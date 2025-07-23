'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useSearch } from '@/contexts/SearchContext';
import SearchResults from './SearchResults';

interface UnifiedSearchProps {
  placeholder?: string;
  className?: string;
  variant?: 'header' | 'homepage';
  onSearch?: (query: string) => void;
}

const UnifiedSearch: React.FC<UnifiedSearchProps> = ({
  placeholder = "ابحث عن أراضي، منتجات، معدات...",
  className = "",
  variant = "header",
  onSearch
}) => {
  const {
    searchTerm,
    setSearchTerm,
    results,
    loading,
    error,
    search,
    clearSearch,
    recentSearches,
    suggestions,
    addRecentSearch
  } = useSearch();

  const [showResults, setShowResults] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Handle click outside to close results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle search input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    if (value.trim()) {
      setShowResults(true);
      // Debounce search
      searchTimeoutRef.current = setTimeout(() => {
        search(value);
      }, 300);
    } else {
      setShowResults(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      search(searchTerm);
      setShowResults(true);
      if (onSearch) {
        onSearch(searchTerm);
      }
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (term: string) => {
    setSearchTerm(term);
    search(term);
    setShowResults(true);
    if (onSearch) {
      onSearch(term);
    }
  };

  // Handle result click
  const handleResultClick = () => {
    setShowResults(false);
    setIsFocused(false);
  };

  // Handle clear search
  const handleClearSearch = () => {
    clearSearch();
    setShowResults(false);
    setIsFocused(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle focus
  const handleFocus = () => {
    setIsFocused(true);
    if (searchTerm.trim() || recentSearches.length > 0) {
      setShowResults(true);
    }
  };

  // Get styles based on variant
  const getStyles = () => {
    if (variant === 'homepage') {
      return {
        container: "relative max-w-2xl mx-auto",
        input: "w-full pl-14 pr-12 py-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full text-white placeholder-white/60 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50 transition-all duration-300 text-lg",
        searchIcon: "absolute left-6 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5",
        clearIcon: "absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80 w-5 h-5 cursor-pointer transition-colors"
      };
    } else {
      return {
        container: "relative w-80",
        input: "w-full pl-12 pr-10 py-2 rounded-lg transition-all duration-300 border-2 border-green-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900 placeholder-gray-500",
        searchIcon: "absolute left-4 top-1/2 transform -translate-y-1/2 text-green-400 w-5 h-5",
        clearIcon: "absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 w-5 h-5 cursor-pointer transition-colors"
      };
    }
  };

  const styles = getStyles();

  return (
    <div ref={searchRef} className={`${styles.container} ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <Search className={styles.searchIcon} />
        
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleFocus}
          placeholder={placeholder}
          className={styles.input}
          dir="rtl"
        />
        
        {searchTerm && (
          <button
            type="button"
            onClick={handleClearSearch}
            className={styles.clearIcon}
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </form>

      {/* Search Results Dropdown */}
      {showResults && (
        <SearchResults
          results={results}
          loading={loading}
          error={error}
          onResultClick={handleResultClick}
          onClearSearch={handleClearSearch}
          searchTerm={searchTerm}
          suggestions={suggestions}
          recentSearches={recentSearches}
          onSuggestionClick={handleSuggestionClick}
        />
      )}
    </div>
  );
};

export default UnifiedSearch; 