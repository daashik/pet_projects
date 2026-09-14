// main.js - основной ES-модуль проекта. Здесь размещается общий функционал сайта, не зависящий от сторонних библиотек.
// Модуль подключается в index.html с type="module", поэтому дополнительная обёртка IIFE больше не требуется.

const renderLoadTime = () => {
  const elementLoad = document.getElementById('load-time');
  if (!elementLoad) return;

  const sec = (performance.now() / 1000).toFixed(2);
  elementLoad.textContent = `Время загрузки страницы: ${sec} с`;
};

const highlightActive = () => {
  const current = location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('nav a').forEach((link) => {
    const href = link.getAttribute('href') || '';

    if (href.startsWith('#')) {
      link.classList.toggle('active', location.hash === href);
      return;
    }

    const linkPath = href.split('#')[0];
    link.classList.toggle('active', (linkPath || 'index.html') === current);
  });
};

addEventListener('DOMContentLoaded', highlightActive, { once: true });
addEventListener('load', renderLoadTime, { once: true });