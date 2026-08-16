import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadState, saveState } from '../utils/storage';

const SettingsContext = createContext();

const defaultSettings = {
  autoplay: false,
  rememberPosition: true,
  confirmClearQueue: true,
  defaultVolume: 80,
  audioQuality: 'High', // High, Lossless, Standard
  crossfade: false,
  compactPlayer: false,
  reducedMotion: false,
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    return loadState('playback_settings', defaultSettings);
  });

  // Persist settings whenever they change
  useEffect(() => {
    saveState('playback_settings', settings);
  }, [settings]);

  // Apply visual settings side-effects
  useEffect(() => {
    if (settings.reducedMotion) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }
  }, [settings.reducedMotion]);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
