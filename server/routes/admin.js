const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const User = require('../models/User');
const Video = require('../models/Video');
const bcrypt = require('bcryptjs');

// @route   GET /api/admin/users
// @desc    Get all users (for management)
// @access  Private/Admin
router.get('/users', [auth, admin], async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/admin/approve/:id
// @desc    Approve a user
// @access  Private/Admin
router.put('/approve/:id', [auth, admin], async (req, res) => {
    try {
        let user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        user.isApproved = true;
        await user.save();

        res.json({ msg: 'User approved successfully', user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure Multer Storage
const storage = multer.diskStorage({
    destination: path.join(__dirname, '../uploads'),
    filename: function (req, file, cb) {
        cb(null, 'video-' + Date.now() + path.extname(file.originalname));
    }
});

// Init Upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 100000000 }, // 100MB limit
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).fields([{ name: 'videoFile', maxCount: 1 }, { name: 'thumbnailFile', maxCount: 1 }]);

// Check File Type
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif|mp4|mov|avi|pdf/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Videos/Images/PDFs Only!');
    }
}

// Helper function to determine Cloudinary resource type based on file
function getResourceType(file) {
    const ext = path.extname(file.originalname || file.path || '').toLowerCase();
    const mimetype = file.mimetype || '';

    // Image extensions
    const imageExts = /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i;
    const imageMimes = /^image\//;

    // Video extensions
    const videoExts = /\.(mp4|mov|avi|wmv|flv|webm|mkv|m4v)$/i;
    const videoMimes = /^video\//;

    if (imageExts.test(ext) || imageMimes.test(mimetype)) {
        return 'image';
    } else if (videoExts.test(ext) || videoMimes.test(mimetype)) {
        return 'video';
    }

    // Default to image for unknown types (safer)
    return 'image';
}

const cloudinary = require('cloudinary').v2;

// Cloudinary Config
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

if (!process.env.CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error("FATAL ERROR: Cloudinary keys are missing from .env file!");
    console.error("Please ensure CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET are set in server/.env");
}

// @route   POST /api/admin/videos
// @desc    Add a new video (supports file upload -> Cloudinary)
// @access  Private/Admin
router.post('/videos', [auth, admin], (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ msg: err });
        } else {
            // File Uploaded or URL provided
            const { title, description, videoUrl, thumbnailUrl, category, tags, type } = req.body;

            let finalVideoUrl = videoUrl || '';
            let finalThumbnailUrl = thumbnailUrl || '';

            // Validation: Check if at least video URL or file is provided
            if (!req.files || !req.files['videoFile']) {
                if (!videoUrl || videoUrl.trim() === '') {
                    return res.status(400).json({ msg: 'Please provide either a video file or video URL' });
                }
            }

            try {
                // Upload Video File to Cloudinary
                if (req.files && req.files['videoFile']) {
                    const videoFile = req.files['videoFile'][0];
                    const videoPath = videoFile.path;

                    // Check if Cloudinary is configured
                    if (!process.env.CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
                        // Clean up uploaded file
                        if (fs.existsSync(videoPath)) {
                            fs.unlinkSync(videoPath);
                        }
                        return res.status(500).json({ msg: 'Cloudinary configuration is missing. Please check your environment variables.' });
                    }

                    // Determine resource type based on actual file type
                    const resourceType = getResourceType(videoFile);
                    const folder = resourceType === 'video' ? 'desi-premium/videos' : 'desi-premium/images';

                    const result = await cloudinary.uploader.upload(videoPath, {
                        resource_type: resourceType,
                        folder: folder
                    });
                    finalVideoUrl = result.secure_url;
                    // Remove local file
                    if (fs.existsSync(videoPath)) {
                        fs.unlinkSync(videoPath);
                    }
                }

                // Upload Thumbnail File to Cloudinary
                if (req.files && req.files['thumbnailFile']) {
                    const thumbPath = req.files['thumbnailFile'][0].path;

                    // Check if Cloudinary is configured
                    if (!process.env.CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
                        // Clean up uploaded file
                        if (fs.existsSync(thumbPath)) {
                            fs.unlinkSync(thumbPath);
                        }
                        return res.status(500).json({ msg: 'Cloudinary configuration is missing. Please check your environment variables.' });
                    }

                    const result = await cloudinary.uploader.upload(thumbPath, {
                        resource_type: "image",
                        folder: "desi-premium/thumbnails"
                    });
                    finalThumbnailUrl = result.secure_url;
                    // Remove local file
                    if (fs.existsSync(thumbPath)) {
                        fs.unlinkSync(thumbPath);
                    }
                }

                const newVideo = new Video({
                    title,
                    description,
                    videoUrl: finalVideoUrl,
                    thumbnailUrl: finalThumbnailUrl,
                    category,
                    type,
                    tags: tags ? tags.split(',').map(tag => tag.trim()) : []
                });

                const video = await newVideo.save();
                res.json(video);
            } catch (err) {
                console.error("Cloudinary/Server Error:", err);

                // Clean up any uploaded files on error
                if (req.files && req.files['videoFile']) {
                    const videoPath = req.files['videoFile'][0].path;
                    if (fs.existsSync(videoPath)) {
                        fs.unlinkSync(videoPath);
                    }
                }
                if (req.files && req.files['thumbnailFile']) {
                    const thumbPath = req.files['thumbnailFile'][0].path;
                    if (fs.existsSync(thumbPath)) {
                        fs.unlinkSync(thumbPath);
                    }
                }

                // Send more detailed error message
                const errorMessage = err.message || 'Server/Upload Error';
                res.status(500).json({ msg: `Upload failed: ${errorMessage}` });
            }
        }
    });
});

