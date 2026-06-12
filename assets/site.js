(function () {
  'use strict';

  function getEnv() {
    return window.SITE_ENV || {};
  }

  function getPagePath() {
    var env = getEnv();
    if (env.getPagePath) return env.getPagePath();
    return window.location.pathname + window.location.search;
  }

  function scrollBehavior() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
  }

  function scrollToElement(el, options) {
    options = options || {};
    if (!el) return;

    var env = getEnv();
    var instant = !!options.instant;
    var useSmooth = !instant &&
      env.supportsSmoothScroll !== false &&
      scrollBehavior() === 'smooth';

    if (useSmooth) {
      try {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      } catch (e) {}
    }

    try {
      el.scrollIntoView(true);
    } catch (e2) {
      var top = el.getBoundingClientRect().top +
        (window.pageYOffset || document.documentElement.scrollTop || 0);
      window.scrollTo(0, top);
    }
  }

  function scrollWindowTop(instant) {
    var env = getEnv();
    var useSmooth = !instant &&
      env.supportsSmoothScroll !== false &&
      scrollBehavior() === 'smooth';

    if (useSmooth) {
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      } catch (e) {}
    }

    window.scrollTo(0, 0);
  }

  function scrollToOrderTarget(options) {
    options = options || {};
    var target = document.getElementById('oformit-polisa-target');
    if (!target) return;

    if (options.loadIframe !== false) {
      loadOrderIframe();
    }

    scrollToElement(target, { instant: options.instant });
  }

  function loadOrderIframe() {
    var iframe = document.getElementById('ppdwi');
    if (!iframe || iframe.src) return;
    var src = iframe.getAttribute('data-src');
    if (!src) return;
    iframe.src = src;
    if (!document.getElementById('ppdw-script')) {
      var s = document.createElement('script');
      s.id = 'ppdw-script';
      s.src = 'https://b2c.pampadu.ru/ppdw.js';
      s.defer = true;
      document.body.appendChild(s);
    }
  }

  function initOrderIframeLazyLoad() {
    var section = document.getElementById('oformit-polisa');
    var iframe = document.getElementById('ppdwi');
    if (!section || !iframe) return;

    function activate() {
      loadOrderIframe();
    }

    if (iframe.src) return;

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
          if (entries[i].isIntersecting) {
            activate();
            observer.disconnect();
            return;
          }
        }
      }, {
        root: null,
        rootMargin: '240px 0px 240px 0px',
        threshold: 0
      });
      observer.observe(section);
      return;
    }

    var triggered = false;
    function checkVisible() {
      if (triggered || iframe.src) return;
      var rect = section.getBoundingClientRect();
      var viewHeight = window.innerHeight || document.documentElement.clientHeight;
      if (rect.top < viewHeight + 240 && rect.bottom > -240) {
        triggered = true;
        activate();
        window.removeEventListener('scroll', checkVisible);
        window.removeEventListener('resize', checkVisible);
      }
    }

    window.addEventListener('scroll', checkVisible, { passive: true });
    window.addEventListener('resize', checkVisible, { passive: true });
    checkVisible();
  }

  function initEngagementTracking() {
    document.querySelectorAll('a[href^="tel:"]').forEach(function (link) {
      link.addEventListener('click', function () { trackGoal('click_phone'); });
    });

    document.querySelectorAll('a[href*="t.me"]').forEach(function (link) {
      link.addEventListener('click', function () { trackGoal('click_telegram'); });
    });

    document.querySelectorAll('a[href*="max.ru"]').forEach(function (link) {
      link.addEventListener('click', function () { trackGoal('click_max'); });
    });

    document.querySelectorAll('a[href^="mailto:"]').forEach(function (link) {
      link.addEventListener('click', function () { trackGoal('click_email'); });
    });
  }

  function preloadOrderWidgetScript() {
    if (document.getElementById('ppdw-script-preload') || document.getElementById('ppdw-script')) {
      return;
    }
    var link = document.createElement('link');
    link.id = 'ppdw-script-preload';
    link.rel = 'preload';
    link.as = 'script';
    link.href = 'https://b2c.pampadu.ru/ppdw.js';
    document.head.appendChild(link);
  }

  function initOrderWidgetPreload() {
    var trigger = document.getElementById('services') || document.getElementById('check');
    if (!trigger) return;

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
          if (entries[i].isIntersecting) {
            preloadOrderWidgetScript();
            observer.disconnect();
            return;
          }
        }
      }, { rootMargin: '320px 0px', threshold: 0 });
      observer.observe(trigger);
      return;
    }

    var done = false;
    function check() {
      if (done) return;
      var rect = trigger.getBoundingClientRect();
      var viewHeight = window.innerHeight || document.documentElement.clientHeight;
      if (rect.top < viewHeight + 320) {
        done = true;
        preloadOrderWidgetScript();
        window.removeEventListener('scroll', check);
      }
    }
    window.addEventListener('scroll', check, { passive: true });
    check();
  }

  function initMobileStickyCta() {
    var bar = document.getElementById('mobile-sticky-cta');
    var orderSection = document.getElementById('oformit-polisa');
    if (!bar) return;

    var orderLink = bar.querySelector('.mobile-sticky-cta__order');
    if (orderLink) {
      orderLink.addEventListener('click', function (e) {
        e.preventDefault();
        scrollToOrderTarget();
        trackGoal('click_order_form');
      });
    }

    var mq = window.matchMedia('(min-width: 768px)');
    var orderVisible = false;

    function setVisible(show) {
      if (mq.matches) {
        bar.hidden = true;
        document.body.classList.remove('has-mobile-cta');
        return;
      }
      var shouldShow = show && !orderVisible;
      bar.hidden = !shouldShow;
      document.body.classList.toggle('has-mobile-cta', shouldShow);
    }

    function onScroll() {
      setVisible(window.scrollY > 420);
    }

    if (orderSection && 'IntersectionObserver' in window) {
      var orderObserver = new IntersectionObserver(function (entries) {
        orderVisible = entries[0] && entries[0].isIntersecting;
        onScroll();
      }, { threshold: 0.08 });
      orderObserver.observe(orderSection);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    if (mq.addEventListener) {
      mq.addEventListener('change', onScroll);
    } else if (mq.addListener) {
      mq.addListener(onScroll);
    }
    onScroll();
  }

  function initScrollLinks() {
    document.querySelectorAll('a[href="#oformit-polisa"]').forEach(function (link) {
      if (link.closest('#mobile-sticky-cta')) return;
      link.addEventListener('click', function (e) {
        e.preventDefault();
        scrollToOrderTarget();
        trackGoal('click_order_form');
      });
    });
  }

  function initMobileMenu() {
    var toggle = document.getElementById('menu-toggle');
    var menu = document.getElementById('mobile-menu');
    var iconOpen = document.getElementById('menu-icon-open');
    var iconClose = document.getElementById('menu-icon-close');
    var links = document.querySelectorAll('.mobile-nav-link');

    if (!toggle || !menu) return;

    function setLinkFocusable(isFocusable) {
      links.forEach(function (link) {
        if (isFocusable) link.removeAttribute('tabindex');
        else link.setAttribute('tabindex', '-1');
      });
    }

    function setMenuOpen(isOpen) {
      menu.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      toggle.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
      menu.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
      if (iconOpen) iconOpen.classList.toggle('hidden', isOpen);
      if (iconClose) iconClose.classList.toggle('hidden', !isOpen);
      setLinkFocusable(isOpen);
      if (isOpen) {
        menu.removeAttribute('inert');
      } else {
        if ('inert' in HTMLElement.prototype) menu.setAttribute('inert', '');
      }
    }

    setMenuOpen(false);

    toggle.addEventListener('click', function () {
      setMenuOpen(!menu.classList.contains('open'));
    });

    links.forEach(function (link) {
      link.addEventListener('click', function () { setMenuOpen(false); });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) {
        setMenuOpen(false);
        toggle.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth >= 768) setMenuOpen(false);
    });
  }

  function initPolicyCheck() {
    var NSIS_TS_URL = 'https://nsis.ru/products/osago/check/';
    var PLATE_RE = /^[ABEKMHOPCTYXАВЕКМНОРСТУХ]\d{3}[ABEKMHOPCTYXАВЕКМНОРСТУХ]{2}\d{2,3}$/u;
    var VIN_RE = /^[A-HJ-NPR-Z0-9]{17}$/i;

    var tabs = document.querySelectorAll('.check-tab');
    var panelPolicy = document.getElementById('panel-policy');
    var panelKbm = document.getElementById('panel-kbm');
    var vehicleInput = document.getElementById('check-vehicle');
    var vehicleError = document.getElementById('check-vehicle-error');
    var checkBtn = document.getElementById('btn-check-policy');
    var copyNotice = document.getElementById('check-copy-notice');

    function normalizeVehicle(value) {
      return value.trim().toUpperCase().replace(/\s/g, '');
    }

    function isValidVehicle(value) {
      var v = normalizeVehicle(value);
      return PLATE_RE.test(v) || VIN_RE.test(v);
    }

    function showNotice(text) {
      if (!copyNotice) return;
      copyNotice.textContent = text;
      copyNotice.classList.remove('hidden');
    }

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var isPolicy = tab.getAttribute('data-tab') === 'policy';
        tabs.forEach(function (t) {
          t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
        });
        if (panelPolicy) {
          panelPolicy.classList.toggle('active', isPolicy);
          panelPolicy.hidden = !isPolicy;
        }
        if (panelKbm) {
          panelKbm.classList.toggle('active', !isPolicy);
          panelKbm.hidden = isPolicy;
        }
        if (copyNotice) copyNotice.classList.add('hidden');
      });
    });

    function openNsisCheck(value) {
      trackGoal('check_policy_nsis');
      showNotice('Откроется официальный сайт НСИС. Введите: ' + value);
      window.setTimeout(function () {
        window.open(NSIS_TS_URL, '_blank', 'noopener,noreferrer');
      }, 120);
    }

    function runPolicyCheck() {
      if (!vehicleInput) return;
      var value = normalizeVehicle(vehicleInput.value);
      if (!isValidVehicle(value)) {
        vehicleInput.classList.add('invalid');
        if (vehicleError) vehicleError.classList.add('visible');
        return;
      }
      vehicleInput.classList.remove('invalid');
      if (vehicleError) vehicleError.classList.remove('visible');

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(function () {
          showNotice('Данные «' + value + '» скопированы. На сайте НСИС вставьте их в поле «Государственный регистрационный знак» или «VIN».');
          trackGoal('check_policy_nsis');
          window.setTimeout(function () {
            window.open(NSIS_TS_URL, '_blank', 'noopener,noreferrer');
          }, 120);
        }).catch(function () {
          openNsisCheck(value);
        });
      } else {
        openNsisCheck(value);
      }
    }

    if (vehicleInput) {
      vehicleInput.addEventListener('input', function () {
        vehicleInput.classList.remove('invalid');
        if (vehicleError) vehicleError.classList.remove('visible');
      });
      vehicleInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          runPolicyCheck();
        }
      });
    }

    if (checkBtn) {
      checkBtn.addEventListener('click', runPolicyCheck);
    }
  }

  function trackGoal(name) {
    var cfg = window.SITE || {};
    var analytics = cfg.analytics || {};
    if (analytics.yandexMetrikaId && window.ym) {
      window.ym(analytics.yandexMetrikaId, 'reachGoal', name);
    }
    if (analytics.googleAnalyticsId && window.gtag) {
      window.gtag('event', name, { event_category: 'engagement', event_label: name });
    }
  }

  window.trackGoal = trackGoal;

  function initAnalytics() {
    if (window.__osagoAnalyticsInit) return;
    window.__osagoAnalyticsInit = true;

    var cfg = window.SITE || {};
    var analytics = cfg.analytics || {};
    var ymId = analytics.yandexMetrikaId;
    var gaId = analytics.googleAnalyticsId;
    var adsId = analytics.googleAdsId;

    if (ymId) {
      var ymTagUrl = 'https://mc.yandex.ru/metrika/tag.js?id=' + encodeURIComponent(String(ymId));
      (function (m, e, t, r, i, k, a) {
        m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); };
        m[i].l = 1 * new Date();
        for (var j = 0; j < document.scripts.length; j++) {
          if (document.scripts[j].src === r) return;
        }
        k = e.createElement(t);
        a = e.getElementsByTagName(t)[0];
        k.async = 1;
        k.src = r;
        a.parentNode.insertBefore(k, a);
      })(window, document, 'script', ymTagUrl, 'ym');

      window.ym(Number(ymId) || ymId, 'init', {
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
        webvisor: true,
        ecommerce: 'dataLayer'
      });

      function appendMetrikaNoscript() {
        if (document.getElementById('ym-noscript-' + ymId)) return;
        var noscript = document.createElement('noscript');
        noscript.id = 'ym-noscript-' + ymId;
        noscript.innerHTML = '<div><img src="https://mc.yandex.ru/watch/' + ymId + '" style="position:absolute;left:-9999px;" alt=""></div>';
        (document.body || document.documentElement).appendChild(noscript);
      }

      if (document.body) appendMetrikaNoscript();
      else document.addEventListener('DOMContentLoaded', appendMetrikaNoscript);
    }

    if (gaId || adsId) {
      var gtagScript = document.createElement('script');
      gtagScript.async = true;
      gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(gaId || adsId);
      document.head.appendChild(gtagScript);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      if (gaId) window.gtag('config', gaId, { anonymize_ip: true });
      if (adsId) window.gtag('config', adsId);
    }
  }

  function initLogoScroll() {
    var logo = document.querySelector('[data-scroll-top]');
    if (!logo) return;
    logo.addEventListener('click', function (e) {
      e.preventDefault();
      scrollWindowTop(false);
      if (history.replaceState) {
        history.replaceState(null, '', getPagePath());
      }
    });
  }

  function initDeferredOrderScroll() {
    var env = getEnv();
    var shouldScroll = env.storageGet
      ? env.storageGet('osago-scroll-order') === '1'
      : null;

    if (!shouldScroll) {
      try {
        shouldScroll = sessionStorage.getItem('osago-scroll-order') === '1';
      } catch (e) {}
    }

    if (!shouldScroll) return;

    if (env.storageRemove) {
      env.storageRemove('osago-scroll-order');
    } else {
      try {
        sessionStorage.removeItem('osago-scroll-order');
      } catch (e) {}
    }

    scrollToOrderTarget({ instant: true });
  }

  initAnalytics();

  document.addEventListener('DOMContentLoaded', function () {
    initScrollLinks();
    initEngagementTracking();
    initMobileMenu();
    initPolicyCheck();
    initLogoScroll();
    initOrderWidgetPreload();
    initOrderIframeLazyLoad();
    initMobileStickyCta();
    initDeferredOrderScroll();
  });
})();
