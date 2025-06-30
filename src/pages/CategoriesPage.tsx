import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Categories } from '../components/Categories';
import { CategorySpecificContent } from '../components/CategorySpecificContent';

export const CategoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCategoryContent, setShowCategoryContent] = useState(false);

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    setShowCategoryContent(true);
  };

  const handleContinueToHelpers = () => {
    if (selectedCategory) {
      navigate(`/helpers?category=${selectedCategory}`);
    }
  };

  const handleCloseCategoryContent = () => {
    setShowCategoryContent(false);
    setSelectedCategory(null);
  };

  return (
    <>
      <Categories onSelectCategory={handleSelectCategory} />
      
      {showCategoryContent && selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl h-5/6 flex flex-col overflow-hidden">
            <CategorySpecificContent 
              category={selectedCategory} 
              onClose={handleCloseCategoryContent}
            />
            
            {/* Action Buttons */}
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-between">
              <button
                onClick={handleCloseCategoryContent}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
              >
                Browse Other Categories
              </button>
              <button
                onClick={handleContinueToHelpers}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
              >
                Find Helpers in {selectedCategory?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};