(() => {
  const byId = id => document.getElementById(id);
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const toggle = byId('pulse-toggle');
  const search = byId('order-search');
  const filters = byId('order-filters');
  const rows = byId('directory-rows');
  const dialog = byId('order-detail');
  const states = ['Yeni', 'İşlənir', 'Hazır'];
  const services = ['Loqo dizaynı','Vizit kart','Reklam vizualı','Poster','Video montajı','Vizual kimlik'];
  const pageSize = 5;

  const names = [...profileSampleNames];
  for (let i = names.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [names[i], names[j]] = [names[j], names[i]];
  }
  const makeOrder = (name, index) => ({
    name, id: index + 101, service: services[index % services.length],
    phase: index % states.length, progress: [8 + index % 7,34 + index * 7 % 43,100][index % states.length]
  });
  const orders = names.slice(0, 15).map(makeOrder);
  const activity = orders.slice(0,5).map(order => ({name:order.name, service:order.service, phase:order.phase}));
  let nameIndex = orders.length;
  let paused = motion.matches;
  let statusFilter = -1;
  let page = 0;
  let tick = 0;

  function element(tag, text, className) {
    const node = document.createElement(tag);
    if (text) node.textContent = text;
    if (className) node.className = className;
    return node;
  }
  function normalize(value) {
    return value.toLocaleLowerCase('az').normalize('NFD').replace(/\p{M}/gu, '').replaceAll('ə','e').replaceAll('ı','i');
  }
  function showOrder(order) {
    byId('detail-title').textContent = order.name;
    const content = byId('detail-content');
    content.replaceChildren(...[
      'Sorğu № ' + order.id,
      'Xidmət: ' + order.service,
      'Vəziyyət: ' + states[order.phase],
      'Gediş: ' + order.progress + '%'
    ].map(line => element('p',line)));
    dialog.showModal();
  }
  function renderTable() {
    const query = normalize(search.value.trim());
    const matching = orders.filter(order => (statusFilter === -1 || statusFilter === order.phase)
      && normalize(order.name + ' ' + order.service).includes(query));
    const lastPage = Math.max(0, Math.ceil(matching.length / pageSize) - 1);
    page = Math.min(lastPage, page);
    const offset = page * pageSize;
    rows.replaceChildren();
    for (const order of matching.slice(offset, offset + pageSize)) {
      const row = rows.insertRow();
      const name = element('button', '', 'order-name');
      name.type = 'button';
      const initials = element('span', order.name.split(' ').map(part => part[0]).join(''), 'directory-avatar');
      initials.setAttribute('aria-hidden','true');
      initials.style.setProperty('--avatar-hue', (order.id * 39) % 360);
      name.append(initials, order.name);
      name.addEventListener('click', () => showOrder(order));
      row.insertCell().append(name);
      row.insertCell().textContent = order.service;
      const progress = document.createElement('progress');
      progress.max = 100;
      progress.value = order.progress;
      progress.setAttribute('aria-label','İşin gedişi');
      row.insertCell().append(progress);
      row.insertCell().append(element('span',states[order.phase],'order-state state-' + order.phase));
    }
    if (!matching.length) {
      const cell = rows.insertRow().insertCell();
      cell.colSpan = 4;
      cell.textContent = 'Uyğun demo sifarişi tapılmadı.';
    }
    byId('order-results').textContent = matching.length ? (offset + 1) + '–' + Math.min(offset + pageSize, matching.length) + ' / ' + matching.length : '0 nəticə';
    byId('order-prev').disabled = page === 0;
    byId('order-next').disabled = page >= lastPage;
    [...filters.children].forEach((button,index) => {
      const phase = index - 1;
      const count = phase === -1 ? orders.length : orders.filter(order => order.phase === phase).length;
      button.textContent = (states[phase] || 'Hamısı') + ' · ' + count;
      button.setAttribute('aria-pressed', phase === statusFilter);
    });
  }
  function renderSignal() {
    const recent = orders.slice(0, 15).reverse();
    byId('pulse-points').replaceChildren(...recent.map((order, index) => {
      const point = element('button','', 'pulse-dot state-' + order.phase);
      point.type = 'button';
      point.style.left = (5 + index * 90 / Math.max(1,recent.length - 1)) + '%';
      point.style.top = (83 - order.progress * .66 + Math.sin(order.id * 1.7) * 8) + '%';
      point.title = order.name + ' · ' + states[order.phase];
      point.setAttribute('aria-label', point.title);
      point.addEventListener('click', () => showOrder(order));
      return point;
    }));
    byId('pulse-bars').replaceChildren(...recent.slice(-8).map(order => {
      const bar = element('i');
      bar.style.setProperty('--height', (15 + order.progress * .78) + '%');
      return bar;
    }));
    const active = orders.filter(order => order.phase < 2).length;
    byId('pulse-value').textContent = active;
    byId('pulse-total').textContent = orders.length + ' simulyasiya olunmuş sorğu';
    byId('pulse-log').replaceChildren(...activity.map(event => {
      const item = element('li');
      item.append(element('strong', event.service), element('span', event.name + ' · ' + states[event.phase]));
      return item;
    }));
  }
  function advance() {
    if (paused || document.hidden || dialog.open) return;
    const focused = document.activeElement;
    if (rows.contains(focused) || byId('pulse-points').contains(focused)) return;
    let order = orders.find(item => item.phase < 2);
    if ((tick++ % 2 === 0 || !order) && nameIndex < names.length) {
      order = makeOrder(names[nameIndex], nameIndex++);
      order.phase = 0;
      order.progress = 8;
      orders.unshift(order);
    } else if (order) {
      order.phase++;
      order.progress = [8,56,100][order.phase];
    } else if (nameIndex === names.length) {
      paused = true;
      setToggle();
      return;
    }
    activity.unshift({name:order.name,service:order.service,phase:order.phase});
    activity.length = 5;
    renderTable();
    renderSignal();
  }
  function setToggle() {
    toggle.textContent = paused ? 'Başlat' : 'Dayandır';
    toggle.setAttribute('aria-pressed', String(!paused));
  }
  for (const [index, label] of ['Hamısı', ...states].entries()) {
    const button = element('button',label);
    button.type = 'button';
    button.addEventListener('click', () => {
      statusFilter = index - 1;
      page = 0;
      renderTable();
    });
    filters.append(button);
  }
  search.addEventListener('input', () => { page = 0; renderTable(); });
  byId('order-prev').addEventListener('click', () => { page--; renderTable(); });
  byId('order-next').addEventListener('click', () => { page++; renderTable(); });
  toggle.addEventListener('click', () => {
    if (paused && nameIndex === names.length && orders.every(order => order.phase === 2)) {
      orders.splice(0, orders.length, ...names.slice(0,15).map(makeOrder));
      nameIndex = 15;
      tick = 0;
      page = 0;
    }
    paused = !paused;
    setToggle();
    if (!paused) advance();
  });
  motion.addEventListener('change', event => {
    paused = event.matches;
    setToggle();
  });
  renderTable();
  renderSignal();
  setToggle();
  toggle.hidden = false;
  setInterval(advance, 7600);
})();
