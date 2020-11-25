import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ACProvider } from './global/AuthenticationContext';

ReactDOM.render(
  <React.StrictMode>

    <ACProvider>

      <App />

    </ACProvider>
    
  </React.StrictMode>,
  document.getElementById('root')
);