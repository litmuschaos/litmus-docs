import "modern-css-reset/dist/reset.min.css";
import { useContext } from "react";
import { ThemeContext } from "styled-components";
import media from "use-media";
import themeObject from "./theme";

export { theme, useTheme };

const theme = () => {
  const { screens, ...themeValues } = themeObject;
  const breakpointSizes = Object.keys(screens).reduce((accum, key) => {
    const value = media({ maxWidth: screens[key] });
    return {
      ...accum,
      [key]: value,
    };
  }, {});
  return {
    ...themeValues,
    screens: breakpointSizes,
  };
};

const useTheme = () => useContext(ThemeContext);
