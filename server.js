require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const nodemailer = require('nodemailer');
const multer = require('multer');
const generateEmailTemplate = require('./emailTemplate');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/')));

// Configure Multer for memory storage (for attaching directly to emails)
const upload = multer({ storage: multer.memoryStorage() });

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

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
app.post('/api/contact', upload.array('photos', 5), (req, res) => {
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
    
    let messageText = `Fahrzeugdaten:\n`;
    messageText += `- Typ: ${vehicle_type || '-'}\n`;
    messageText += `- Hersteller: ${manufacturer || '-'}\n`;
    messageText += `- Modell: ${model || '-'}\n`;
    messageText += `- Baujahr: ${year || '-'}\n`;
    messageText += `- Erstzulassung: ${first_registration || '-'}\n`;
    messageText += `- Kilometerstand/Betriebsstunden: ${mileage || '-'}\n`;
    messageText += `- Schaltung/Automatik: ${gear_full || '-'}\n`;
    messageText += `- Unfallfrei: ${accident_full || '-'}\n`;
    messageText += `- Schadstoffklasse: ${emission_class || '-'}\n`;
    messageText += `- TÜV/HU: ${tuev_available === 'ja' ? (tuev || 'Ja') : 'Nein'}\n`;
    messageText += `- Wunschpreis: ${price ? price + ' €' : '-'}\n\n`;
    
    messageText += `Zustand:\n`;
    messageText += `- Antrieb (Motor/Batterie): ${state_drive_full || '-'}\n`;
    messageText += `- Getriebe: ${state_gear_full || '-'}\n`;
    messageText += `- Achsen: ${state_axle_full || '-'}\n`;
    
    if (description) {
        messageText += `\nOptionale Beschreibung / Sonderausstattungen:\n${description}\n`;
    }
    
    if (other_defects) {
        messageText += `\nWeitere bekannte Mängel / Schäden:\n${other_defects}\n`;
    }

    const sql = `INSERT INTO submissions (name, email, phone, vehicle, message) VALUES (?, ?, ?, ?, ?)`;
    const params = [name, email, phone, vehicle, messageText];

    db.run(sql, params, function (err) {
        if (err) {
            console.error('Error inserting into db', err.message);
            return res.status(500).json({ error: 'Internal server error' });
        }
        
        // Send email notification asynchronously
        if (process.env.SMTP_USER && process.env.SMTP_PASS) {
            const mailOptions = {
                from: process.env.SMTP_FROM || process.env.SMTP_USER,
                to: process.env.SMTP_TO || process.env.SMTP_USER,
                subject: `Neue Anfrage von ${name} - ${vehicle || 'Fahrzeug'}`,
                text: `Neue Anfrage erhalten:\n\nName: ${name}\nEmail: ${email}\nTelefon: ${phone}\n\n${messageText}`
            };

            // Process uploaded files for attachments
            if (req.files && req.files.length > 0) {
                mailOptions.attachments = req.files.map(file => ({
                    filename: file.originalname,
                    content: file.buffer
                }));
            }

            transporter.sendMail(mailOptions, (mailErr, info) => {
                if (mailErr) console.error('Error sending email:', mailErr);
                else console.log('Email sent:', info.response);
            });
        }

        res.status(201).json({ 
            success: true, 
            message: 'Submission saved successfully',
            id: this.lastID 
        });
    });
});

// Production-ready Email Confirmation Endpoint
app.post('/api/lead', upload.array('photos', 5), (req, res) => {
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
    
    let messageText = `Fahrzeugdaten:\n`;
    messageText += `- Typ: ${vehicle_type || '-'}\n`;
    messageText += `- Hersteller: ${manufacturer || '-'}\n`;
    messageText += `- Modell: ${model || '-'}\n`;
    messageText += `- Baujahr: ${year || '-'}\n`;
    messageText += `- Erstzulassung: ${first_registration || '-'}\n`;
    messageText += `- Kilometerstand/Betriebsstunden: ${mileage || '-'}\n`;
    messageText += `- Schaltung/Automatik: ${gear_full || '-'}\n`;
    messageText += `- Unfallfrei: ${accident_full || '-'}\n`;
    messageText += `- Schadstoffklasse: ${emission_class || '-'}\n`;
    messageText += `- TÜV/HU: ${tuev_available === 'ja' ? (tuev || 'Ja') : 'Nein'}\n`;
    messageText += `- Wunschpreis: ${price ? price + ' €' : '-'}\n\n`;
    
    if (description) messageText += `\nBeschreibung: ${description}\n`;
    if (other_defects) messageText += `\nMängel: ${other_defects}\n`;

    // 2. Save Lead
    const sql = `INSERT INTO submissions (name, email, phone, vehicle, message) VALUES (?, ?, ?, ?, ?)`;
    const params = [name, email, phone, vehicle, messageText];

    db.run(sql, params, function (err) {
        if (err) {
            console.error('Error inserting into db', err.message);
            return res.status(500).json({ success: false, error: 'Internal server error' });
        }
        
        // 3. Send Email Confirmation Asynchronously
        if (process.env.SMTP_USER && process.env.SMTP_PASS) {
            // Internal Notification
            const internalMailOptions = {
                from: process.env.SMTP_FROM || process.env.SMTP_USER,
                to: process.env.SMTP_TO || process.env.SMTP_USER,
                subject: `Neue Anfrage von ${name} - ${vehicle || 'Fahrzeug'}`,
                text: `Neue Anfrage erhalten:\n\nName: ${name}\nEmail: ${email}\nTelefon: ${phone}\n\n${messageText}`
            };

            // Process uploaded files for attachments
            if (req.files && req.files.length > 0) {
                internalMailOptions.attachments = req.files.map(file => ({
                    filename: file.originalname,
                    content: file.buffer
                }));
            }

            transporter.sendMail(internalMailOptions, (mailErr) => {
                if (mailErr) console.error('Error sending internal notification:', mailErr);
            });

            // Customer Confirmation Email (Premium HTML)
            const htmlContent = generateEmailTemplate(req.body);
            
            const customerMailOptions = {
                from: `"N&A Transporte" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
                to: email,
                subject: 'Ihre Anfrage bei N&A Transporte ist eingegangen',
                html: htmlContent
            };

            transporter.sendMail(customerMailOptions, (mailErr, info) => {
                if (mailErr) console.error('Error sending confirmation email to customer:', mailErr);
                else console.log('Confirmation email sent to customer:', email, info.response);
            });
        } else {
            console.warn('SMTP credentials not provided. Email not sent.');
        }

        // 4. Instant Confirmation
        res.status(201).json({ 
            success: true, 
            message: 'Ihre Anfrage wurde erfolgreich gesendet!',
            id: this.lastID 
        });
    });
});


app.get('/api/submissions', basicAuth, (req, res) => {
    db.all(`SELECT * FROM submissions ORDER BY created_at DESC`, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
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
