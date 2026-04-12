// Giscus event handler to sync with Material theme palette
const setGiscusTheme = (theme) => {
  const frame = document.querySelector(".giscus-frame");
  if (frame && frame.contentWindow) {
    frame.contentWindow.postMessage(
      { giscus: { setConfig: { theme } } },
      "https://giscus.app"
    );
  }
};

const getTheme = () => {
  const palette = __md_get("__palette");
  if (palette && palette.color && palette.color.scheme === "slate") {
    return "dark";
  }
  return "light";
};

// Sync Giscus theme
const syncGiscus = () => {
  const giscusScript = document.querySelector("script[src*=giscus]");
  if (giscusScript) {
    const theme = getTheme();
    giscusScript.setAttribute("data-theme", theme);
    setGiscusTheme(theme);
  }
};

// Run on initial load
document.addEventListener("DOMContentLoaded", () => {
  syncGiscus();
});

// Subscribe to Material theme changes
if (window.palette$) {
  window.palette$.subscribe(function(palette) {
    const theme = palette.color.scheme === "slate" ? "dark" : "light";
    setGiscusTheme(theme);
  });
}

// Ensure it syncs when Giscus iframe is ready
window.addEventListener("message", (event) => {
  if (event.origin !== "https://giscus.app") return;
  if (!(event.data && event.data.giscus)) return;
  
  setGiscusTheme(getTheme());
});
