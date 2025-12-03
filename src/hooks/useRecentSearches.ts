import { useState, useEffect } from 'react';
import { RecentSearchItem } from 'src/components/search/SearchPopup.types';

const RECENT_SEARCHES_KEY = 'bagstrap_recent_searches';
const MAX_RECENT_SEARCHES = 5;

export default function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState<RecentSearchItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const validSearches = parsed.map((item: any) => ({
          ...item,
          searchedAt: new Date(item.searchedAt)
        }));
        setRecentSearches(validSearches);
      }
    } catch (error) {
      console.error('Failed to load recent searches:', error);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save to localStorage whenever recentSearches changes (except initial load)

  useEffect(() => {
    if (!isInitialized) return;

    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recentSearches));
    } catch (error) {
      console.error('Failed to save recent searches:', error);
    }
  }, [recentSearches, isInitialized]);

  const addRecentSearch = (keyword: string) => {
    const trimmedKeyword = keyword.trim();
    if (!trimmedKeyword) return;

    setRecentSearches(prev => {
      const filtered = prev.filter(item => item.keyword !== trimmedKeyword);

      const newItem: RecentSearchItem = {
        id: Date.now().toString(),
        keyword: trimmedKeyword,
        searchedAt: new Date()
      };

      return [newItem, ...filtered].slice(0, MAX_RECENT_SEARCHES);
    });
  };

  const deleteRecentSearch = (id: string) => {
    setRecentSearches(prev => prev.filter(item => item.id !== id));
  };

  const clearAllRecentSearches = () => {
    setRecentSearches([]);
  };

  return {
    recentSearches,
    addRecentSearch,
    deleteRecentSearch,
    clearAllRecentSearches
  };
}