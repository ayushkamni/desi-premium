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
                    className="flex justify-center gap-4"
                >
                    <button className="px-8 py-3 rounded-full bg-gradient-to-r from-saffron to-gold text-dark font-bold hover:shadow-lg hover:shadow-saffron/30 transition-all transform hover:-translate-y-1 font-desicon">
                        Explore Desi
                    </button>
                    <button className="px-8 py-3 rounded-full border border-white/20 text-white font-medium hover:bg-white/10 transition-all font-desicon">
                        View Premium
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

export default HeroSection;
