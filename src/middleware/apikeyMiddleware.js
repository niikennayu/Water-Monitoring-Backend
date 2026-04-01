const VALID_API_KEY = "123456789"; // sementara hardcode dulu

const apiKeyMiddleware = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
        return res.status(401).json({
            status: 'error',
            message: 'API key is missing'
        });
    }

    if (apiKey !== VALID_API_KEY) {
        return res.status(403).json({
            status: 'error',
            message: 'Invalid API key'
        });
    }

    next();
};

export default apiKeyMiddleware;