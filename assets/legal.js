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
    return {
      entityName: legal.entityName || '',
      inn: legal.inn || '',
      ogrn: legal.ogrn || '',
      address: legal.address || '',
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

  function buildOperatorHtml(options) {
    options = options || {};
    var legal = getLegalConfig();
    var parts = [];
    var html = '';

    html += '<p class="' + (options.titleClass || '') + '"><strong>Оператор сайта';
    if (legal.entityName) {
      html += ' — ' + escapeHtml(legal.entityName);
    }
    html += '</strong></p>';

    if (legal.role) {
      html += '<p class="' + (options.textClass || '') + '">' + escapeHtml(legal.role) + '</p>';
    }

    if (legal.inn) parts.push('ИНН ' + escapeHtml(legal.inn));
    if (legal.ogrn) parts.push('ОГРН/ОГРНИП ' + escapeHtml(legal.ogrn));
    if (legal.address) parts.push(escapeHtml(legal.address));

    if (parts.length) {
      html += '<p class="' + (options.textClass || '') + '">' + parts.join(' · ') + '</p>';
    } else if (options.showConfigHint) {
      html += '<p class="' + (options.hintClass || '') + '">Полные реквизиты (наименование, ИНН, ОГРН) указываются в файле <code>assets/site.config.js</code> в блоке <code>legal</code>.</p>';
    }

    html += '<p class="' + (options.textClass || '') + '">Контакты оператора: ';
    html += '<a href="tel:' + escapeHtml(legal.phone) + '">' + escapeHtml(formatPhoneDisplay(legal.phone)) + '</a>, ';
    html += '<a href="mailto:' + escapeHtml(legal.email) + '">' + escapeHtml(legal.email) + '</a>';
    html += '</p>';

    return html;
  }

  window.renderSiteLegal = function (targetId, options) {
    var el = document.getElementById(targetId);
    if (!el) return;
    el.innerHTML = buildOperatorHtml(options || {});
  };
})(window);
