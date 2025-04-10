const reviewService = require('../services/reviewService');

exports.addReview = async (req, res) => {
    try {
        const review = await reviewService.addReview(req.body);
        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getReviewsByCourseId = async (req, res) => {
    try {
        const reviews = await reviewService.getReviewsByCourseId(req.params.courseId);
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAverageRatingByCourseId = async (req, res) => {
    try {
        const averageRating = await reviewService.getAverageRatingByCourseId(req.params.courseId);
        res.json(averageRating);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteRecommendation = async (req, res) => {
    try {
        await reviewService.deleteRecommendation(req.params.courseId, req.query.text);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAIRecommendations = async (req, res) => {
    try {
        const recommendations = await reviewService.getAIRecommendationsForCourse(req.params.courseId);
        res.json({ recommendations });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
