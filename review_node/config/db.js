const { Sequelize } = require('sequelize');
const retry = require('async-retry'); // Add this line at the top

class Database {
    constructor() {
        this.sequelize = null;
        this.initialized = false;
    }
    async initialize() {
        if (this.initialized) return;

        try {
            this.sequelize = new Sequelize(
                process.env.DB_NAME,
                process.env.DB_USER,
                process.env.DB_PASSWORD,
                {
                    host: process.env.DB_HOST,
                    port: process.env.DB_PORT,
                    dialect: 'postgres',
                    logging: console.log,
                    retry: {
                        max: 10, // Maximum number of retries
                        timeout: 5000, // Timeout between retries (ms)
                        match: [
                            /ECONNREFUSED/,
                            /ETIMEDOUT/,
                            /SequelizeConnectionError/,
                            /SequelizeConnectionRefusedError/,
                            /SequelizeHostNotFoundError/,
                            /SequelizeHostNotReachableError/,
                            /SequelizeInvalidConnectionError/,
                            /SequelizeConnectionTimedOutError/
                        ]
                    }
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
