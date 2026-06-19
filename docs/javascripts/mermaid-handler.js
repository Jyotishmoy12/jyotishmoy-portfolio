const getMermaidTheme = () =>
  document.body.getAttribute("data-md-color-scheme") === "slate"
    ? "dark"
    : "default";

let mermaidRenderTimer;

const renderMermaidDiagrams = async () => {
  if (!window.mermaid) return;

  const diagrams = Array.from(document.querySelectorAll(".mermaid"));
  if (!diagrams.length) return;

  diagrams.forEach((diagram) => {
    if (!diagram.dataset.mermaidSource) {
      diagram.dataset.mermaidSource = diagram.textContent.trim();
    } else {
      diagram.textContent = diagram.dataset.mermaidSource;
    }

    diagram.removeAttribute("data-processed");
  });

  window.mermaid.initialize({
    startOnLoad: false,
    securityLevel: "strict",
    theme: getMermaidTheme()
  });

  await window.mermaid.run({ nodes: diagrams });
};

const scheduleMermaidRender = () => {
  window.clearTimeout(mermaidRenderTimer);
  mermaidRenderTimer = window.setTimeout(() => {
    renderMermaidDiagrams().catch((error) => {
      console.error("Unable to render Mermaid diagrams:", error);
    });
  }, 50);
};

if (window.document$) {
  window.document$.subscribe(scheduleMermaidRender);
} else {
  document.addEventListener("DOMContentLoaded", scheduleMermaidRender);
}

if (window.palette$) {
  window.palette$.subscribe(scheduleMermaidRender);
}
