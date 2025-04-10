const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Recommendation = sequelize.define('Recommendation', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        recommendation: { type: DataTypes.TEXT, allowNull: false },
        reviewId: {
            type: DataTypes.INTEGER,
            references: { model: 'reviews', key: 'id' }
        }
    }, {
        tableName: 'recommendations',
        timestamps: true
    });

    Recommendation.associate = function(models) {
        Recommendation.belongsTo(models.Review, { foreignKey: 'reviewId' });
    };

    return Recommendation;
};
