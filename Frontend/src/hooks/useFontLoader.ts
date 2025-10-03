import { useState, useEffect } from "react";
import * as Font from "expo-font";

export function useFontLoader() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      // Asynchronous function that loads custom fonts
      await Font.loadAsync({
        "InstrumentSans-Regular": require("../assets/fonts/InstrumentSans-Regular.ttf"),
        "InstrumentSans-Medium": require("../assets/fonts/InstrumentSans-Medium.ttf"),
        "InstrumentSans-Semibold": require("../assets/fonts/InstrumentSans-SemiBold.ttf"),
        "InstrumentSans-Bold": require("../assets/fonts/InstrumentSans-Bold.ttf"),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  return { fontsLoaded };
}
