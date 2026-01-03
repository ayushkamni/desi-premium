import React from 'react';
import { motion } from 'framer-motion';

const HeroSection = () => {
    return (
        <section className="relative min-h-[500px] flex items-center justify-center overflow-hidden pt-20">
            {/* Background Glows */}
            <div className="absolute top-10 left-10 w-96 h-96 bg-saffron/20 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-royal/20 rounded-full blur-[100px]"></div>

            <div className="container mx-auto px-6 text-center relative z-10">
                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="text-5xl md:text-7xl font-premium font-bold mb-6 text-white"
                >
                    Welcome to <span className="gradient-text">Desi Premium World</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 font-body"
                >
                    Experience the finest curation of Desi entertainment blended with absolute luxury.
                    Exclusive content for the exclusive few.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="flex flex-col sm:flex-row justify-center gap-6"
                >
                    <button className="group relative px-10 py-4 rounded-full bg-gradient-to-r from-saffron to-gold text-dark font-black tracking-widest uppercase text-sm shadow-2xl shadow-saffron/20 transition-all hover:shadow-saffron/40 hover:-translate-y-1 active:scale-95 overflow-hidden">
                        <span className="relative z-10">Explore Desi</span>
                        <div className="absolute inset-0 bg-white/30 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-[-20deg]"></div>
                    </button>

                    <button className="group relative px-10 py-4 rounded-full border border-white/10 text-white font-bold tracking-widest uppercase text-sm transition-all hover:border-gold/50 hover:bg-white/5 hover:-translate-y-1 active:scale-95 overflow-hidden">
                        <span className="relative z-10 group-hover:text-gold transition-colors">View Premium</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-gold/0 via-gold/5 to-gold/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

export default HeroSection;
