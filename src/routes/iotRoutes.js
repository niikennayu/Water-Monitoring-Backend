import express from 'express';
import apiKeyMiddleware from '../middleware/apiKeyMiddleware.js';

const router = express.Router();

router.post('/water-usage', (req, res) => {
    const { flowRate, volume } = req.body;

    console.log("FlowRate:", flowRate);
    console.log("Volume:", volume);

    res.json({
        status: 'success',
        data: {
            flowRate,
            volume
        }
    });
});

export default router;