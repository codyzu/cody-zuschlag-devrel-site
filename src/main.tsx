// eslint-disable-line unicorn/filename-case
import React from 'react';
import ReactDOM from 'react-dom/client';
import {init, trackPages} from 'insights-js';
import App from './App';
import '@unocss/reset/tailwind.css';
import 'uno.css';

// Insights privacy orientated tracking
if (import.meta.env.PROD) {
  init('KbjjkY98I3MxcBui');
  trackPages({hash: true});
}

ReactDOM.createRoot(document.querySelector('#root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
