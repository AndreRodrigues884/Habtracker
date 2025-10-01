// src/contexts/FontContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import * as Font from 'expo-font';

export const FontContext = createContext({ fontsLoaded: false });

export const FontProvider = ({ children }: { children: ReactNode }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
         'InstrumentSans-Regular': require('../assets/fonts/InstrumentSans-Regular.ttf'),
        'InstrumentSans-Medium': require('../assets/fonts/InstrumentSans-Medium.ttf'),
        'InstrumentSans-Semibold': require('../assets/fonts/InstrumentSans-SemiBold.ttf'),
        'InstrumentSans-Bold': require('../../src/assets/fonts/InstrumentSans-Bold.ttf'), 
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) return null; // ou ActivityIndicator

  return <FontContext.Provider value={{ fontsLoaded }}>{children}</FontContext.Provider>;
};
