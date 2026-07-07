
(function () {
  const root = document.documentElement;
  const button = document.querySelector('.st-theme-toggle');
  const initialTheme = root.getAttribute('data-st-initial-theme') === 'dark' ? 'dark' : 'light';
  const currentScript = document.currentScript;
  const exportScope =
    currentScript instanceof HTMLScriptElement && currentScript.src ? currentScript.src : window.location.href;
  const storageKey = 'notaly-static-export-theme:' + initialTheme + ':' + exportScope;
  const setState = function (isDark) {
    root.classList.toggle('dark', isDark);
    if (button instanceof HTMLButtonElement) {
      button.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      button.textContent = isDark ? 'Dark' : 'Light';
    }
  };

  try {
    const saved = localStorage.getItem(storageKey);
    if (saved === 'dark') {
      setState(true);
    } else if (saved === 'light') {
      setState(false);
    } else {
      setState(initialTheme === 'dark');
    }
  } catch (_error) {
    setState(initialTheme === 'dark');
  }

  document.addEventListener('click', function (event) {
    const target = event.target;
    if (!(target instanceof Element) || !target.closest('.st-theme-toggle')) {
      return;
    }
    event.preventDefault();
    const nextDark = !root.classList.contains('dark');
    setState(nextDark);
    try {
      localStorage.setItem(storageKey, nextDark ? 'dark' : 'light');
    } catch (_error) {
      // localStorage가 불가능한 환경에서는 무시한다.
    }
  });
})();
