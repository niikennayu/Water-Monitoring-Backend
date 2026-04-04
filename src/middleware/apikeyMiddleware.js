import prisma from '../config/db.js';

const apiKeyMiddleware = async (req, res, next) => {
    try {
        const apiKey = req.headers['x-api-key'];

        // Check API from request header
        console.log("API KEY MASUK:", apiKey);

        // Validation API key
        if (!apiKey) {
            return res.status(401).json({
                status: 'error',
                message: 'API key is missing'
            });
        }

        // Checking all devices in database
        const allDevices = await prisma.device.findMany();
        console.log("SEMUA DEVICE:", allDevices);

        // Mencari device berdasarkan API key
        const device = await prisma.device.findUnique({
        where: {
            apiKey: apiKey
        }
        });

        // Result device
        console.log("DEVICE DITEMUKAN:", device);

        // In case the API key is invalid, device will be null
        if (!device) {
        return res.status(403).json({
            status: 'error',
            message: 'Invalid API key'
        });
        }

        // Save to request
        req.device = device;

        next();

        } catch (error) {
            console.error(error);
            res.status(500).json({
            status: 'error',
            message: 'Internal server error'
            });
        }
    };

export default apiKeyMiddleware;