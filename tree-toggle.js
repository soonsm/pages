
(function () {
  const findNode = function (button) {
    return button.closest('[data-st-node]');
  };
  const layout = document.querySelector('.st-layout');
  const sidebar = document.querySelector('.st-sidebar');
  const sidebarResizer = document.querySelector('.st-sidebar-resizer');
  const sidebarHideButton = document.querySelector('.st-sidebar-hide-button');
  const sidebarShowButton = document.querySelector('.st-sidebar-show-button');
  let resizeState = null;

  const getRootFontSize = function () {
    const fontSize = Number.parseFloat(window.getComputedStyle(document.documentElement).fontSize);
    return Number.isFinite(fontSize) && fontSize > 0 ? fontSize : 16;
  };

  const getSidebarLimits = function () {
    const min = 15;
    const max = 17;
    return { min: min, max: max };
  };

  const clampSidebarWidth = function (widthRem) {
    const limits = getSidebarLimits();
    const dynamicMax = Math.max(limits.min, Math.min(limits.max, (window.innerWidth * 0.62) / getRootFontSize()));
    return Math.min(dynamicMax, Math.max(limits.min, widthRem));
  };

  const applySidebarWidth = function (widthRem) {
    if (!(layout instanceof HTMLElement)) {
      return;
    }
    const normalizedWidth = Math.round(clampSidebarWidth(widthRem) * 1000) / 1000;
    layout.style.setProperty('--st-sidebar-width', String(normalizedWidth) + 'rem');
  };

  const stopResize = function () {
    if (resizeState === null) {
      return;
    }
    resizeState = null;
    document.body.classList.remove('st-sidebar-resizing');
  };

  const applySidebarState = function (expanded) {
    if (!(layout instanceof HTMLElement)) {
      return;
    }
    layout.setAttribute('data-sidebar-open', expanded ? 'true' : 'false');
    if (sidebarHideButton instanceof HTMLButtonElement) {
      sidebarHideButton.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    }
    if (sidebarShowButton instanceof HTMLButtonElement) {
      sidebarShowButton.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    }
    if (sidebarResizer instanceof HTMLElement) {
      sidebarResizer.setAttribute('aria-hidden', expanded ? 'false' : 'true');
    }
    if (!expanded) {
      stopResize();
    }
  };

  const applyState = function (node, expanded) {
    const toggle = node.querySelector('[data-st-toggle]');
    const children = node.querySelector(':scope > .st-tree-children');
    node.setAttribute('data-expanded', expanded ? 'true' : 'false');
    if (toggle) {
      toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      toggle.textContent = expanded ? '▾' : '▸';
    }
    if (children) {
      children.hidden = !expanded;
    }
  };

  document.addEventListener('click', function (event) {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }
    const sidebarToggle = target.closest('.st-sidebar-hide-button, .st-sidebar-show-button');
    if (sidebarToggle instanceof HTMLButtonElement) {
      event.preventDefault();
      const expanded = layout instanceof HTMLElement && layout.getAttribute('data-sidebar-open') !== 'false';
      applySidebarState(!expanded);
      return;
    }
    const button = target.closest('[data-st-toggle]');
    if (!(button instanceof HTMLButtonElement)) {
      return;
    }
    event.preventDefault();
    const node = findNode(button);
    if (!node) {
      return;
    }
    const expanded = node.getAttribute('data-expanded') !== 'false';
    applyState(node, !expanded);
  });

  document.addEventListener('pointermove', function (event) {
    if (
      resizeState === null ||
      !(layout instanceof HTMLElement) ||
      layout.getAttribute('data-sidebar-open') === 'false'
    ) {
      return;
    }
    const deltaX = (event.clientX - resizeState.startX) / getRootFontSize();
    applySidebarWidth(resizeState.startWidth + deltaX);
  });

  const handlePointerUp = function () {
    stopResize();
  };

  document.addEventListener('pointerup', handlePointerUp);
  document.addEventListener('pointercancel', handlePointerUp);
  window.addEventListener('blur', handlePointerUp);

  if (sidebarResizer instanceof HTMLElement) {
    sidebarResizer.addEventListener('pointerdown', function (event) {
      if (!(sidebar instanceof HTMLElement) || event.button !== 0) {
        return;
      }
      if (layout instanceof HTMLElement && layout.getAttribute('data-sidebar-open') === 'false') {
        return;
      }
      event.preventDefault();
      resizeState = {
        startX: event.clientX,
        startWidth: sidebar.getBoundingClientRect().width / getRootFontSize()
      };
      document.body.classList.add('st-sidebar-resizing');
    });
  }

  window.addEventListener('resize', function () {
    if (!(layout instanceof HTMLElement) || layout.getAttribute('data-sidebar-open') === 'false') {
      return;
    }
    const currentWidth = sidebar instanceof HTMLElement ? sidebar.getBoundingClientRect().width / getRootFontSize() : 0;
    if (currentWidth > 0) {
      applySidebarWidth(currentWidth);
    }
  });

  applySidebarState(true);
})();
