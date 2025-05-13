const { parse } = require('url');
const reviewService = require('../services/reviewService');

async function handleReviewsRoutes(req, res) {
    const parsedUrl = parse(req.url, true);
    const method = req.method;

    // Set CORS headers (API Gateway will override these)
    res.setHeader('Content-Type', 'application/json');

    // POST /reviews
    if (method === 'POST' && parsedUrl.pathname === '/reviews') {
        try {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', async () => {
                const review = await reviewService.addReview(JSON.parse(body));
                res.writeHead(201);
                res.end(JSON.stringify(review));
            });
            return;
        } catch (error) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: 'Failed to add review' }));
            return;
        }
    }

    // GET /reviews/courses/:courseId
    if (method === 'GET' && parsedUrl.pathname.startsWith('/reviews/courses/') &&
        !parsedUrl.pathname.includes('/ai-recommendations') &&
        !parsedUrl.pathname.includes('/average-rating')) {
        const courseId = parsedUrl.pathname.split('/')[3];
        try {
            const reviews = await reviewService.getReviewsByCourseId(courseId);
            res.writeHead(200);
            res.end(JSON.stringify(reviews));
            return;
        } catch (error) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: error.message }));
            return;
        }
    }

    // GET /reviews/courses/:courseId/ai-recommendations
    if (method === 'GET' && parsedUrl.pathname.includes('/ai-recommendations')) {
        const courseId = parsedUrl.pathname.split('/')[3];
        try {
            const result = await reviewService.getAIRecommendationsForCourse(courseId);
            res.writeHead(200);
            res.end(JSON.stringify({ recommendations: result }));
            return;
        } catch (error) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: error.message }));
            return;
        }
    }

    // GET /reviews/courses/:courseId/average-rating
    if (method === 'GET' && parsedUrl.pathname.includes('/average-rating')) {
        const courseId = parsedUrl.pathname.split('/')[3];
        try {
            const averageRating = await reviewService.getAverageRatingByCourseId(courseId);
            res.writeHead(200);
            res.end(JSON.stringify(averageRating));
            return;
        } catch (error) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: error.message }));
            return;
        }
    }

    // DELETE /reviews/courses/:courseId/recommendations?text=...
    if (method === 'DELETE' && parsedUrl.pathname.includes('/recommendations')) {
        const courseId = parsedUrl.pathname.split('/')[3];
        const text = parsedUrl.query.text;
        try {
            await reviewService.deleteRecommendation(courseId, text);
            res.writeHead(204);
            res.end();
            return;
        } catch (error) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: error.message }));
            return;
        }
    }
    if (method === 'GET' && parsedUrl.pathname === '/reviews/has-reviewed') {
        const { studentId, courseId } = parsedUrl.query;

        try {
            const hasReviewed = await reviewService.hasStudentReviewedCourse(parseInt(studentId), parseInt(courseId));
            res.writeHead(200);
            res.end(JSON.stringify({ hasReviewed }));
            return;
        } catch (error) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: 'Error checking review status' }));
            return;
        }
    }

    // GET /reviews/has-reviewed?studentId=...&courseId=...
    if (method === 'GET' && parsedUrl.pathname === '/reviews/has-reviewed') {
        const { studentId, courseId } = parsedUrl.query;

        try {
            const { Review } = require('../models').getModels();
            const existingReview = await Review.findOne({
                where: {
                    studentId: parseInt(studentId),
                    courseId: parseInt(courseId)
                }
            });

            const hasReviewed = !!existingReview;
            res.writeHead(200);
            res.end(JSON.stringify({ hasReviewed }));
            return;
        } catch (error) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: 'Error checking review status' }));
            return;
        }
    }

    // Not found
    res.writeHead(404);
    res.end(JSON.stringify({ message: 'Route not found' }));
}

module.exports = { handleReviewsRoutes };
