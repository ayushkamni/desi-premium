import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaVideo, FaChartLine, FaSignOutAlt, FaCheck, FaTimes, FaCloudUploadAlt } from 'react-icons/fa';
import { FaTelegramPlane } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Data States
    const [stats, setStats] = useState({ totalUsers: 0, pendingUsers: 0, totalVideos: 0, totalAdmins: 0 });
    const [users, setUsers] = useState([]);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'upload' or 'edit'
    const [editingVideo, setEditingVideo] = useState(null);

    // Video Form State
    const [videoForm, setVideoForm] = useState({
        title: '', description: '', videoUrl: '', thumbnailUrl: '', category: 'desi', type: 'video', tags: ''
    });
    const [uploadStatus, setUploadStatus] = useState('');

    // Password Reset Modal State
    const [passwordModal, setPasswordModal] = useState({ show: false, userId: '', userName: '', newPassword: '' });


    useEffect(() => {
        fetchStats();
    }, []);

    useEffect(() => {
        if (activeTab === 'users') fetchUsers();
        if (activeTab === 'videos') fetchVideos();
    }, [activeTab]);

    const fetchStats = async () => {
        try {
            const res = await api.get('/admin/stats');
            setStats(res.data);
        } catch (err) {
            console.error("Error fetching stats", err);
        }
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/users');
            setUsers(res.data);
        } catch (err) {
            console.error("Error fetching users", err);
        }
        setLoading(false);
    };

    const fetchVideos = async () => {
        setLoading(true);
        try {
            // Need a route to get all videos for admin
            // Assuming /api/videos exists or we should use /api/admin/videos if we want all
            const res = await api.get('/videos');
            setVideos(res.data);
        } catch (err) {
            console.error("Error fetching videos", err);
        }
        setLoading(false);
    };

    const approveUser = async (id) => {
        try {
            await api.put(`/admin/approve/${id}`, {});
            // Update UI optimistically
            setUsers(users.map(user => user._id === id ? { ...user, isApproved: true } : user));
            fetchStats(); // Refresh stats
        } catch (err) {
            console.error("Error approving user", err);
        }
    };

    const promoteToAdmin = async (id) => {
        if (!window.confirm("Are you sure you want to promote this user to Admin? They will have full access.")) return;
        try {
            await api.put(`/admin/promote/${id}`, {});
            setUsers(users.map(user => user._id === id ? { ...user, role: 'admin', isApproved: true } : user));
            fetchStats();
        } catch (err) {
            console.error("Error promoting user", err);
        }
    };

    const deleteUser = async (id) => {
        if (!window.confirm("Are you sure you want to remove this user? This action cannot be undone.")) return;
        try {
            await api.delete(`/admin/users/${id}`);
            setUsers(users.filter(user => user._id !== id));
            fetchStats();
        } catch (err) {
            console.error("Error deleting user", err);
            alert(err.response?.data?.msg || "Failed to delete user");
        }
    };

    const deleteVideo = async (id) => {
        if (!window.confirm("Are you sure you want to delete this content?")) return;
        try {
            await api.delete(`/admin/videos/${id}`);
            setVideos(videos.filter(v => v._id !== id));
            fetchStats();
        } catch (err) {
            console.error("Error deleting video", err);
            alert("Failed to delete video");
        }
    };

    const startEditVideo = (video) => {
        setEditingVideo(video);
        setVideoForm({
            title: video.title,
            description: video.description || '',
            videoUrl: video.videoUrl,
            thumbnailUrl: video.thumbnailUrl,
            category: video.category,
            type: video.type || 'video',
            tags: video.tags ? video.tags.join(', ') : '',
            videoFile: null,
            thumbnailFile: null
        });
        setViewMode('edit');
        setUploadStatus('');
    };

    const initiatePasswordReset = (user) => {
        setPasswordModal({ show: true, userId: user._id, userName: user.name, newPassword: '' });
    };

    const handlePasswordReset = async () => {
        try {
            await api.put(`/admin/reset-password/${passwordModal.userId}`, { password: passwordModal.newPassword });
            alert('Password updated successfully');
            setPasswordModal({ show: false, userId: '', userName: '', newPassword: '' });
        } catch (err) {
            console.error("Error resetting password", err);
            alert('Failed to reset password');
        }
    };

    const handleFileChange = (e) => {
        if (e.target.name === 'videoFile') {
            setVideoForm({ ...videoForm, videoFile: e.target.files[0] });
        } else if (e.target.name === 'thumbnailFile') {
            setVideoForm({ ...videoForm, thumbnailFile: e.target.files[0] });
        }
    };

    const handleVideoSubmit = async (e) => {
        e.preventDefault();
        setUploadStatus('Uploading...');

        const formData = new FormData();
        formData.append('title', videoForm.title);
        formData.append('description', videoForm.description);
        formData.append('type', videoForm.type);
        formData.append('category', videoForm.category);
        formData.append('tags', videoForm.tags);

        // Append Video File/URL
        if (videoForm.videoFile) {
            formData.append('videoFile', videoForm.videoFile);
        } else {
            formData.append('videoUrl', videoForm.videoUrl);
        }

        // Append Thumbnail File/URL
        if (videoForm.thumbnailFile) {
            formData.append('thumbnailFile', videoForm.thumbnailFile);
        } else {
            formData.append('thumbnailUrl', videoForm.thumbnailUrl);
        }


        try {
            if (viewMode === 'edit') {
                await api.put(`/admin/videos/${editingVideo._id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setUploadStatus('Video Updated Successfully!');
                setViewMode('list');
                fetchVideos();
            } else {
                const response = await api.post('/admin/videos', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setUploadStatus('Video Uploaded Successfully!');
                setViewMode('list');
                fetchVideos();
            }

            setVideoForm({ title: '', description: '', videoUrl: '', thumbnailUrl: '', category: 'desi', type: 'video', tags: '', videoFile: null, thumbnailFile: null });
            fetchStats();
        } catch (err) {
            console.error("Error saving video", err);
            const errorMessage = err.response?.data?.msg || err.message || 'Action Failed!';
            setUploadStatus(`${viewMode === 'edit' ? 'Update' : 'Upload'} Failed: ${errorMessage}`);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const SidebarItem = ({ id, icon: Icon, label }) => (
        <div
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all ${activeTab === id ? 'bg-gradient-to-r from-saffron to-gold text-dark font-bold shadow-lg' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
        >
            <Icon className="text-xl" />
            {isSidebarOpen && <span>{label}</span>}
        </div>
    );

    return (
        <div className="flex h-screen bg-dark text-white overflow-hidden font-body">
            {/* Sidebar */}
            <motion.div
                animate={{ width: isSidebarOpen ? '260px' : '80px' }}
                className="glass-dark border-r border-white/5 flex flex-col z-20"
            >
                <div className="p-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-saffron to-gold rounded-full flex items-center justify-center shadow-lg shrink-0">
                        <span className="text-white font-bold text-xl font-premium">D</span>
                    </div>
                    {isSidebarOpen && <span className="text-xl font-premium font-bold gradient-text">Admin</span>}
                </div>

                <div className="flex-1 px-4 space-y-2 mt-4">
                    <SidebarItem id="dashboard" icon={FaChartLine} label="Overview" />
                    <SidebarItem id="users" icon={FaUsers} label="Manage Users" />
                    <SidebarItem id="videos" icon={FaVideo} label="Manage Videos" />
                </div>

                <div className="p-4 border-t border-white/5">
                    <div onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg cursor-pointer transition-colors">
                        <FaSignOutAlt className="text-xl" />
                        {isSidebarOpen && <span>Logout</span>}
                    </div>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-8 relative">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-royal/10 rounded-full blur-[100px] pointer-events-none"></div>

                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-premium font-bold text-white">
                            {activeTab === 'dashboard' && 'Dashboard Overview'}
                            {activeTab === 'users' && 'User Management'}
                            {activeTab === 'videos' && 'Content Library'}
                        </h1>
                        <p className="text-gray-400 text-sm">Welcome back, Admin</p>
                    </div>
                </header>

                {/* Content Area */}
                {activeTab === 'dashboard' && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="p-6 glass-dark rounded-xl border border-white/5">
                            <h3 className="text-gray-400 text-sm mb-2">Total Users</h3>
                            <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
                        </div>
                        <div className="p-6 glass-dark rounded-xl border border-white/5">
                            <h3 className="text-gray-400 text-sm mb-2">Pending Requests</h3>
                            <p className="text-3xl font-bold text-saffron">{stats.pendingUsers}</p>
                        </div>
                        <div className="p-6 glass-dark rounded-xl border border-white/5">
                            <h3 className="text-gray-400 text-sm mb-2">Total Videos</h3>
                            <p className="text-3xl font-bold text-gold">{stats.totalVideos}</p>
                        </div>
                        <div className="p-6 glass-dark rounded-xl border border-gold/20 bg-gold/5">
                            <h3 className="text-gold text-sm mb-2">Total Admins</h3>
                            <p className="text-3xl font-bold text-white">{stats.totalAdmins}</p>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="glass-dark rounded-xl border border-white/5 overflow-hidden">
                        <div className="p-4 bg-white/5 border-b border-white/5">
                            <h3 className="font-bold text-white">User Management</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-400">
                                <thead className="bg-white/5 text-xs uppercase font-medium text-gray-200">
                                    <tr>
                                        <th className="px-6 py-4">Name</th>
                                        <th className="px-6 py-4">Email</th>
                                        <th className="px-6 py-4">Role</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {users.map(user => (
                                        <tr key={user._id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 font-medium text-white">{user.name}</td>
                                            <td className="px-6 py-4">{user.email}</td>
                                            <td className="px-6 py-4 capitalize">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.role === 'admin' ? 'bg-gold/20 text-gold' : 'bg-white/10 text-gray-300'}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {user.isApproved ? (
                                                    <span className="px-2 py-1 rounded text-xs bg-green-500/20 text-green-400">Active</span>
                                                ) : (
                                                    <span className="px-2 py-1 rounded text-xs bg-yellow-500/20 text-yellow-400">Pending</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 flex gap-2">
                                                {!user.isApproved && user.role !== 'admin' && (
                                                    <button
                                                        onClick={() => approveUser(user._id)}
                                                        className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/50 rounded hover:bg-green-500/20 transition-colors"
                                                        title="Approve User"
                                                    >
                                                        <FaCheck />
                                                    </button>
                                                )}

                                                {user.role !== 'admin' && (
                                                    <button
                                                        onClick={() => promoteToAdmin(user._id)}
                                                        className="px-3 py-1 bg-gold/10 text-gold border border-gold/50 rounded hover:bg-gold/20 transition-colors"
                                                        title="Promote to Admin"
                                                    >
                                                        <FaUsers />
                                                    </button>
                                                )}

                                                <button
                                                    onClick={() => initiatePasswordReset(user)}
                                                    className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/50 rounded hover:bg-blue-500/20 transition-colors"
                                                    title="Reset Password"
                                                >
                                                    Key
                                                </button>

                                                <button
                                                    onClick={() => deleteUser(user._id)}
                                                    className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/50 rounded hover:bg-red-500/20 transition-colors"
                                                    title="Delete User"
                                                >
                                                    <FaTimes />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {users.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No users found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'videos' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
                            <h3 className="font-bold text-white text-lg">Manage Library</h3>
                            <button
                                onClick={() => {
                                    setViewMode(viewMode === 'list' ? 'upload' : 'list');
                                    setUploadStatus('');
                                    setEditingVideo(null);
                                    setVideoForm({ title: '', description: '', videoUrl: '', thumbnailUrl: '', category: 'desi', type: 'video', tags: '', videoFile: null, thumbnailFile: null });
                                }}
                                className="px-4 py-2 bg-gradient-to-r from-saffron to-gold text-dark font-bold rounded-lg hover:shadow-lg transition-all"
                            >
                                {viewMode === 'list' ? 'Add New Content' : 'View Library'}
                            </button>
                        </div>

                        {viewMode === 'list' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {videos.map(video => (
                                    <div key={video._id} className="glass-dark border border-white/5 rounded-xl overflow-hidden group">
                                        <div className="aspect-video relative overflow-hidden bg-black/40 flex items-center justify-center">
                                            {video.thumbnailUrl ? (
                                                <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                            ) : (
                                                <div className="flex flex-col items-center gap-2 opacity-40">
                                                    {video.type === 'link' ? (
                                                        <FaTelegramPlane className="text-4xl text-gold" />
                                                    ) : (
                                                        <FaVideo className="text-4xl text-saffron" />
                                                    )}
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">{video.type}</span>
                                                </div>
                                            )}
                                            <div className="absolute top-2 right-2 flex gap-2">
                                                <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold ${video.category === 'premium' ? 'bg-gold text-dark' : 'bg-saffron text-dark'}`}>
                                                    {video.category}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h4 className="font-bold text-white mb-1 truncate">{video.title}</h4>
                                            <div className="flex justify-between items-center mt-4">
                                                <button
                                                    onClick={() => startEditVideo(video)}
                                                    className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => deleteVideo(video._id)}
                                                    className="text-red-400 hover:text-red-300 text-sm font-medium"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {videos.length === 0 && (
                                    <div className="col-span-full py-20 text-center text-gray-500">
                                        No videos in library.
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="glass-dark rounded-xl border border-white/5 p-8 max-w-2xl mx-auto">
                                <div className="flex flex-col items-center justify-center text-center mb-6">
                                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 text-gray-400">
                                        <FaCloudUploadAlt className="text-3xl" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">{viewMode === 'edit' ? 'Edit Content' : 'Upload New Content'}</h3>
                                    <p className="text-gray-400">{viewMode === 'edit' ? 'Update the details below' : 'Upload a video/image file or provide a URL'}</p>
                                </div>

                                <form onSubmit={handleVideoSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Video Title</label>
                                        <input
                                            type="text"
                                            className="w-full bg-dark border border-white/10 rounded-lg px-4 py-2 text-white focus:border-saffron focus:outline-none"
                                            value={videoForm.title}
                                            onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Description</label>
                                        <textarea
                                            className="w-full bg-dark border border-white/10 rounded-lg px-4 py-2 text-white focus:border-saffron focus:outline-none"
                                            rows="3"
                                            value={videoForm.description}
                                            onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                                        ></textarea>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Content Type</label>
                                        <select
                                            className="w-full bg-dark border border-white/10 rounded-lg px-4 py-2 text-white focus:border-saffron focus:outline-none"
                                            value={videoForm.type}
                                            onChange={(e) => setVideoForm({ ...videoForm, type: e.target.value })}
                                        >
                                            <option value="video">Video</option>
                                            <option value="image">Image (Pic)</option>
                                            <option value="link">Telegram Link</option>
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-1">
                                                {videoForm.type === 'link' ? 'Link URL' : 'Upload File or Provide URL'}
                                            </label>

                                            <input
                                                type="text"
                                                className="w-full bg-dark border border-white/10 rounded-lg px-4 py-2 text-white focus:border-saffron focus:outline-none mb-2"
                                                placeholder={videoForm.type === 'link' ? 'https://t.me/...' : 'https://...'}
                                                value={videoForm.videoUrl}
                                                onChange={(e) => setVideoForm({ ...videoForm, videoUrl: e.target.value })}
                                            />

                                            {videoForm.type !== 'link' && (
                                                <div className="flex items-center">
                                                    <span className="text-gray-500 mr-2 text-sm">OR</span>
                                                    <input
                                                        type="file"
                                                        name="videoFile"
                                                        className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20"
                                                        onChange={handleFileChange}
                                                        accept="video/*,image/*"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-1">
                                                {videoForm.type === 'link' ? 'Preview Image URL (Optional)' : 'Thumbnail (URL or Upload)'}
                                            </label>

                                            {videoForm.type === 'link' && <p className="text-[10px] text-gray-500 mb-1 italic">Links look best with a preview, but it's not required.</p>}

                                            <input
                                                type="text"
                                                className="w-full bg-dark border border-white/10 rounded-lg px-4 py-2 text-white focus:border-saffron focus:outline-none mb-2"
                                                placeholder={videoForm.type === 'link' ? 'https://image-url...' : 'https://image...'}
                                                value={videoForm.thumbnailUrl}
                                                onChange={(e) => setVideoForm({ ...videoForm, thumbnailUrl: e.target.value })}
                                            />

                                            <div className="flex items-center">
                                                <span className="text-gray-500 mr-2 text-sm">OR</span>
                                                <input
                                                    type="file"
                                                    name="thumbnailFile"
                                                    className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20"
                                                    onChange={handleFileChange}
                                                    accept="image/*"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Category</label>
                                        <select
                                            className="w-full bg-dark border border-white/10 rounded-lg px-4 py-2 text-white focus:border-saffron focus:outline-none"
                                            value={videoForm.category}
                                            onChange={(e) => setVideoForm({ ...videoForm, category: e.target.value })}
                                        >
                                            <option value="desi">Desi Content (Free)</option>
                                            <option value="premium">Premium Content (Gold)</option>
                                        </select>
                                    </div>

                                    {uploadStatus && (
                                        <p className={`text-center text-sm ${uploadStatus.includes('Failed') ? 'text-red-400' : 'text-green-400'}`}>
                                            {uploadStatus}
                                        </p>
                                    )}

                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Tags (comma separated)</label>
                                        <input
                                            type="text"
                                            className="w-full bg-dark border border-white/10 rounded-lg px-4 py-2 text-white focus:border-saffron focus:outline-none"
                                            placeholder="snap, school, collage, foreign, cctv, hidden"
                                            value={videoForm.tags}
                                            onChange={(e) => setVideoForm({ ...videoForm, tags: e.target.value })}
                                        />
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            type="submit"
                                            className="flex-1 py-3 bg-gradient-to-r from-saffron to-gold text-dark font-bold rounded-lg hover:shadow-lg transition-all"
                                        >
                                            {viewMode === 'edit' ? 'Update Content' : 'Upload Video'}
                                        </button>
                                        {viewMode === 'edit' && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setViewMode('list');
                                                    setEditingVideo(null);
                                                    setUploadStatus('');
                                                    setVideoForm({ title: '', description: '', videoUrl: '', thumbnailUrl: '', category: 'desi', type: 'video', tags: '', videoFile: null, thumbnailFile: null });
                                                }}
                                                className="flex-1 py-3 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-all"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                )}

                {/* Password Reset Modal */}
                {passwordModal.show && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                        <div className="bg-dark border border-gold rounded-xl p-6 w-96 max-w-full m-4 shadow-2xl shadow-gold/20">
                            <h3 className="text-xl font-bold text-white mb-4">Reset Password</h3>
                            <p className="text-gray-400 text-sm mb-4">Set a new password for <span className="text-gold">{passwordModal.userName}</span></p>

                            <input
                                type="text"
                                placeholder="New Password"
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white mb-4 focus:border-gold outline-none"
                                value={passwordModal.newPassword}
                                onChange={(e) => setPasswordModal({ ...passwordModal, newPassword: e.target.value })}
                            />

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setPasswordModal({ ...passwordModal, show: false })}
                                    className="px-4 py-2 rounded-lg text-gray-400 hover:bg-white/5"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handlePasswordReset}
                                    className="px-4 py-2 rounded-lg bg-gold text-dark font-bold hover:bg-saffron transition-colors"
                                >
                                    Update Password
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
