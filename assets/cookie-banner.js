(function (window, document) {
  'use strict';

  /* =========================================================================
     COOKIE-БАННЕР И УПРАВЛЕНИЕ СОГЛАСИЕМ НА АНАЛИТИКУ
     - Показывает маленькую плашку внизу при первом визите.
     - До нажатия "ОК" Яндекс.Метрика НЕ запускается.
     - После клика — запускается и больше не показывается (localStorage, 1 год).
     - Дизайн: тёмно-синий, как сайт. Не перекрывает контент.
     ========================================================================= */

  var CONSENT_KEY = 'osago-cookie-consent';
  var CONSENT_VALUE = 'accepted';
  // Срок хранения согласия — 1 год (в мс)
  var CONSENT_TTL = 365 * 24 * 60 * 60 * 1000;

  // Флаг: дал ли уже согласие (с проверкой срока)
  function hasConsent() {
    try {
      var raw = localStorage.getItem(CONSENT_KEY);
      if (!raw) return false;
      var data = JSON.parse(raw);
      if (!data || data.value !== CONSENT_VALUE) return false;
      if (typeof data.ts !== 'number') return false;
      if (Date.now() - data.ts > CONSENT_TTL) return false;
      return true;
    } catch (e) {
      return false;
    }
  }

  function setConsent() {
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify({
        value: CONSENT_VALUE,
        ts: Date.now()
      }));
    } catch (e) {}
  }

  // Запускаем аналитику (если она подключена на странице)
  function startAnalytics() {
    if (window.__osagoStartAnalytics && !window.__osagoAnalyticsInit) {
      try { window.__osagoStartAnalytics(); } catch (e) {}
    }
  }

  // CSS для плашки
  function injectStyles() {
    if (document.getElementById('cookie-banner-css')) return;
    var css = document.createElement('style');
    css.id = 'cookie-banner-css';
    css.textContent =
      '.cookie-banner{position:fixed;left:0;right:0;bottom:0;z-index:60;background:#0B2545;color:#E2E8F0;' +
      'padding:12px 16px;box-shadow:0 -4px 20px rgba(11,37,69,.18);font-family:inherit;font-size:14px;line-height:1.45;' +
      'transform:translateY(110%);transition:transform .35s ease;}' +
      '.cookie-banner--visible{transform:translateY(0);}' +
      '.cookie-banner__inner{max-width:720px;margin:0 auto;display:flex;flex-wrap:wrap;align-items:center;gap:10px 14px;}' +
      '.cookie-banner__text{flex:1 1 280px;color:#CBD5E1;}' +
      '.cookie-banner__text a{color:#93C5FD;text-decoration:underline;}' +
      '.cookie-banner__btn{flex:0 0 auto;background:#0D9488;color:#fff;border:0;border-radius:8px;' +
      'padding:8px 16px;font-size:14px;font-weight:600;cursor:pointer;white-space:nowrap;' +
      'transition:background .15s ease;}' +
      '.cookie-banner__btn:hover{background:#0F766E;}' +
      '@media(max-width:480px){.cookie-banner{font-size:13px;padding:10px 12px;}' +
      '.cookie-banner__btn{padding:7px 14px;font-size:13px;}}';
    document.head.appendChild(css);
  }

  function buildBanner() {
    var banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Уведомление об использовании cookie');
    banner.innerHTML =
      '<div class="cookie-banner__inner">' +
        '<p class="cookie-banner__text">Мы используем Яндекс.Метрику для аналитики посещаемости. ' +
        'Продолжая, вы соглашаетесь с <a href="privacy.html">политикой конфиденциальности</a>.</p>' +
        '<button type="button" class="cookie-banner__btn" aria-label="Принять и продолжить">ОК</button>' +
      '</div>';

    var btn = banner.querySelector('.cookie-banner__btn');
    btn.addEventListener('click', function () {
      setConsent();
      banner.classList.remove('cookie-banner--visible');
      window.setTimeout(function () { if (banner.parentNode) banner.parentNode.removeChild(banner); }, 400);
      startAnalytics();
    });

    return banner;
  }

  function showBanner() {
    injectStyles();
    var banner = buildBanner();
    document.body.appendChild(banner);
    // Плавное появление на следующем кадре
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        banner.classList.add('cookie-banner--visible');
      });
    });
  }

  function init() {
    // На странице политики/404 Метрики нет — баннер не нужен
    if (window.__osagoHasAnalytics === false) return;

    var cfg = (window.SITE && window.SITE.analytics) || {};

    if (hasConsent() || cfg.startAnalyticsBeforeConsent) {
      // Согласие уже дано ранее, ИЛИ временно включён режим
      // "стартовать до согласия" (см. site.config.js) — запускаем аналитику сразу.
      startAnalytics();
      // Если согласия формально ещё нет — баннер всё равно показываем
      // (спросить его — отдельная задача от запуска счётчика).
      if (!hasConsent()) {
        if (document.body) showBanner();
        else document.addEventListener('DOMContentLoaded', showBanner);
      }
      return;
    }

    // Согласия нет: показываем баннер. Аналитика не стартует до клика "ОК".
    if (document.body) showBanner();
    else document.addEventListener('DOMContentLoaded', showBanner);
  }

  // Запуск: после загрузки DOM, с небольшой задержкой, чтобы не мешать рендеру
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      window.setTimeout(init, 600);
    });
  } else {
    window.setTimeout(init, 600);
  }
})(window, document);
