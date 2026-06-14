const generateEmailTemplate = (data) => {
    const {
        name,
        manufacturer,
        model,
        vehicle_type,
        year,
        mileage,
        accident_full,
        tuev_available,
        tuev,
        state_drive_full,
        state_gear_full,
        state_axle_full,
        other_defects
    } = data;

    const vehicleTitle = manufacturer !== '-' ? manufacturer : 'Fahrzeug';
    const isTrailer = vehicle_type === 'auflieger' || vehicle_type === 'anhaenger';

    return `
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Eingangsbestätigung - N&A Transporte</title>
    <!--[if mso]>
    <style type="text/css">
        table {border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;}
        table, td {mso-line-height-rule: exactly;}
    </style>
    <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f4f3f1; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; -webkit-font-smoothing: antialiased;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 0; border-radius: 8px; overflow: hidden; margin-top: 40px; margin-bottom: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        
        <!-- Header -->
        <div style="background-color: #1a1c1a; padding: 32px 40px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 0.5px;">N&A Transporte GmbH</h1>
        </div>

        <!-- Content -->
        <div style="padding: 40px;">
            <h2 style="margin-top: 0; margin-bottom: 24px; color: #1a1c1a; font-size: 20px; font-weight: 600;">Hallo ${name},</h2>
            
            <p style="color: #5f6366; font-size: 16px; line-height: 1.6; margin-top: 0; margin-bottom: 24px;">
                vielen Dank für Ihre Anfrage! Wir haben die Daten zu Ihrem Fahrzeug erfolgreich erhalten und werden diese umgehend prüfen.
            </p>

            <!-- Vehicle Summary Card -->
            <div style="background-color: #f9f8f6; border: 1px solid #e3e2e0; border-radius: 6px; padding: 24px; margin-bottom: 32px;">
                <h3 style="margin-top: 0; margin-bottom: 16px; color: #ab3500; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">Ihre Fahrzeugdaten</h3>
                
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                        <td style="padding-bottom: 12px; width: 40%; color: #5f6366; font-size: 14px;">Typ:</td>
                        <td style="padding-bottom: 12px; color: #1a1c1a; font-size: 14px; font-weight: 600;">${vehicle_type || '-'}</td>
                    </tr>
                    ${vehicle_type !== 'andere' && manufacturer !== '-' ? `
                    <tr>
                        <td style="padding-bottom: 12px; color: #5f6366; font-size: 14px;">Marke:</td>
                        <td style="padding-bottom: 12px; color: #1a1c1a; font-size: 14px; font-weight: 600;">${manufacturer || '-'}</td>
                    </tr>
                    ${model && model !== '-' ? `
                    <tr>
                        <td style="padding-bottom: 12px; color: #5f6366; font-size: 14px;">Modell:</td>
                        <td style="padding-bottom: 12px; color: #1a1c1a; font-size: 14px; font-weight: 600;">${model}</td>
                    </tr>
                    ` : ''}
                    <tr>
                        <td style="padding-bottom: 12px; color: #5f6366; font-size: 14px;">Baujahr:</td>
                        <td style="padding-bottom: 12px; color: #1a1c1a; font-size: 14px; font-weight: 600;">${year || '-'}</td>
                    </tr>
                    ${!isTrailer ? `
                    <tr>
                        <td style="padding-bottom: 12px; color: #5f6366; font-size: 14px;">Kilometer:</td>
                        <td style="padding-bottom: 12px; color: #1a1c1a; font-size: 14px; font-weight: 600;">${mileage || '-'}</td>
                    </tr>
                    ` : ''}
                    ${(!isTrailer && !['szm', 'SZM', 'lkw', 'LKW'].includes(vehicle_type)) ? `
                    <tr>
                        <td style="padding-bottom: 24px; color: #5f6366; font-size: 14px;">TÜV/HU:</td>
                        <td style="padding-bottom: 24px; color: #1a1c1a; font-size: 14px; font-weight: 600;">${tuev_available === 'ja' ? (tuev || 'Ja') : (tuev_available === 'nein' ? 'Nein' : '-')}</td>
                    </tr>
                    <tr>
                        <td style="padding-bottom: 12px; color: #5f6366; font-size: 14px;">Unfallfrei:</td>
                        <td style="padding-bottom: 12px; color: #1a1c1a; font-size: 14px; font-weight: 600;">${accident_full || '-'}</td>
                    </tr>
                    ` : ''}
                    ` : ''}
                </table>
            </div>

            <h3 style="color: #1a1c1a; font-size: 18px; font-weight: 600; margin-bottom: 16px; margin-top: 0;">Wie geht es jetzt weiter?</h3>
            
            <p style="color: #5f6366; font-size: 16px; line-height: 1.6; margin-top: 0; margin-bottom: 32px;">
                Einer unserer Experten schaut sich Ihre Angaben an. Sie erhalten <strong>innerhalb von 24 Stunden</strong> eine persönliche Rückmeldung mit einer ersten Preiseinschätzung oder weiteren Fragen zu Ihrem Fahrzeug.
            </p>

            <!-- CTA -->
            <div style="text-align: center; margin-bottom: 32px;">
                <a href="mailto:natransport@web.de" style="display: inline-block; background-color: #ab3500; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 16px;">Bei Fragen direkt antworten</a>
            </div>
            
            <p style="color: #5f6366; font-size: 16px; line-height: 1.6; margin-top: 0; margin-bottom: 0;">
                Beste Grüße,<br>
                <strong>Ihr N&A Transporte Team</strong>
            </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #efeeeb; padding: 24px 40px; text-align: center;">
            <p style="color: #5f6366; font-size: 12px; margin: 0; line-height: 1.5;">
                N&A Transporte GmbH<br>
                Senefelderstr. 5, 77933 Lahr<br>
                <a href="https://na-transporte.de" style="color: #ab3500; text-decoration: none;">www.na-transporte.de</a>
            </p>
        </div>
    </div>
</body>
</html>
    `;
};

module.exports = generateEmailTemplate;
