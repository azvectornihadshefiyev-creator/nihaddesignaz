const posterDeck = document.querySelector('#poster-deck');
posterDeck.innerHTML = posterPackages.map(plan => `
  <article class="poster-card">
    <img src="${plan.image}" alt="" loading="lazy" width="960" height="750">
    <div class="poster-card-copy">
      <h3>${plan.name}</h3><p>${plan.quantity} mövzu · ${posterPrice(plan)}</p>
      <p>Şəkildə: ${posterOptions(plan)}</p>
      <strong>${plan.price} <small>AZN</small></strong>
      <a class="btn sm" href="sifaris.html?paket=${plan.id}">Sifariş ver →</a>
    </div>
  </article>`).join('');

const serviceGroup = new Map(Object.entries(serviceGroups).flatMap(([label, ids]) => ids.map(id => [id, label])));
const offerGrid = document.querySelector('#offers');
const packageDialog = document.querySelector('#packageDialog');
const packageGrid = document.querySelector('#packageGrid');
const form = document.querySelector('#form');
const packageSelect = document.querySelector('#fp');
const message = document.querySelector('#fm');
const prepared = document.querySelector('#prepared');
const statusLine = document.querySelector('#briefStatus');
const whatsapp = /^\d{8,15}$/.test(studioContact.whatsapp) ? studioContact.whatsapp : '';
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const planLabel = (service, plan) => service.title + ' · ' + plan[0] + ' · ' + plan[1] + ' AZN';

offerGrid.innerHTML = catalog.map(service => `
  <article class="glass of spot rv studio-service" data-card-service="${service.id}" style="--accent:${service.color}">
    <div class="service-art" aria-hidden="true">
      ${service.id === "logo" ? `<img class="logo-sample" data-sample src="${logoSamples[0]}" alt="">` : `<span class="service-sample"><span class="sample-mark">${service.mark}</span><span data-sample>${service.samples[0]}</span></span>`}
    </div>
    <small class="service-group">${serviceGroup.get(service.id)}</small><h3>${service.title}</h3><p>${service.description}</p>
    <div class="service-bottom"><small>${service.plans[0][1]} AZN-dən</small>
      ${service.id === 'logo' ? '<a class="btn ghost sm" href="loqo.html">Loqo sifarişi və nümunələr →</a>' :
        `<button type="button" class="btn ghost sm" data-service="${service.id}" aria-haspopup="dialog">Paketlərə bax →</button>`}
    </div>
  </article>`).join('');
watch();

const filters = document.querySelector('#serviceFilters');
const search = document.querySelector('#serviceSearch');
const result = document.querySelector('#catalogResult');
const cards = [...offerGrid.children];
const categories = ['Hamısı', ...Object.keys(serviceGroups)];
let activeCategory = 'Hamısı';
filters.innerHTML = categories.map((label, index) =>
  `<button type="button" aria-pressed="${index === 0}">${label}</button>`
).join('');
document.querySelector('#serviceCount').textContent = catalog.length + ' xidmət';
document.querySelector('#planCount').textContent = catalog.reduce((sum, service) => sum + service.plans.length, 0) + ' paket';

function searchable(text) {
  return text.toLocaleLowerCase('az').normalize('NFD').replace(/\p{M}/gu, '').replaceAll('ə','e').replaceAll('ı','i');
}
function filterCatalog() {
  const words = searchable(search.value).trim().split(/\s+/).filter(Boolean);
  let matches = 0;
  for (const [index, service] of catalog.entries()) {
    const group = serviceGroup.get(service.id);
    const text = searchable([service.title, service.description, group, ...service.plans.flat()].join(' '));
    const show = (activeCategory === 'Hamısı' || group === activeCategory) && words.every(word => text.includes(word));
    cards[index].hidden = !show;
    if (show) matches++;
  }
  result.textContent = matches ? matches + ' xidmət' : 'Uyğun xidmət tapılmadı. Axtarışı və ya kateqoriyanı dəyiş.';
}
filters.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;
  activeCategory = button.textContent;
  for (const option of filters.children) option.setAttribute('aria-pressed', option === button);
  filterCatalog();
});
search.addEventListener('input', filterCatalog);
filterCatalog();

const sampleDisplays = [...offerGrid.querySelectorAll('[data-sample]')];
let sampleIndex = 0;
setInterval(() => {
  if (document.hidden || reducedMotion.matches) return;
  sampleIndex++;
  catalog.forEach((service, index) => {
    if (cards[index].hidden || service.samples.length < 2) return;
    const label = sampleDisplays[index];
    const sample = service.samples[sampleIndex % service.samples.length];
    const isLogo = service.id === 'logo';
    const display = isLogo ? label : label.parentElement;
    if (isLogo) label.src = logoSamples[sampleIndex % logoSamples.length];
    else label.textContent = sample;
    display.classList.remove('sample-turn');
    requestAnimationFrame(() => requestAnimationFrame(() => display.classList.add('sample-turn')));
  });
}, 3500);

