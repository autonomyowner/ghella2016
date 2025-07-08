'use client';

import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

interface MobileSearchProps {
  onSearch?: (term: string) => void;
  placeholder?: string;
  showFilters?: boolean;
}

const MobileSearch: React.FC<MobileSearchProps> = ({
  onSearch,
  placeholder = "ابحث...",
  showFilters = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    onSearch?.(term);
  };

  return (
    <div className="lg:hidden w-full">
      {/* Compact Search Bar */}
      {!isExpanded ? (
        <div 
          onClick={() => setIsExpanded(true)}
          className="flex items-center space-x-3 space-x-reverse p-3 glass-dark rounded-full cursor-pointer hover:scale-105 transition-all duration-300"
        >
          <Search size={20} className="text-white/60" />
          <span className="text-white/60 flex-1">{placeholder}</span>
          {showFilters && (
            <Filter size={18} className="text-white/60" />
          )}
        </div>
      ) : (
        /* Expanded Search */
        <div className="space-y-3">
          <div className="flex items-center space-x-2 space-x-reverse">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder={placeholder}
                className="w-full pr-4 pl-12 py-3 glass-dark text-white placeholder-white/70 
                         border border-green-400/30 rounded-full focus:border-green-400 
                         focus:outline-none focus:ring-2 focus:ring-green-400/20 
                         transition-all duration-300"
                autoFocus
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60" size={20} />
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-3 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300"
            >
              <X size={20} />
            </button>
          </div>

          {/* Quick Filter Tags */}
          {searchTerm && (
            <div className="flex flex-wrap gap-2">
              {['المشاتل', 'عمالة فلاحية', 'كراء معدات', 'منتجات طازجة'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleSearch(tag)}
                  className="px-3 py-1 text-sm bg-green-500/20 text-green-300 rounded-full hover:bg-green-500/30 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MobileSearch;
