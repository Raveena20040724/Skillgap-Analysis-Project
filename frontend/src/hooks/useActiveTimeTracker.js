import { useEffect, useRef } from 'react';
import { getUserData, setUserData } from '../utils/userStorage';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const useActiveTimeTracker = () => {
  const activeSecondsRef = useRef(0);
  const isTabActiveRef = useRef(true);

  useEffect(() => {
    // Function to check visibility and focus state
    const checkActiveState = () => {
      const isVisible = document.visibilityState === 'visible';
      const isFocused = document.hasFocus();
      isTabActiveRef.current = isVisible && isFocused;
    };

    // Initial check
    checkActiveState();

    // Handlers for tab switch, focus, and blur
    const handleVisibilityChange = () => checkActiveState();
    const handleFocus = () => checkActiveState();
    const handleBlur = () => {
      isTabActiveRef.current = false;
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    // Save interval every 5 seconds if user is active
    const timerInterval = setInterval(() => {
      if (isTabActiveRef.current) {
        activeSecondsRef.current += 1;

        // Flush active seconds to user storage every 5 seconds
        if (activeSecondsRef.current % 5 === 0) {
          try {
            const todayDay = DAYS[new Date().getDay()]; // e.g., 'Mon'
            const currentWeeklyMap = getUserData('active_weekly_seconds', {
              Mon: 0,
              Tue: 0,
              Wed: 0,
              Thu: 0,
              Fri: 0,
              Sat: 0,
              Sun: 0,
            }) || {};

            const updatedMap = {
              ...currentWeeklyMap,
              [todayDay]: (currentWeeklyMap[todayDay] || 0) + 5,
            };

            setUserData('active_weekly_seconds', updatedMap);
            window.dispatchEvent(new Event('activeTimeUpdated'));
          } catch (e) {
            console.error('Error saving active learning duration:', e);
          }
        }
      }
    }, 1000);

    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      clearInterval(timerInterval);
    };
  }, []);
};
