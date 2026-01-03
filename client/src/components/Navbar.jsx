

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaUserCircle,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaHome,
  FaFilm,
  FaCrown,
} from 'react-icons/fa';

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-[100] px-6 py-4 flex justify-between items-center bg-black/70 backdrop-blur-lg"
    >
      {/* LOGO */}
      <Link to="/" className="flex items-center gap-2">
        <div className="w-12 h-10 bg-gradient-to-br from-orange-500 to-yellow-400 rounded-lg flex items-center justify-center">
          <span className="text-white font-black text-xs">VIP</span>
        </div>
        <span className="text-xl font-bold text-white hidden md:block">
          VIP Cinema
        </span>
      </Link>

      {/* DESKTOP MENU */}
      <div className="hidden md:flex gap-8 text-sm text-gray-300">
        <Link to="/" className="hover:text-orange-400">Home</Link>
        {user && <Link to="/desi-content" className="hover:text-orange-400">Desi</Link>}
        {user && (
          <Link to="/premium" className="text-yellow-400 flex items-center gap-1">
            Premium <FaCrown />
          </Link>
        )}
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4">
        {/* DESKTOP AUTH */}
        {user ? (
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2">
              <FaUserCircle className="text-yellow-400 text-2xl" />
              <span className="text-white text-sm">{user.name}</span>
            </div>
            <button onClick={handleLogout} className="text-red-400">
              <FaSignOutAlt />
            </button>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/login"
              className="text-gray-300 hover:text-white transition-colors relative group py-2"
            >
              <span>Login</span>
              <span className="absolute bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-saffron to-gold group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              to="/signup"
              className="relative overflow-hidden group px-6 py-2.5 rounded-full bg-gradient-to-r from-saffron to-gold text-dark font-bold shadow-lg shadow-saffron/20 transition-all hover:shadow-saffron/40 hover:-translate-y-0.5 active:scale-95"
            >
              <span className="relative z-10">Sign Up</span>
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-[-20deg]"></div>
            </Link>
          </div>
        )}

        {/* ✅ HAMBURGER (FIXED) */}
        <button
          onClick={() => setIsMenuOpen(true)}
          className="md:hidden relative z-[110] text-white p-2"
        >
          <FaBars size={24} />
        </button>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className="fixed inset-0 z-[40] bg-black/95 md:hidden flex flex-col"
          >
            {/* HEADER */}
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <span className="text-white font-bold text-lg">VIP Cinema</span>
              <button onClick={() => setIsMenuOpen(false)} className="text-white">
                <FaTimes size={24} />
              </button>
            </div>

            {/* LINKS */}
            <div className="flex-1 p-6 flex flex-col gap-4">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 text-white text-lg"
              >
                <FaHome /> Home
              </Link>

              {user && (
                <Link
                  to="/desi-content"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 text-white text-lg"
                >
                  <FaFilm /> Desi Content
                </Link>
              )}

              {user && (
                <Link
                  to="/premium"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 text-yellow-400 text-lg"
                >
                  <FaCrown /> Premium
                </Link>
              )}

              <div className="border-t border-white/10 my-4"></div>

              {user ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-3 text-red-400 text-lg"
                >
                  <FaSignOutAlt /> Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-white text-lg"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-yellow-400 text-lg"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
