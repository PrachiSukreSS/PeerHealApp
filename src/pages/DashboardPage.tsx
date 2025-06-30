import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Users, Calendar, TrendingUp, Award, Clock, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    {
      label: 'Sessions Completed',
      value: '12',
      icon: MessageCircle,
      color: 'blue',
      change: '+3 this week'
    },
    {
      label: 'Hours of Support',
      value: '24.5',
      icon: Clock,
      color: 'green',
      change: '+5.2 this week'
    },
    {
      label: 'Helpers Connected',
      value: '8',
      icon: Users,
      color: 'purple',
      change: '+2 this month'
    },
    {
      label: 'Trust Score',
      value: '4.9',
      icon: Star,
      color: 'yellow',
      change: '+0.1 this month'
    }
  ];

  const recentSessions = [
    {
      id: 1,
      helper: 'Dr. Sarah Chen',
      type: 'Anxiety Support',
      date: '2 hours ago',
      duration: '45 min',
      rating: 5
    },
    {
      id: 2,
      helper: 'Marcus Williams',
      type: 'Career Guidance',
      date: 'Yesterday',
      duration: '60 min',
      rating: 5
    },
    {
      id: 3,
      helper: 'AI Assistant',
      type: 'Quick Chat',
      date: '3 days ago',
      duration: '15 min',
      rating: 4
    }
  ];

  const upcomingSessions = [
    {
      id: 1,
      helper: 'Dr. Priya Patel',
      type: 'Mindfulness Session',
      date: 'Today, 3:00 PM',
      duration: '45 min'
    },
    {
      id: 2,
      helper: 'Jennifer Rodriguez',
      type: 'Career Planning',
      date: 'Tomorrow, 10:00 AM',
      duration: '60 min'
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      yellow: 'bg-yellow-100 text-yellow-600'
    };
    return colorMap[color as keyof typeof colorMap];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.user_metadata?.first_name || 'Friend'}! 👋
          </h1>
          <p className="text-xl text-gray-600">
            Here's your support journey overview
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${getColorClasses(stat.color)}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </div>
            );
          })}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Sessions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Recent Sessions</h2>
              <Link
                to="/sessions"
                className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
              >
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {recentSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <MessageCircle className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{session.helper}</div>
                      <div className="text-sm text-gray-600">{session.type}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">{session.date}</div>
                    <div className="text-sm text-gray-500">{session.duration}</div>
                    <div className="flex items-center mt-1">
                      {[...Array(session.rating)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Upcoming Sessions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Upcoming</h2>
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {upcomingSessions.map((session) => (
                <div key={session.id} className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="font-semibold text-gray-900 mb-1">{session.helper}</div>
                  <div className="text-sm text-gray-600 mb-2">{session.type}</div>
                  <div className="text-sm text-blue-600 font-medium">{session.date}</div>
                  <div className="text-xs text-gray-500">{session.duration}</div>
                </div>
              ))}
              <Link
                to="/helpers"
                className="block w-full bg-gradient-to-r from-blue-600 to-green-600 text-white text-center py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
              >
                Book New Session
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white"
        >
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/ai-support"
              className="bg-white/20 backdrop-blur-sm p-6 rounded-xl hover:bg-white/30 transition-all duration-300 text-center"
            >
              <Heart className="h-8 w-8 mx-auto mb-3" />
              <div className="font-semibold mb-2">AI Support</div>
              <div className="text-sm text-purple-100">Get instant help</div>
            </Link>
            <Link
              to="/helpers"
              className="bg-white/20 backdrop-blur-sm p-6 rounded-xl hover:bg-white/30 transition-all duration-300 text-center"
            >
              <Users className="h-8 w-8 mx-auto mb-3" />
              <div className="font-semibold mb-2">Find Helpers</div>
              <div className="text-sm text-purple-100">Connect with peers</div>
            </Link>
            <Link
              to="/categories"
              className="bg-white/20 backdrop-blur-sm p-6 rounded-xl hover:bg-white/30 transition-all duration-300 text-center"
            >
              <TrendingUp className="h-8 w-8 mx-auto mb-3" />
              <div className="font-semibold mb-2">Explore Topics</div>
              <div className="text-sm text-purple-100">Browse categories</div>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};