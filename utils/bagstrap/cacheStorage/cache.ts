export const clearTimeTableCache = () => {
  const prefix = 'timetable_cache_';

  Object.keys(localStorage).forEach(key => {
    if (key.startsWith(prefix)) {
      localStorage.removeItem(key);
    }
  });
};
