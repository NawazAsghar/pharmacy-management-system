import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './main.css'

import "primereact/resources/themes/lara-light-indigo/theme.css"; // Theme
import "primereact/resources/primereact.min.css";                  // Core CSS
import "primeicons/primeicons.css";                                // Icons

import { PrimeReactProvider } from '@primereact/core';

import Nora from '@primeuix/themes/nora';
import { definePreset } from '@primeuix/themes';
import { AuthProvider } from './context/AuthContext.jsx';

const PharmaFlowTheme = definePreset(Nora, {
  semantic: {
    primary: {
      50: '{teal.50}',
      100: '{teal.100}',
      200: '{teal.200}',
      300: '{teal.300}',
      400: '{teal.400}',
      500: '{teal.500}',
      600: '{teal.600}',
      700: '{teal.700}',
      800: '{teal.800}',
      900: '{teal.900}',
      950: '{teal.950}',
    },
    colorScheme: {
      light: {
        surface: {
          0: '#ffffff',
          50: '{slate.50}',
          100: '{slate.100}',
          200: '{slate.200}',
          300: '{slate.300}',
          400: '{slate.400}',
          500: '{slate.500}',
          600: '{slate.600}',
          700: '{slate.700}',
          800: '{slate.800}',
          900: '{slate.900}',
          950: '{slate.950}',
        }
      },
      dark: {
        surface: {
          0: '#ffffff',
          50: '{slate.950}',
          100: '{slate.900}',
          200: '{slate.800}',
          300: '{slate.700}',
          400: '{slate.600}',
          500: '{slate.500}',
          600: '{slate.400}',
          700: '{slate.300}',
          800: '{slate.200}',
          900: '{slate.100}',
          950: '{slate.50}',
        }
      }
    }
  }
});

const PrimeReactLicense = import.meta.env.VITE_PRIMEREACT_LICENSE_KEY;

const primereact = {
  theme: {
    preset: PharmaFlowTheme,
    options: {
      darkModeSelector: false, // 👈 disables dark mode completely
    }
  },
  license: PrimeReactLicense
};


ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PrimeReactProvider {...primereact}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </PrimeReactProvider>
  </StrictMode>
);