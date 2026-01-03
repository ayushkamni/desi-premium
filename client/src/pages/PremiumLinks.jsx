import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaTelegramPlane, FaLock, FaCrown, FaArrowRight, FaShieldAlt } from 'react-icons/fa';
import axios from 'axios';
import Navbar from '../components/Navbar';

const PremiumLinks = () => {
    const [links, setLinks] = useState([]);
    const [filteredLinks, setFilteredLinks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTag, setActiveTag] = useState('All');
    const [loading, setLoading] = useState(true);

    const tags = ['All', 'Snap', 'School', 'Collage', 'Foreign', 'CCTV', 'Hidden'];

    useEffect(() => {
        const fetchPremiumContent = async () => {
            const token = localStorage.getItem('token');
            const config = { headers: { 'x-auth-token': token } };
            try {
                const res = await axios.get('http://localhost:5000/api/videos', config);
                const premiumContent = res.data.filter(item => item.category === 'premium');
                setLinks(premiumContent);
                setFilteredLinks(premiumContent);
                document.title = "Exclusive Vault | VIP Cinema";
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        };
        fetchPremiumContent();
    }, []);

    useEffect(() => {
        let result = links;
        if (activeTag !== 'All') {
            result = result.filter(item =>
                item.tags && item.tags.some(tag => tag.toLowerCase() === activeTag.toLowerCase())
            );
        }
        if (searchTerm) {
            result = result.filter(item =>
                item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        setFilteredLinks(result);
    }, [searchTerm, activeTag, links]);

    return (
        <div className="min-h-screen bg-dark text-white font-body relative overflow-hidden">
            <Navbar />

            {/* Premium Gold Ambience */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gold/5 rounded-full blur-[150px]"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-saffron/5 rounded-full blur-[150px]"></div>
            </div>

            <main className="relative z-10 container mx-auto px-6 pt-32 pb-24">

                {/* Header Section */}
                <div className="max-w-5xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12"
                    >
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 bg-gold/10 text-gold border border-gold/20 px-4 py-1.5 rounded-full text-xs font-bold mb-6 tracking-widest uppercase">
                                <FaCrown className="animate-pulse" /> VIP Exclusive Access
                            </div>
                            <h1 className="text-5xl md:text-7xl font-premium font-bold mb-6 text-white leading-tight">
                                Exclusive <span className="gradient-text">Vault</span>
                            </h1>
                            <p className="text-gray-400 text-xl font-light">
                                High-end telegram channels, secured snaps, and unreleased content curated for our elite members.
                            </p>
                        </div>

                        <div className="flex items-center gap-4 text-gray-400 border-l border-white/10 pl-6 h-fit hidden md:flex">
                            <FaShieldAlt className="text-gold text-2xl" />
                            <div>
                                <p className="text-white font-bold text-sm">Secured Content</p>
                                <p className="text-xs">End-to-end encrypted links</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Filter Bar */}
                    <div className="flex flex-col lg:flex-row items-center gap-6 glass-dark border border-white/10 p-4 rounded-2xl shadow-2xl">
                        {/* Search Bar */}
                        <div className="relative flex-1 w-full group">
                            <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gold opacity-50 group-focus-within:opacity-100 transition-opacity" />
                            <input
                                type="text"
                                placeholder="Search exclusive content..."
                                className="bg-white/5 border border-white/5 rounded-xl px-14 py-4 text-white w-full placeholder-gray-500 font-medium focus:border-gold/50 focus:outline-none transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 justify-center lg:justify-end">
                            {tags.map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => setActiveTag(tag)}
                                    className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${activeTag === tag
                                        ? 'bg-gold text-dark border-gold shadow-lg shadow-gold/20 scale-105'
                                        : 'bg-white/5 text-gray-500 border-white/5 hover:border-gold/30 hover:text-gold'
                                        }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content List Section - Row Layout */}
                <div className="max-w-6xl mx-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-40 gap-4">
                            <div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin"></div>
                            <p className="text-gold font-premium tracking-widest uppercase text-sm">Decrypting Library...</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <AnimatePresence mode="popLayout">
                                {filteredLinks.map((item, index) => (
                                    <motion.div
                                        key={item._id}
                                        layout
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="group relative"
                                    >
                                        <div className="relative glass-dark border border-white/5 hover:border-gold/30 rounded-2xl p-6 transition-all duration-500 hover:shadow-2xl hover:shadow-gold/5 flex flex-col md:flex-row items-center gap-8 group-hover:-translate-y-1">

                                            {/* Icon / Thumbnail Section */}
                                            <div className="relative shrink-0">
                                                {(item.type === 'link' || !item.thumbnailUrl) ? (
                                                    <div className="relative w-24 h-24 md:w-28 md:h-28 flex items-center justify-center group/icon">
                                                        <div className="absolute inset-0 bg-gradient-to-br from-gold to-saffron rounded-full blur-[25px] opacity-10 group-hover:opacity-60 transition-all duration-700 animate-pulse"></div>
                                                        <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full border-[3px] border-gold group-hover:border-white bg-gradient-to-br from-white/10 to-transparent flex flex-col items-center justify-center transition-all duration-500 shadow-2xl shadow-gold/20 group-hover:shadow-gold/60 group-hover:scale-110 overflow-hidden">
                                                            {item.thumbnailUrl && item.type !== 'link' ? (
                                                                <img
                                                                    src={item.thumbnailUrl}
                                                                    alt={item.title}
                                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                                />
                                                            ) : (
                                                                <>
                                                                    <FaTelegramPlane className="text-4xl text-gold group-hover:text-white transition-colors duration-500" />
                                                                    <div className="absolute -bottom-1 bg-gradient-to-r from-saffron to-gold text-dark text-[9px] font-black px-2.5 py-1 rounded-full tracking-tighter shadow-xl shadow-gold/40 group-hover:scale-110 transition-transform">VIP</div>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="relative w-28 h-28 md:w-32 md:h-32">
                                                        <div className="absolute inset-0 bg-gradient-to-br from-gold to-saffron rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                                        <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10 group-hover:border-gold/50 bg-black/40 flex items-center justify-center">
                                                            <img
                                                                src={item.thumbnailUrl}
                                                                alt={item.title}
                                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Info Content */}
                                            <div className="flex-1 text-center md:text-left min-w-0">
                                                <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mb-3">
                                                    <h3 className="text-2xl font-premium font-bold text-white group-hover:text-gold transition-colors">{item.title}</h3>
                                                    {item.tags && item.tags.map((tag, idx) => (
                                                        <span key={idx} className="text-[10px] bg-gold/10 text-gold/80 border border-gold/20 px-2 py-0.5 rounded tracking-widest uppercase">{tag}</span>
                                                    ))}
                                                </div>
                                                <p className="text-gray-400 text-lg leading-relaxed line-clamp-2 md:line-clamp-1 mb-4 italic">
                                                    "{item.description || 'Exclusive access to our premium network.'}"
                                                </p>
                                                <div className="flex items-center justify-center md:justify-start gap-6 text-xs text-gray-500 font-bold uppercase tracking-[0.2em]">
                                                    <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div> Online Now</span>
                                                    <span className="text-white/20">|</span>
                                                    <span>Updated {new Date(item.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>

                                            {/* Action Button */}
                                            <div className="w-full md:w-auto mt-6 md:mt-0">
                                                <a
                                                    href={item.videoUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center justify-center gap-3 bg-white/5 hover:bg-gold text-white hover:text-dark px-10 py-4 rounded-xl border border-white/10 hover:border-gold font-bold transition-all duration-300 group/btn"
                                                >
                                                    <FaTelegramPlane className="text-xl group-hover/btn:scale-125 transition-transform" />
                                                    <span className="tracking-widest uppercase text-sm">Join Channel</span>
                                                    <FaArrowRight className="text-xs opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
                                                </a>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}

                    {!loading && filteredLinks.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-40 border-2 border-dashed border-white/5 rounded-3xl bg-white/5"
                        >
                            <FaLock className="text-6xl text-gold/20 mx-auto mb-6" />
                            <h3 className="text-2xl font-premium font-bold text-white mb-2">Access Restricted</h3>
                            <p className="text-gray-500 max-w-sm mx-auto">No exclusive content matches your current filter selection. Please reset or try another tag.</p>
                            <button
                                onClick={() => { setActiveTag('All'); setSearchTerm(''); }}
                                className="mt-8 text-gold font-bold flex items-center gap-2 mx-auto hover:underline"
                            >
                                Clear All Encryption
                            </button>
                        </motion.div>
                    )}
                </div>

            </main>

            {/* Bottom Decor */}
            <div className="fixed bottom-0 left-0 w-full p-8 text-center pointer-events-none opacity-20">
                <p className="text-[10px] text-gold tracking-[0.5em] uppercase font-bold">The Gold Standard of Desi Entertainment</p>
            </div>
        </div>
    );
};

export default PremiumLinks;
