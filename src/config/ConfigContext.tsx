import React, { createContext, useContext, useState, useEffect } from 'react';
import type { HorusPayConfig } from '../types';
import {
  configureHorusPay,
  getHorusPayConfig,
  saveHorusPayConfig,
  clearHorusPayConfig as clearStoredConfig,
} from './horuspay';

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
    const savedConfig = getHorusPayConfig();
    if (savedConfig.secretKey || savedConfig.publicKey) {
      configureHorusPay(savedConfig);
      setIsConfigured(true);
      setConfig(savedConfig);
    }
    setLoading(false);
  }, []);

  const setConfiguration = (newConfig: HorusPayConfig) => {
    saveHorusPayConfig(newConfig);
    setIsConfigured(true);
    setConfig(newConfig);
  };

  const clearConfiguration = () => {
    clearStoredConfig();
    setIsConfigured(false);
    setConfig(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0f172a]">
        <p className="text-slate-400 text-sm">Loading...</p>
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
