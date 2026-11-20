const studioProjects = [
  {id:1, t:'PULS Fitness', c:'Vizual kimlik', tags:['Loqo','Rəng və şrift'], img:'assets/concepts/puls.webp', d:'İdman zalı üçün konsept. Həndəsi işarə hərəkəti ifadə edir, kontrastlı palitra isə loqonun rəqəmsal və çap tətbiqlərində seçilməsinə kömək edir.', service:'logo', wide:true},
  {id:2, t:'QAT Coffee', c:'Reklam', tags:['Poster','Məhsul vizualı'], img:'assets/concepts/qat.webp', d:'Soyuq qəhvə üçün kampaniya konsepti. Məhsulu və əsas reklam mesajını iri ölçüdə göstərən isti rəngli afişa.', service:'poster'},
  {id:3, t:'FORMA İnteryer', c:'Çap dizaynı', tags:['Vizit kart','Tipoqrafiya'], img:'assets/concepts/forma.webp', d:'İnteryer studiyası üçün ikiüzlü vizit kart konsepti. Açıq və tünd səthlərdə eyni tipoqrafiya və həndəsi naxış tətbiq edilib.', service:'print'}
];

function projectImage(project) {
  return '<img src="' + project.img + '" alt="' + project.t + ' — dizayn konsepti" loading="lazy" width="960" height="750">';
}

const logoSamples = ['puls','mono','orbit','forma','nova'].map(name => 'assets/concepts/logo-' + name + '.webp');
