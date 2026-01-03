const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const createAdmin = async () => {
    try {
        const mongoURI = process.env.MONGO_URI;
        if (!mongoURI) {
            console.error('MONGO_URI is not defined in .env file');
            process.exit(1);
        }

        console.log('Connecting to MongoDB...');
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected');

        const adminData = {
            name: 'Admin User',
            email: 'admin@gmail.com', // You can change this
            password: 'adminpassword123', // You can change this
            role: 'admin',
            isApproved: true
        };

        // Check if admin already exists
        let user = await User.findOne({ email: adminData.email });
        if (user) {
            console.log('Admin user already exists');
            process.exit(0);
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        adminData.password = await bcrypt.hash(adminData.password, salt);

        user = new User(adminData);
        await user.save();

        console.log('Admin user created successfully!');
        console.log('Email:', adminData.email);
        console.log('Password: adminpassword123'); // Original password before hashing

        process.exit(0);
    } catch (err) {
        console.error('Error creating admin:', err.message);
        process.exit(1);
    }
};

createAdmin();
