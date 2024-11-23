import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // Si tienes un archivo CSS global, de lo contrario puedes omitir esta línea
import App from './App.js';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);