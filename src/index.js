import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.css';
import GoogleAnalytics from './GoogleAnalytics';
// Import reportWebVitals properly or remove the reference if not needed
// import reportWebVitals from './reportWebVitals';

// Add Font Awesome using proper method
const fontAwesomeLink = document.createElement('link');
fontAwesomeLink.rel = 'stylesheet';
fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
fontAwesomeLink.integrity = 'sha512-1ycn6IcaQQ40/MKBW2W4Rhis/DbILU74C1vSrLJxCq57o941Ym01SwNsOMqvEBFlcgUa6xLiPY/NS5R+E6ztJQ==';
fontAwesomeLink.crossOrigin = 'anonymous';
fontAwesomeLink.referrerPolicy = 'no-referrer';
document.head.appendChild(fontAwesomeLink);

// Create root and render app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleAnalytics />
    <App />
  </React.StrictMode>
);

// Remove or comment out this line since reportWebVitals is causing issues
// reportWebVitals();