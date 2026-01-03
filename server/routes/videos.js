const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Video = require('../models/Video');

// @route   GET /api/videos
// @desc    Get all videos
// @access  Private (Approved Users)
router.get('/', auth, async (req, res) => {
    try {
        const videos = await Video.find().sort({ createdAt: -1 });
        res.json(videos);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
