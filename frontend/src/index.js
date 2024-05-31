import React from 'react';
import App from './App';
import ReactDOM from 'react-dom';
import { AuthProvider } from './utils/authUtils';
import { BrowserRouter as Router } from 'react-router-dom';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <AuthProvider> {/* Wrap App with AuthProvider here */}
        <App />
      </AuthProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
