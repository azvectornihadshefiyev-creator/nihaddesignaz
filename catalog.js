/* Əlaqə məlumatını burada yaz. WhatsApp nömrəsi ölkə kodu ilə, yalnız rəqəmlər. */
const studioContact = { whatsapp: '', email: '', instagram: '' };

const catalog = [
  { id:'logo', title:'Loqo dizaynı', mark:'◈', color:'#b49aff', description:'Profil şəklindən lövhəyə qədər işləyən sadə işarə və ya yazı loqosu.', samples:['PULS','MONO','ORBIT','FORMA','NOVA'], plans:[
    ['Sadə loqo',20,'Biznesinə uyğun 1 loqo konsepti','Təsdiq üçün önizləmə','Şəffaf PNG','Düzəliş ayrıca razılaşdırılır'],
    ['Minimalist loqo',50,'İki ilkin istiqamət, bir yekun loqo','2 düzəliş raundu','Açıq və tünd PNG, 1 mockup'],
    ['Loqo və vizual dəst',100,'Loqo, rəng palitrası və şrift seçimi','2 düzəliş raundu','PNG, laylı PSD, profil şəkli və qısa PDF']
  ]},
  { id:'identity', title:'Vizual kimlik', mark:'✦', color:'#82e8cb', description:'Loqo, rəng və yazı üslubunu vahid görünüşdə birləşdirən dəst.', samples:['RƏNG','ŞRİFT','TƏTBİQ'], plans:[
    ['Vizual istiqamət',45,'Mövcud loqo ilə rəng və şrift seçimi','1 düzəliş raundu','1 səhifəlik PDF'],
    ['Başlanğıc kimlik',100,'Minimalist loqo, palitra və profil şəkli','2 düzəliş raundu','PNG və istifadə qaydaları PDF'],
    ['Sosial kimlik',145,'Başlanğıc kimlik və 3 sosial şablon','2 düzəliş raundu','PNG, PDF və razılaşdırılmış redaktə faylı']
  ]},
  { id:'social', title:'Sosial media dizaynı', mark:'◐', color:'#ff9ac8', description:'Kampaniya və elanlar üçün post və story vizualları.', samples:['POST','STORY','KAMPANİYA'], plans:[
    ['Bir vizual',20,'1 post və ya story','1 düzəliş raundu','PNG və ya JPG'],
    ['Kampaniya dəsti',50,'2 post və 2 uyğun story','2 düzəliş raundu','4 hazır PNG'],
    ['Sosial vitrin',90,'4 post və 4 uyğun story','2 düzəliş raundu','PNG və razılaşdırılmış redaktə faylı']
  ]},
  { id:'poster', title:'Poster və afişa', mark:'▧', color:'#ffb879', description:'Məhsul, kampaniya və elan üçün əsas vizual.', samples:['AFİŞA','ELAN','REKLAM'], plans:[
    ['Rəqəmsal poster',25,'1 poster, 1 ölçü','1 düzəliş raundu','PNG və ya JPG'],
    ['Çap və ekran',50,'1 poster, 2 ölçü','2 düzəliş raundu','PNG və çap ölçüsünə uyğun PDF'],
    ['Kampaniya vizualı',85,'Əsas poster və 3 ölçüyə adaptasiya','2 düzəliş raundu','PNG, PDF və laylı PSD']
  ]},
  { id:'print', title:'Vizit kart və çap dizaynı', mark:'▰', color:'#8acbff', description:'Vizit kart, kiçik flayer və fincan üzəri üçün tətbiq dizaynı.', samples:['VİZİT','FLAYER','FİNCAN'], plans:[
    ['Vizit kart',25,'1 vizit kartı, iki üz','1 düzəliş raundu','PDF və önizləmə'],
    ['Bir çap tətbiqi',45,'Flayer və ya fincan üçün 1 dizayn','2 düzəliş raundu','İstehsalçının ölçüsünə uyğun PDF və ya PNG'],
    ['Çap dəsti',75,'Vizit kart və 1 əlavə tətbiq','2 düzəliş raundu','PDF, önizləmə və 1 mockup']
  ]},
  { id:'video', title:'Qısa video montajı', mark:'▶', color:'#f3db88', description:'Hazır çəkilişlərindən şaquli sosial media reklamı.', samples:['KƏSİM','TİTR','REELS'], plans:[
    ['Qısa montaj',30,'15 saniyəyədək, müştəri çəkilişlərindən','1 düzəliş raundu','Şaquli MP4'],
    ['Reklam videosu',60,'30 saniyəyədək, mətn və sadə subtitr','2 düzəliş raundu','Şaquli MP4 və üz qabığı'],
    ['İki versiya',95,'Əsas video və qısa alternativ kəsim','2 düzəliş raundu','2 MP4 və üz qabığı']
  ]}
];

