import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PeerHelpers } from '../components/PeerHelpers';
import { EnhancedHelperSearch } from '../components/EnhancedHelperSearch';
import { AIAssistant } from '../components/AIAssistant';
import { Helper } from '../types';
import { getAllDemoHelpers, getDemoHelpersByCategory } from '../lib/database';

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

export const HelpersPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [selectedHelper, setSelectedHelper] = useState<Helper | undefined>();
  const [filteredHelpers, setFilteredHelpers] = useState<any[]>([]);
  const [allHelpers, setAllHelpers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const category = searchParams.get('category') || undefined;

  useEffect(() => {
    loadHelpers();
  }, [category]);

  const loadHelpers = async () => {
    setLoading(true);
    try {
      let result;
      if (category && category !== 'all') {
        result = await getDemoHelpersByCategory(category);
      } else {
        result = await getAllDemoHelpers();
      }

      if (result.data && !result.error) {
        setAllHelpers(result.data);
        setFilteredHelpers(result.data);
      }
    } catch (error) {
      console.error('Error loading helpers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (filters: SearchFilters) => {
    let filtered = [...allHelpers];

    // Apply search query
    if (filters.query) {
      const query = filters.query.toLowerCase();
      filtered = filtered.filter(helper =>
        `${helper.first_name} ${helper.last_name}`.toLowerCase().includes(query) ||
        helper.title.toLowerCase().includes(query) ||
        helper.description.toLowerCase().includes(query) ||
        helper.specialties.some((s: string) => s.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(helper => helper.category_name === filters.category);
    }

    // Apply rating filter
    if (filters.minRating > 0) {
      filtered = filtered.filter(helper => helper.computed_rating >= filters.minRating);
    }

    // Apply price filter
    if (filters.maxRate < 500) {
      filtered = filtered.filter(helper => helper.hourly_rate <= filters.maxRate);
    }

    // Apply experience filter
    if (filters.experience) {
      const [min, max] = filters.experience.includes('+') 
        ? [parseInt(filters.experience), 100]
        : filters.experience.split('-').map(Number);
      
      filtered = filtered.filter(helper => {
        const exp = helper.experience_years;
        return exp >= min && (max ? exp <= max : true);
      });
    }

    // Apply location filter
    if (filters.location) {
      const location = filters.location.toLowerCase();
      filtered = filtered.filter(helper =>
        helper.location.toLowerCase().includes(location)
      );
    }

    // Apply availability filter
    if (filters.availability === 'online') {
      filtered = filtered.filter(helper => helper.availability_status === 'online');
    }

    // Apply language filter
    if (filters.languages.length > 0) {
      filtered = filtered.filter(helper =>
        filters.languages.some(lang => helper.languages.includes(lang))
      );
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.computed_rating - a.computed_rating);
        break;
      case 'price-low':
        filtered.sort((a, b) => a.hourly_rate - b.hourly_rate);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.hourly_rate - a.hourly_rate);
        break;
      case 'experience':
        filtered.sort((a, b) => b.experience_years - a.experience_years);
        break;
      case 'reviews':
        filtered.sort((a, b) => b.computed_reviews - a.computed_reviews);
        break;
    }

    setFilteredHelpers(filtered);
  };

  const handleStartChat = (helper?: Helper) => {
    setSelectedHelper(helper);
    setShowAIAssistant(true);
  };

  return (
    <>
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EnhancedHelperSearch 
            onFiltersChange={handleFiltersChange}
            totalResults={filteredHelpers.length}
          />
        </div>
        
        <PeerHelpers 
          onStartChat={handleStartChat} 
          selectedCategory={category}
          helpers={filteredHelpers}
          loading={loading}
        />
      </div>
      
      {showAIAssistant && (
        <AIAssistant 
          onClose={() => setShowAIAssistant(false)}
          helper={selectedHelper}
        />
      )}
    </>
  );
};