(function (window) {
  'use strict';

  var loc = window.location;

  function isLocalHost() {
    if (loc.protocol === 'file:') return true;
    var host = loc.hostname;
    if (!host) return true;
    if (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host === '[::1]' ||
      host === '0.0.0.0'
    ) {
      return true;
    }
    if (/^192\.168\./.test(host) || /^10\./.test(host)) return true;
    if (/^172\.(1[6-9]|2\d|3[01])\./.test(host)) return true;
    return false;
  }

  function getBasePath() {
    var path = loc.pathname || '/';
    if (/\.[a-z0-9]+$/i.test(path)) {
      path = path.replace(/[^/]*$/, '');
    }
    if (path.charAt(path.length - 1) !== '/') path += '/';
    return path;
  }

  function getPagePath() {
    return (loc.pathname || '/') + (loc.search || '');
  }

  function toHttps(url) {
    return url ? String(url).replace(/^http:\/\//i, 'https://') : url;
  }

  function storageAvailable(type) {
    try {
      var store = window[type];
      var key = '__osago_probe__';
      store.setItem(key, '1');
      store.removeItem(key);
      return true;
    } catch (e) {
      return false;
    }
  }

  function storageSet(key, value) {
    if (storageAvailable('sessionStorage')) {
      try {
        sessionStorage.setItem(key, value);
        return;
      } catch (e) {}
    }
    // Без fallback в localStorage для флагов навигации —
    // иначе скролл «залипает» между визитами.
    if (key === 'osago-scroll-order') return;
    if (storageAvailable('localStorage')) {
      try {
        localStorage.setItem(key, value);
      } catch (e) {}
    }
  }

  function storageGet(key) {
    if (storageAvailable('sessionStorage')) {
      try {
        var sessionValue = sessionStorage.getItem(key);
        if (sessionValue != null) return sessionValue;
      } catch (e) {}
    }
    if (key === 'osago-scroll-order') return null;
    if (storageAvailable('localStorage')) {
      try {
        return localStorage.getItem(key);
      } catch (e) {}
    }
    return null;
  }

  function storageRemove(key) {
    try {
      sessionStorage.removeItem(key);
    } catch (e) {}
    try {
      localStorage.removeItem(key);
    } catch (e) {}
  }

  function isPageReload() {
    try {
      var entries = window.performance && performance.getEntriesByType
        ? performance.getEntriesByType('navigation')
        : null;
      if (entries && entries.length && entries[0].type) {
        return entries[0].type === 'reload';
      }
    } catch (e) {}
    try {
      if (window.performance && performance.navigation) {
        return performance.navigation.type === 1;
      }
    } catch (e2) {}
    return false;
  }

  var local = isLocalHost();

  window.SITE_ENV = {
    isLocal: local,
    isFile: loc.protocol === 'file:',
    isHttps: loc.protocol === 'https:',
    isHttp: loc.protocol === 'http:',
    protocol: loc.protocol,
    getBasePath: getBasePath,
    getPagePath: getPagePath,
    toHttps: toHttps,
    storageSet: storageSet,
    storageGet: storageGet,
    storageRemove: storageRemove,
    isPageReload: isPageReload,
    supportsSmoothScroll: 'scrollBehavior' in document.documentElement.style
  };

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  // F5 / обновление: всегда сверху, без прыжка к старому #якорю
  if (isPageReload()) {
    storageRemove('osago-scroll-order');
    if (loc.hash && history.replaceState) {
      history.replaceState(null, '', getPagePath());
    }
    var resetTop = function () {
      window.scrollTo(0, 0);
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    };
    resetTop();
    window.addEventListener('DOMContentLoaded', resetTop, { once: true });
    window.addEventListener('load', resetTop, { once: true });
  } else if (loc.hash === '#oformit-polisa') {
    // На http→https не пишем sessionStorage до редиректа (разные origins).
    // Хэш оставляем в URL редиректа; на https снимаем и ставим флаг.
    if (loc.protocol === 'https:' || local || loc.protocol === 'file:') {
      storageSet('osago-scroll-order', '1');
      if (history.replaceState) {
        history.replaceState(null, '', getPagePath());
      }
    }
  } else {
    try {
      localStorage.removeItem('osago-scroll-order');
    } catch (e) {}
  }

  if (!local && loc.protocol === 'http:') {
    loc.replace(
      'https://' + loc.host + loc.pathname + loc.search + loc.hash
    );
  } else if (!local && loc.protocol === 'https:') {
    var csp = document.createElement('meta');
    csp.httpEquiv = 'Content-Security-Policy';
    csp.content = 'upgrade-insecure-requests';
    document.head.appendChild(csp);
  }
})(window);
