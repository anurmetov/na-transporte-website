require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const multer = require('multer');
const { Resend } = require('resend');
const generateEmailTemplate = require('./emailTemplate');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/')));
app.use(
  "/assets",
  express.static(path.join(__dirname, "react-wizard/dist/assets"))
);
app.use(
  express.static(path.join(__dirname, 'react-wizard/public'))
);

// Configure Multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Setup Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Simple Basic Auth Middleware
const basicAuth = (req, res, next) => {
    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');

    // Default to admin/admin as requested
    if (login && password && login === 'admin' && password === 'admin') {
        return next();
    }

    res.set('WWW-Authenticate', 'Basic realm="401"');
    res.status(401).send('Authentication required.');
};

// API Routes
app.post('/api/contact', upload.array('photos', 5), async (req, res) => {
    const { 
        name, email, phone, 
        vehicle_type, manufacturer, model, description, year, first_registration, 
        mileage, gear_full, accident_full, emission_class, 
        state_drive_full, state_gear_full, state_axle_full, other_defects, 
        tuev_available, tuev, price 
    } = req.body;
    
    if (!name || !email || !phone) {
        return res.status(400).json({ error: 'Name, email, and phone are required.' });
    }

    const vehicle = `${manufacturer || ''} ${model || ''} ${vehicle_type ? `(${vehicle_type})` : ''}`.trim();
    const isTrailer = vehicle_type === 'auflieger' || vehicle_type === 'anhaenger';

    // 1. Save to Database
    try {
        await pool.query(`
            INSERT INTO leads (
                name, email, phone, vehicle_type, manufacturer, model, 
                year, first_registration, mileage, gear_full, accident_full, 
                emission_class, tuev, price, description, other_defects, is_trailer
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            name, email, phone, vehicle_type, manufacturer, model,
            year, first_registration, mileage, gear_full, accident_full,
            emission_class, tuev_available === 'ja' ? tuev : (tuev_available === 'nein' ? 'Nein' : null), 
            price, description, other_defects, isTrailer
        ]);
    } catch (dbError) {
        console.error('Error saving to DB:', dbError);
        // We continue to send email even if DB fails, or we could return 500
    }

    let messageText = `Fahrzeugdaten:\n`;
    messageText += `- Typ: ${vehicle_type || '-'}\n`;
    messageText += `- Hersteller: ${manufacturer || '-'}\n`;
    messageText += `- Modell: ${model || '-'}\n`;
    messageText += `- Baujahr: ${year || '-'}\n`;
    messageText += `- Erstzulassung: ${first_registration || '-'}\n`;
    if (!isTrailer) {
        messageText += `- Kilometerstand/Betriebsstunden: ${mileage || '-'}\n`;
        messageText += `- Schaltung/Automatik: ${gear_full || '-'}\n`;
        if (!['szm', 'SZM', 'lkw', 'LKW'].includes(vehicle_type)) {
            messageText += `- Unfallfrei: ${accident_full || '-'}\n`;
        }
        messageText += `- Schadstoffklasse: ${emission_class || '-'}\n`;
        if (!['szm', 'SZM', 'lkw', 'LKW'].includes(vehicle_type)) {
            messageText += `- TÜV/HU: ${tuev_available === 'ja' ? (tuev || 'Ja') : (tuev_available === 'nein' ? 'Nein' : '-')}\n`;
        }
    }
    messageText += `- Wunschpreis: ${price ? price + ' €' : '-'}\n\n`;
    
    if (description) messageText += `\nOptionale Beschreibung / Sonderausstattungen:\n${description}\n`;
    if (other_defects) messageText += `\nWeitere bekannte Mängel / Schäden:\n${other_defects}\n`;

    // 2. Send email via Resend
    if (process.env.RESEND_API_KEY) {
        try {
            const attachments = req.files && req.files.length > 0 
                ? req.files.map(file => ({
                    filename: file.originalname,
                    content: file.buffer
                })) 
                : undefined;

            await resend.emails.send({
                from: process.env.SMTP_FROM || 'onboarding@resend.dev',
                to: process.env.SMTP_TO || 'onboarding@resend.dev',
                subject: `Neue Anfrage von ${name} - ${vehicle || 'Fahrzeug'}`,
                text: `Neue Anfrage erhalten:\n\nName: ${name}\nEmail: ${email}\nTelefon: ${phone}\n\n${messageText}`,
                attachments
            });
            console.log('Contact email sent via Resend.');
        } catch (mailErr) {
            console.error('Error sending email via Resend:', mailErr);
        }
    }

    res.status(201).json({ 
        success: true, 
        message: 'Submission sent successfully'
    });
});

// Production-ready Email Confirmation Endpoint
app.post('/api/lead', upload.array('photos', 5), async (req, res) => {
    const { 
        name, email, phone, 
        vehicle_type, manufacturer, model, description, year, first_registration, 
        mileage, gear_full, accident_full, emission_class, 
        state_drive_full, state_gear_full, state_axle_full, other_defects, 
        tuev_available, tuev, price 
    } = req.body;
    
    // 1. Basic Validation
    if (!name || !email || !phone) {
        return res.status(400).json({ success: false, error: 'Name, email, and phone are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, error: 'Ungültige E-Mail-Adresse.' });
    }

    const vehicle = `${manufacturer || ''} ${model || ''} ${vehicle_type ? `(${vehicle_type})` : ''}`.trim();
    const isTrailer = vehicle_type === 'auflieger' || vehicle_type === 'anhaenger';
    
    // 2. Save to Database
    try {
        await pool.query(`
            INSERT INTO leads (
                name, email, phone, vehicle_type, manufacturer, model, 
                year, first_registration, mileage, gear_full, accident_full, 
                emission_class, tuev, price, description, other_defects, is_trailer
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            name, email, phone, vehicle_type, manufacturer, model,
            year, first_registration, mileage, gear_full, accident_full,
            emission_class, tuev_available === 'ja' ? tuev : (tuev_available === 'nein' ? 'Nein' : null), 
            price, description, other_defects, isTrailer
        ]);
    } catch (dbError) {
        console.error('Error saving to DB:', dbError);
    }

    let messageText = `FAHRZEUG:\n`;
    messageText += `- Typ: ${vehicle_type || '-'}\n`;
    if (vehicle_type !== 'andere' && manufacturer !== '-') {
        messageText += `- Marke: ${manufacturer || '-'}\n`;
        if (model && model !== '-') messageText += `- Modell: ${model}\n`;
        messageText += `- Baujahr: ${year || '-'}\n`;
        if (!isTrailer) {
            messageText += `- Kilometer: ${mileage || '-'}\n`;
            if (!['szm', 'SZM', 'lkw', 'LKW'].includes(vehicle_type)) {
                messageText += `- TÜV/HU: ${tuev_available === 'ja' ? (tuev || 'Ja') : (tuev_available === 'nein' ? 'Nein' : '-')}\n`;
                messageText += `- Unfallfrei: ${accident_full || '-'}\n`;
            }
        }
    }

    // 3. Send Emails via Resend Asynchronously
    if (process.env.RESEND_API_KEY) {
        try {
            const attachments = req.files && req.files.length > 0 
                ? req.files.map(file => ({
                    filename: file.originalname,
                    content: file.buffer
                })) 
                : undefined;

            // Internal Notification
            resend.emails.send({
                from: process.env.SMTP_FROM || 'onboarding@resend.dev',
                to: process.env.SMTP_TO || 'onboarding@resend.dev',
                subject: `Neue Anfrage von ${name} - ${vehicle || 'Fahrzeug'}`,
                text: `Neue Anfrage erhalten:\n\nName: ${name}\nEmail: ${email}\nTelefon: ${phone}\n\n${messageText}`,
                attachments
            }).catch(e => console.error('Error sending internal resend email:', e));

            // Customer Confirmation Email (Premium HTML)
            const htmlContent = generateEmailTemplate(req.body);
            
            resend.emails.send({
                from: process.env.SMTP_FROM || 'onboarding@resend.dev', // Must be verified domain
                to: email,
                subject: 'Ihre Anfrage bei N&A Transporte ist eingegangen',
                html: htmlContent
            }).catch(e => console.error('Error sending customer resend email:', e));

        } catch (mailErr) {
            console.error('Error in Resend block:', mailErr);
        }
    } else {
        console.warn('RESEND_API_KEY not provided. Emails not sent.');
    }

    // 4. Instant Confirmation
    res.status(201).json({ 
        success: true, 
        message: 'Ihre Anfrage wurde erfolgreich gesendet!'
    });
});

app.get('/api/submissions', basicAuth, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM leads ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching submissions:', error);
        res.status(500).json({ error: 'Failed to fetch submissions' });
    }
});

app.get('/admin', basicAuth, (req, res) => {
    try {
        const html = fs.readFileSync(path.join(__dirname, 'admin.html'), 'utf8');
        res.send(html);
    } catch (error) {
        console.error('Error reading admin.html:', error);
        res.status(500).send('Error loading admin page.');
    }
});

// Start server
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
