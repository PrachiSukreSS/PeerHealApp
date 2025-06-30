import React from 'react';
import { ArrowRight, Shield, Users, Heart, Zap, Star, CheckCircle, Sparkles, Globe, TrendingUp, Award, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  const features = [
    {
      icon: Shield,
      title: 'Blockchain Verified',
      description: 'Transparent trust system with immutable credentials',
      color: 'blue'
    },
    {
      icon: Zap,
      title: 'AI-Powered Support',
      description: 'Instant 24/7 assistance with advanced AI',
      color: 'yellow'
    },
    {
      icon: Globe,
      title: 'Global Community',
      description: '120+ countries served worldwide',
      color: 'green'
    },
    {
      icon: Heart,
      title: 'Pay What You Can',
      description: 'Flexible pricing that adapts to your situation',
      color: 'pink'
    }
  ];

  const stats = [
    { label: 'Verified Helpers', value: '5,000+', icon: Users },
    { label: 'Successful Sessions', value: '50K+', icon: CheckCircle },
    { label: 'Average Rating', value: '4.9/5', icon: Star },
    { label: 'Response Time', value: '< 2 min', icon: Clock }
  ];

  const platformFeatures = [
    {
      icon: TrendingUp,
      title: 'Real-Time Matching',
      description: 'Advanced AI matches you with the perfect helper based on your needs, preferences, and availability.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Award,
      title: 'Expert Verification',
      description: 'Every helper undergoes rigorous background checks and professional verification for your safety.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Globe,
      title: 'Multi-Modal Support',
      description: 'Choose from text, voice, video, or AI avatar sessions based on your comfort level.',
      gradient: 'from-green-500 to-teal-500'
    },
    {
      icon: Shield,
      title: 'Blockchain Security',
      description: 'Transparent, immutable trust scores and secure payments powered by Algorand blockchain.',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      green: 'bg-green-100 text-green-600',
      pink: 'bg-pink-100 text-pink-600'
    };
    return colorMap[color as keyof typeof colorMap];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse floating-animation"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse floating-animation" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse floating-animation" style={{ animationDelay: '4s' }}></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Trust Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center space-x-2 glass-effect border border-blue-200 rounded-full px-6 py-3 mb-8 shadow-lg"
            >
              <Sparkles className="h-5 w-5 text-blue-600" />
              <span className="text-blue-600 font-semibold">Trusted by 50,000+ users worldwide</span>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 font-poppins leading-tight"
            >
              Find{' '}
              <span className="gradient-text relative">
                Trusted Support
              </span>
              <br />
              When You Need It Most
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed"
            >
              Connect with verified peer helpers and AI-powered support for mental health, 
              career guidance, and life challenges. <span className="font-semibold text-blue-600">Pay what you can, when you can.</span>
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
            >
              <button
                onClick={handleGetStarted}
                className="group inline-flex items-center px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
              >
                Get Support Now
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </button>
              <Link
                to="/helpers"
                className="inline-flex items-center px-10 py-5 border-3 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-105"
              >
                Browse Helpers
                <Users className="ml-3 h-6 w-6" />
              </Link>
            </motion.div>

            <img
  src="/home/project/.bolt/public/bolt-badge.png"
  alt="Built with Bolt"
  className="h-20 w-20 object-contain hover:scale-105 transition-transform duration-300"
/>

            {/* Feature highlights */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
            >
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                    className="group flex flex-col items-center p-8 glass-effect rounded-3xl border border-white/30 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                  >
                    <div className={`p-4 rounded-2xl mb-6 ${getColorClasses(feature.color)} group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-3 text-lg font-poppins">{feature.title}</h3>
                    <p className="text-gray-600 text-center leading-relaxed">{feature.description}</p>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Stats Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="glass-effect rounded-3xl p-8 border border-white/30 shadow-xl"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-8 font-poppins">Trusted by Thousands</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: 1.3 + index * 0.1 }}
                      className="text-center group"
                    >
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-3xl font-bold text-gray-900 mb-2 font-poppins">{stat.value}</div>
                      <div className="text-gray-600 font-medium">{stat.label}</div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Platform Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 font-poppins">
              Why Choose PeerHeal?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced technology meets human compassion to deliver unparalleled support experiences
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {platformFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="professional-card p-8 group"
                >
                  <div className={`bg-gradient-to-r ${feature.gradient} p-4 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 font-poppins">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 font-poppins">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Getting support is simple, secure, and tailored to your needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Choose Your Support',
                description: 'Browse categories or get matched with helpers based on your specific needs and preferences.',
                icon: Users
              },
              {
                step: '02',
                title: 'Connect Instantly',
                description: 'Start with AI support immediately or schedule a session with a verified peer helper.',
                icon: Zap
              },
              {
                step: '03',
                title: 'Get Better Together',
                description: 'Receive personalized support, track your progress, and build lasting positive changes.',
                icon: TrendingUp
              }
            ].map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="text-center"
                >
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-blue-600 mb-4 font-poppins">{step.step}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 font-poppins">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">{step.description}</p>
                </motion.div>
              );
            })}
          </div>
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
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands who have found the support they needed. Your journey to better mental health starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleGetStarted}
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Start Your Journey
              </button>
              <Link
                to="/ai-support"
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
              >
                Try AI Support
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};