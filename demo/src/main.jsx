import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';

// Restore theme on load
const saved = localStorage.getItem('utilitynet-theme') || 'light';
document.documentElement.setAttribute('data-theme', saved);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