const serviceGroups = {
  'Loqo və kimlik': ['logo','identity','wordmark','logo-refresh'],
  'Sosial media və reklam': ['social','poster','covers','product','campaign'],
  'Çap və təqdimat': ['print','business-card','flyer','label','menu','merch','slides'],
  'Video və montaj': ['video','subtitles','shorts']
};

const moreServices = [
  ['wordmark','Yazı və inisial loqosu','Aa','#c4a9ff','Biznes adından və ya baş hərflərindən qurulan loqo.',
    [['İnisial',25,'1 hərf kompozisiyası','Şəffaf PNG'],['Yazı loqosu',45,'1 yazı loqosu, 2 fon üçün variant','Şəffaf PNG'],['Yazı və inisial',75,'Eyni üslubda ad və qısa inisial','PNG və profil şəkli']]],
  ['logo-refresh','Loqonun yenilənməsi','↗','#a6b9ff','Mövcud loqonu daha oxunaqlı və istifadəyə uyğun hala gətirirəm.',
    [['PNG hazırlanması',20,'Mövcud fayldan fonun təmizlənməsi','Şəffaf PNG'],['Sadələşdirmə',45,'Mövcud işarə və yazının təmizlənməsi','Açıq və tünd PNG'],['Tətbiq dəsti',70,'Yenilənmiş loqo və profil ölçüləri','PNG və 1 mockup']]],
  ['covers','Üz qabığı və banner','▣','#a3b9ff','Profil, video və reklam üçün ölçüyə uyğun dizayn.',
    [['Bir üz qabığı',15,'1 platforma və 1 ölçü','PNG'],['Profil dəsti',35,'Profil və üz qabığı','2 PNG'],['Kanal dəsti',60,'Üz qabığı və 3 video eskizi','4 PNG']]],
  ['product','Məhsul kartı','▤','#f4ab86','Mağaza və sosial media üçün məhsul fotosu, qiymət və məlumat kartı.',
    [['Bir məhsul',20,'1 məhsul kartı','PNG'],['Kiçik vitrin',45,'Eyni üslubda 3 məhsul kartı','3 PNG'],['Məhsul seriyası',80,'Eyni üslubda 6 məhsul kartı','6 PNG']]],
  ['campaign','Kampaniya dəsti','✷','#f59acc','Eyni vizual üslubda bir neçə reklam formatı.',
    [['Elan dəsti',45,'1 əsas vizual, post və story ölçüsü','2 PNG'],['Kampaniya',85,'2 post, 2 story və 1 banner','5 PNG'],['Kampaniya və video',130,'Kampaniya vizualları və 15 saniyəlik montaj','PNG və MP4']]],
  ['business-card','Vizit kart','▰','#8acbff','Əlaqə məlumatları üçün tək və ikiüzlü vizit kart dizaynı.',
    [['Təküzlü',20,'1 təküzlü dizayn','Çap ölçüsündə PDF'],['İkiüzlü',30,'1 ikiüzlü dizayn','PDF və JPG önizləmə'],['Komanda kartları',55,'Eyni dizaynda 3 əməkdaş üçün kart','3 PDF və önizləmə']]],
  ['flyer','Flayer və buklet','▱','#ffc485','Kampaniya və xidmət məlumatları üçün çap materialı.',
    [['Birüzlü flayer',25,'1 üz, 1 çap ölçüsü','PDF'],['İkiüzlü flayer',45,'2 üz, 1 çap ölçüsü','PDF və önizləmə'],['Qatlanan buklet',75,'Mətbəənin şablonu üzrə 1 buklet','PDF və önizləmə']]],
  ['label','Etiket və stiker','◇','#a6e8c9','Məhsul üzərində istifadə olunan etiket və stiker dizaynı.',
    [['Bir stiker',20,'1 forma və 1 ölçü','PDF və ya PNG'],['Məhsul etiketi',40,'İstehsalçının ölçüsünə uyğun 1 etiket','PDF və önizləmə'],['Etiket seriyası',70,'Eyni dizaynın 3 məhsul variantı','3 PDF']]],
  ['menu','Menyu və qiymət siyahısı','☷','#ffca91','Məhsul və xidmət qiymətlərini oxunaqlı təqdim edən maket.',
    [['Bir səhifə',25,'Müştərinin təqdim etdiyi mətnlə 1 səhifə','PDF və PNG'],['İki səhifə',45,'2 səhifəlik menyu və ya qiymət siyahısı','PDF və PNG'],['Çap və telefon',75,'2 səhifəlik menyu və mobil ölçülər','Çap PDF-i və mobil PNG']]],
  ['merch','Fincan və geyim dizaynı','✿','#dfb0ff','Fincan və ya geyim üçün vizualın çap ölçüsünə uyğunlaşdırılması.',
    [['Loqo tətbiqi',20,'Mövcud loqonun 1 səthə uyğunlaşdırılması','PNG və önizləmə'],['Fərdi dizayn',40,'1 səth üçün yeni qrafik kompozisiya','PNG və 1 mockup'],['İki məhsul',65,'Fincan və geyim üçün uyğun 2 tətbiq','2 PNG və 2 mockup']]],
  ['slides','Slayd və dərs materialı','▥','#c3dca5','Hazır mətnin təqdimat və ya iş vərəqi kimi tərtibatı.',
    [['Bir iş vərəqi',20,'1 A4 səhifə','PDF'],['Qısa təqdimat',45,'Müştərinin mətni ilə 5 slaydadək','PDF və razılaşdırılmış redaktə faylı'],['Tədris dəsti',85,'10 slaydadək və 1 iş vərəqi','PDF və razılaşdırılmış redaktə faylı']]],
  ['subtitles','Video altyazısı','CC','#abdbfc','Qısa video üçün oxunaqlı altyazı və sadə mətn tərtibatı.',
    [['Qısa altyazı',15,'30 saniyəyədək 1 video','Altyazılı MP4'],['Bir dəqiqə',25,'60 saniyəyədək video və altyazı tərtibatı','MP4'],['Üç video',60,'Hər biri 60 saniyəyədək 3 video','3 MP4']]],
  ['shorts','Reels və Shorts dəsti','▷','#f3db88','Bir çəkilişdən bir neçə şaquli video kəsimi.',
    [['Bir kəsim',25,'Müştərinin çəkilişindən 1 qısa video','MP4'],['İki kəsim',45,'Eyni çəkilişdən iki şaquli variant','2 MP4'],['Üç kəsim',70,'3 video və uyğun üz qabıqları','3 MP4 və 3 PNG']]]
];

catalog.push(...moreServices.map(([id,title,mark,color,description,plans]) => ({
  id,title,mark,color,description,samples:[title],plans:plans.map(([name,price,scope,files]) => [
    name,price,scope,'1 düzəliş raundu',files
  ])
})));

const posterPackages = [
  {id:'poster-start', name:'Başlanğıc', quantity:10, price:150, image:'assets/concepts/qat.webp'},
  {id:'poster-growth', name:'Davamlı', quantity:20, price:250, image:'assets/concepts/puls.webp'},
  {id:'poster-scale', name:'Geniş', quantity:40, price:450, image:'assets/concepts/forma.webp'}
];
const posterTitle = 'Sosial media dizaynı';
const posterFormats = ['Şəkil','Video'];
const posterOptions = plan => (plan.quantity * 5) + '–' + (plan.quantity * 7) + ' şəkil variantı';
const posterPrice = plan => (plan.price / plan.quantity).toFixed(2).replace('.', ',') + ' AZN / mövzu';
