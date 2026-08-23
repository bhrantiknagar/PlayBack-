import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { PlayerProvider } from './context/PlayerContext';
import { ThemeProvider } from './context/ThemeContext';
import { SettingsProvider } from './context/SettingsContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { AppRoutes } from './routes';

export function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <SettingsProvider>
          <PlayerProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </PlayerProvider>
        </SettingsProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
