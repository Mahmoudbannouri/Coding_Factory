const { Sequelize } = require('sequelize');

class Database {
    constructor() {
        this.sequelize = null;
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return;

        try {
            // First connect to default postgres database
            const adminSequelize = new Sequelize({
                database: 'postgres',
                username: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                host: process.env.DB_HOST,
                port: process.env.DB_PORT,
                dialect: 'postgres',
                logging: false
            });

            // Check if database exists
            const [results] = await adminSequelize.query(
                `SELECT 1 FROM pg_database WHERE datname = '${process.env.DB_NAME}'`
            );

            if (results.length === 0) {
                await adminSequelize.query(`CREATE DATABASE "${process.env.DB_NAME}"`);
                console.log(`Database ${process.env.DB_NAME} created`);
            }

            await adminSequelize.close();

            // Connect to our application database
            this.sequelize = new Sequelize(
                process.env.DB_NAME,
                process.env.DB_USER,
                process.env.DB_PASSWORD,
                {
                    host: process.env.DB_HOST,
                    port: process.env.DB_PORT,
                    dialect: 'postgres',
                    logging: console.log
                }
            );

            await this.sequelize.authenticate();
            console.log('Database connection established');
            this.initialized = true;
        } catch (error) {
            console.error('Database initialization failed:', error);
            throw error;
        }
    }

    async syncModels() {
        if (!this.initialized) {
            throw new Error('Database not initialized');
        }

        try {
            await this.sequelize.sync({ alter: true });
            console.log('Database tables synchronized');
        } catch (error) {
            console.error('Database sync failed:', error);
            throw error;
        }
    }
}

module.exports = new Database();
