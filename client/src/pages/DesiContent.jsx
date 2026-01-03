import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaPlay, FaLock, FaTelegramPlane } from 'react-icons/fa';
import axios from 'axios';
import Navbar from '../components/Navbar';

const DesiContent = () => {
    const [videos, setVideos] = useState([]);
    const [filteredVideos, setFilteredVideos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTag, setActiveTag] = useState('All');
    const [loading, setLoading] = useState(true);

    const tags = ['All', 'Snap', 'Collage', 'School', 'Office', 'Hidden'];

    useEffect(() => {
        const fetchVideos = async () => {
            const token = localStorage.getItem('token');
            const config = { headers: { 'x-auth-token': token } };
            try {
                const res = await axios.get('http://localhost:5000/api/videos', config);
                // Filter only Desi content
                const desiContent = res.data.filter(video => video.category === 'desi');
                setVideos(desiContent);
                setFilteredVideos(desiContent);
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        };
        fetchVideos();
    }, []);

    useEffect(() => {
        let result = videos;

        // Filter by Tag
        if (activeTag !== 'All') {
            result = result.filter(video =>
                video.tags && video.tags.some(tag => tag.toLowerCase() === activeTag.toLowerCase())
            );
        }

        // Filter by Search
        if (searchTerm) {
            result = result.filter(video =>
                video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                video.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredVideos(result);
    }, [searchTerm, activeTag, videos]);

    return (
        <div className="min-h-screen bg-dark text-white font-body relative">
            <Navbar />

            {/* Background Ambience */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
                <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-royal/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-20 right-1/4 w-[500px] h-[500px] bg-saffron/10 rounded-full blur-[120px]"></div>
            </div>

            <main className="relative z-10 container mx-auto px-6 pt-32 pb-12">

                {/* Search & Tags Section */}
                <div className="max-w-3xl mx-auto mb-16 text-center">
                    <h1 className="text-3xl font-premium font-bold mb-8">
                        <span className="gradient-text">Desi Content</span>
                    </h1>

                    {/* Search Bar */}
                    <div className="relative mb-8 group">
                        <div className="absolute inset-0 bg-gradient-to-r from-saffron to-gold rounded-full blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                        <div className="relative bg-white/5 border border-white/10 rounded-full flex items-center px-6 py-4 shadow-2xl backdrop-blur-md">
                            <FaSearch className="text-gray-400 mr-4 text-lg" />
                            <input
                                type="text"
                                placeholder="Search for stories, places, moments..."
                                className="bg-transparent border-none outline-none text-white w-full placeholder-gray-500 font-medium"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap justify-center gap-3">
                        {tags.map(tag => (
                            <button
                                key={tag}
                                onClick={() => setActiveTag(tag)}
                                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${activeTag === tag
                                    ? 'bg-gradient-to-r from-saffron to-gold text-dark border-transparent shadow-lg shadow-saffron/20 scale-105'
                                    : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:border-white/20'
                                    }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Video Grid */}
                {loading ? (
                    <div className="text-center text-gray-500 py-20">Loading desi content...</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence>
                            {filteredVideos.map((video) => (
                                <motion.div
                                    key={video._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                    className="group relative rounded-2xl overflow-hidden glass-dark border border-white/5 hover:border-gold/30 transition-all hover:shadow-2xl hover:shadow-gold/10"
                                >
                                    {/* Thumbnail / Content Preview */}
                                    <div className="aspect-video relative overflow-hidden">
                                        <img
                                            src={video.thumbnailUrl}
                                            alt={video.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />

                                        {/* Overlay Content */}
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            {video.type === 'video' && (
                                                <a href={video.videoUrl} target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 hover:scale-110 transition-transform">
                                                    <FaPlay className="ml-1" />
                                                </a>
                                            )}
                                            {video.type === 'link' && (
                                                <a href={video.videoUrl} target="_blank" rel="noopener noreferrer" className="px-6 py-2 bg-[#0088cc] rounded-full text-white font-bold flex items-center gap-2 hover:bg-[#0077b5] transition-colors shadow-lg">
                                                    <FaTelegramPlane /> Join Channel
                                                </a>
                                            )}
                                            {video.type === 'image' && (
                                                <span className="px-4 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-sm">View Image</span>
                                            )}
                                        </div>

                                        {/* Type Badge */}
                                        <div className="absolute top-3 left-3">
                                            {video.type === 'video' && <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded">VIDEO</span>}
                                            {video.type === 'image' && <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-1 rounded">IMAGE</span>}
                                            {video.type === 'link' && <span className="bg-[#0088cc] text-white text-[10px] font-bold px-2 py-1 rounded">LINK</span>}
                                        </div>

                                        {video.category === 'premium' && (
                                            <div className="absolute top-3 right-3 bg-gold text-black text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                                                <FaLock size={10} /> PREMIUM
                                            </div>
                                        )}
                                        {/* Tags Overlay */}
                                        <div className="absolute bottom-3 left-3 flex gap-2">
                                            {video.tags && video.tags.map((tag, idx) => (
                                                <span key={idx} className="text-[10px] bg-black/60 text-white px-2 py-1 rounded backdrop-blur-sm uppercase tracking-wider">{tag}</span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5">
                                        <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{video.title}</h3>
                                        <p className="text-gray-400 text-sm line-clamp-2 mb-4">{video.description}</p>
                                        <div className="flex justify-between items-center text-xs text-gray-500 font-medium uppercase tracking-widest">
                                            <span>{video.category}</span>
                                            <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}

                {!loading && filteredVideos.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-lg">No desi content found.</p>
                        <button onClick={() => { setActiveTag('All'); setSearchTerm(''); }} className="mt-4 text-saffron underline">Clear Filters</button>
                    </div>
                )}

            </main>
        </div>
    );
};

export default DesiContent;
