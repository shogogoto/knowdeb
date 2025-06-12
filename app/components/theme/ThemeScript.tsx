export default function ThemeScript() {
  const themeScript = `
    (function() {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const storedTheme = localStorage.getItem('vite-ui-theme');
      const theme = storedTheme || (prefersDark ? 'dark' : 'light');
      document.documentElement.classList.add(theme);
    })();
  `;

  return <script>{themeScript}</script>;
}
