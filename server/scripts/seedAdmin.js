const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB Connected...');

        const email = 'admin@desi.com';
        const password = 'admin123';
        const name = 'Super Admin';

        let user = await User.findOne({ email });

        if (user) {
            console.log('Admin user already exists. Updating role to Admin...');
            user.role = 'admin';
            user.isApproved = true;
            user.name = name;
            // Optionally update password if you want, but might overwrite user's custom password
            // user.password = await bcrypt.hash(password, 10); 
        } else {
            console.log('Creating new Admin user...');
            user = new User({
                name,
                email,
                password,
                role: 'admin',
                isApproved: true
            });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();
        console.log(`\nSUCCESS! Admin User Ready.`);
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        console.log('You can now login at http://localhost:5173/login');

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedAdmin();
