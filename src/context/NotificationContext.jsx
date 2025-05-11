import React, { createContext, useContext, useState, useEffect } from 'react';
import { useGoals } from './GoalContext';
import { shouldShowCheckInReminder } from '../utils/goalUtils';
import { isToday } from '../utils/dateUtils';

const NotificationContext = createContext(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [lastReminderShown, setLastReminderShown] = useState(
    localStorage.getItem('lastReminderShown')
  );
  const { goals } = useGoals();

  // Persist last reminder date
  useEffect(() => {
    if (lastReminderShown) {
      localStorage.setItem('lastReminderShown', lastReminderShown);
    } else {
      localStorage.removeItem('lastReminderShown');
    }
  }, [lastReminderShown]);

  // Show reminder if needed
  useEffect(() => {
    if (!isToday(lastReminderShown) && shouldShowCheckInReminder(goals)) {
      const now = new Date();
      if (now.getHours() >= 18) {
        showNotification(
          "Don't forget to check in on your goals today!",
          'warning'
        );
        setLastReminderShown(new Date().toISOString());
      }
    }
  }, [goals, lastReminderShown]);

  const showNotification = (message, type) => {
    const id = Date.now().toString();
    setNotifications((prev) => [...prev, { id, message, type }]);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      dismissNotification(id);
    }, 5000);
  };

  const dismissNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider
      value={{
        showNotification,
        notifications,
        dismissNotification,
        lastReminderShown,
        setLastReminderShown,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
