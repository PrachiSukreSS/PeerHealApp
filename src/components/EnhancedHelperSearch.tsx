import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Star, DollarSign, Clock, Users, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchFilters {
  query: string;
  category: string;
  minRating: number;
  maxRate: number;
  experience: string;
  location: string;
  availability: string;
  languages: string[];
  sortBy: string;
}

interface EnhancedHelperSearchProps {
  onFiltersChange: (filters: SearchFilters) => void;
  totalResults: number;
}

export const EnhancedHelperSearch: React.FC<EnhancedHelperSearchProps> = ({ 
  onFiltersChange, 
  totalResults 
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: '',
    minRating: 0,
    maxRate: 500,
    experience: '',
    location: '',
    availability: '',
    languages: [],
    sortBy: 'rating'
  });

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'mental-health', label: 'Mental Health' },
    { value: 'career', label: 'Career Development' },
    { value: 'relationships', label: 'Relationships' },
    { value: 'life-transitions', label: 'Life Transitions' },
    { value: 'education', label: 'Education' },
    { value: 'community', label: 'Community & Social' }
  ];

  const experienceLevels = [
    { value: '', label: 'Any Experience' },
    { value: '0-2', label: '0-2 years' },
    { value: '3-5', label: '3-5 years' },
    { value: '6-10', label: '6-10 years' },
    { value: '10+', label: '10+ years' }
  ];

  const availabilityOptions = [
    { value: '', label: 'Any Time' },
    { value: 'online', label: 'Available Now' },
    { value: 'today', label: 'Available Today' },
    { value: 'week', label: 'This Week' }
  ];

  const sortOptions = [
    { value: 'rating', label: 'Highest Rated' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'experience', label: 'Most Experienced' },
    { value: 'reviews', label: 'Most Reviews' }
  ];

  const languages = [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 
    'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Russian'
  ];

  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleLanguage = (language: string) => {
    setFilters(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }));
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      category: '',
      minRating: 0,
      maxRate: 500,
      experience: '',
      location: '',
      availability: '',
      languages: [],
      sortBy: 'rating'
    });
  };

  const activeFiltersCount = Object.values(filters).filter(value => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'string') return value !== '';
    if (typeof value === 'number') return value !== 0 && value !== 500;
    return false;
  }).length;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
      {/* Search Bar */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={filters.query}
            onChange={(e) => updateFilter('query', e.target.value)}
            placeholder="Search helpers by name, specialty, or keywords..."
            className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex gap-3">
          <select
            value={filters.category}
            onChange={(e) => updateFilter('category', e.target.value)}
            className="px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[200px]"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
              showFilters || activeFiltersCount > 0
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <SlidersHorizontal className="h-5 w-5" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="bg-white text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-600">
          <span className="font-semibold text-gray-900">{totalResults}</span> helpers found
        </p>
        
        <div className="flex items-center space-x-4">
          <label className="text-sm text-gray-600">Sort by:</label>
          <select
            value={filters.sortBy}
            onChange={(e) => updateFilter('sortBy', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-200 pt-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <Star className="inline h-4 w-4 mr-1" />
                  Minimum Rating
                </label>
                <div className="space-y-2">
                  {[4.5, 4.0, 3.5, 3.0, 0].map(rating => (
                    <label key={rating} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="rating"
                        value={rating}
                        checked={filters.minRating === rating}
                        onChange={(e) => updateFilter('minRating', parseFloat(e.target.value))}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex items-center space-x-1">
                        {rating > 0 ? (
                          <>
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span>{rating}+</span>
                          </>
                        ) : (
                          <span>Any Rating</span>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <DollarSign className="inline h-4 w-4 mr-1" />
                  Hourly Rate
                </label>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-500">Max Rate: ${filters.maxRate}</label>
                    <input
                      type="range"
                      min="10"
                      max="500"
                      step="10"
                      value={filters.maxRate}
                      onChange={(e) => updateFilter('maxRate', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>$10</span>
                    <span>$500+</span>
                  </div>
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <Clock className="inline h-4 w-4 mr-1" />
                  Experience Level
                </label>
                <select
                  value={filters.experience}
                  onChange={(e) => updateFilter('experience', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {experienceLevels.map(level => (
                    <option key={level.value} value={level.value}>{level.label}</option>
                  ))}
                </select>
              </div>

              {/* Availability */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <Users className="inline h-4 w-4 mr-1" />
                  Availability
                </label>
                <select
                  value={filters.availability}
                  onChange={(e) => updateFilter('availability', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {availabilityOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location Filter */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <MapPin className="inline h-4 w-4 mr-1" />
                Location
              </label>
              <input
                type="text"
                value={filters.location}
                onChange={(e) => updateFilter('location', e.target.value)}
                placeholder="Enter city, state, or country..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Languages Filter */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Languages Spoken
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {languages.map(language => (
                  <button
                    key={language}
                    type="button"
                    onClick={() => toggleLanguage(language)}
                    className={`px-3 py-2 rounded-lg border text-sm transition-all duration-300 ${
                      filters.languages.includes(language)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    {language}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Actions */}
            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={clearFilters}
                className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Clear All Filters
              </button>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowFilters(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};