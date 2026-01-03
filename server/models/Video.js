const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    videoUrl: {
        type: String, // Cloudinary URL
        required: true
    },
    thumbnailUrl: {
        type: String, // Cloudinary URL
        required: false
    },
    category: {
        type: String,
        enum: ['desi', 'premium'],
        required: true
    },
    type: {
        type: String, // 'video', 'image', 'link'
        enum: ['video', 'image', 'link'],
        default: 'video'
    },
    tags: {
        type: [String],
        default: []
    },
    views: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Video', VideoSchema);
