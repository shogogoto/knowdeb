export default function ThemeScript() {
  const themeScript = `
    (function() {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const storedTheme = localStorage.getItem('vite-ui-theme');
      const theme = storedTheme || (prefersDark ? 'dark' : 'light');
      window.__theme = theme;
      document.documentElement.classList.add(theme);
    })();
  `;

  // biome-ignore lint/security/noDangerouslySetInnerHtml: Theme script is required to prevent flash
  return <script dangerouslySetInnerHTML={{ __html: themeScript }} />;
}
