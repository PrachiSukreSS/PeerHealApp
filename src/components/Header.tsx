import React, { useState } from 'react';
import { Heart, Menu, X, User, LogOut, Shield, Bell, Settings } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/categories', label: 'Categories' },
  
    { path: '/ai-support', label: 'AI Support' },
    { path: '/elevenlabs-demo', label: 'Voice AI Demo' },
    { path: '/pricing', label: 'Pricing' },
    { path: '/become-helper', label: 'Become Helper' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300"
            >
              <Heart className="h-7 w-7 text-white" />
            </motion.div>
            <span className="text-3xl font-bold gradient-text font-poppins">
              PeerHeal
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-2">
            {navItems.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`px-5 py-3 rounded-xl transition-all duration-300 font-semibold relative overflow-hidden group ${
                  isActive(path)
                    ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 shadow-md'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <span className="relative z-10">{label}</span>
                {isActive(path) && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 font-semibold transition-colors p-2 rounded-xl hover:bg-blue-50"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-md">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <span>{user.user_metadata?.first_name || 'User'}</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </button>
                
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-large border border-gray-200 py-2 z-50"
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">
                          {user.user_metadata?.first_name} {user.user_metadata?.last_name}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      
                      <Link
                        to="/dashboard"
                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                      
                      <Link
                        to="/profile"
                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4" />
                        <span>Profile Settings</span>
                      </Link>
                      
                      <Link
                        to="/notifications"
                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Bell className="h-4 w-4" />
                        <span>Notifications</span>
                        <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
                      </Link>
                      
                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-blue-600 font-semibold transition-colors px-4 py-2 rounded-xl hover:bg-blue-50"
                >
                  Sign In
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGetStarted}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-bold"
                >
                  Get Started
                </motion.button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-3 rounded-xl hover:bg-gray-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden py-4 border-t border-blue-100"
            >
              <nav className="flex flex-col space-y-2">
                {navItems.map(({ path, label }) => (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-4 rounded-xl transition-all duration-300 font-semibold ${
                      isActive(path)
                        ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    {label}
                  </Link>
                ))}
                <div className="pt-4 border-t border-blue-100 space-y-3">
                  {user ? (
                    <>
                      <Link
                        to="/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-4 py-4 text-gray-600 hover:text-blue-600 font-semibold transition-colors rounded-xl hover:bg-blue-50"
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-4 py-4 text-gray-600 hover:text-blue-600 font-semibold transition-colors rounded-xl hover:bg-blue-50"
                      >
                        Profile
                      </Link>
                      <Link
                        to="/notifications"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-4 py-4 text-gray-600 hover:text-blue-600 font-semibold transition-colors rounded-xl hover:bg-blue-50"
                      >
                        Notifications
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-4 text-red-600 font-semibold transition-colors rounded-xl hover:bg-red-50"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-4 py-4 text-gray-600 hover:text-blue-600 font-semibold transition-colors rounded-xl hover:bg-blue-50"
                      >
                        Sign In
                      </Link>
                      <button
                        onClick={() => {
                          handleGetStarted();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-4 rounded-xl font-bold"
                      >
                        Get Started
                      </button>
                      
                      <div className="flex justify-center pt-4 border-t border-blue-100">
                        <img
                          src="/bolt-badge.png"
                          alt="Built with Bolt"
                          className="h-6 w-6 object-contain opacity-60"
                        />
                      </div>
                    </>
                  )}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};