// wait-for-postgres.js
const { Sequelize } = require('sequelize');
const { exec } = require('child_process');

const maxRetries = 10;
const retryDelay = 5000; // 5 seconds

async function testConnection() {
    const sequelize = new Sequelize({
        database: process.env.DB_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        logging: false,
    });

    try {
        await sequelize.authenticate();
        console.log('PostgreSQL is ready');
        process.exit(0);
    } catch (error) {
        console.log('PostgreSQL not ready yet, retrying...');
        return false;
    } finally {
        await sequelize.close();
    }
}

async function waitForPostgres() {
    for (let i = 0; i < maxRetries; i++) {
        if (await testConnection()) return;
        await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
    console.error('Failed to connect to PostgreSQL after multiple attempts');
    process.exit(1);
}

waitForPostgres();
