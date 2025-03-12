import { useEffect } from 'react';

const GoogleAnalytics = () => {
  useEffect(() => {
    try {
      // Measurement ID from your Google Analytics 4 property
      const measurementId = 'G-J3ER4S4XEP';
      
      // Check if Google Analytics is already loaded
      if (window.gtag) return;
      
      // Load Google Analytics script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(script);
      
      // Initialize gtag
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }
      window.gtag = gtag;
      
      gtag('js', new Date());
      gtag('config', measurementId, {
        page_path: window.location.pathname,
        debug_mode: process.env.NODE_ENV === 'development'
      });
      
      // Track page navigation events for single-page application
      const handleRouteChange = () => {
        gtag('event', 'page_view', {
          page_path: window.location.pathname,
          page_title: document.title
        });
      };
      
      window.addEventListener('popstate', handleRouteChange);
      return () => window.removeEventListener('popstate', handleRouteChange);
    } catch (error) {
      console.error('Failed to initialize Google Analytics:', error);
    }
  }, []);

  return null;
};

export default GoogleAnalytics;
