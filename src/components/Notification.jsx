import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

const Notification = () => {
  const { notifications, dismissNotification } = useNotifications();
  const [visible, setVisible] = useState({});

  useEffect(() => {
    const newVisibleState = {};
    notifications.forEach(notification => {
      newVisibleState[notification.id] = true;
    });
    setVisible(prev => ({ ...prev, ...newVisibleState }));
  }, [notifications]);

  const handleDismiss = (id) => {
    setVisible(prev => ({ ...prev, [id]: false }));
    setTimeout(() => {
      dismissNotification(id);
    }, 300);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'warning': return 'bg-amber-50 border-amber-200';
      case 'error': return 'bg-red-50 border-red-200';
      default: return 'bg-blue-50 border-blue-200';
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`${getBgColor(notification.type)} ${
            visible[notification.id] ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          } transition-all duration-300 ease-in-out max-w-xs rounded-lg border shadow-md p-4 flex items-start gap-3`}
        >
          {getIcon(notification.type)}
          <p className="flex-1 text-sm text-gray-700">{notification.message}</p>
          <button
            onClick={() => handleDismiss(notification.id)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Notification;
