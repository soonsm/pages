
(function () {
  const update = function (titleLine, expanded) {
    const members = titleLine.nextElementSibling;
    if (!(members instanceof HTMLElement) || !members.classList.contains('sg-members')) {
      return;
    }
    members.classList.toggle('is-collapsed', !expanded);
    const toggle = titleLine.querySelector('[data-sg-toggle]');
    if (toggle instanceof HTMLButtonElement) {
      toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      toggle.textContent = '⌵';
    }
  };

  document.addEventListener('click', function (event) {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }
    const toggle = target.closest('[data-sg-toggle]');
    if (!(toggle instanceof HTMLButtonElement)) {
      return;
    }
    const titleLine = toggle.closest('[data-sg-id]');
    if (!(titleLine instanceof HTMLElement)) {
      return;
    }
    event.preventDefault();
    const isExpanded = toggle.getAttribute('aria-expanded') !== 'false';
    update(titleLine, !isExpanded);
  });
})();
