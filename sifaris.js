(() => {
  const byId = id => document.getElementById(id);
  const form = byId('request-form');
  const status = byId('request-status');
  const output = byId('request-output');
  const message = byId('request-message');
  const params = new URLSearchParams(location.search);
  const selected = params.get('paket');
  const inquiries = new Map([
    ['reklam', {
      title:'Reklam yerləşdirmə', summary:'Məhsulu, istifadə olunacaq linki və reklamın görünməsini istədiyin tarixləri yaz.',
      placeholder:'Məhsul və ya kampaniya, keçid və yerləşdirmə tarixləri'
    }],
    ['kampaniya', {
      title:'Kampaniya əməkdaşlığı', summary:'Kampaniyanın məqsədini, auditoriyanı və lazım olan dizayn materiallarını paylaş.',
      placeholder:'Kampaniyanın məqsədi, materiallar və təhvil tarixi'
    }],
    ['davamli', {
      title:'Davamlı dizayn əməkdaşlığı', summary:'Həftəlik və ya aylıq hansı dizayn dəstəyinə ehtiyacın olduğunu yaz.',
      placeholder:'İş sayı, formatlar və planlanan əməkdaşlıq müddəti'
    }],
    ['agentlik', {
      title:'Agentlik əməkdaşlığı', summary:'Komandanın iş prosesi, dizayn ehtiyacı və təhvil qaydası barədə qısa məlumat paylaş.',
      placeholder:'Komanda, gözlənilən iş həcmi və material formatları'
    }]
  ]);
  const inquiry = selected ? undefined : inquiries.get(params.get('muraciet'));
  const poster = posterPackages.find(plan => plan.id === selected);
  const servicePlans = catalog.flatMap(service => service.plans.map(([name, price, ...details], index) => ({
    id: service.id + '-' + index, title: service.title + ' · ' + name, price, details
  })));
  const posterImageTerms = 'Şəkil işində eyni mövzuya 5–7 variant. Qiymət kimi razılaşdırılmış elementlərə limitsiz düzəliş.';
  const posterVideoTerms = 'Video işində bir yekun video, musiqi və kiçik montaj düzəlişləri.';
  const plan = poster ? {
    title: posterTitle + ' · ' + poster.name, price: poster.price,
    details: [poster.quantity + ' mövzu', posterPrice(poster), 'Şəkildə: ' + posterOptions(poster), posterImageTerms, posterVideoTerms]
  } : servicePlans.find(item => item.id === selected);

  if (poster) {
    const format = form.elements.namedItem('format');
    for (const label of posterFormats) format.add(new Option(label,label));
    format.required = true;
    byId('format-field').hidden = false;
  }

  if (plan) {
    byId('selection-title').textContent = plan.title;
    const price = byId('selection-price');
    price.textContent = plan.price + ' AZN';
    price.hidden = false;
    const list = byId('selection-details');
    for (const detail of plan.details) {
      const item = document.createElement('li');
      item.textContent = detail;
      list.append(item);
    }
    list.hidden = false;
    byId('selection-custom').hidden = true;
    byId('switch-custom').hidden = false;
  } else if (inquiry) {
    byId('request-title').textContent = inquiry.title;
    byId('selection-title').textContent = 'Müraciət haqqında';
    byId('selection-custom').textContent = inquiry.summary;
    form.elements.namedItem('details').placeholder = inquiry.placeholder;
  } else if (selected) {
    const notice = byId('selection-notice');
    notice.hidden = false;
    notice.textContent = 'Bu paket tapılmadı. Fərdi sifariş yaza və ya paketlərə qayıda bilərsən.';
  }

  if (poster) {
    const format = form.elements.namedItem('format');
    const list = byId('selection-details');
    format.addEventListener('change', () => {
      const copy = format.value === 'Video' ? [poster.quantity + ' yekun video',posterVideoTerms] :
        format.value === 'Şəkil' ? [poster.quantity + ' mövzu',posterOptions(poster),posterImageTerms] : plan.details;
      list.replaceChildren(...copy.map(detail => {
        const item = document.createElement('li');
        item.textContent = detail;
        return item;
      }));
    });
  }

  const whatsapp = /^\d{8,15}$/.test(studioContact.whatsapp) ? studioContact.whatsapp : '';
  const submit = form.querySelector('[type="submit"]');
  if (whatsapp) submit.textContent = 'WhatsApp-da aç →';

  for (const field of ['firstName','lastName','details']) {
    const input = form.elements.namedItem(field);
    input.addEventListener('input', () => input.setCustomValidity(''));
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(form);
    const value = key => String(data.get(key) || '').trim();
    for (const key of ['firstName','lastName','details']) {
      if (value(key)) continue;
      const field = form.elements.namedItem(key);
      field.setCustomValidity('Bu sahəni doldurun.');
      field.reportValidity();
      return;
    }
    const text = ['Salam, Nihad!', 'Ad və soyad: ' + value('firstName') + ' ' + value('lastName'),
      value('company') && 'Şirkət: ' + value('company'),
      value('sector') && 'Biznesin sahəsi: ' + value('sector'),
      inquiry ? 'Müraciət: ' + inquiry.title : 'Sifariş: ' + (plan ? plan.title : 'Fərdi sifariş'),
      plan && 'Paket: ' + plan.price + ' AZN',
      poster && 'Format: ' + value('format') + ' · ' + (value('format') === 'Video'
        ? poster.quantity + ' yekun video'
        : poster.quantity + ' mövzu · ' + posterOptions(poster)),
      plan && !poster && 'Paketə daxildir: ' + plan.details.join(' · '),
      'Layihə: ' + value('details')
    ].filter(Boolean).join('\n');

    message.value = text;
    output.hidden = false;
    if (whatsapp) {
      status.textContent = 'Mesaj hazırdır. WhatsApp-da göndər düyməsinə toxun.';
      window.open('https://wa.me/' + whatsapp + '?text=' + encodeURIComponent(text),'_blank','noopener');
    } else {
      status.textContent = 'Mesaj hazırdır. WhatsApp nömrəsi əlavə edilənədək mətni kopyalaya bilərsən.';
    }
  });
  byId('request-copy').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(message.value);
      status.textContent = 'Mesaj kopyalandı.';
    } catch {
      message.focus();
      message.select();
      status.textContent = 'Mətn seçildi. Cihazının kopyalama əmri ilə götürə bilərsən.';
    }
  });
  submit.disabled = false;
})();
