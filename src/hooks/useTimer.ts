import { useEffect, useRef } from 'react';
import { useAppStore } from '../store';

export const useTimer = () => {
  const { timer, tickTimer, stopTimer, startTimer, pauseTimer } = useAppStore();
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (timer.isActive && timer.timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        tickTimer();
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timer.isActive, timer.timeRemaining, tickTimer]);

  // Notification when timer completes
  useEffect(() => {
    if (timer.timeRemaining === 0 && timer.totalTime > 0) {
      // Play notification sound or vibrate
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
      
      // Browser notification (if permission granted)
      if (Notification.permission === 'granted') {
        new Notification('Rest Complete!', {
          body: 'Time for your next set',
          icon: '/favicon.ico',
          tag: 'rest-timer'
        });
      }
    }
  }, [timer.timeRemaining, timer.totalTime]);

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  return {
    timer,
    startTimer,
    pauseTimer,
    stopTimer,
    requestNotificationPermission
  };
};