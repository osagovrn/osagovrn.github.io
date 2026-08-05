(function (window, document) {
  'use strict';

  /* =========================================================================
     АДМИНКА САЙТА — ВСПЛЫВАЮЩЕЕ ОБЪЯВЛЕНИЕ
     Как этим пользоваться — см. файл "ИНСТРУКЦИЯ К АДМИНКЕ" в папке ПРОЧЕЕ.

     Редактируйте ТОЛЬКО значения ниже, между кавычками ' '.
     Ничего в фигурных скобках { } или в коде ниже трогать не нужно.

     enabled     — true  = объявление показывается на сайте
                   false = объявление ВООБЩЕ не появляется на сайте
     id          — метка текста. При КАЖДОМ изменении текста меняйте id
                   на любое другое слово (например site-off-1 -> site-off-2).
                   Без этого те, кто уже закрыл старое объявление,
                   не увидят новое.
     title       — заголовок окна
     text        — сам текст объявления (можно писать даты, числа — как угодно)
     buttonText  — надпись на зелёной кнопке
     startDate   — необязательно. Формат "2026-08-05". С какого дня показывать
     endDate     — необязательно. Формат "2026-08-15". До какого дня показывать
     ========================================================================= */
  window.SITE_ANNOUNCEMENT = {
    enabled: false,
    id: 'site-off-1',
    title: 'Сайт временно не работает',
    text: 'Ведутся технические работы. Сайт снова заработает в обычном режиме в ближайшее время. Приносим изинения за неудобства.',
    buttonText: 'Понятно',
    startDate: '',
    endDate: ''
  };

  /* ========================= Дальше — логика, не трогать ========================= */

  var DISMISS_KEY = 'osago-announcement-dismissed';
  var SHOWN_KEY = 'osago-announcement-shown-session';

  function parseDate(str) {
    if (!str) return null;
    var d = new Date(str + 'T00:00:00');
    return isNaN(d.getTime()) ? null : d;
  }

  function withinDateRange(cfg) {
    var now = new Date();
    var start = parseDate(cfg.startDate);
    var end = parseDate(cfg.endDate);
    if (start && now < start) return false;
    if (end) {
      var endOfDay = new Date(end.getTime());
      endOfDay.setHours(23, 59, 59, 999);
      if (now > endOfDay) return false;
    }
    return true;
  }

  function alreadyDismissed(id) {
    try {
      return localStorage.getItem(DISMISS_KEY) === id;
    } catch (e) {
      return false;
    }
  }

  function markDismissed(id) {
    try {
      localStorage.setItem(DISMISS_KEY, id);
    } catch (e) {}
  }

  // Показываем один раз за визит — на той странице, куда человек зашёл первой.
  // При переходе на другие страницы сайта в рамках того же визита
  // объявление повторно не всплывает (даже если его не закрывали кнопкой).
  function alreadyShownThisVisit(id) {
    try {
      return sessionStorage.getItem(SHOWN_KEY) === id;
    } catch (e) {
      return false;
    }
  }

  function markShownThisVisit(id) {
    try {
      sessionStorage.setItem(SHOWN_KEY, id);
    } catch (e) {}
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function render(cfg) {
    var overlay = document.createElement('div');
    overlay.className = 'announce-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'announce-title');

    var safeTitle = escapeHtml(cfg.title || '');
    var safeText = escapeHtml(cfg.text || '').replace(/\n/g, '<br>');
    var safeBtn = escapeHtml(cfg.buttonText || 'Понятно');

    overlay.innerHTML =
      '<div class="announce-card">' +
        '<button type="button" class="announce-close" aria-label="Закрыть объявление">' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
          '<span>Закрыть</span>' +
        '</button>' +
        '<h3 id="announce-title" class="announce-title">' + safeTitle + '</h3>' +
        '<p class="announce-text">' + safeText + '</p>' +
        '<button type="button" class="announce-ok">' + safeBtn + '</button>' +
      '</div>';

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    function close() {
      markDismissed(cfg.id);
      overlay.remove();
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeydown);
    }

    function onKeydown(e) {
      if (e.key === 'Escape') close();
    }

    // Клик мимо карточки, крестик, кнопка "Понятно" и клавиша Esc —
    // любой из этих способов спокойно закрывает окно, сайт остаётся доступен.
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });
    overlay.querySelector('.announce-close').addEventListener('click', close);
    overlay.querySelector('.announce-ok').addEventListener('click', close);
    document.addEventListener('keydown', onKeydown);

    overlay.querySelector('.announce-ok').focus();
  }

  function init() {
    var cfg = window.SITE_ANNOUNCEMENT;
    if (!cfg || !cfg.enabled) return; // выключено — вообще ничего не показываем
    if (!cfg.id || !cfg.text) return;
    if (!withinDateRange(cfg)) return;
    if (alreadyDismissed(cfg.id)) return;
    if (alreadyShownThisVisit(cfg.id)) return;
    markShownThisVisit(cfg.id);
    render(cfg);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(window, document);
