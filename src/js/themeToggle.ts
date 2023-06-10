export function initializeThemeToggle() {
  let themeToggle = document.querySelector("#themeToggle") as HTMLInputElement;
  let themeIcon = document.querySelector("#themeIcon");
  let isDarkMode = localStorage.getItem("theme") === "dark";

  const html = document.querySelector("html");
  const body = document.querySelector("body");
  const darkModeTrigger = document.querySelector(".darkmode-trigger");

  function updateTheme() {
    if (isDarkMode) {
      html?.classList.add("uk-dark");
      body?.classList.add("uk-dark");
      html?.classList.remove("uk-light-demo");
      body?.classList.remove("uk-light-demo");
      if (themeToggle) themeToggle.checked = true;
      themeIcon?.classList.remove("fa-sun");
      themeIcon?.classList.add("fa-moon");

      darkModeTrigger?.classList.remove("light-theme");
      darkModeTrigger?.classList.add("dark-theme");
      themeIcon?.classList.remove("light-theme");
      themeIcon?.classList.add("dark-theme");
    } else {
      html?.classList.add("uk-light-demo");
      body?.classList.add("uk-light-demo");
      html?.classList.remove("uk-dark");
      body?.classList.remove("uk-dark");
      if (themeToggle) themeToggle.checked = false;
      themeIcon?.classList.remove("fa-moon");
      themeIcon?.classList.add("fa-sun");

      // Add or remove classes for the theme switch
      darkModeTrigger?.classList.remove("dark-theme");
      darkModeTrigger?.classList.add("light-theme");
      themeIcon?.classList.remove("dark-theme");
      themeIcon?.classList.add("light-theme");
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener("change", function () {
      isDarkMode = !isDarkMode;
      localStorage.setItem("theme", isDarkMode ? "dark" : "light");
      updateTheme();
    });
  }

  updateTheme();
}
