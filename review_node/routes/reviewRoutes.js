const { parse } = require('url');
const reviewService = require('../services/reviewService');

async function handleReviewsRoutes(req, res) {
    const parsedUrl = parse(req.url, true);
    const method = req.method;



    // Handle preflight requests
    if (method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // POST /reviews
    if (method === 'POST' && parsedUrl.pathname === '/reviews') {
        try {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', async () => {
                try {
                    const review = await reviewService.addReview(JSON.parse(body));
                    res.writeHead(201);
                    res.end(JSON.stringify(review));
                } catch (error) {
                    if (error.message.includes('already reviewed')) {
                        res.writeHead(409);
                    } else {
                        res.writeHead(500);
                    }
                    res.end(JSON.stringify({ error: error.message }));
                }
            });
            return;
        } catch (error) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: 'Failed to add review' }));
            return;
        }
    }

    // GET /reviews/has-reviewed/:studentId/:courseId
    if (method === 'GET' && parsedUrl.pathname.startsWith('/reviews/has-reviewed/')) {
        const parts = parsedUrl.pathname.split('/');
        const studentId = parts[3];
        const courseId = parts[4];

        if (!studentId || !courseId) {
            res.writeHead(400);
            res.end(JSON.stringify({ error: 'Missing studentId or courseId' }));
            return;
        }

        try {
            const hasReviewed = await reviewService.hasStudentReviewed(studentId, courseId);
            res.writeHead(200);
            res.end(JSON.stringify({ hasReviewed }));
        } catch (error) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: error.message }));
        }
        return;
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
        } catch (error) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: error.message }));
        }
        return;
    }

    // GET /reviews/courses/:courseId/ai-recommendations
    if (method === 'GET' && parsedUrl.pathname.includes('/ai-recommendations')) {
        const courseId = parsedUrl.pathname.split('/')[3];
        try {
            const result = await reviewService.getAIRecommendationsForCourse(courseId);
            res.writeHead(200);
            res.end(JSON.stringify({ recommendations: result }));
        } catch (error) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: error.message }));
        }
        return;
    }

    // GET /reviews/courses/:courseId/average-rating
    if (method === 'GET' && parsedUrl.pathname.includes('/average-rating')) {
        const courseId = parsedUrl.pathname.split('/')[3];
        try {
            const averageRating = await reviewService.getAverageRatingByCourseId(courseId);
            res.writeHead(200);
            res.end(JSON.stringify(averageRating));
        } catch (error) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: error.message }));
        }
        return;
    }

    // DELETE /reviews/courses/:courseId/recommendations?text=...
    if (method === 'DELETE' && parsedUrl.pathname.includes('/recommendations')) {
        const courseId = parsedUrl.pathname.split('/')[3];
        const text = parsedUrl.query.text;
        try {
            await reviewService.deleteRecommendation(courseId, text);
            res.writeHead(204);
            res.end();
        } catch (error) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: error.message }));
        }
        return;
    }

    // Not found
    res.writeHead(404);
    res.end(JSON.stringify({ message: 'Route not found' }));
}

module.exports = { handleReviewsRoutes };
