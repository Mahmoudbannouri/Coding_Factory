// Add before your server creation
const healthCheck = (req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'UP' }));
};

// Update your server creation
const server = http.createServer(async (req, res) => {
    const parsedUrl = parse(req.url, true);

    // Health check endpoint
    if (parsedUrl.pathname === '/health') {
        return healthCheck(req, res);
    }

    // Info endpoint
    if (parsedUrl.pathname === '/info') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({
            app: {
                name: 'REVIEW-SERVICE-NODE',
                version: '1.0.0'
            }
        }));
    }

    // ... rest of your routes
});
