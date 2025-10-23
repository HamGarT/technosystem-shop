import { useState, useCallback } from 'react';

export const useNotification = () => {
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback((type, message, duration = 3000) => {
    setNotification({
      type,
      message,
      visible: true,
      duration
    });

    setTimeout(() => {
      setNotification(prev => prev ? { ...prev, visible: false } : null);
      
      setTimeout(() => {
        setNotification(null);
      }, 300);
    }, duration);
  }, []);

  const showSuccess = useCallback((message, duration = 3000) => {
    showNotification('success', message, duration);
  }, [showNotification]);

  const showError = useCallback((message, duration = 4000) => {
    showNotification('error', message, duration);
  }, [showNotification]);

  const showWarning = useCallback((message, duration = 3000) => {
    showNotification('warning', message, duration);
  }, [showNotification]);

  const showInfo = useCallback((message, duration = 3000) => {
    showNotification('info', message, duration);
  }, [showNotification]);

  const closeNotification = useCallback(() => {
    setNotification(prev => prev ? { ...prev, visible: false } : null);
    
    setTimeout(() => {
      setNotification(null);
    }, 300);
  }, []);

  return {
    notification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    closeNotification
  };
};