packageSelect.innerHTML = '<option value="">Fərdi layihə</option>' + catalog.map(service =>
  '<optgroup label="' + service.title + '">' + service.plans.map((plan, index) =>
    '<option value="' + service.id + '-' + index + '">' + planLabel(service, plan) + '</option>'
  ).join('') + '</optgroup>'
).join('');

const directService = new URLSearchParams(location.search).get('xidmet');
if (directService === 'logo') location.replace('loqo.html');
const directButton = [...offerGrid.querySelectorAll('[data-service]')].find(button => button.dataset.service === directService);

const summary = document.querySelector('#selectedPlan');
function updateSummary() {
  const value = packageSelect.value;
  summary.hidden = !value;
  if (!value) {
    summary.replaceChildren();
    return;
  }
  const option = packageSelect.selectedOptions[0];
  const service = catalog.find(item => value.startsWith(item.id + '-') && /^\d+$/.test(value.slice(item.id.length + 1)));
  const plan = service.plans[Number(value.slice(service.id.length + 1))];
  summary.replaceChildren();
  const heading = document.createElement('strong');
  heading.textContent = option.textContent;
  const details = document.createElement('ul');
  for (const line of plan.slice(2)) {
    const item = document.createElement('li');
    item.textContent = line;
    details.append(item);
  }
  summary.append(heading, details);
}
packageSelect.addEventListener('change', updateSummary);
updateSummary();

let openService;
offerGrid.addEventListener('click', event => {
  const trigger = event.target.closest('[data-service]');
  if (!trigger) return;
  openService = catalog.find(service => service.id === trigger.dataset.service);
  document.querySelector('#packageTitle').textContent = openService.title;
  document.querySelector('#packageDesc').textContent = openService.description;
  packageGrid.innerHTML = openService.plans.map(([name, price, ...items], index) => `
    <article class="pkg-card"><h3>${name}</h3><div class="pkg-price">${price} <small>AZN</small></div>
      <ul>${items.map(item => '<li>' + item + '</li>').join('')}</ul>
      <a class="btn sm" href="sifaris.html?paket=${openService.id}-${index}">Paketi seç →</a>
    </article>`).join('');
  packageDialog.showModal();
});
packageDialog.addEventListener('click', event => {
  if (event.target === packageDialog) {
    const box = packageDialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) packageDialog.close();
  }
});
const submit = form.querySelector('[type="submit"]');
if (whatsapp) submit.textContent = 'WhatsApp-da aç →';
else if (studioContact.email) submit.textContent = 'E-poçtda aç →';
form.addEventListener('submit', event => {
  event.preventDefault();
  const name = document.querySelector('#fn').value.trim();
  const email = document.querySelector('#fe').value.trim();
  if (!name || !message.value.trim()) {
    statusLine.textContent = 'Adını və layihənin qısa təsvirini yaz.';
    (!name ? document.querySelector('#fn') : message).focus();
    return;
  }
  const body = ['Salam, Nihad!', 'Ad: ' + name, email && 'E-poçt: ' + email,
    'Paket: ' + packageSelect.selectedOptions[0].textContent,
    'Layihə: ' + message.value.trim()].filter(Boolean).join('\n');
  prepared.value = body;
  document.querySelector('#briefOutput').hidden = false;
  if (whatsapp) {
    statusLine.textContent = 'Hazır mətni WhatsApp-da özün göndərə bilərsən.';
    window.open('https://wa.me/' + whatsapp + '?text=' + encodeURIComponent(body), '_blank', 'noopener');
  } else if (studioContact.email) {
    statusLine.textContent = 'Hazır mətni e-poçt tətbiqində göndərə bilərsən.';
    location.href = 'mailto:' + studioContact.email + '?subject=' + encodeURIComponent('Yeni dizayn sifarişi') + '&body=' + encodeURIComponent(body);
  } else {
    statusLine.textContent = 'Mesaj hazırdır. Əlaqə ünvanı əlavə edildikdən sonra buradan göndərmək mümkün olacaq.';
  }
});
document.querySelector('#copyBrief').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(prepared.value);
    statusLine.textContent = 'Sifariş mətni kopyalandı.';
  } catch {
    prepared.focus();
    prepared.select();
    statusLine.textContent = 'Mətn seçildi. Cihazının kopyalama əmri ilə götürə bilərsən.';
  }
});

if (directButton) {
  const openDirect = () => {
    directButton.scrollIntoView({block:'center',behavior:'instant'});
    directButton.click();
  };
  if (document.body.classList.contains('loaded')) openDirect();
  else {
    const ready = new MutationObserver(() => {
      if (!document.body.classList.contains('loaded')) return;
      ready.disconnect();
      openDirect();
    });
    ready.observe(document.body,{attributes:true,attributeFilter:['class']});
  }
}
