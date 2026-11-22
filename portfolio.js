const portfolioFilters = document.querySelector('#portfolioFilters');
const portfolioProjects = document.querySelector('#portfolioProjects');
const categories = ['Hamısı', ...new Set(studioProjects.map(project => project.c))];

portfolioFilters.innerHTML = categories.map((category, index) =>
  '<button type="button" aria-pressed="' + (index === 0) + '">' + category + '</button>'
).join('');
portfolioProjects.innerHTML = studioProjects.map(project => `
  <article class="page-project" data-category="${project.c}">
    ${projectImage(project)}
    <div class="project-copy"><small>Konsept layihə · ${project.c}</small>
      <h2>${project.t}</h2><p>${project.d}</p>
      <a class="page-cta" href="${project.service === 'logo' ? 'loqo.html' : 'index.html?xidmet=' + project.service + '#services'}">Bu xidmətin paketləri →</a>
    </div>
  </article>`).join('');

portfolioFilters.addEventListener('click', event => {
  const selected = event.target.closest('button');
  if (!selected) return;
  for (const button of portfolioFilters.children) button.setAttribute('aria-pressed', button === selected);
  for (const card of portfolioProjects.children) {
    card.hidden = selected.textContent !== 'Hamısı' && card.dataset.category !== selected.textContent;
  }
});
