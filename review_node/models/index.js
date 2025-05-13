const database = require('../config/db');
const { DataTypes } = require('sequelize');

// This will be populated after database initialization
const models = {};

async function initializeModels() {
    await database.initialize();

    models.Review = require('./Review')(database.sequelize, DataTypes);
    models.Recommendation = require('./Recommendation')(database.sequelize, DataTypes);

    // Set up associations
    models.Review.associate(models);
    if (models.Recommendation.associate) {
        models.Recommendation.associate(models);
    }

    return models;
}

module.exports = {
    initializeModels,
    getModels: () => {
        if (!database.initialized) {
            throw new Error('Models not initialized');
        }
        return models;
    }
};
