/**
 * osago-inostrancam-i18n.js
 * Переводы страницы-гида «ОСАГО для иностранцев»
 * Языки: ru (по умолчанию), en, uz, tg, kk
 *
 * Использование: все переводимые элементы в HTML имеют data-i18n="key"
 * Скрипт при загрузке заменяет textContent на перевод из LANG[key]
 */
(function (window, document) {
  'use strict';

  var LANGS = {
    ru: {
      langName: 'Русский',
      langFlag: '🇷🇺',
      pageTitle: 'ОСАГО для иностранных граждан — гид по оформлению в России',
      pageDesc: 'Подробная инструкция для иностранных граждан: как оформить ОСАГО в России, какие документы нужны, как пользоваться онлайн-калькулятором.',
      heading: 'ОСАГО для иностранных граждан',
      subheading: 'Пошаговая инструкция по оформлению полиса ОСАГО в России для иностранных граждан',
      navHome: 'На главную',
      navOrder: 'Оформить ОСАГО',

      // Кто может
      whoTitle: 'Кто может оформить ОСАГО в России',
      whoIntro: 'Обязательное страхование автогражданской ответственности (ОСАГО) должны оформлять все владельцы транспортных средств, зарегистрированных в России, независимо от гражданства.',
      whoEaes: 'Граждане стран ЕАЭС (Евразийский экономический союз)',
      whoEaesList: 'Беларусь, Казахстан, Армения, Кыргызстан. Водительские удостоверения этих стран признаются в России без обмена. Оформление ОСАГО — на общих основаниях.',
      whoOther: 'Граждане других стран',
      whoOtherList: 'Оформить ОСАГО можно, но потребуется: иностранный паспорт, водительское удостоверение (признаваемое в РФ — см. ниже), документы на автомобиль (СТС/ПТС) и временная регистрация или вид на жительство в России.',
      whoImportant: 'Важно: автомобиль должен быть зарегистрирован в России. Для автомобилей на иностранных номерах нужна «Зелёная карта» или оформление в стране регистрации ТС.',

      // Документы
      docsTitle: 'Какие документы нужны',
      docsPassport: 'Паспорт',
      docsPassportText: 'Российский или иностранный паспорт. При оформлении онлайн через калькулятор выберите тип документа «Иностранный паспорт».',
      docsVu: 'Водительское удостоверение (ВУ)',
      docsVuText: 'Российское ВУ — принимается без ограничений. Иностранное ВУ — принимается, если страна выдала его по Венской конвенции 1968 года (большинство стран Европы и СНГ). Для стран вне конвенции может потребоваться международное ВУ (МВУ) или обмен на российское.',
      docsVuNote: 'Центробанк РФ подтвердил: страховщики обязаны оформлять ОСАГО водителям с иностранными ВУ на тех же условиях, что и с российскими.',
      docsCar: 'Документы на автомобиль',
      docsCarText: 'Свидетельство о регистрации ТС (СТС) или паспорт транспортного средства (ПТС). Автомобиль должен быть зарегистрирован в РФ.',
      docsReg: 'Регистрация в России',
      docsRegText: 'Временная регистрация (миграционная карта с отметкой) или вид на жительство (ВНЖ). Без регистрации в РФ онлайн-оформление через виджет невозможно.',

      // Как оформить
      stepsTitle: 'Как оформить ОСАГО (3 шага)',
      stepsIntro: 'Оформление через онлайн-калькулятор на нашем сайте. Виджет на русском языке — если вам нужна помощь, позвоните нам, мы поможем по телефону.',
      step1Title: 'Заполните калькулятор',
      step1Text: 'Введите данные автомобиля (госномер или VIN), ваш паспорт и водительское удостоверение. Сканы загружать не нужно — всё вводится вручную.',
      step1Note: 'Совет: номер автомобиля вводите на русской раскладке клавиатуры (А, В, Е, К, М, Н, О, Р, С, Т, У, Х).',
      step2Title: 'Выберите тариф и оплатите',
      step2Text: 'Система покажет предложения страховых компаний. Выберите подходящий тариф и оплатите картой. Электронный полис придёт на e-mail.',
      step3Title: 'Не получилось? Напишите или позвоните',
      step3Text: 'Если виджет не принял документы или появилась ошибка — позвоните или напишите нам. Мы поможем оформить вручную.',
      step3Phone: 'Позвонить',
      step3Telegram: 'Написать в Telegram',
      step3Email: 'Написать на почту',

      // Переводчик
      translateTitle: 'Как перевести страницу на свой язык',
      translateIntro: 'Виджет ОСАГО работает только на русском языке. Но вы можете использовать встроенный переводчик браузера, чтобы перевести текст на этой странице:',
      translateChrome: 'Google Chrome / Яндекс Браузер',
      translateChromeSteps: 'Нажмите правую кнопку мыши на странице → выберите «Перевести на [язык]» в появившемся меню. Или: нажмите на иконку перевода 💬 в адресной строке.',
      translateSafari: 'Safari (iPhone / Mac)',
      translateSafariSteps: 'Нажмите на кнопку «аа» в адресной строке → выберите «Translate to [language]».',
      translateEdge: 'Microsoft Edge',
      translateEdgeSteps: 'Нажмите правую кнопку мыши → «Перевести на [язык]». Или нажмите иконку перевода в адресной строке.',

      // Ограничения
      limitsTitle: 'Важные ограничения',
      limits1: 'Вероятность одобрения полиса по иностранным документам ниже, чем по российским. Это связано с особенностями автоматической проверки документов страховыми компаниями.',
      limits2: 'Без временной регистрации или ВНЖ в России онлайн-оформление невозможно — система не пропустит.',
      limits3: 'Автомобиль должен быть зарегистрирован в РФ. Для машин с иностранными номерами ОСАГО не оформляется — нужна «Зелёная карта».',
      limits4: 'Водительские удостоверения стран, не входящих в Венскую конвенцию 1968 года, могут не приниматься онлайн. В этом случае обращайтесь к нам — поможем разобраться.',

      // FAQ
      faqTitle: 'Частые вопросы',
      faq1q: 'Могу ли я оформить ОСАГО без российского паспорта?',
      faq1a: 'Да. Для онлайн-оформления через виджет выберите тип документа «Иностранный паспорт». У вас должна быть временная регистрация или ВНЖ в России.',
      faq2q: 'Моё водительское удостоверение (другой страны) подойдёт?',
      faq2a: 'Если ваша страна участвует в Венской конвенции о дорожном движении 1968 года (большинство стран СНГ, Европы и многие другие) — да, ваше национальное ВУ подойдёт. Для других стран может потребоваться международное ВУ.',
      faq3q: 'Сколько стоит ОСАГО?',
      faq3a: 'Стоимость зависит от региона, мощности двигателя, стажа водителей и бонуса-малуса (КБМ). Пример: для легкового автомобиля B-класса с 1 водителем в регионе III — от ~4 200 ₽. Точную стоимость покажет калькулятор.',
      faq4q: 'Сколько времени занимает оформление?',
      faq4a: 'Около 60 минут при самостоятельном заполнении. Если возникнут сложности — звоните, поможем.',
      faq5q: 'Что делать, если виджет не принимает мои документы?',
      faq5a: 'Позвоните или напишите нам — мы поможем оформить полис вручную через страховую компанию. Телефон и Telegram указаны выше.',
      faq6q: 'Нужна ли «Зелёная карта»?',
      faq6a: '«Зелёная карта» нужна для автомобиля, зарегистрированного за рубежом и временно въезжающего в Россию. Если ваш автомобиль зарегистрирован в РФ — вам нужно российское ОСАГО.',
      faq7q: 'Можно ли оформить КАСКО?',
      faq7a: 'Да, КАСКО оформляется добровольно. Условия и стоимость зависят от страховой компании. Напишите нам для подбора тарифа.',

      // CTA
      ctaTitle: 'Нужна помощь с оформлением?',
      ctaText: 'Позвоните или напишите — работаем дистанционно по всей России. Поможем оформить ОСАГО даже если онлайн-калькулятор не принял документы.',
      ctaPhone: '8 (950) 767-85-75',
      ctaTelegram: 'Написать в Telegram',
      ctaEmail: 'Написать на почту',

      // Footer
      footerNote: 'Сайт не является страховой компанией. Договор страхования заключается с лицензированной страховой организацией через партнёрскую платформу.',
      footerPrivacy: 'Политика конфиденциальности',
      footerCopy: '© 2026 Страхование ОСАГО / КАСКО. Все права защищены.',

      // Переключатель
      switchLabel: 'Язык:'
    },

    en: {
      langName: 'English',
      langFlag: '🇬🇧',
      pageTitle: 'OSAGO for foreign citizens — guide to getting car insurance in Russia',
      pageDesc: 'Step-by-step guide for foreign citizens: how to get OSAGO car insurance in Russia, required documents, and how to use the online calculator.',
      heading: 'OSAGO for Foreign Citizens',
      subheading: 'A step-by-step guide to getting compulsory motor insurance in Russia for foreign citizens',
      navHome: 'Home',
      navOrder: 'Get OSAGO',

      whoTitle: 'Who can get OSAGO in Russia',
      whoIntro: 'Compulsory motor third-party liability insurance (OSAGO) is required for all vehicle owners registered in Russia, regardless of citizenship.',
      whoEaes: 'Citizens of EAEU countries (Eurasian Economic Union)',
      whoEaesList: 'Belarus, Kazakhstan, Armenia, Kyrgyzstan. Driver\'s licenses from these countries are recognized in Russia without exchange. OSAGO is issued on standard terms.',
      whoOther: 'Citizens of other countries',
      whoOtherList: 'You can get OSAGO, but you will need: a foreign passport, a driver\'s license recognized in Russia (see below), vehicle registration documents (STS/PTS), and temporary registration or a residence permit in Russia.',
      whoImportant: 'Important: the vehicle must be registered in Russia. For vehicles with foreign license plates, you need a "Green Card" or insurance from the country of registration.',

      docsTitle: 'Required Documents',
      docsPassport: 'Passport',
      docsPassportText: 'Russian or foreign passport. When applying online through the calculator, select "Foreign passport" as the document type.',
      docsVu: 'Driver\'s License',
      docsVuText: 'Russian license — accepted without restrictions. Foreign license — accepted if issued by a country that is a party to the 1968 Vienna Convention on Road Traffic (most European and CIS countries). For non-convention countries, an International Driving Permit (IDP) or exchange for a Russian license may be required.',
      docsVuNote: 'The Central Bank of Russia has confirmed: insurers are required to issue OSAGO to drivers with foreign licenses on the same terms as Russian license holders.',
      docsCar: 'Vehicle Documents',
      docsCarText: 'Vehicle Registration Certificate (STS) or Vehicle Passport (PTS). The vehicle must be registered in Russia.',
      docsReg: 'Registration in Russia',
      docsRegText: 'Temporary registration (migration card with stamp) or residence permit. Without registration in Russia, online application through the widget is not possible.',

      stepsTitle: 'How to Get OSAGO (3 Steps)',
      stepsIntro: 'Apply through the online calculator on our website. The widget is in Russian — if you need help, call us and we\'ll assist by phone.',
      step1Title: 'Fill in the Calculator',
      step1Text: 'Enter your vehicle data (license plate or VIN), passport, and driver\'s license. No scanned documents needed — enter everything manually.',
      step1Note: 'Tip: enter the vehicle license plate using the Russian keyboard layout (А, В, Е, К, М, Н, О, Р, С, Т, У, Х).',
      step2Title: 'Choose a Plan and Pay',
      step2Text: 'The system will show offers from insurance companies. Select a suitable plan and pay by card. The electronic policy will be sent to your email.',
      step3Title: 'Didn\'t Work? Contact Us',
      step3Text: 'If the widget didn\'t accept your documents or an error appeared — call or message us. We\'ll help you apply manually.',
      step3Phone: 'Call',
      step3Telegram: 'Message on Telegram',
      step3Email: 'Send email',

      translateTitle: 'How to Translate This Page',
      translateIntro: 'The OSAGO widget only works in Russian. However, you can use your browser\'s built-in translator to translate the text on this page:',
      translateChrome: 'Google Chrome / Yandex Browser',
      translateChromeSteps: 'Right-click anywhere on the page → select "Translate to [language]" from the menu. Or click the translation icon 💬 in the address bar.',
      translateSafari: 'Safari (iPhone / Mac)',
      translateSafariSteps: 'Tap the "аа" button in the address bar → select "Translate to [language]".',
      translateEdge: 'Microsoft Edge',
      translateEdgeSteps: 'Right-click → "Translate to [language]". Or click the translation icon in the address bar.',

      limitsTitle: 'Important Limitations',
      limits1: 'The approval rate for policies with foreign documents is lower than for Russian documents. This is due to the specifics of automated document verification by insurance companies.',
      limits2: 'Without temporary registration or a residence permit in Russia, online application is not possible — the system will not allow it.',
      limits3: 'The vehicle must be registered in Russia. OSAGO cannot be issued for vehicles with foreign license plates — you need a "Green Card".',
      limits4: 'Driver\'s licenses from countries not party to the 1968 Vienna Convention may not be accepted online. In this case, contact us — we\'ll help figure it out.',

      faqTitle: 'Frequently Asked Questions',
      faq1q: 'Can I get OSAGO without a Russian passport?',
      faq1a: 'Yes. For online application through the widget, select "Foreign passport" as the document type. You must have temporary registration or a residence permit in Russia.',
      faq2q: 'Will my foreign driver\'s license work?',
      faq2a: 'If your country participates in the 1968 Vienna Convention on Road Traffic (most CIS, European, and many other countries) — yes, your national license will work. For other countries, an International Driving Permit may be required.',
      faq3q: 'How much does OSAGO cost?',
      faq3a: 'The cost depends on the region, engine power, driving experience, and bonus-malus coefficient (KBM). Example: for a B-class sedan with 1 driver in region III — from ~4,200 ₽. The calculator will show the exact price.',
      faq4q: 'How long does it take?',
      faq4a: 'About 60 minutes if you fill it out yourself. If you have difficulties — call us, we\'ll help.',
      faq5q: 'What if the widget doesn\'t accept my documents?',
      faq5a: 'Call or message us — we\'ll help you get the policy manually through an insurance company. Phone and Telegram are listed above.',
      faq6q: 'Do I need a "Green Card"?',
      faq6a: 'A "Green Card" is needed for a vehicle registered abroad and temporarily entering Russia. If your vehicle is registered in Russia — you need Russian OSAGO.',
      faq7q: 'Can I get CASCO insurance?',
      faq7a: 'Yes, CASCO is optional. Terms and pricing depend on the insurance company. Message us to find a suitable plan.',

      ctaTitle: 'Need Help with Your Application?',
      ctaText: 'Call or message us — we work remotely across all of Russia. We\'ll help you get OSAGO even if the online calculator didn\'t accept your documents.',
      ctaPhone: '8 (950) 767-85-75',
      ctaTelegram: 'Message on Telegram',
      ctaEmail: 'Send email',

      footerNote: 'This website is not an insurance company. The insurance contract is concluded with a licensed insurer through a partner platform.',
      footerPrivacy: 'Privacy Policy',
      footerCopy: '© 2026 OSAGO / CASCO Insurance. All rights reserved.',

      switchLabel: 'Language:'
    },

    uz: {
      langName: 'O\'zbekcha',
      langFlag: '🇺🇿',
      pageTitle: 'Chet ell fuqarolari uchun OSAGO — Rossiyada sug\'urta polisini rasmiylashtirish bo\'yicha qo\'llanma',
      pageDesc: 'Chet ell fuqarolari uchun batafsil ko\'rsatma: Rossiyada OSAGO qanday rasmiylashtiriladi, qanday hujjatlar kerak va onlayn-kalkulyatordan qanday foydalanish kerak.',
      heading: 'Chet ell fuqarolari uchun OSAGO',
      subheading: 'Rossiyada avtomobil sug\'urtasi (OSAGO) rasmiylashtirish bo\'yicha chet ell fuqarolari uchun bosqichma-bosqich ko\'rsatma',
      navHome: 'Bosh sahifa',
      navOrder: 'OSAGO rasmiylashtirish',

      whoTitle: 'Rossiyada OSAGO kimlarga rasmiylashtirilsa bo\'ladi',
      whoIntro: 'Majburiy avtomobil javobgarlik sug\'urtasi (OSAGO) Rossiyada ro\'yxatdan o\'tgan barcha avtomobil egalari uchun, fuqaroligidan qat\'i nazar, majburiydir.',
      whoEaes: 'Yevrosiyo Iqtisodiy Ittifoqi (YEII) davlatlari fuqarolari',
      whoEaesList: 'Belarus, Qozog\'iston, Armaniston, Qirg\'iziston. Bu davlatlarning haydovchilik guvohnomalari Rossiyada almashtirilmasdan tan olinadi. OSAGO umumiy asosda beriladi.',
      whoOther: 'Boshqa davlatlar fuqarolari',
      whoOtherList: 'OSAGO rasmiylashtirish mumkin, lekin quyidagilar kerak: chet el pasporti, Rossiyada tan olinadigan haydovchilik guvohnomasi (quyida qarang), avtomobil hujjatlari (STS/PTS) va Rossiyada vaqtinchalik ro\'yxatdan o\'tish yoki yashash ruxsatnomasi.',
      whoImportant: 'Muhim: avtomobil Rossiyada ro\'yxatdan o\'tilgan bo\'lishi kerak. Chet el raqamli avtomobillar uchun «Yashil karta» yoki ro\'yxatdan o\'tilgan davlatda sug\'urta kerak.',

      docsTitle: 'Kerakli hujjatlar',
      docsPassport: 'Pasport',
      docsPassportText: 'Rossiyalik yoki chet el pasporti. Onlayn rasmiylashtirishda kalkulyatorda hujjat turini «Chet el pasporti» deb tanlang.',
      docsVu: 'Haydovchilik guvohnomasi',
      docsVuText: 'Rossiyalik guvohnoma — cheklanmarsdan qabul qilinadi. Chet el guvohnomasi — mamlakat 1968-yilgi Vena konventsiyasi a\'zosi bo\'lsa qabul qilinadi (ko\'p Yevropa va MDH davlatlari). Boshqa davlatlar uchun xalqaro haydovchilik guvohnomasi (XHG) yoki rossiyalikga almashtirish kerak bo\'lishi mumkin.',
      docsVuNote: 'Rossiya Markaziy Banki tasdiqladi: sug\'urta kompaniyalari chet el guvohnomasi bo\'lgan haydovchilarga rossiyalik guvohnomasi bilan bir xil shartlarda OSAGO berishlari shart.',
      docsCar: 'Avtomobil hujjatlari',
      docsCarText: 'Transport vositasi ro\'yxat guvohnomasi (STS) yoki transport pasporti (PTS). Avtomobil Rossiyada ro\'yxatdan o\'tilgan bo\'lishi kerak.',
      docsReg: 'Rossiyada ro\'yxatdan o\'tish',
      docsRegText: 'Vaqtinchalik ro\'yxatdan o\'tish (migratsiya kartasidagi belgi) yoki yashash ruxsatnomasi. Rossiyada ro\'yxatsiz onlayn rasmiylashtirish imkoni yo\'q.',

      stepsTitle: 'OSAGO qanday rasmiylashtiriladi (3 bosqich)',
      stepsIntro: 'Saytimizdagi onlayn-kalkulyator orqali rasmiylashtiring. Vidjet rus tilida — agar yordam kerak bo\'lsa, telefon qiling, telefon orqali yordam beramiz.',
      step1Title: 'Kalkulyatorni to\'ldiring',
      step1Text: 'Avtomobil ma\'lumotlarini ( davlat raqami yoki VIN), pasport va haydovchilik guvohnomasini kiriting. Skanirlangan hujjatlar kerak emas — hammasini qo\'lda kiriting.',
      step1Note: 'Maslahat: avtomobil davlat raqamini rus tilidagi klaviatura tartibida kiriting (А, В, Е, К, М, Н, О, Р, С, Т, У, Х).',
      step2Title: 'Tarifni tanlang va to\'lang',
      step2Text: 'Tizim sug\'urta kompaniyalarining takliflarini ko\'rsatadi. Mos tarifni tanlang va kartadan to\'lang. Elektron polis e-mail manzilingizga yuboriladi.',
      step3Title: 'Bo\'lmadimi? Yozing yoki qo\'ng\'iroq qiling',
      step3Text: 'Agar vidjet hujjatlaringizni qabul qilmadi yoki xatolik chiqdi — qo\'ng\'iroq qiling yoki yozing. Qo\'lda rasmiylashtirishga yordam beramiz.',
      step3Phone: 'Qo\'ng\'iroq qilish',
      step3Telegram: 'Telegram orqali yozish',
      step3Email: 'E-mail orqali yozish',

      translateTitle: 'Sahifani qanday tarjima qilish',
      translateIntro: 'OSAGO vidjeti faqat rus tilida ishlaydi. Lekin sahifadagi matnni brauzer ning ichki tarjimonidan foydalanib tarjima qilishingiz mumkin:',
      translateChrome: 'Google Chrome / Yandex Brauzer',
      translateChromeSteps: 'Sahifada sichqonchaning o\'ng tugmasini bosing → paydo bo\'lgan menuda «Tarjima qilish» ni tanlang. Yoki manzil panelidagi tarjima ikonasini bosing.',
      translateSafari: 'Safari (iPhone / Mac)',
      translateSafariSteps: 'Manzil panelidagi «аа» tugmasini bosing → «Tarjima qilish» ni tanlang.',
      translateEdge: 'Microsoft Edge',
      translateEdgeSteps: 'O\'ng tugmani bosing → «Tarjima qilish». Yoki manzil panelidagi tarjima ikonasini bosing.',

      limitsTitle: 'Muhim cheklovlar',
      limits1: 'Chet el hujjatlari bilan polis tasdiqlanish ehtimoli rossiyalik hujjatlar bilan solishtirganda pastroq. Bu sug\'urta kompaniyalarining avtomatik hujjat tekshirish xususiyatlari bilan bog\'liq.',
      limits2: 'Rossiyada vaqtinchalik ro\'yxat yoki yashash ruxsatnomasisiz onlayn rasmiylashtirish imkoni yo\'q — tizim o\'tkazmaydi.',
      limits3: 'Avtomobil Rossiyada ro\'yxatdan o\'tilgan bo\'lishi kerak. Chet el raqamli avtomobillar uchun OSAGO berilmaydi — «Yashil karta» kerak.',
      limits4: '1968-yilgi Vena konventsiyasida ishtirok etmagan davlatlarning haydovchilik guvohnomalari onlayn qabul qilinmasligi mumkin. Bunday hollarda bizga murojaat qiling — yordam beramiz.',

      faqTitle: 'Tez-tez so\'raladigan savollar',
      faq1q: 'Rossiya pasportisiz OSAGO rasmiylashtirishim mumkinmi?',
      faq1a: 'Ha. Onlayn rasmiylashtirishda kalkulyatorda hujjat turini «Chet el pasporti» deb tanlang. Rossiyada vaqtinchalik ro\'yxat yoki yashash ruxsatnomasi bo\'lishi kerak.',
      faq2q: 'Mening chet el haydovchilik guvohnomam mosadami?',
      faq2a: 'Agar mamlakatingiz 1968-yilgi Vena konventsiyasida ishtirok etsa (ko\'p MDH, Yevropa va boshqa davlatlar) — ha, milliy guvohnomangiz mos keladi. Boshqa davlatlar uchun xalqaro haydovchilik guvohnomasi kerak bo\'lishi mumkin.',
      faq3q: 'OSAGO narxi qancha?',
      faq3a: 'Narx hudud, dvigatel kuchi, tajriba va bonus-malus koeffitsientiga (KBM) bog\'liq. Misol: B-sinf avtomobil, 1 haydovchi, III hudud uchun — ~4 200 ₽ dan. Kalkulyator aniq narxni ko\'rsatadi.',
      faq4q: 'Rasmiylashtirish qancha vaqt oladi?',
      faq4a: 'Mustaqil to\'ldirishda taxminan 60 daqiqa. Agar qiyinchilik bo\'lsa — qo\'ng\'iroq qiling, yordam beramiz.',
      faq5q: 'Vidjet hujjatlaringizni qabul qilmasa nima qilishim kerak?',
      faq5a: 'Bizga qo\'ng\'iroq qiling yoki yozing — sug\'urta kompaniyasi orqali qo\'lda rasmiylashtirishga yordam beramiz. Telefon va Telegram yuqorida ko\'rsatilgan.',
      faq6q: '«Yashil karta» kerakmi?',
      faq6a: '«Yashil karta» chet elda ro\'yxatdan o\'tgan va Rossiyaga vaqtinchalik kirayotgan avtomobil uchun kerak. Agar avtomobil Rossiyada ro\'yxatdan o\'tilgan bo\'lsa — sizga Rossiya OSAGO kerak.',
      faq7q: 'KASKO rasmiylashtirishim mumkinmi?',
      faq7a: 'Ha, KASKO ixtiyoriy. Shartlar va narx sug\'urta kompaniyasiga bog\'liq. Mos tarifni tanlash uchun bizga yozing.',

      ctaTitle: 'Rasmiylashtirishda yordam kerakmi?',
      ctaText: 'Qo\'ng\'iroq qiling yoki yozing — butun Rossiya bo\'ylab masofaviy ishlaymiz. Onlayn-kalkulyator hujjatlaringizni qabul qilmasa ham OSAGO rasmiylashtirishga yordam beramiz.',
      ctaPhone: '8 (950) 767-85-75',
      ctaTelegram: 'Telegram orqali yozish',
      ctaEmail: 'E-mail orqali yozish',

      footerNote: 'Ushbu sayt sug\'urta kompaniyasi emas. Sug\'urta shartnomasi litsenziyalangan sug\'urta kompaniyasi bilan hamkorlik platformasi orqali tuziladi.',
      footerPrivacy: 'Maxfiylik siyosati',
      footerCopy: '© 2026 OSAGO / KASKO Sug\'urta. Barcha huquqlar himoyalangan.',

      switchLabel: 'Til:'
    },

    tg: {
      langName: 'Тоҷикӣ',
      langFlag: '🇹🇯',
      pageTitle: 'OSAGO барои шаҳрвандони хориҷӣ — роҳнамо дар бораи гирифтани суғуртаи автомобил дар Русия',
      pageDesc: 'Роҳнамои муфассал барои шаҳрвандони хориҷӣ: чӣ тавр OSAGO дар Русия гирифтан, кадом ҳуҷҷатҳо лозиманд ва аз барандаи онлайн чӣ тавр истифода бурдан.',
      heading: 'OSAGO барои шаҳрвандони хориҷӣ',
      subheading: 'Роҳнамои қадам-ба-қадам барои шаҳрвандони хориҷӣ дар бораи гирифтани суғуртаи ҳатмии автомобил дар Русия',
      navHome: 'Саҳифаи асосӣ',
      navOrder: 'OSAGO гирифтан',

      whoTitle: 'Кӣ дар Русия OSAGO мегирад',
      whoIntro: 'Суғуртаи ҳатмии масъулияти граждании автомобилӣ (OSAGO) барои ҳамаи соҳибони воситаҳои нақлиёт, ки дар Русия сабти ном шудаанд, мустақиман аз шаҳрвандӣ вобаста аст, маҷбуриест.',
      whoEaes: 'Шаҳрвандони давлатҳои Иттиҳоди Иқтисодии Авруосиё (ИИА)',
      whoEaesList: 'Белорус, Қазоқистон, Арманистон, Қирғизистон. Гувоҳномаҳои навозандагонии ин давлатҳо дар Русия бидуни иваз кардан эътироф мешаванд. OSAGO дар шароити оддӣ дода мешавад.',
      whoOther: 'Шаҳрвандони дигар давлатҳо',
      whoOtherList: 'Шумо метавонед OSAGO гиред, аммо лозим аст: паспасорти хориҷӣ, гувоҳномаи навозандагӣ (дар Русия эътирофшуда — бошед), ҳуҷҷатҳои автомобил (STS/PTS) ва сабти номи муваққатӣ ё иҷозати истиқомат дар Русия.',
      whoImportant: 'Муҳим: автомобил бояд дар Русия сабти ном шуда бошад. Барои автомобилҳо бо рақамҳои хориҷӣ «Картаси сабз» ё суғурта аз давлати сабти ном лозим аст.',

      docsTitle: 'Ҳуҷҷатҳои лозимӣ',
      docsPassport: 'Паспорт',
      docsPassportText: 'Паспорти русӣ ё хориҷӣ. Ҳангоми истифода аз баранда дар навори навъи ҳуҷҷатро «Паспорти хориҷӣ» интихоб кунед.',
      docsVu: 'Гувоҳномаи навозандагӣ',
      docsVuText: 'Гувоҳномаи русӣ — бидуни маҳдудият қабул карда мешавад. Гувоҳномаи хориҷӣ — агар давлат онро мувофиқи Конвенсияи Венаи 1968 дода бошад (бисёр давлатҳои Аврупо ва ИДМ) қабул карда мешавад. Барои давлатҳои беруни конвенсия гувоҳномаи байналмилалии навозандагӣ ё иваз ба русӣ лозим аст.',
      docsVuNote: 'Бонки Марказии Русия тасдиқ кардааст: ширкатҳои суғурта вазифадоранд, ки ба навозандагон бо гувоҳномаи хориҷӣ дар шароити якхела бо гувоҳномаи русӣ OSAGO диҳанд.',
      docsCar: 'Ҳуҷҷатҳои автомобил',
      docsCarText: 'Гувоҳномаи сабти номи воситаи нақлиёт (STS) ё пасportsи воситаи нақлиёт (PTS). Автомил дар Русия сабти ном шуда бошад лозим аст.',
      docsReg: 'Сабти ном дар Русия',
      docsRegText: 'Сабти номи муваққатӣ ( нишонии корти муҳоҷират) ё иҷозати истиқомат. Бидуни сабти ном дар Русия истифода аз баранда имконнопазир аст.',

      stepsTitle: 'OSAGO чӣ тавр гирифтан (3 қадам)',
      stepsIntro: 'Аз байни барандаи онлайн дар сомонаи мо гириед. Баранда бо забони русӣ аст — агар кӯмак лозим бошад, занг занед, бо телефон кӯмак мерасонем.',
      step1Title: 'Барандаро пур кунед',
      step1Text: 'Маълумоти автомобил (рақами давлатӣ ё VIN), паспорт ва гувоҳномаи навозандагиро ворид кунед. Ҳуҷҷатҳои сканшудлар лозим нестанд — ҳаммаро ба даст ворид кунед.',
      step1Note: 'Маслиҳат: рақами автомобилро бо тартиби клавиатураи русӣ ворид кунед (А, В, Е, К, М, Н, О, Р, С, Т, У, Х).',
      step2Title: 'Тарифро интихоб кунед ва пардохт кунед',
      step2Text: 'Система пешниҳодҳои ширкатҳои суғуртаро нишон медиҳад. Тарифи мувофиқро интихоб кунед ва бо корт пардохт кунед. Полиси электронӣ ба e-mail фиристода мешавад.',
      step3Title: 'Натавонистед? Бинависед ё занг занед',
      step3Text: 'Агар баранда ҳуҷҷатҳои шуморо қабул накард ё хато пайдо шуд — занг занед ё бинависед. Бо даст кӯмак мерасонем.',
      step3Phone: 'Занг задан',
      step3Telegram: 'Дар Telegram навиштан',
      step3Email: 'Ба e-mail навиштан',

      translateTitle: 'Саҳифаро чӣ тавр тарҷума кардан',
      translateIntro: 'Барандаи OSAGO танҳо бо забони русӣ кор мекунад. Аммо шумо метавонед аз тарҷумони дарунӣи браузер истифода баред то матни саҳифаро тарҷума кунед:',
      translateChrome: 'Google Chrome / Яндекс Браузер',
      translateChromeSteps: 'Дар саҳифа тугмаи рости мушро пахш кунед → «Тарҷума кардан»-ро интихоб кунед. Ё тасвири тарҷumarо дар панҷераи суроға пахш кунед.',
      translateSafari: 'Safari (iPhone / Mac)',
      translateSafariSteps: 'Тугмаи «аа»-ро дар панҷераи суроға пахш кунед → «Translate to»-ро интихоб кунед.',
      translateEdge: 'Microsoft Edge',
      translateEdgeSteps: 'Тугмаи рости мушро пахш кунед → «Тарҷума кардан». Ё тасвири тарҷumarо дар панҷераи суроға пахш кунед.',

      limitsTitle: 'Маҳдудиятҳои муҳим',
      limits1: 'Эhtimalияти тасдиқи полис бо ҳуҷҷатҳои хориҷӣ камтар аз ҳуҷҷатҳои русӣ аст. Ин ба хусусиятҳои санҷиши автоматии ҳуҷҷатҳо аз тарафи ширкатҳои суғурта вобаста аст.',
      limits2: 'Бидуни сабти номи муваққатӣ ё иҷозати истиқомат дар Русия истифода аз баранда имконнопазир аст.',
      limits3: 'Аutomобил бояд дар Русия сабти ном шуда бошад. Барои автомобилҳо бо рақамҳои хориҷӣ OSAGO дода намешавад — «Картаси сабз» лозим аст.',
      limits4: 'Гувоҳномаҳои навозандагии давлатҳое, ки дар Конвенсияи Венаи 1968 иштирок надоранд, онлайн қабул карда намешаванд. Дар ин ҳолат ба мо муроҷиат кунед — кӯмак мерасонем.',

      faqTitle: 'Саволҳои зиёд такроршаванда',
      faq1q: 'Оё ман бидуни паспорти русӣ OSAGO гирифтан метавонам?',
      faq1a: 'Ҳа. Дар истифодаи баранда навъи ҳуҷҷатро «Паспорти хориҷӣ» интихоб кунед. Сабти номи муваққатӣ ё иҷозати истиқомат дар Русия бояд бошад.',
      faq2q: 'Оё гувоҳномаи навозандагии хориҷии ман мувофиқ аст?',
      faq2a: 'Агар давлати шумо дар Конвенсияи Венаи 1968 иштирок кунад (бисёр давлатҳои ИДМ, Аврупо ва дигарон) — ҳа, гувоҳномаи миллии шумо мувофиқ аст. Барои дигар давлатҳо гувоҳномаи байналмилалии навозандагӣ лозим аст.',
      faq3q: 'Нархи OSAGO чанд аст?',
      faq3a: 'Нарх ба ҳудуд, қудрати муҳаррик, таҷриба ва коэффитсиенти бонус-малус (KBM) вобаста аст. Мисол: барои автомобили синфи B бо 1 навозанда дар ҳудуди III — аз ~4 200 ₽. Баранда нархи дақиқро нишон медиҳад.',
      faq4q: 'Чӣ қадар вақт мехарад?',
      faq4a: 'Тақрибан 60 дақиқа агар худатон пур кунед. Агар мушкилӣ бошад — занг занед, кӯмак мерасонем.',
      faq5q: 'Агар баранда ҳуҷҷатҳои маро қабул накард чи кунам?',
      faq5a: 'Занг занед ё бинависед — бо ширкати суғурта бо даст кӯмак мерасонем. Телефон ва Telegram дар боло нишон дода шудаанд.',
      faq6q: 'Оё «Картаси сабз» лозим аст?',
      faq6a: '«Картаси сабз» барои автомобиле, ки дар хориҷ сабти ном шуда ва ба Русия вақтан дохил мешавад, лозим аст. Агар автомобили шумо дар Русия сабти ном шуда бошад — ба шумо OSAGO-и русӣ лозим аст.',
      faq7q: 'Оё KASKO гирифтан мумкин аст?',
      faq7a: 'Ҳа, KASKO ихтиёрӣ аст. Шартҳо ва нарх ба ширкати суғурта вобастаанд. Барои интихоби тариф ба мо бинависед.',

      ctaTitle: 'Кӯмак дар бораи расмиёти лозим аст?',
      ctaText: 'Занг занед ё бинависед — дар тамоми Русия масофавӣ кор мекунем. Агар барандаи онлайн ҳуҷҷатҳои шуморо қабул накард ҳам OSAGO гирифтан кӯмак мерасонем.',
      ctaPhone: '8 (950) 767-85-75',
      ctaTelegram: 'Дар Telegram навиштан',
      ctaEmail: 'Ба e-mail навиштан',

      footerNote: 'Ин сомона ширкати суғурта нест. Шартномаи суғурта бо ширкати суғуртаи дорои иҷозатнома аз платформаи ҳамкорӣ баста мешавад.',
      footerPrivacy: 'Сиёсати махфият',
      footerCopy: '© 2026 Суғуртаи OSAGO / KASKO. Ҳамаи ҳуқуқҳо ҳифз шудаанд.',

      switchLabel: 'Забон:'
    },

    kk: {
      langName: 'Қазақша',
      langFlag: '🇰🇿',
      pageTitle: 'Шетел азаматтары үшін ОСАГО — Ресейде көлік сақтандыруды рәсімдеу жөніндегі нұсқаулық',
      pageDesc: 'Шетел азаматтары үшін толық нұсқаулық: Ресейде ОСАГО қалай рәсімделеді, қандай құжаттар қажет және онлайн-калькулятordan қалай пайдалану керек.',
      heading: 'Шетел азаматтары үшін ОСАГО',
      subheading: 'Ресейде көлік сақтандыруды рәсімдеу жөніндегі шетел азаматтары үшін қадамдық нұсқаулық',
      navHome: 'Басты бет',
      navOrder: 'ОСАГО рәсімдеу',

      whoTitle: 'Ресейде ОСАГО кімдерге рәсімделуі мүмкін',
      whoIntro: 'Міндетті автокөлік азаматтық жауапкершілігін сақтандыру (ОСАГО) Ресейде тіркелген барлық көлік иелері үшін, азаматтықтан қарамастан, міндетті.',
      whoEaes: 'Еуразиялық экономикалық одақ (ЕЭО) елдерінің азаматтары',
      whoEaesList: 'Беларусь, Қазақстан, Армения, Қырғызстан. Бұл елдердің жүргізушілік куәліктері Ресейде алмассатан мойындалады. ОСАГО жалпы негізде беріледі.',
      whoOther: 'Басқа елдердің азаматтары',
      whoOtherList: 'ОСАГО рәсімдеуге болады, бірақ келесілер қажет: шетел паспорты, Ресейде мойындалатын жүргізушілік куәлік (төменде қараңыз), көлік құжаттары (СТС/ПТС) және Ресейде уақытша тіркелу немесе тұру рұқсаты.',
      whoImportant: 'Маңызды: көлік Ресейде тіркелуі тиіс. Шетел нөмірлі көліктер үшін «Жасыл карта» немесе тіркелген елде сақтандыру қажет.',

      docsTitle: 'Қажетті құжаттар',
      docsPassport: 'Паспорт',
      docsPassportText: 'Ресейлік немесе шетел паспорты. Онлайн рәсімдеу кезінде кальуляторда құжат түрін «Шетел паспорты» деп таңдаңыз.',
      docsVu: 'Жүргізушілік куәлік',
      docsVuText: 'Ресейлік куәлік — шектеусіз қабылданады. Шетелдік куәлік — ел 1968 жылғы Вена конвенциясына мүше болса (көптеген Еуропа және ТДД елдері) қабылданады. Конвенцияға кірмеген елдер үшін халықаралық жүргізушілік куәлік (ХЖК) немесе ресейлікке ауыстыру қажет болуы мүмкін.',
      docsVuNote: 'Ресей Орталық Банкі растады: сақтандыру компаниялары шетелдік куәлігі бар жүргізушілерге ресейлік куәлікпен бірдей шарттармен ОСАГО беруі тиіс.',
      docsCar: 'Көлік құжаттары',
      docsCarText: 'Көлік тіркелім куәлігі (СТС) немесе көлік паспорты (ПТС). Көлік Ресейде тіркелуі тиіс.',
      docsReg: 'Ресейде тіркелу',
      docsRegText: 'Уақытша тіркелу (миграциялық картадағы белгі) немесе тұру рұқсаты. Ресейде тіркелімсіз онлайн рәсімдеу мүмкін емес.',

      stepsTitle: 'ОСАГО қалай рәсімдеу (3 қадам)',
      stepsIntro: 'Вебсайтымыздағы онлайн-калькулятор арқылы рәсімдеңіз. Виджет орыс тілінде — көмек қажет болса, телефон соңғы, телефон арқылы көмектесеміз.',
      step1Title: 'Калькуляторды толтырыңыз',
      step1Text: 'Көлік мәліметтерін (мемлекеттік нөмір немесе VIN), паспорт және жүргізушілік куәлігін енгізіңіз. Скандық құжаттар қажет емес — бәрін қолмен енгізіңіз.',
      step1Note: 'Кеңес: көлік мемлекеттік нөмірін орыс тіліндегі пернетақта жайымен енгізіңіз (А, В, Е, К, М, Н, О, Р, С, Т, У, Х).',
      step2Title: 'Тарифті таңдап, төлеңіз',
      step2Text: 'Жүйе сақтандыру компанияларының ұсыныстарын көрсетеді. Сәйкес тарифті таңдап, картамен төлеңіз. Электронды полис e-mail мекенжайыңызға жіберіледі.',
      step3Title: 'Болмады ма? Жазыңыз немесе қоңырау шалыңыз',
      step3Text: 'Виджет құжаттарыңызды қабылдамаса немесе қате шықса — қоңырау шалыңыз немесе жазыңыз. Қолмен рәсімдеуге көмектесеміз.',
      step3Phone: 'Қоңырау шалу',
      step3Telegram: 'Telegram арқылы жазу',
      step3Email: 'E-mail арқылы жазу',

      translateTitle: 'Бетті қалай аудару',
      translateIntro: 'ОСАГО виджеті тек орыс тілінде жұмыс істейді. Бірақ браузердің ішкі аударғышын пайдаланып беттегі мәтінді аударуға болады:',
      translateChrome: 'Google Chrome / Яндекс Браузер',
      translateChromeSteps: 'Бетте тышқанның оң батырмасын басыңыз → пайда болған мәзірден «Аудару»-ды таңдаңыз. Немесе мекен-жай панеліндегі аудару белгішесін басыңыз.',
      translateSafari: 'Safari (iPhone / Mac)',
      translateSafariSteps: 'Мекен-жай панеліндегі «аа» батырмасын басыңыз → «Translate to»-ны таңдаңыз.',
      translateEdge: 'Microsoft Edge',
      translateEdgeSteps: 'Оң батырманы басыңыз → «Аудару». Немесе мекен-жай панеліндегі аудару белгішесін басыңыз.',

      limitsTitle: 'Маңызды шектеулер',
      limits1: 'Шетелдік құжаттармен полисті растау ықтималдығы ресейлік құжаттармен салыстырғанда төмен. Бұл сақтандыру компанияларының автоматты құжат тексеру ерекшеліктеріне байланысты.',
      limits2: 'Ресейде уақытша тіркелу немесе тұру рұқсатысыз онлайн рәсімдеу мүмкін емес — жүйе өткізбейді.',
      limits3: 'Көлік Ресейде тіркелуі тиіс. Шетел нөмірлі көліктерге ОСАГО берілмейді — «Жасыл карта» қажет.',
      limits4: '1968 жылғы Вена конвенциясына қатыспайтын елдердің жүргізушілік куәліктері онлайн қабылданбауы мүмкін. Бұл жағдайда бізге хабарласыңыз — көмектесеміз.',

      faqTitle: 'Жиқ қойылатын сұрақтар',
      faq1q: 'Ресей паспортынсыз ОСАГО рәсімдеуге бола ма?',
      faq1a: 'Иә. Онлайн рәсімдеу кезінде калькуляторда құжат түрін «Шетел паспорты» деп таңдаңыз. Ресейде уақытша тіркелу немесе тұру рұқсаты болуы тиіс.',
      faq2q: 'Менің шетелдік жүргізушілік куәлігім сәйкес пе?',
      faq2a: 'Еліңіз 1968 жылғы Вена конвенциясына қатысатын болса (көптеген ТДД, Еуропа және басқа елдер) — иә, ұлттық куәлігіңіз сәйкес. Басқа елдер үшін халықаралық жүргізушілік куәлік қажет болуы мүмкін.',
      faq3q: 'ОСАГО қанша тұрады?',
      faq3a: 'Баға аймақ, қозғалтқыш қуаты, тәжірибе және бонус-малус коэффициентіне (КБМ) байланысты. Мысал: B-классы көлік, 1 жүргізуші, III аймақ үшін — ~4 200 ₽-ден. Калькулятор нақты бағаны көрсетеді.',
      faq4q: 'Қанша уақыт алады?',
      faq4a: 'Өзіңіз толтырғанда шамамен 60 минут. Қиындық туылса — қоңырау шалыңыз, көмектесеміз.',
      faq5q: 'Виджет құжаттарымды қабылдамаса не істеуім керек?',
      faq5a: 'Бізге қоңырау шалыңыз немесе жазыңыз — сақтандыру компаниясы арқылы қолмен рәсімдеуге көмектесеміз. Телефон мен Telegram жоғарыда көрсетілген.',
      faq6q: '«Жасыл карта» қажет пе?',
      faq6a: '«Жасыл карта» шетелде тіркелген және Ресейге уақытша кіретін көлік үшін қажет. Егер көлігіңіз Ресейде тіркелген болса — сізге Ресей ОСАГО қажет.',
      faq7q: 'КАСКО рәсімдеуге бола ма?',
      faq7a: 'Иә, КАСКО ерікті. Шарттар мен баға сақтандыру компаниясына байланысты. Сәйкес тарифті таңдау үшін бізге жазыңыз.',

      ctaTitle: 'Рәсімдеуге көмек керек пе?',
      ctaText: 'Қоңырау шалыңыз немесе жазыңыз — бүкіл Ресей бойынша қашықтықтан жұмыс істейміз. Онлайн-калькулятор құжаттарыңызды қабылдамаса да ОСАГО рәсімдеуге көмектесеміз.',
      ctaPhone: '8 (950) 767-85-75',
      ctaTelegram: 'Telegram арқылы жазу',
      ctaEmail: 'E-mail арқылы жазу',

      footerNote: 'Бұл вебсайт сақтандыру компаниясы емес. Сақтандыру шарты лицензиялы сақтандыру компаниясымен серіктестік платформа арқылы жасалады.',
      footerPrivacy: 'Құпиялылық саясаты',
      footerCopy: '© 2026 ОСАГО / КАСКО Сақтандыру. Барлық құқықтар қорғалған.',

      switchLabel: 'Тіл:'
    }
  };

  /**
   * Инициализация переключения языков.
   * - Читает data-i18n из всех элементов и заменяет textContent
   * - Сохраняет выбор в localStorage
   */
  function initI18n() {
    var saved = null;
    try { saved = localStorage.getItem('osago-lang-inostrancam'); } catch (e) {}
    var lang = saved && LANGS[saved] ? saved : 'ru';

    // Определим язык браузера как подсказку (только при первом визите)
    if (!saved) {
      var nav = (navigator.language || navigator.userLanguage || '').substring(0, 2).toLowerCase();
      var langMap = { en: 'en', uz: 'uz', tg: 'tg', kk: 'kk', ky: 'kk', ru: 'ru' };
      if (langMap[nav]) lang = langMap[nav];
    }

    applyLang(lang);
    buildSwitcher(lang);
  }

  function applyLang(lang) {
    var dict = LANGS[lang] || LANGS.ru;
    var els = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < els.length; i++) {
      var key = els[i].getAttribute('data-i18n');
      if (dict[key]) {
        // Для input/textarea используем placeholder
        if (els[i].tagName === 'INPUT' || els[i].tagName === 'TEXTAREA') {
          els[i].placeholder = dict[key];
        } else {
          els[i].textContent = dict[key];
        }
      }
    }

    // Обновим title и dir
    document.documentElement.lang = lang === 'ru' ? 'ru' : lang;
    if (lang === 'tg' || lang === 'uz' || lang === 'kk') {
      // Таджикский и узбекский — разные направления; для безопасности ставим auto
      document.documentElement.dir = '';
    }
    if (dict.pageTitle) document.title = dict.pageTitle;

    // Обновим active класс на кнопках переключателя
    var btns = document.querySelectorAll('[data-lang-btn]');
    for (var j = 0; j < btns.length; j++) {
      btns[j].classList.toggle('i18n-active', btns[j].getAttribute('data-lang-btn') === lang);
    }
  }

  function buildSwitcher(currentLang) {
    var container = document.getElementById('i18n-switcher');
    if (!container) return;

    var codes = ['ru', 'en', 'uz', 'tg', 'kk'];
    var html = '<span data-i18n="switchLabel" class="i18n-switch-label">' +
      (LANGS[currentLang] || LANGS.ru).switchLabel + '</span>';
    html += '<div class="i18n-btns">';
    for (var i = 0; i < codes.length; i++) {
      var c = codes[i];
      var l = LANGS[c];
      var active = c === currentLang ? ' i18n-active' : '';
      html += '<button type="button" class="i18n-btn' + active + '" data-lang-btn="' + c + '" title="' + l.langName + '">' +
        l.langFlag + ' ' + l.langName + '</button>';
    }
    html += '</div>';
    container.innerHTML = html;

    // Обработчики кликов
    var btns = container.querySelectorAll('[data-lang-btn]');
    for (var j = 0; j < btns.length; j++) {
      btns[j].addEventListener('click', function () {
        var selected = this.getAttribute('data-lang-btn');
        applyLang(selected);
        try { localStorage.setItem('osago-lang-inostrancam', selected); } catch (e) {}
        // Обновим label
        var label = container.querySelector('.i18n-switch-label');
        if (label && LANGS[selected]) {
          label.textContent = LANGS[selected].switchLabel;
        }
        // Обновим active
        var allBtns = container.querySelectorAll('[data-lang-btn]');
        for (var k = 0; k < allBtns.length; k++) {
          allBtns[k].classList.toggle('i18n-active', allBtns[k].getAttribute('data-lang-btn') === selected);
        }
      });
    }
  }

  // CSS для переключателя
  var style = document.createElement('style');
  style.id = 'i18n-switcher-css';
  style.textContent =
    '.i18n-switcher{display:flex;align-items:center;flex-wrap:wrap;gap:8px;margin:0 auto 1.5rem;max-width:42rem;padding:0.75rem 1rem;background:#fff;border:1px solid #E2E8F0;border-radius:0.75rem;box-shadow:0 1px 3px rgba(11,37,69,.06);}' +
    '.i18n-switch-label{font-size:0.875rem;font-weight:600;color:#475569;white-space:nowrap;}' +
    '.i18n-btns{display:flex;flex-wrap:wrap;gap:4px;}' +
    '.i18n-btn{background:#F1F5F9;border:1px solid #E2E8F0;border-radius:6px;padding:4px 10px;font-size:0.8125rem;font-weight:500;color:#475569;cursor:pointer;transition:all .15s ease;font-family:inherit;}' +
    '.i18n-btn:hover{background:#DBEAFE;border-color:#93C5FD;color:#1D4ED8;}' +
    '.i18n-btn.i18n-active{background:#1D4ED8;border-color:#1D4ED8;color:#fff;}' +
    '@media(max-width:480px){.i18n-switcher{gap:6px;padding:0.625rem 0.75rem;}.i18n-btn{padding:4px 8px;font-size:0.75rem;}}';
  document.head.appendChild(style);

  // Запуск после загрузки DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initI18n);
  } else {
    initI18n();
  }
})(window, document);
