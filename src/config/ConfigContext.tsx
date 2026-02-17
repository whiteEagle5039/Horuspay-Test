import React, { createContext, useContext, useState, useEffect } from 'react';
import type { HorusPayConfig } from '../types';
import { configureHorusPay, getHorusPayConfig } from './horuspay';

interface ConfigContextType {
  isConfigured: boolean;
  config: HorusPayConfig | null;
  setConfiguration: (config: HorusPayConfig) => void;
  clearConfiguration: () => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConfigured, setIsConfigured] = useState(false);
  const [config, setConfig] = useState<HorusPayConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Charger la configuration au montage
    const savedConfig = getHorusPayConfig();
    console.debug('[ConfigContext] loaded config from localStorage:', savedConfig);
    if (savedConfig.apiKey && savedConfig.accountId) {
      configureHorusPay(savedConfig);
      setIsConfigured(true);
      setConfig(savedConfig);
    }
    setLoading(false);
    console.debug('[ConfigContext] isConfigured:', savedConfig.apiKey && savedConfig.accountId);
  }, []);

  const setConfiguration = (newConfig: HorusPayConfig) => {
    configureHorusPay(newConfig);
    setIsConfigured(true);
    setConfig(newConfig);
    localStorage.setItem('horuspay_api_key', newConfig.apiKey);
    localStorage.setItem('horuspay_env', newConfig.environment);
    localStorage.setItem('horuspay_account_id', newConfig.accountId);
    console.debug('[ConfigContext] setConfiguration -> saved to localStorage', newConfig);
  };

  const clearConfiguration = () => {
    setIsConfigured(false);
    setConfig(null);
    localStorage.removeItem('horuspay_api_key');
    localStorage.removeItem('horuspay_env');
    localStorage.removeItem('horuspay_account_id');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <h2>🎯 Chargement...</h2>
        </div>
      </div>
    );
  }

  return (
    <ConfigContext.Provider value={{ isConfigured, config, setConfiguration, clearConfiguration }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};
