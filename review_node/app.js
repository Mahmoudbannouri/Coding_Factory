require('dotenv').config();
const http = require('http');
const { parse } = require('url');
const database = require('./config/db');
const { initializeModels } = require('./models');
const eurekaClient = require('./config/eureka');
const { handleReviewsRoutes } = require('./routes/reviewRoutes');

async function startServer() {
    try {
        console.log('Initializing database...');
        await database.initialize();

        console.log('Initializing models...');
        await initializeModels();

        console.log('Syncing database...');
        await database.syncModels();

        const PORT = process.env.PORT || 8082;

        const server = http.createServer(async (req, res) => {

            // Handle OPTIONS preflight
            if (req.method === 'OPTIONS') {
                res.writeHead(204);
                return res.end();
            }

            const parsedUrl = parse(req.url, true);

            // Health checks
            if (parsedUrl.pathname === '/health') {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ status: 'UP' }));
            }

            if (parsedUrl.pathname === '/info') {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({
                    app: { name: 'reviews-service' }
                }));
            }

            // Main routes
            if (parsedUrl.pathname.startsWith('/reviews')) {
                return handleReviewsRoutes(req, res);
            }

            // Not found
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Route not found' }));
        });

        server.listen(PORT, async () => {
            console.log(`Server running on port ${PORT}`);
            try {
                await new Promise((resolve, reject) => {
                    eurekaClient.start(error => {
                        if (error) {
                            console.error('Eureka registration failed:', error);
                            reject(error);
                        } else {
                            console.log('Registered with Eureka');
                            resolve();
                        }
                    });
                });
            } catch (e) {
                console.error('Eureka registration error:', e);
            }
        });

        // Graceful shutdown
        process.on('SIGINT', () => {
            console.log('Shutting down...');
            eurekaClient.stop(() => {
                server.close(() => {
                    console.log('Server stopped');
                    process.exit(0);
                });
            });
        });

    } catch (error) {
        console.error('Server initialization failed:', error);
        process.exit(1);
    }
}

startServer();
