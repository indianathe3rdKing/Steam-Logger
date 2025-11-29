import { useEffect } from "react";

export const useWebFonts = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Force font loading on web
      const fontAwesome = new FontFace(
        "FontAwesome",
        "url(/assets/node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/FontAwesome.ttf)"
      );

      const materialCommunity = new FontFace(
        "material-community",
        "url(/assets/node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf)"
      );

      Promise.all([fontAwesome.load(), materialCommunity.load()])
        .then((fonts) => {
          fonts.forEach((font) => document.fonts.add(font));
        })
        .catch((err) => {
          console.warn("Font loading failed:", err);
        });
    }
  }, []);
};
