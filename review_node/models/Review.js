module.exports = (sequelize, DataTypes) => {
    const Review = sequelize.define('Review', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        studentId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        courseId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 5
            }
        },
        comment: {
            type: DataTypes.TEXT
        }
    }, {
        tableName: 'reviews',
        timestamps: true
    });

    Review.associate = (models) => {
        Review.hasMany(models.Recommendation, {
            foreignKey: 'reviewId',
            as: 'recommendations'
        });
    };

    return Review;
};
