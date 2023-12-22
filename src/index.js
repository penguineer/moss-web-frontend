import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import "primeflex/primeflex.css";
import 'primeicons/primeicons.css';
import { PrimeReactProvider} from 'primereact/api';


if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  // User prefers dark theme
  require('primereact/resources/themes/lara-dark-teal/theme.css');
} else {
  // User prefers light theme
  require('primereact/resources/themes/lara-light-teal/theme.css');
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <PrimeReactProvider>
    <App />
  </PrimeReactProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
