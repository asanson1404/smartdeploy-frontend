export function initializeThemeToggle() {
  let themeToggle = document.querySelector("#themeToggle") as HTMLInputElement;
  let themeIcon = document.querySelector("#themeIcon");
  let isDarkMode = localStorage.getItem("theme") === "dark";

  const html = document.querySelector("html");
  const body = document.querySelector("body");

  function updateTheme() {
    if (isDarkMode) {
      html?.classList.add("uk-dark");
      body?.classList.add("uk-dark");
      html?.classList.remove("uk-light-demo");
      body?.classList.remove("uk-light-demo");
      if (themeToggle) themeToggle.checked = true;
      themeIcon?.classList.remove("fa-sun");
      themeIcon?.classList.add("fa-moon");
    } else {
      html?.classList.add("uk-light-demo");
      body?.classList.add("uk-light-demo");
      html?.classList.remove("uk-dark");
      body?.classList.remove("uk-dark");
      if (themeToggle) themeToggle.checked = false;
      themeIcon?.classList.remove("fa-moon");
      themeIcon?.classList.add("fa-sun");
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
