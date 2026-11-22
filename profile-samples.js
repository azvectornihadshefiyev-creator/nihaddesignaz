// Uydurma demo qeydləri. Şəbəkədən məlumat alınmır.
const profileSampleNames = (() => {
  const givenNames = ['Aylin','Nərmin','Leyla','Günel','Aysel','Sevinc','Səbinə','Fidan','Zəhra','Nigar',
    'Murad','Elvin','Orxan','Tural','Rəşad','Kənan','Emin','Fərid','Nurlan','Rauf'];
  const familyNames = ['Əliyev','Məmmədov','Hüseynov','Həsənov','Quliyev','İbrahimov','Rzayev','Səfərov','Əhmədov','İsmayılov',
    'Cabbarov','Abbasov','Mustafayev','Hacıyev','Qasımov','Şirinov','Bağırov','Babayev','Ələkbərov','Sultanov'];
  return givenNames.flatMap((given, index) => Array.from({length:5}, (_, offset) => {
    const family = familyNames[(index * 3 + offset * 7) % familyNames.length];
    return given + ' ' + family + (index < 10 ? 'a' : '');
  }));
})();
