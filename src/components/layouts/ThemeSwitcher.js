import { useEffect, useState } from "react";

const ThemeSwitcher = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode((prev) => {
      const newTheme = !prev ? "dark" : "light";
      window.localStorage.setItem("theme", newTheme);
      return !prev;
    });
  };

  useEffect(() => {
    const html = document.querySelector("Html");
    const theme = window.localStorage.getItem("theme") || "light";

    setDarkMode(theme === "dark");

    return () => {
      html.classList.remove("uk-dark", "uk-light-demo");
    };
  }, []);

  useEffect(() => {
    const html = document.querySelector("Html");

    if (darkMode) {
      html.classList.add("uk-dark");
      html.classList.remove("uk-light-demo");
    } else {
      html.classList.add("uk-light-demo");
      html.classList.remove("uk-dark");
    }
  }, [darkMode]);

  return (
    <div className="theme_switcher">
      <div className="wrap uk-overflow-hidden">
        <div
          class="darkmode-trigger uk-position-bottom-right uk-position-small uk-position-fixed uk-box-shadow-large uk-radius-circle"
          data-darkmode-toggle=""
        >
          <label class="switch">
            <span class="sr-only">Dark mode toggle</span>
            <input
              data-theme="light"
              class="setColor light"
              id="themeToggle"
              type="checkbox"
            />
            <span class="slider"></span>
            <i id="themeIcon" class="fas"></i>
          </label>
        </div>
      </div>
    </div>
  );
};

export default ThemeSwitcher;
