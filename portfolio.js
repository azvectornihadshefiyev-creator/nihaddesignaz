(() => {
  const filters = document.querySelector('#portfolioFilters');
  const gallery = document.querySelector('#portfolioProjects');

  // Hər layihəyə şəkil və ya video əlavə etmək üçün media siyahısını yenilə.
  // Video nümunəsi: {type:'video',src:'assets/portfolio/project.mp4',poster:'assets/portfolio/cover.webp',alt:'Video təsviri',caption:'Qısa reklam'}
  const caseStudies = [
    {
      projectId:1, slug:'puls', accent:'#d6fc5a', surface:'#1c2720',
      headline:'Hərəkətin vizual işarəsi',
      brief:'Bir fitness məkanı üçün profil şəklində seçilən, lövhədə isə aydın oxunan vizual kimlik konsepti.',
      decision:'İti bucaqlı işarə hərəkəti ifadə edir. Tünd fon və turş yaşıl rəng yüksək kontrast yaradır. İri yazı forması işarə ilə eyni ritmdə qalır.',
      deliverables:'Loqo konsepti, rəng palitrası və ekran tətbiqi',
      media:[{type:'image',src:'assets/concepts/logo-puls.webp',alt:'PULS loqosunun üfüqi görünüşü',caption:'Loqonun üfüqi tətbiqi'}]
    },
    {
      projectId:2, slug:'qat', accent:'#ffbf72', surface:'#302419',
      headline:'Məhsul ilk baxışda görünür',
      brief:'Soyuq qəhvə üçün məhsulu və əsas mesajı bir baxışda tanıdan reklam vizualı konsepti.',
      decision:'Kompozisiyanı başlıq və məhsul arasında böldüm. İsti rəngli dairələr məhsula diqqəti çəkir. Başlığın ətrafında boşluq saxladım ki, kompozisiya dar ekranda da oxunsun.',
      deliverables:'Kampaniyanın əsas vizualı və məhsul təqdimatı',
      media:[]
    },
    {
      projectId:3, slug:'forma', accent:'#c8dbc4', surface:'#242d25',
      headline:'İnteryer studiyası üçün çap kimliyi',
      brief:'İnteryer studiyasının əlaqə məlumatlarını oxunaqlı, ikiüzlü vizit kartda toplamaq.',
      decision:'Tünd üzdə iri ad, açıq üzdə isə məlumat önə çıxır. Təkrarlanan qövs forması iki üzü birləşdirir və memarlıq eskizlərini xatırladır.',
      deliverables:'İkiüzlü vizit kart və loqonun çap tətbiqi',
      media:[{type:'image',src:'assets/concepts/logo-forma.webp',alt:'FORMA yazı loqosu',caption:'Vizit kartda istifadə olunan loqo'}]
    }
  ].map(study => ({...study,project:studioProjects.find(project => project.id === study.projectId)}))
    .filter(study => study.project);

  function mediaMarkup({type,src,alt,caption,poster,captions}) {
    const content = type === 'video'
      ? `<video controls playsinline preload="none" aria-label="${alt}"${poster ? ' poster="' + poster + '"' : ''}><source src="${src}" type="video/mp4">${captions ? '<track kind="captions" srclang="az" label="Azərbaycanca" src="' + captions + '">' : ''}</video>`
      : `<img src="${src}" loading="lazy" alt="${alt}">`;
    return `<figure class="case-extra">${content}<figcaption>${caption}</figcaption></figure>`;
  }

  const categories = ['Hamısı', ...new Set(caseStudies.map(study => study.project.c))];
  filters.innerHTML = categories.map((category,index) => `<button type="button" aria-pressed="${index === 0}">${category}</button>`).join('');
  gallery.innerHTML = caseStudies.map(({project,slug,accent,surface,headline,brief,decision,deliverables,media}) => `
    <article class="edition-case" id="${slug}" data-category="${project.c}" style="--case-accent:${accent};--case-surface:${surface}">
      <figure class="case-image">
        <img src="${project.img}" alt="${project.t} — əsas konsept vizualı" loading="lazy" width="960" height="750">
        <figcaption>${project.t} · Əsas vizual</figcaption>
      </figure>
      <div class="case-body">
        <p class="case-type">${project.c} · Konsept layihə</p>
        <h3>${project.t}</h3><p class="case-headline">${headline}</p>
        <dl><div><dt>Tapşırıq</dt><dd>${brief}</dd></div><div><dt>Dizayn qərarı</dt><dd>${decision}</dd></div><div><dt>Tətbiqlər</dt><dd>${deliverables}</dd></div></dl>
        ${media.map(mediaMarkup).join('')}
        <a class="case-link" href="${project.service === 'logo' ? 'loqo.html' : 'index.html?xidmet=' + project.service + '#services'}">${project.service === 'logo' ? 'Loqonun tətbiqlərinə bax' : 'Xidmətin paketlərinə bax'} <span aria-hidden="true">↗</span></a>
      </div>
    </article>`).join('');

  function selectCategory(button) {
    const category = button.textContent;
    for (const option of filters.children) option.setAttribute('aria-pressed', String(option === button));
    for (const article of gallery.children) article.hidden = category !== 'Hamısı' && article.dataset.category !== category;
  }
  filters.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (button) selectCategory(button);
  });
  function revealLinkedProject() {
    const target = [...gallery.children].find(article => '#' + article.id === location.hash);
    if (!target) return;
    if (target.hidden) selectCategory(filters.firstElementChild);
    target.scrollIntoView();
  }
  document.querySelector('.edition-cover').addEventListener('click', event => {
    if (location.hash !== event.currentTarget.hash) return;
    event.preventDefault();
    revealLinkedProject();
  });
  addEventListener('hashchange', revealLinkedProject);
  if (location.hash) requestAnimationFrame(revealLinkedProject);
})();
