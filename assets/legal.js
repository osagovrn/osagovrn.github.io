(function (window) {
  'use strict';

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function getLegalConfig() {
    var cfg = window.SITE || {};
    var legal = cfg.legal || {};
    var status = legal.status || 'self_employed';
    return {
      status: status,
      entityName: legal.entityName || '',
      inn: legal.inn || '',
      ogrn: legal.ogrn || '',
      address: legal.address || '',
      addressNote: legal.addressNote || '',
      role: legal.role || 'Консультации и помощь в оформлении полисов ОСАГО и КАСКО. Сайт не является страховой компанией.',
      phone: legal.phone || '+79507678575',
      email: legal.email || '2020yvwvy2020@gmail.com'
    };
  }

  function formatPhoneDisplay(phone) {
    var digits = String(phone).replace(/\D/g, '');
    if (digits.length === 11 && digits.charAt(0) === '7') {
      return '8 (' + digits.slice(1, 4) + ') ' + digits.slice(4, 7) + '-' + digits.slice(7, 9) + '-' + digits.slice(9, 11);
    }
    return phone;
  }

  function statusLabel(status) {
    if (status === 'self_employed') return 'самозанятый (плательщик НПД)';
    if (status === 'ip') return 'индивидуальный предприниматель';
    if (status === 'ooo') return 'юридическое лицо';
    return '';
  }

  function buildOperatorHtml(options) {
    options = options || {};
    var legal = getLegalConfig();
    var parts = [];
    var html = '';
    var label = statusLabel(legal.status);
    var hasPublicId = !!(legal.entityName || legal.inn);

    html += '<p class="' + (options.titleClass || '') + '"><strong>Оператор сайта';
    if (legal.entityName) {
      html += ' — ' + escapeHtml(legal.entityName);
    }
    html += '</strong>';
    if (label) {
      html += ' <span class="' + (options.textClass || '') + '">(' + escapeHtml(label) + ')</span>';
    }
    html += '</p>';

    if (legal.role) {
      html += '<p class="' + (options.textClass || '') + '">' + escapeHtml(legal.role) + '</p>';
    }

    if (legal.inn) parts.push('ИНН ' + escapeHtml(legal.inn));
    if (legal.ogrn) {
      if (legal.status === 'ip') parts.push('ОГРНИП ' + escapeHtml(legal.ogrn));
      else if (legal.status !== 'self_employed') parts.push('ОГРН ' + escapeHtml(legal.ogrn));
    }
    if (legal.address) {
      var addressLine = escapeHtml(legal.address);
      if (legal.addressNote) {
        addressLine += ' (' + escapeHtml(legal.addressNote) + ')';
      }
      parts.push(addressLine);
    }

    if (parts.length) {
      html += '<p class="' + (options.textClass || '') + '">' + parts.join(' · ') + '</p>';
    }

    if (!hasPublicId) {
      html += '<p class="' + (options.hintClass || options.textClass || '') + '">';
      html += 'ФИО и ИНН оператора не публикуются на сайте в целях защиты от злоупотреблений. ';
      html += 'По законному запросу субъекта персональных данных или уполномоченного органа данные предоставляются по контактам ниже.';
      html += '</p>';
    }

    html += '<p class="' + (options.textClass || '') + '">Контакты оператора: ';
    html += '<a href="tel:' + escapeHtml(legal.phone) + '">' + escapeHtml(formatPhoneDisplay(legal.phone)) + '</a>, ';
    html += '<a href="mailto:' + escapeHtml(legal.email) + '">' + escapeHtml(legal.email) + '</a>';
    html += '</p>';

    html += '<p class="' + (options.hintClass || options.textClass || '') + '">';
    html += 'Находясь на сайте и продолжая им пользоваться, вы соглашаетесь с обработкой персональных данных и использованием cookie, в том числе Яндекс.Метрики (включая Вебвизор), на условиях ';
    html += '<a href="privacy.html">политики конфиденциальности</a>. ';
    html += 'Информация на сайте носит ознакомительный характер и не является публичной офертой (ст.&nbsp;437 ГК РФ).';
    html += '</p>';

    return html;
  }

  window.renderSiteLegal = function (targetId, options) {
    var el = document.getElementById(targetId);
    if (!el) return;
    el.innerHTML = buildOperatorHtml(options || {});
  };
})(window);