// @route   GET /api/admin/stats
// @desc    Get dashboard stats
// @access  Private/Admin
router.get('/stats', [auth, admin], async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const pendingUsers = await User.countDocuments({ isApproved: false });
        const totalVideos = await Video.countDocuments();
        const totalAdmins = await User.countDocuments({ role: 'admin' });

        res.json({ totalUsers, pendingUsers, totalVideos, totalAdmins });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/admin/promote/:id
// @desc    Promote user to Admin
// @access  Private/Admin
router.put('/promote/:id', [auth, admin], async (req, res) => {
    try {
        let user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        user.role = 'admin';
        user.isApproved = true; // Admins are auto-approved
        await user.save();

        res.json({ msg: 'User promoted to Admin', user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/admin/reset-password/:id
// @desc    Reset user password
// @access  Private/Admin
router.put('/reset-password/:id', [auth, admin], async (req, res) => {
    const { password } = req.body;
    try {
        let user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        res.json({ msg: 'Password updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/admin/videos/:id
// @desc    Delete a video
// @access  Private/Admin
router.delete('/videos/:id', [auth, admin], async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) return res.status(404).json({ msg: 'Video not found' });

        // Function to extract public_id from Cloudinary URL
        const getPublicId = (url) => {
            if (!url) return null;
            const parts = url.split('/');
            const fileName = parts[parts.length - 1];
            const publicId = fileName.split('.')[0];

            // If it's in a folder, we need the folder name too
            // Cloudinary URLs usually look like: .../upload/v12345/folder/subfolder/publicId.ext
            const uploadIndex = parts.indexOf('upload');
            if (uploadIndex !== -1 && parts.length > uploadIndex + 2) {
                // Join parts between version (v...) and filename
                const folderParts = parts.slice(uploadIndex + 2, parts.length - 1);
                if (folderParts.length > 0) {
                    return folderParts.join('/') + '/' + publicId;
                }
            }
            return publicId;
        };

        // Delete from Cloudinary if URLs exist
        try {
            if (video.videoUrl && video.videoUrl.includes('cloudinary')) {
                const publicId = getPublicId(video.videoUrl);
                if (publicId) await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
            }
            if (video.thumbnailUrl && video.thumbnailUrl.includes('cloudinary')) {
                const publicId = getPublicId(video.thumbnailUrl);
                if (publicId) await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
            }
        } catch (cloudinaryErr) {
            console.error('Cloudinary deletion error:', cloudinaryErr);
            // Continue with database deletion even if Cloudinary fails
        }

        await video.deleteOne();
        res.json({ msg: 'Video removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/admin/videos/:id
// @desc    Update video details (supports file updates -> Cloudinary)
// @access  Private/Admin
router.put('/videos/:id', [auth, admin], (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ msg: err });
        }

        try {
            let video = await Video.findById(req.params.id);
            if (!video) return res.status(404).json({ msg: 'Video not found' });

            const { title, description, category, tags, type, videoUrl, thumbnailUrl } = req.body;
            const videoFields = {};

            if (title) videoFields.title = title;
            if (description !== undefined) videoFields.description = description;
            if (category) videoFields.category = category;
            if (type) videoFields.type = type;

            // Handle Tags
            if (tags) {
                videoFields.tags = Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim());
            }

            // Handle Video File Upload
            if (req.files && req.files['videoFile']) {
                const videoFile = req.files['videoFile'][0];
                const videoPath = videoFile.path;

                if (process.env.CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
                    try {
                        const resourceType = getResourceType(videoFile);
                        const folder = resourceType === 'video' ? 'desi-premium/videos' : 'desi-premium/images';

                        const result = await cloudinary.uploader.upload(videoPath, {
                            resource_type: resourceType,
                            folder: folder
                        });
                        videoFields.videoUrl = result.secure_url;

                        // Cleanup local file
                        if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
                    } catch (uploadErr) {
                        console.error('Cloudinary upload error:', uploadErr);
                        // Cleanup local file on error
                        if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
                        throw new Error('Failed to upload video file to Cloudinary');
                    }
                } else {
                    // Cleanup local file if Cloudinary not configured
                    if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
                    return res.status(500).json({ msg: 'Cloudinary configuration is missing' });
                }
            } else if (videoUrl && videoUrl.trim() !== '') {
                videoFields.videoUrl = videoUrl.trim();
            }

            // Handle Thumbnail File Upload
            if (req.files && req.files['thumbnailFile']) {
                const thumbPath = req.files['thumbnailFile'][0].path;

                if (process.env.CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
                    try {
                        const result = await cloudinary.uploader.upload(thumbPath, {
                            resource_type: "image",
                            folder: "desi-premium/thumbnails"
                        });
                        videoFields.thumbnailUrl = result.secure_url;

                        // Cleanup local file
                        if (fs.existsSync(thumbPath)) fs.unlinkSync(thumbPath);
                    } catch (uploadErr) {
                        console.error('Cloudinary upload error:', uploadErr);
                        // Cleanup local file on error
                        if (fs.existsSync(thumbPath)) fs.unlinkSync(thumbPath);
                        throw new Error('Failed to upload thumbnail to Cloudinary');
                    }
                } else {
                    // Cleanup local file if Cloudinary not configured
                    if (fs.existsSync(thumbPath)) fs.unlinkSync(thumbPath);
                    return res.status(500).json({ msg: 'Cloudinary configuration is missing' });
                }
            } else if (thumbnailUrl && thumbnailUrl.trim() !== '') {
                videoFields.thumbnailUrl = thumbnailUrl.trim();
            }

            video = await Video.findByIdAndUpdate(
                req.params.id,
                { $set: videoFields },
                { new: true }
            );

            res.json(video);
        } catch (err) {
            console.error('Update video error:', err);
            
            // Clean up any uploaded files on error
            if (req.files && req.files['videoFile']) {
                const videoPath = req.files['videoFile'][0].path;
                if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
            }
            if (req.files && req.files['thumbnailFile']) {
                const thumbPath = req.files['thumbnailFile'][0].path;
                if (fs.existsSync(thumbPath)) fs.unlinkSync(thumbPath);
            }
            
            const errorMessage = err.message || 'Server Error';
            res.status(500).json({ msg: errorMessage });
        }
    });
});

// @route   DELETE /api/admin/users/:id
// @desc    Remove a user
// @access  Private/Admin
router.delete('/users/:id', [auth, admin], async (req, res) => {
    try {
        // Prevent deleting yourself
        if (req.params.id === req.user.id) {
            return res.status(400).json({ msg: 'You cannot delete yourself' });
        }

        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        await user.deleteOne();
        res.json({ msg: 'User removed successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
