import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { HelperRegistrationForm } from '../components/HelperRegistrationForm';
import { 
  Heart, 
  Users, 
  DollarSign, 
  Clock, 
  Star, 
  Shield,
  CheckCircle,
  ArrowRight,
  Globe,
  Award
} from 'lucide-react';

export const BecomeHelperPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  const benefits = [
    {
      icon: DollarSign,
      title: 'Flexible Earnings',
      description: 'Set your own rates and work schedule. Earn $30-150+ per hour based on your expertise.',
      color: 'green'
    },
    {
      icon: Heart,
      title: 'Make a Difference',
      description: 'Help people through difficult times and be part of their healing journey.',
      color: 'red'
    },
    {
      icon: Users,
      title: 'Global Community',
      description: 'Connect with people from around the world and build meaningful relationships.',
      color: 'blue'
    },
    {
      icon: Shield,
      title: 'Verified Platform',
      description: 'Blockchain-verified credentials and secure payment processing.',
      color: 'purple'
    },
    {
      icon: Clock,
      title: 'Work When You Want',
      description: 'Complete flexibility to work around your schedule and availability.',
      color: 'orange'
    },
    {
      icon: Award,
      title: 'Professional Growth',
      description: 'Build your reputation, gain experience, and advance your career.',
      color: 'indigo'
    }
  ];

  const stats = [
    { label: 'Average Helper Rating', value: '4.9/5', icon: Star },
    { label: 'Monthly Earnings', value: '$2,500+', icon: DollarSign },
    { label: 'Global Reach', value: '120+ Countries', icon: Globe },
    { label: 'Success Rate', value: '96%', icon: CheckCircle }
  ];

  const requirements = [
    'Professional experience or lived experience in your field',
    'Excellent communication and empathy skills',
    'Reliable internet connection and quiet space',
    'Commitment to helping others with compassion',
    'Background verification (we assist with this process)',
    'Completion of our helper training program'
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      green: 'bg-green-100 text-green-600',
      red: 'bg-red-100 text-red-600',
      blue: 'bg-blue-100 text-blue-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600',
      indigo: 'bg-indigo-100 text-indigo-600'
    };
    return colorMap[color as keyof typeof colorMap];
  };

  const handleGetStarted = () => {
    if (!user) {
      navigate('/signup');
      return;
    }
    setShowForm(true);
  };

  if (showForm) {
    return <HelperRegistrationForm onBack={() => setShowForm(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-violet-50">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-full px-6 py-3 mb-8 shadow-lg">
              <Heart className="h-5 w-5 text-red-500" />
              <span className="text-purple-600 font-semibold">Join 5,000+ Verified Helpers</span>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 font-poppins leading-tight">
              Become a{' '}
              <span className="gradient-text">Trusted Helper</span>
              <br />
              Change Lives Today
            </h1>

            <p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Share your expertise, support others through their challenges, and build a meaningful career 
              helping people heal and grow. <span className="font-semibold text-blue-600">Flexible hours, competitive pay.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGetStarted}
                className="group inline-flex items-center px-10 py-5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-lg rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                Start Application
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              
              <button className="inline-flex items-center px-10 py-5 border-3 border-violet-600 text-purple-600 hover:bg-purple-50 font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-105">
                Learn More
                <Users className="ml-3 h-6 w-6" />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="bg-gradient-to-r from-pink-500 to-indigo-500 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2 font-poppins">{stat.value}</div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 font-poppins">
              Why Join PeerHeal?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join a platform that values your expertise and provides the tools you need to succeed
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="professional-card p-8 text-center group"
                >
                  <div className={`p-4 rounded-2xl w-fit mx-auto mb-6 ${getColorClasses(benefit.color)} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 font-poppins">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6 font-poppins">
              Helper Requirements
            </h2>
            <p className="text-xl text-gray-600">
              We maintain high standards to ensure the best experience for everyone
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200"
          >
            <div className="space-y-4">
              {requirements.map((requirement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-start space-x-4"
                >
                  <div className="bg-green-100 rounded-full p-2 mt-1">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-gray-700 text-lg leading-relaxed">{requirement}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 font-poppins">
              Ready to Start Helping?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join our community of verified helpers and start making a difference today. 
              The application process takes just 10 minutes.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetStarted}
              className="bg-white text-blue-600 px-12 py-5 rounded-2xl font-bold text-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Begin Application
            </motion.button>
            <p className="text-blue-200 mt-4 text-sm">
              Free to apply • No upfront costs • Start earning immediately after approval
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};