(() => {
  // Hər konseptin eyni şəffaf loqo faylı üç tətbiqdə göstərilir.
  const concepts = [
    {name:'PULS', description:'İdman zalı üçün loqo konsepti', image:'assets/logo-concepts/puls.svg', accent:'#d6fc5a', surface:'#1d2921'},
    {name:'QAT', description:'Qəhvə markası üçün loqo konsepti', image:'assets/logo-concepts/qat.svg', accent:'#ffc47f', surface:'#44302a'},
    {name:'FORMA', description:'İnteryer studiyası üçün loqo konsepti', image:'assets/logo-concepts/forma.svg', accent:'#dbe7c5', surface:'#2b4036'}
  ];
  const gallery = document.querySelector('#logo-gallery');
  const picker = document.querySelector('#logo-picker');
  const images = [...gallery.querySelectorAll('[data-logo]')];
  const labels = [...gallery.querySelectorAll('[data-logo-name]')];
  const buttons = concepts.map(concept => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'page-cta';
    button.textContent = concept.name;
    picker.append(button);
    return button;
  });

  function selectConcept(index) {
    const concept = concepts[index];
    gallery.style.setProperty('--scene-accent', concept.accent);
    gallery.style.setProperty('--scene-surface', concept.surface);
    for (const image of images) {
      image.src = concept.image;
      image.alt = concept.name + ' loqosu';
    }
    for (const label of labels) label.textContent = concept.name;
    buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    document.querySelector('#logo-context').textContent = concept.description;
  }
  buttons.forEach((button,index) => button.addEventListener('click', () => selectConcept(index)));
  selectConcept(0);

  const logo = catalog.find(service => service.id === 'logo');
  document.querySelector('#logo-plan-grid').innerHTML = logo.plans.map(([name,price,...details],index) => {
    const id = 'logo-' + index;
    return `<article class="logo-plan">
      <h3>${name}</h3><p class="logo-price">${price} <small>AZN</small></p>
      <ul>${details.map(detail => '<li>' + detail + '</li>').join('')}</ul>
      <a class="page-cta" href="sifaris.html?paket=${id}">Bu paketlə davam et →</a>
    </article>`;
  }).join('');
})();
