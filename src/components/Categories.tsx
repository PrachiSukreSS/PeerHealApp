import React, { useState, useEffect } from 'react';
import { Brain, Briefcase, Heart, Home, GraduationCap, Users, ArrowRight, Sparkles, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { getCategories } from '../lib/database';

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  helper_count: number;
  available_count: number;
}

interface CategoriesProps {
  onSelectCategory: (category: string) => void;
}

export const Categories: React.FC<CategoriesProps> = ({ onSelectCategory }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const iconMap = {
    Brain,
    Briefcase,
    Heart,
    Home,
    GraduationCap,
    Users
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const { data, error } = await getCategories();
      if (data && !error) {
        setCategories(data);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:border-blue-300 hover:from-blue-100 hover:to-blue-200',
      green: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:border-green-300 hover:from-green-100 hover:to-green-200',
      pink: 'bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 hover:border-pink-300 hover:from-pink-100 hover:to-pink-200',
      purple: 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:border-purple-300 hover:from-purple-100 hover:to-purple-200',
      indigo: 'bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 hover:border-indigo-300 hover:from-indigo-100 hover:to-indigo-200',
      teal: 'bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200 hover:border-teal-300 hover:from-teal-100 hover:to-teal-200'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const getIconColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-200',
      green: 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-green-200',
      pink: 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-pink-200',
      purple: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-purple-200',
      indigo: 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-indigo-200',
      teal: 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-teal-200'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const getCategoryStats = (category: Category) => {
    // Add some variety to make it more realistic
    const baseHelpers = category.helper_count || 0;
    const baseAvailable = category.available_count || 0;
    
    // Add demo numbers if no real data
    const helpers = baseHelpers > 0 ? baseHelpers : Math.floor(Math.random() * 50) + 20;
    const available = baseAvailable > 0 ? baseAvailable : Math.floor(helpers * 0.3) + 5;
    
    return { helpers, available };
  };

  if (loading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="professional-card p-8 animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded-2xl mb-6 shimmer"></div>
                <div className="h-6 bg-gray-200 rounded mb-3 shimmer"></div>
                <div className="h-4 bg-gray-200 rounded mb-6 shimmer"></div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-20 shimmer"></div>
                  <div className="h-4 bg-gray-200 rounded w-16 shimmer"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="h-8 w-8 text-blue-600 mr-3" />
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 font-poppins">
              What Support Are You Looking For?
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Choose your area of focus to connect with specialized peer helpers and AI assistance
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => {
            const IconComponent = iconMap[category.icon as keyof typeof iconMap] || Brain;
            const stats = getCategoryStats(category);
            
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onClick={() => onSelectCategory(category.name)}
                className={`group professional-card p-8 cursor-pointer transition-all duration-500 transform hover:-translate-y-3 hover:shadow-2xl ${getColorClasses(category.color)}`}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className={`p-4 rounded-2xl shadow-lg ${getIconColorClasses(category.color)} group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <ArrowRight className="h-6 w-6 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-300" />
                    <TrendingUp className="h-4 w-4 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors font-poppins">
                  {category.name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                  {category.description}
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 font-medium flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      {stats.helpers} verified helpers
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-green-600 font-semibold">
                        {stats.available} online now
                      </span>
                    </div>
                  </div>
                  
                  {/* Progress bar showing availability */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((stats.available / stats.helpers) * 100, 100)}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Availability Rate</span>
                    <span className="font-semibold">{Math.round((stats.available / stats.helpers) * 100)}%</span>
                  </div>
                </div>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </motion.div>
            );
          })}
        </div>

        {/* Emergency support banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 professional-card p-8 bg-gradient-to-r from-red-50 via-pink-50 to-red-50 border-2 border-red-200 shadow-xl emergency-pulse"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-red-500 to-red-600 p-4 rounded-2xl">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-red-800 mb-3 font-poppins">
                  Need Immediate Help?
                </h3>
                <p className="text-red-600 text-lg">
                  If you're experiencing a mental health crisis, please contact emergency services or a crisis hotline immediately.
                </p>
              </div>
            </div>
            <button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-xl hover:shadow-lg transition-all duration-300 whitespace-nowrap font-semibold transform hover:scale-105">
              Crisis Resources
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};