import React from 'react';
import { FaInstagram, FaWhatsapp, FaTwitter, FaYoutube } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Footer = () => {
    return (
        <footer className="bg-dark border-t border-white/10 pt-16 pb-8 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-50"></div>

            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">

                    {/* Brand */}
                    <div className="text-center md:text-left">
                        <h2 className="text-2xl font-premium font-bold text-white mb-2">VIP<span className="text-gold">Cinema</span></h2>
                        <p className="text-gray-400 text-sm max-w-xs">
                            The ultimate destination for premium entertainment. Curated for the exclusive few.
                        </p>
                    </div>

                    {/* Social Icons */}
                    <div className="flex gap-6">
                        {[
                            { icon: FaInstagram, color: "hover:text-pink-500" },
                            { icon: FaWhatsapp, color: "hover:text-green-500" },
                            { icon: FaTwitter, color: "hover:text-blue-400" },
                            { icon: FaYoutube, color: "hover:text-red-500" }
                        ].map((social, index) => (
                            <motion.a
                                key={index}
                                href="#"
                                whileHover={{ y: -5, scale: 1.1 }}
                                className={`text-gray-400 text-2xl transition-colors ${social.color}`}
                            >
                                <social.icon />
                            </motion.a>
                        ))}
                    </div>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-white/5 mb-8"></div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 font-body">
                    <p>&copy; {new Date().getFullYear()} VIP Premium Entertainment. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-saffron transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-saffron transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-saffron transition-colors">Contact Support</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
