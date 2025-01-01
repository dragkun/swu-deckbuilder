import React from "react";
import { useTheme } from "../contexts/ThemeContext";

export default function ColorSchemeSwitcher(props) {
  const { switchTheme, theme } = useTheme();
  const nextTheme = theme === "dark" ? "light" : "dark";
  const nextThemeLabel = theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode";

  const handleSwitchTheme = (event) => {
    event.preventDefault();
    switchTheme();
  };

  return (
      <input name="theme" type="checkbox" role="switch" checked={theme === 'dark'} onChange={handleSwitchTheme} />
  );
}