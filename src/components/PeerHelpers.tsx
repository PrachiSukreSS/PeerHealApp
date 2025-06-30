import React, { useState, useEffect } from 'react';
import { Star, MessageCircle, Video, Shield, Clock, Globe, Filter, Mic, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { getAllDemoHelpers, getDemoHelpersByCategory } from '../lib/database';
import { Helper } from '../types';

interface PeerHelpersProps {
  onStartChat: (helper?: Helper) => void;
  selectedCategory?: string;
  helpers?: any[];
  loading?: boolean;
}

export const PeerHelpers: React.FC<PeerHelpersProps> = ({ onStartChat, selectedCategory, helpers: propHelpers, loading: propLoading }) => {
  const [helpers, setHelpers] = useState<Helper[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showTavusDemo, setShowTavusDemo] = useState(false);

  const filters = [
    { id: 'all', label: 'All Helpers' },
    { id: 'available', label: 'Available Now' },
    { id: 'top-rated', label: 'Top Rated' },
    { id: 'affordable', label: 'Under $70/hr' },
    { id: 'video', label: 'Video Enabled' },
    { id: 'voice', label: 'Voice AI' }
  ];

  useEffect(() => {
    if (propHelpers) {
      // Transform database data to match Helper interface
      const transformedHelpers = propHelpers.map((helper: any) => ({
        id: helper.id,
        name: `${helper.first_name} ${helper.last_name}`,
        title: helper.title,
        rating: helper.average_rating || helper.computed_rating || 0,
        reviews: helper.total_reviews || helper.computed_reviews || 0,
        hourlyRate: helper.hourly_rate,
        languages: helper.languages || [],
        specialties: helper.specialties || [],
        availability: helper.availability_status === 'online' ? 'Available now' : 
                     helper.availability_status === 'busy' ? 'Busy' : 'Offline',
        verified: helper.verified,
        image: helper.avatar_url || `https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=150&h=150&fit=crop&crop=face`,
        responseTime: helper.response_time,
        description: helper.description,
        category: helper.category_name || 'general',
        experience: helper.experience_years,
        location: helper.location || 'Global',
        timezone: 'UTC',
        videoEnabled: helper.video_enabled,
        voiceEnabled: helper.voice_enabled
      }));
      setHelpers(transformedHelpers);
      setLoading(propLoading || false);
    } else {
      loadHelpers();
    }
  }, [propHelpers, propLoading, selectedCategory, selectedFilter]);

  const loadHelpers = async () => {
    setLoading(true);
    try {
      const filterOptions = {
        available: selectedFilter === 'available',
        topRated: selectedFilter === 'top-rated',
        affordable: selectedFilter === 'affordable',
        videoEnabled: selectedFilter === 'video',
        voiceAI: selectedFilter === 'voice'
      };

      let result;
      if (selectedCategory && selectedCategory !== 'all') {
        result = await getDemoHelpersByCategory(selectedCategory, filterOptions);
      } else {
        result = await getAllDemoHelpers(filterOptions);
      }

      if (result.data && !result.error) {
        // Transform database data to match Helper interface
        const transformedHelpers = result.data.map((helper: any) => ({
          id: helper.id,
          name: `${helper.first_name} ${helper.last_name}`,
          title: helper.title,
          rating: helper.average_rating || 0,
          reviews: helper.total_reviews || 0,
          hourlyRate: helper.hourly_rate,
          languages: helper.languages || [],
          specialties: helper.specialties || [],
          availability: helper.availability_status === 'online' ? 'Available now' : 
                       helper.availability_status === 'busy' ? 'Busy' : 'Offline',
          verified: helper.verified,
          image: helper.avatar_url || `https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=150&h=150&fit=crop&crop=face`,
          responseTime: helper.response_time,
          description: helper.description,
          category: helper.category_name || 'general',
          experience: helper.experience_years,
          location: helper.location || 'Global',
          timezone: 'UTC',
          videoEnabled: helper.video_enabled,
          voiceEnabled: helper.voice_enabled
        }));
        setHelpers(transformedHelpers);
      }
    } catch (error) {
      console.error('Error loading helpers:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAvailabilityColor = (availability: string) => {
    if (availability.includes('now')) return 'text-green-600 bg-green-100 border-green-200';
    if (availability.includes('Busy')) return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    return 'text-gray-600 bg-gray-100 border-gray-200';
  };

  const handleTavusVideoCall = (helper: Helper) => {
    setShowTavusDemo(true);
    // Simulate Tavus AI avatar call
    setTimeout(() => {
      alert(`Starting AI Avatar video call with ${helper.name} using Tavus technology...`);
      setShowTavusDemo(false);
    }, 2000);
  };

  const handleElevenLabsVoice = (helper: Helper) => {
    // Simulate ElevenLabs voice synthesis
    alert(`Starting voice session with ${helper.name} using ElevenLabs AI voice synthesis...`);
  };

  const handleAlgorandPayment = (helper: Helper) => {
    // Simulate Algorand blockchain payment
    alert(`Processing secure payment of $${helper.hourlyRate}/hr via Algorand blockchain...`);
  };

  if (loading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white rounded-3xl border border-gray-200 p-8 animate-pulse">
                <div className="flex items-start space-x-6">
                  <div className="w-20 h-20 bg-gray-200 rounded-2xl"></div>
                  <div className="flex-1">
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-6"></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-10 bg-gray-200 rounded-xl"></div>
                      <div className="h-10 bg-gray-200 rounded-xl"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Connect with Verified Peer Helpers
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Choose from our community of trusted, verified helpers who understand your journey
          </p>
        </motion.div>

        {/* Enhanced Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                selectedFilter === filter.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-blue-300 hover:text-blue-600 shadow-md'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </motion.div>

        {/* Helper Cards */}
        {helpers.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <Filter className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No helpers found</h3>
            <p className="text-gray-600 mb-8">Try adjusting your filters or check back later for more helpers.</p>
            <button
              onClick={() => setSelectedFilter('all')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
            >
              Show All Helpers
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {helpers.map((helper, index) => (
              <motion.div 
                key={helper.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-3xl border border-gray-200 p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                <div className="flex items-start space-x-6">
                  <div className="relative">
                    <img
                      src={helper.image}
                      alt={helper.name}
                      className="w-20 h-20 rounded-2xl object-cover shadow-lg"
                    />
                    {helper.verified && (
                      <div className="absolute -top-2 -right-2 bg-blue-600 rounded-full p-2 shadow-lg">
                        <Shield className="h-4 w-4 text-white" />
                      </div>
                    )}
                    <div className={`absolute -bottom-2 -right-2 px-2 py-1 rounded-full text-xs font-bold border ${getAvailabilityColor(helper.availability)}`}>
                      {helper.availability.includes('now') ? 'LIVE' : helper.availability.includes('Busy') ? 'BUSY' : 'OFF'}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{helper.name}</h3>
                        <p className="text-blue-600 font-semibold">{helper.title}</p>
                        <p className="text-gray-500 text-sm">{helper.location} • {helper.experience} years exp</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1 mb-1">
                          <Star className="h-5 w-5 text-yellow-400 fill-current" />
                          <span className="font-bold text-lg">{helper.rating}</span>
                          <span className="text-gray-500">({helper.reviews})</span>
                        </div>
                        <p className="text-2xl font-bold text-green-600">${helper.hourlyRate}/hr</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {helper.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {helper.specialties.slice(0, 3).map((specialty) => (
                        <span key={specialty} className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                          {specialty}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">{helper.responseTime}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Globe className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">{helper.languages.slice(0, 2).join(', ')}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Enhanced Action Buttons with Glassmorphism */}
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => onStartChat(helper)}
                        className="bg-cyan-500/80 backdrop-blur-md border border-cyan-300/50 text-white px-4 py-3 rounded-xl hover:shadow-lg hover:bg-cyan-600/80 transition-all duration-300 flex items-center justify-center space-x-2 font-semibold transform hover:scale-105"
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>Chat</span>
                      </button>
                      
                      <button
                        onClick={() => handleTavusVideoCall(helper)}
                        className="bg-violet-500/80 backdrop-blur-md border border-violet-300/50 text-white px-4 py-3 rounded-xl hover:shadow-lg hover:bg-violet-600/80 transition-all duration-300 flex items-center justify-center space-x-2 font-semibold transform hover:scale-105"
                      >
                        <Video className="h-4 w-4" />
                        <span>AI Avatar</span>
                      </button>
                      
                      <button
                        onClick={() => handleElevenLabsVoice(helper)}
                        className="bg-violet-500/80 backdrop-blur-md border border-violet-300/50 text-white px-4 py-3 rounded-xl hover:shadow-lg hover:bg-violet-600/80 transition-all duration-300 flex items-center justify-center space-x-2 font-semibold transform hover:scale-105"
                      >
                        <Mic className="h-4 w-4" />
                        <span>Voice AI</span>
                      </button>
                      
                      <button
                        onClick={() => handleAlgorandPayment(helper)}
                        className="bg-cyan-500/80 backdrop-blur-md border border-cyan-300/50 text-white px-4 py-3 rounded-xl hover:shadow-lg hover:bg-cyan-600/80 transition-all duration-300 flex items-center justify-center space-x-2 font-semibold transform hover:scale-105"
                      >
                        <Shield className="h-4 w-4" />
                        <span>Pay</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* AI Assistant CTA with Enhanced Features */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 border-2 border-purple-200 rounded-3xl p-10 text-center shadow-xl"
        >
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              Need Immediate Support?
            </h3>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Our AI assistant powered by advanced language models is available 24/7 to provide instant support and guidance while you wait for a peer helper.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onStartChat()}
                className="bg-purple-600/80 backdrop-blur-md border border-purple-300/50 text-white px-8 py-4 rounded-xl hover:shadow-lg hover:bg-purple-700/80 transition-all duration-300 font-bold text-lg transform hover:scale-105"
              >
                Chat with AI Assistant
              </button>
              <button
                onClick={() => handleElevenLabsVoice({ name: 'AI Assistant' } as Helper)}
                className="bg-orange-500/80 backdrop-blur-md border border-orange-300/50 text-white px-8 py-4 rounded-xl hover:shadow-lg hover:bg-orange-600/80 transition-all duration-300 font-bold text-lg flex items-center justify-center space-x-2 transform hover:scale-105"
              >
                <Mic className="h-5 w-5" />
                <span>Voice AI Support</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tavus Demo Modal */}
        {showTavusDemo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md mx-4">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <h3 className="text-xl font-bold mb-2">Connecting to AI Avatar...</h3>
                <p className="text-gray-600">Powered by Tavus technology</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};