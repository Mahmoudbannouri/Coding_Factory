const { getModels } = require('../models');
const geminiAIService = require('./geminiService');
const courseServiceClient = require('./courseServiceClient');

class ReviewService {
    async addReview(reviewData) {
        const { Review, Recommendation } = getModels();
        const { studentId, courseId } = reviewData;

        try {
            console.log('Checking for existing review...');

            // Check if the student already reviewed this course
            const existingReview = await Review.findOne({
                where: {
                    studentId,
                    courseId
                }
            });

            if (existingReview) {
                console.log(`Student ${studentId} already reviewed course ${courseId}. Skipping creation.`);
                // Instead of throwing error, return a message or a custom object
                return { message: 'Review already submitted by this student for this course.' };
            }

            console.log('Creating new review:', reviewData);
            const review = await Review.create(reviewData);

            try {
                await this.updateCourseRate(review.courseId);
            } catch (error) {
                console.error('Non-critical error updating course rate:', error.message);
            }

            if (reviewData.comment && reviewData.comment.trim() !== '') {
                const { suggestion } = await geminiAIService.analyzeSentiment(reviewData.comment);
                if (suggestion) {
                    await Recommendation.create({
                        recommendation: suggestion,
                        reviewId: review.id
                    });
                }
            }

            return review;
        } catch (error) {
            console.error('Error in addReview:', error);
            throw error;
        }
    }
    async hasStudentReviewedCourse(studentId, courseId) {
        const { Review } = getModels();
        const existingReview = await Review.findOne({ where: { studentId, courseId } });
        return !!existingReview;
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

    async getAverageRatingByCourseId(courseId) {
        const { Review } = getModels();

        const reviews = await Review.findAll({ where: { courseId } });
        if (reviews.length === 0) return 0;
        return reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    }

}

module.exports = new ReviewService();
