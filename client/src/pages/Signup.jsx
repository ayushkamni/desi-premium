import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', formData);
            setSuccess(res.data.msg);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.msg || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                <div className="absolute bottom-[0%] left-[20%] w-[600px] h-[600px] bg-royal rounded-full blur-[120px]"></div>
                <div className="absolute top-[10%] right-[0%] w-[500px] h-[500px] bg-saffron rounded-full blur-[100px]"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="glass-dark p-8 rounded-2xl w-full max-w-md relative z-10 border border-gold/20 shadow-2xl"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-premium font-bold gradient-text mb-2">Join the Exclusive Club</h1>
                    <p className="text-gray-400 font-body text-sm">Your gateway to Desi Premium Entertainment</p>
                </div>

                {error && <p className="text-red-500 text-center text-sm mb-4">{error}</p>}
                {success && <p className="text-green-500 text-center text-sm mb-4">{success}</p>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-gold-light text-sm font-medium mb-1 font-desicon">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full bg-dark/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-royal-light focus:ring-1 focus:ring-royal-light transition-all"
                            placeholder="Ravi Kumar"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gold-light text-sm font-medium mb-1 font-desicon">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-dark/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-royal-light focus:ring-1 focus:ring-royal-light transition-all"
                            placeholder="ravi@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gold-light text-sm font-medium mb-1 font-desicon">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full bg-dark/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-royal-light focus:ring-1 focus:ring-royal-light transition-all"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <motion.div
                        className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <p className="text-xs text-yellow-500 flex items-center justify-center gap-2">
                            ⚠️ <span>Approval Required by Admin</span>
                        </p>
                    </motion.div>

                    <motion.button
                        whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(15, 81, 50, 0.5)" }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3 rounded-lg font-bold text-white bg-royal hover:bg-royal-light shadow-lg transition-all font-desicon border border-white/10"
                    >
                        Request Access
                    </motion.button>
                </form>

                <p className="text-center mt-6 text-gray-500 text-sm">
                    Already a member? <Link to="/login" className="text-saffron hover:text-gold transition-colors font-medium">Login</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Signup;
