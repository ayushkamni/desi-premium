const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Routes (Placeholder)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/videos', require('./routes/videos'));

// Serve Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Hostinger/Render Deployment: Serve Client
if (process.env.NODE_ENV === 'production') {
    const clientPath = path.resolve(__dirname, '../client/dist');
    const indexPath = path.resolve(clientPath, 'index.html');
    
    // Check if dist folder exists
    const fs = require('fs');
    if (fs.existsSync(clientPath) && fs.existsSync(indexPath)) {
        console.log('Serving static files from:', clientPath);
        app.use(express.static(clientPath));
        app.get('*', (req, res) => {
            res.sendFile(indexPath, (err) => {
                if (err) {
                    console.error('Error sending index.html:', err);
                    res.status(500).send('Error loading application');
                }
            });
        });
    } else {
        console.warn('WARNING: Client dist folder not found at:', clientPath);
        console.warn('Make sure to run "npm run build" before starting the server in production');
        app.get('*', (req, res) => {
            res.status(503).send('Application is building. Please try again in a moment.');
        });
    }
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
