const pool = require('./db');

async function initializeDatabase() {
    try {
        console.log('Initializing database schema...');
        
        // Ensure database exists (optional, assumes user created it via Hetzner panel or CLI)
        // We connect directly to the database via pool, so it must exist.

        const createLeadsTableQuery = `
            CREATE TABLE IF NOT EXISTS leads (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(50) NOT NULL,
                vehicle_type VARCHAR(100),
                manufacturer VARCHAR(100),
                model VARCHAR(100),
                year VARCHAR(50),
                first_registration VARCHAR(50),
                mileage VARCHAR(100),
                gear_full VARCHAR(100),
                accident_full VARCHAR(100),
                emission_class VARCHAR(100),
                tuev VARCHAR(50),
                price VARCHAR(50),
                description TEXT,
                other_defects TEXT,
                is_trailer BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

        await pool.query(createLeadsTableQuery);
        console.log('Table `leads` created or already exists.');

        console.log('Database initialization complete!');
        process.exit(0);
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
}

initializeDatabase();
