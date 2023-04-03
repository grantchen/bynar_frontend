import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import "@carbon/ibm-products/css/index-full-carbon.css";
import { ThemeProvider } from './sdk/theme/ThemeContext';
import {I18nextProvider} from "react-i18next";
import i18next from "i18next";
import './i18nextConfig';

i18next.init({
    interpolation: { escapeValue: false },  // React already does escaping
});

ReactDOM.render(
  <ThemeProvider>
  <React.StrictMode>
  <I18nextProvider i18n={i18next}>
    <App />
    </I18nextProvider>
  </React.StrictMode>
  </ThemeProvider>,
 document.getElementById('root')
);

