import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await api.post('/auth/login', { email, password });

            // Save token and user info
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user)); // Access user from res.data

            // Redirect based on role
            if (res.data.user.role === 'admin') {
                navigate('/dashboard');
            } else {
                navigate('/desi-content');
            }

        } catch (err) {
            if (err.response && err.response.status === 403) {
                setError('Your account is waiting for Admin approval. Please check back later.');
            } else {
                setError(err.response?.data?.msg || 'Login failed. Please checks your credentials.');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] bg-saffron rounded-full blur-[120px]"></div>
                <div className="absolute top-[40%] -right-[10%] w-[500px] h-[500px] bg-royal rounded-full blur-[100px]"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="glass-dark p-8 rounded-2xl w-full max-w-md relative z-10 border border-gold/20 shadow-2xl"
            >
                <div className="absolute top-6 left-6">
                    <Link to="/" className="text-gray-400 hover:text-gold transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                        ← Home
                    </Link>
                </div>

                <div className="text-center mb-8 mt-4">
                    <h1 className="text-4xl font-premium font-bold gradient-text mb-2">Welcome Back</h1>
                    <p className="text-gray-400 font-body text-sm">Enter the Desi Premium World</p>
                </div>

                {error && <p className="text-red-500 text-center text-sm mb-4 bg-red-500/10 p-2 rounded border border-red-500/20">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gold-light text-sm font-medium mb-2 font-desicon">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-dark/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron transition-all"
                            placeholder="you@desiworld.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gold-light text-sm font-medium mb-2 font-desicon">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-dark/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron transition-all"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(255, 153, 51, 0.4)" }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3 rounded-lg font-bold text-dark bg-gradient-to-r from-saffron to-gold shadow-lg hover:shadow-saffron/20 transition-all font-desicon"
                    >
                        Login to Premium
                    </motion.button>
                </form>

                <p className="text-center mt-6 text-gray-500 text-sm">
                    New here? <Link to="/signup" className="text-saffron hover:text-gold transition-colors font-medium">Join the Club</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
