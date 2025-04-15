const { getModels } = require('../models');
const geminiAIService = require('./geminiService');
const courseServiceClient = require('./courseServiceClient');

class ReviewService {
    async addReview(reviewData) {
        const { Review } = getModels();

        // Check if review already exists
        const existing = await Review.findOne({
            where: {
                studentId: reviewData.studentId,
                courseId: reviewData.courseId
            }
        });

        if (existing) {
            throw new Error('You have already reviewed this course');
        }

        // Create new review
        return await Review.create(reviewData);
    }

    async hasStudentReviewed(studentId, courseId) {
        const { Review } = getModels();
        const count = await Review.count({
            where: { studentId, courseId }
        });
        return count > 0;
    }
    async updateCourseRate(courseId) {
        try {
            const averageRating = await this.getAverageRatingByCourseId(courseId);
            console.log(`Updating course rate for ${courseId} to ${averageRating}`);

            // Call the courseServiceClient method properly
            await courseServiceClient.updateCourseRate(courseId, averageRating);
        } catch (error) {
            console.error(`Non-critical error: Could not update course rate for ${courseId}. Review was still saved.`, error.message);
            // Don't re-throw, we want to continue even if this fails
        }
    }
    async getReviewsByCourseId(courseId) {
        const { Review, Recommendation } = getModels();

        try {
            return await Review.findAll({
                where: { courseId },
                include: [{
                    model: Recommendation,
                    as: 'recommendations'
                }],
                order: [['createdAt', 'DESC']]
            });
        } catch (error) {
            console.error(`Error getting reviews for course ${courseId}:`, error);
            throw error;
        }
    }
    async deleteRecommendation(courseId, text) {
        const { Review, Recommendation } = getModels();

        console.log(`Deleting recommendation for course ${courseId}, text: ${text}`);
        const normalizedText = text.trim();

        const reviews = await Review.findAll({ where: { courseId } });
        if (reviews.length === 0) {
            console.log('No reviews found for course');
            return;
        }

        for (const review of reviews) {
            const recommendations = await Recommendation.findAll({
                where: {
                    reviewId: review.id,
                    recommendation: normalizedText
                }
            });

            for (const rec of recommendations) {
                await rec.destroy();
                console.log('Recommendation deleted');
            }
        }
    }

    async getAIRecommendationsForCourse(courseId) {
        const { Review, Recommendation } = getModels();

        console.log(`Fetching AI recommendations for course ${courseId}`);
        const reviews = await Review.findAll({
            where: { courseId },
            include: [{
                model: Recommendation,
                as: 'recommendations'
            }]
        });

        const recommendations = reviews
            .flatMap(review => review.recommendations.map(r => r.recommendation))
            .join('\n');

        return recommendations || 'No recommendations available for this course.';
    }
    async hasStudentReviewed(studentId, courseId) {
        const { Review } = getModels();
        const count = await Review.count({
            where: {
                studentId,
                courseId
            }
        });
        return count > 0;
    }
    async getAverageRatingByCourseId(courseId) {
        const { Review } = getModels();

        const reviews = await Review.findAll({ where: { courseId } });
        if (reviews.length === 0) return 0;
        return reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    }

}

module.exports = new ReviewService();
