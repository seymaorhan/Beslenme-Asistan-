import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const recipes = [
  // ─── ÇORBA ───────────────────────────────────────────────
  {
    name: "Domates Çorbası",
    category: "Çorba", tag: "Vegan", calories: 120, time: "25 dk", difficulty: "Kolay", emoji: "🍅",
    ingredients: JSON.stringify(["4 adet domates", "1 soğan", "2 diş sarımsak", "500ml su", "Tuz, karabiber", "Zeytinyağı"]),
    steps: JSON.stringify(["Soğan ve sarımsağı zeytinyağında soteleyin", "Domatesleri ekleyip 10 dk pişirin", "Su ekleyip 15 dk kaynatın", "Blenderdan geçirin, tuz karabiber ekleyin"]),
  },
  {
    name: "Mercimek Çorbası",
    category: "Çorba", tag: "Vegan", calories: 180, time: "30 dk", difficulty: "Kolay", emoji: "🥣",
    ingredients: JSON.stringify(["1 bardak kırmızı mercimek", "1 soğan", "1 havuç", "1 patates", "1L su", "Tuz, kimyon, kırmızı biber"]),
    steps: JSON.stringify(["Sebzeleri doğrayın", "Tüm malzemeleri tencereye alın", "25 dk pişirin", "Blenderdan geçirin", "Baharatları ekleyin"]),
  },
  {
    name: "Ezogelin Çorbası",
    category: "Çorba", tag: "Vegan", calories: 160, time: "35 dk", difficulty: "Kolay", emoji: "🍜",
    ingredients: JSON.stringify(["1 bardak kırmızı mercimek", "2 yemek kaşığı bulgur", "1 soğan", "1 yemek kaşığı salça", "Nane, kırmızı biber", "Zeytinyağı"]),
    steps: JSON.stringify(["Soğanı kavurun", "Salça ekleyip kavurun", "Mercimek ve bulgurun ekleyin", "Su ekleyip 25 dk pişirin", "Nane ve kırmızı biberle tatlandırın"]),
  },
  {
    name: "Tavuk Suyu Çorba",
    category: "Çorba", tag: null, calories: 150, time: "40 dk", difficulty: "Orta", emoji: "🍗",
    ingredients: JSON.stringify(["500g tavuk", "1 havuç", "1 kereviz", "1 soğan", "Tuz, karabiber", "Maydanoz"]),
    steps: JSON.stringify(["Tavuğu haşlayın", "Sebzeleri ekleyin", "30 dk pişirin", "Tavuğu didikleyip geri ekleyin", "Maydanozla servis edin"]),
  },
  {
    name: "Yayla Çorbası",
    category: "Çorba", tag: null, calories: 200, time: "30 dk", difficulty: "Orta", emoji: "🥛",
    ingredients: JSON.stringify(["1 bardak pirinç", "500g yoğurt", "2 yumurta sarısı", "1 yemek kaşığı un", "Nane, tereyağı"]),
    steps: JSON.stringify(["Pirinci haşlayın", "Yoğurt, yumurta ve unu karıştırın", "Yavaşça çorbaya ekleyin", "Tereyağında nane kızartıp gezdirin"]),
  },
  {
    name: "Balkabağı Çorbası",
    category: "Çorba", tag: "Vegan", calories: 110, time: "35 dk", difficulty: "Kolay", emoji: "🎃",
    ingredients: JSON.stringify(["500g balkabağı", "1 soğan", "2 diş sarımsak", "500ml su", "Zencefil", "Zerdeçal", "Zeytinyağı"]),
    steps: JSON.stringify(["Balkabağını küp doğrayın", "Soğan ve sarımsağı soteleyin", "Kabağı ekleyip 20 dk pişirin", "Blenderdan geçirin", "Baharatlarla tatlandırın"]),
  },
  {
    name: "Doğu Çorbası",
    category: "Çorba", tag: null, calories: 210, time: "45 dk", difficulty: "Orta", emoji: "🫕",
    ingredients: JSON.stringify(["200g kemikli et", "1 soğan", "1 domates", "1 biber", "Kırmızı biber, kimyon", "Nohut"]),
    steps: JSON.stringify(["Eti haşlayın", "Sebzeleri ekleyin", "Nohut ekleyip 30 dk pişirin", "Baharatları ekleyin", "Servis edin"]),
  },

  // ─── ANA YEMEK ───────────────────────────────────────────
  {
    name: "Tavuk Sote",
    category: "Ana Yemek", tag: "Sporcu", calories: 320, time: "35 dk", difficulty: "Orta", emoji: "🍗",
    ingredients: JSON.stringify(["500g tavuk göğsü", "1 biber", "1 domates", "1 soğan", "Zeytinyağı", "Tuz, karabiber, kekik"]),
    steps: JSON.stringify(["Tavuğu küp doğrayın", "Zeytinyağında soteleyin", "Sebzeleri ekleyin", "15 dk pişirin", "Baharatları ekleyip servis edin"]),
  },
  {
    name: "Karnıyarık",
    category: "Ana Yemek", tag: null, calories: 420, time: "60 dk", difficulty: "Zor", emoji: "🍆",
    ingredients: JSON.stringify(["4 patlıcan", "300g kıyma", "2 domates", "1 soğan", "Biber salçası", "Maydanoz"]),
    steps: JSON.stringify(["Patlıcanları yağda kızartın", "İç harcı hazırlayın", "Patlıcanları doldurun", "Fırında 25 dk pişirin"]),
  },
  {
    name: "Fırında Somon",
    category: "Ana Yemek", tag: "Sporcu", calories: 280, time: "30 dk", difficulty: "Kolay", emoji: "🐟",
    ingredients: JSON.stringify(["2 somon fileto", "Limon", "Sarımsak", "Dereotu", "Zeytinyağı", "Tuz"]),
    steps: JSON.stringify(["Fırını 200°C ısıtın", "Somonu baharatlarla marine edin", "25 dk fırınlayın"]),
  },
  {
    name: "İmam Bayıldı",
    category: "Ana Yemek", tag: "Vegan", calories: 300, time: "50 dk", difficulty: "Orta", emoji: "🍆",
    ingredients: JSON.stringify(["3 patlıcan", "3 soğan", "4 domates", "4 diş sarımsak", "Zeytinyağı", "Maydanoz", "Şeker"]),
    steps: JSON.stringify(["Patlıcanları boylamasına kesin", "İç harcı hazırlayın", "Patlıcanlara doldurun", "Zeytinyağı ve su ekleyip kısık ateşte pişirin"]),
  },
  {
    name: "Hünkar Beğendi",
    category: "Ana Yemek", tag: null, calories: 480, time: "70 dk", difficulty: "Zor", emoji: "🥩",
    ingredients: JSON.stringify(["500g kuzu eti", "3 patlıcan", "2 yemek kaşığı tereyağı", "2 yemek kaşığı un", "200ml süt", "Kaşar peyniri"]),
    steps: JSON.stringify(["Kuzu etini haşlayın", "Patlıcanları közleyin", "Beşamel sos hazırlayın", "Patlıcanı sosla karıştırın", "Et üstüne servis edin"]),
  },
  {
    name: "Köfte",
    category: "Ana Yemek", tag: null, calories: 390, time: "25 dk", difficulty: "Kolay", emoji: "🫓",
    ingredients: JSON.stringify(["500g kıyma", "1 soğan (rendelenmiş)", "2 diş sarımsak", "Maydanoz", "Tuz, karabiber, kimyon", "Galeta unu"]),
    steps: JSON.stringify(["Tüm malzemeleri yoğurun", "Köfte şekli verin", "Tavada veya fırında pişirin", "Yanında pilav ile servis edin"]),
  },
  {
    name: "Mantı",
    category: "Ana Yemek", tag: null, calories: 460, time: "90 dk", difficulty: "Zor", emoji: "🥟",
    ingredients: JSON.stringify(["2 bardak un", "1 yumurta", "250g kıyma", "1 soğan", "500g yoğurt", "Sarımsak, nane, pul biber", "Tereyağı"]),
    steps: JSON.stringify(["Hamuru yoğurun", "İnce açıp kesin", "Kıymalı harçla doldurun", "Haşlayın", "Yoğurt ve tereyağlı sosla servis edin"]),
  },
  {
    name: "Kuzu Tandır",
    category: "Ana Yemek", tag: null, calories: 520, time: "180 dk", difficulty: "Zor", emoji: "🍖",
    ingredients: JSON.stringify(["1kg kuzu but", "Sarımsak", "Zeytinyağı", "Kekik, biberiye", "Tuz, karabiber", "Soğan"]),
    steps: JSON.stringify(["Eti marine edin", "Fırın torbasına koyun", "160°C'de 3 saat pişirin", "Altın rengi için folyo açın", "Dinlendir ve servis et"]),
  },
  {
    name: "Domates Soslu Makarna",
    category: "Ana Yemek", tag: "Vegan", calories: 380, time: "20 dk", difficulty: "Kolay", emoji: "🍝",
    ingredients: JSON.stringify(["300g spagetti", "4 domates", "2 diş sarımsak", "1 soğan", "Zeytinyağı", "Tuz, karabiber", "Fesleğen"]),
    steps: JSON.stringify(["Makarnayı tuzlu suda haşlayın", "Soğan ve sarımsağı kavurun", "Domatesleri ekleyip 10 dk pişirin", "Makarnayı sosla karıştırın"]),
  },
  {
    name: "Izgara Tavuk",
    category: "Ana Yemek", tag: "Sporcu", calories: 250, time: "25 dk", difficulty: "Kolay", emoji: "🍖",
    ingredients: JSON.stringify(["2 tavuk göğsü", "Zeytinyağı", "Limon suyu", "Sarımsak", "Kekik, biberiye", "Tuz, karabiber"]),
    steps: JSON.stringify(["Tavuğu marine edin (30 dk)", "Izgara veya tavada pişirin", "Her tarafı altın rengi yapın", "Yanında sebze ile servis edin"]),
  },
  {
    name: "Sebzeli Güveç",
    category: "Ana Yemek", tag: "Vegan", calories: 290, time: "55 dk", difficulty: "Orta", emoji: "🫕",
    ingredients: JSON.stringify(["2 patlıcan", "3 domates", "2 biber", "2 kabak", "2 patates", "Zeytinyağı", "Sarımsak", "Tuz, karabiber"]),
    steps: JSON.stringify(["Sebzeleri doğrayın", "Güvece dizin", "Zeytinyağı ve baharatları ekleyin", "180°C'de 45 dk pişirin"]),
  },

  // ─── TATLI ───────────────────────────────────────────────
  {
    name: "Sütlaç",
    category: "Tatlı", tag: null, calories: 220, time: "40 dk", difficulty: "Orta", emoji: "🍮",
    ingredients: JSON.stringify(["1L süt", "4 yemek kaşığı pirinç", "6 yemek kaşığı şeker", "2 yemek kaşığı nişasta", "Vanilya"]),
    steps: JSON.stringify(["Pirinci haşlayın", "Sütü kaynatın", "Şeker ve nişastayı ekleyin", "Kısık ateşte pişirin", "Kaselerine dökün"]),
  },
  {
    name: "Kazandibi",
    category: "Tatlı", tag: null, calories: 260, time: "50 dk", difficulty: "Zor", emoji: "🍯",
    ingredients: JSON.stringify(["1L süt", "100g şeker", "60g nişasta", "30g un", "Vanilya"]),
    steps: JSON.stringify(["Malzemeleri karıştırın", "Kısık ateşte pişirin", "Tepsiye dökün", "Altı kızarana kadar bekleyin", "Ters çevirin"]),
  },
  {
    name: "Baklava",
    category: "Tatlı", tag: null, calories: 480, time: "90 dk", difficulty: "Zor", emoji: "🍬",
    ingredients: JSON.stringify(["500g yufka", "300g ceviz", "200g tereyağı", "2 bardak şeker", "1 bardak su", "Limon"]),
    steps: JSON.stringify(["Yufkaları tereyağıyla yağlayın", "Ceviz serpin", "Katman katman dizin", "Kesin ve 180°C'de pişirin", "Şerbeti dökün"]),
  },
  {
    name: "Aşure",
    category: "Tatlı", tag: "Vegan", calories: 310, time: "120 dk", difficulty: "Zor", emoji: "🫙",
    ingredients: JSON.stringify(["Buğday", "Nohut", "Kuru fasulye", "Kuru kayısı", "Fındık", "Ceviz", "Şeker", "Tarçın"]),
    steps: JSON.stringify(["Hububatı gece ıslatın", "Sabah haşlayın", "Şeker ve kuruları ekleyin", "Pişirin", "Soğutup servis edin"]),
  },
  {
    name: "Revani",
    category: "Tatlı", tag: null, calories: 350, time: "45 dk", difficulty: "Orta", emoji: "🍰",
    ingredients: JSON.stringify(["2 yumurta", "1 bardak şeker", "1 bardak irmik", "1/2 bardak un", "1 bardak yoğurt", "Şerbet için şeker ve su"]),
    steps: JSON.stringify(["Malzemeleri karıştırın", "Yağlı tepsiye dökün", "180°C'de 35 dk pişirin", "Şerbeti dökün", "Soğuduktan sonra servis edin"]),
  },
  {
    name: "Muhallebi",
    category: "Tatlı", tag: null, calories: 190, time: "20 dk", difficulty: "Kolay", emoji: "🥛",
    ingredients: JSON.stringify(["1L süt", "5 yemek kaşığı şeker", "3 yemek kaşığı nişasta", "1 yemek kaşığı gül suyu"]),
    steps: JSON.stringify(["Sütü ısıtın", "Nişasta ve şekeri ekleyin", "Karıştırarak koyulaştırın", "Gül suyunu ekleyin", "Kaselerine dökün"]),
  },
  {
    name: "Kadayıf",
    category: "Tatlı", tag: null, calories: 420, time: "60 dk", difficulty: "Orta", emoji: "🍯",
    ingredients: JSON.stringify(["500g tel kadayıf", "200g tereyağı", "200g ceviz", "2 bardak şeker", "1 bardak su"]),
    steps: JSON.stringify(["Kadayıfı tereyağıyla yağlayın", "Ceviz serpin", "Pişirin", "Şerbet dökün", "Soğutup servis edin"]),
  },
  {
    name: "Lokma",
    category: "Tatlı", tag: "Vegan", calories: 280, time: "30 dk", difficulty: "Orta", emoji: "🍩",
    ingredients: JSON.stringify(["2 bardak un", "1 paket maya", "1 bardak ılık su", "Tuz", "Kızartma yağı", "Şeker şerbeti"]),
    steps: JSON.stringify(["Hamuru hazırlayın", "30 dk mayalandırın", "Yağda kızartın", "Şerbete batırın", "Sıcak servis edin"]),
  },

  // ─── DİYET ───────────────────────────────────────────────
  {
    name: "Akdeniz Salatası",
    category: "Diyet", tag: "Vegan", calories: 140, time: "10 dk", difficulty: "Kolay", emoji: "🥗",
    ingredients: JSON.stringify(["Domates", "Salatalık", "Zeytin", "Beyaz peynir", "Kırmızı soğan", "Zeytinyağı", "Limon"]),
    steps: JSON.stringify(["Tüm sebzeleri doğrayın", "Zeytinyağı ve limon ile harmanlayın", "Servis edin"]),
  },
  {
    name: "Smoothie Bowl",
    category: "Diyet", tag: "Vegan", calories: 190, time: "5 dk", difficulty: "Kolay", emoji: "🫐",
    ingredients: JSON.stringify(["Muz", "Yaban mersini", "Çilek", "Yulaf", "Badem sütü", "Chia tohumu"]),
    steps: JSON.stringify(["Meyveleri blenderdan geçirin", "Kaseye dökün", "Üzerine yulaf ve tohum serpin"]),
  },
  {
    name: "Avokado Toast",
    category: "Diyet", tag: "Vegan", calories: 250, time: "10 dk", difficulty: "Kolay", emoji: "🥑",
    ingredients: JSON.stringify(["2 dilim tam tahıllı ekmek", "1 avokado", "Limon suyu", "Tuz, karabiber", "Kırmızı biber", "Taze nane"]),
    steps: JSON.stringify(["Ekmeği kızartın", "Avokadonun ezin", "Limon ve baharatları ekleyin", "Ekmek üzerine sürün"]),
  },
  {
    name: "Chia Puding",
    category: "Diyet", tag: "Vegan", calories: 160, time: "5 dk", difficulty: "Kolay", emoji: "🍶",
    ingredients: JSON.stringify(["3 yemek kaşığı chia tohumu", "250ml badem sütü", "1 yemek kaşığı bal", "Vanilya", "Taze meyve"]),
    steps: JSON.stringify(["Chia ve sütü karıştırın", "Buzdolabında 4 saat bekletin", "Meyve ve bal ile servis edin"]),
  },
  {
    name: "Izgara Sebze",
    category: "Diyet", tag: "Vegan", calories: 120, time: "20 dk", difficulty: "Kolay", emoji: "🥦",
    ingredients: JSON.stringify(["Kabak", "Patlıcan", "Biber", "Brokoli", "Zeytinyağı", "Sarımsak", "Tuz, karabiber"]),
    steps: JSON.stringify(["Sebzeleri doğrayın", "Zeytinyağı ve baharatlarla karıştırın", "Izgarada pişirin", "Limon sıkıp servis edin"]),
  },
  {
    name: "Ton Balıklı Salata",
    category: "Diyet", tag: null, calories: 200, time: "10 dk", difficulty: "Kolay", emoji: "🐟",
    ingredients: JSON.stringify(["1 kutu ton balığı", "Marul", "Cherry domates", "Salatalık", "Mısır", "Zeytinyağı", "Limon"]),
    steps: JSON.stringify(["Sebzeleri doğrayın", "Ton balığını ekleyin", "Zeytinyağı ve limon ile karıştırın", "Servis edin"]),
  },
  {
    name: "Kinoa Salatası",
    category: "Diyet", tag: "Vegan", calories: 230, time: "25 dk", difficulty: "Kolay", emoji: "🌾",
    ingredients: JSON.stringify(["1 bardak kinoa", "Salatalık", "Domates", "Maydanoz", "Limon suyu", "Zeytinyağı", "Tuz"]),
    steps: JSON.stringify(["Kinoayı pişirin", "Sebzeleri doğrayın", "Tüm malzemeleri karıştırın", "Limon ve zeytinyağı ekleyin"]),
  },
  {
    name: "Yoğurtlu Nohut",
    category: "Diyet", tag: null, calories: 250, time: "10 dk", difficulty: "Kolay", emoji: "🫘",
    ingredients: JSON.stringify(["1 kutu haşlanmış nohut", "300g yoğurt", "2 diş sarımsak", "Zeytinyağı", "Kırmızı biber", "Maydanoz"]),
    steps: JSON.stringify(["Sarımsağı yoğurtla karıştırın", "Nohutu ekleyin", "Üzerine zeytinyağı gezdirin", "Kırmızı biber serpin"]),
  },

  // ─── SPORCU ──────────────────────────────────────────────
  {
    name: "Protein Kasesi",
    category: "Sporcu", tag: "Sporcu", calories: 380, time: "15 dk", difficulty: "Kolay", emoji: "💪",
    ingredients: JSON.stringify(["200g tavuk göğsü", "Kinoa", "Avokado", "Cherry domates", "Ispanak", "Limon sosu"]),
    steps: JSON.stringify(["Tavuğu pişirin", "Kinoayı haşlayın", "Kasede düzenleyin", "Sos ekleyin"]),
  },
  {
    name: "Izgara Köfte",
    category: "Sporcu", tag: "Sporcu", calories: 410, time: "20 dk", difficulty: "Orta", emoji: "🥩",
    ingredients: JSON.stringify(["500g kıyma", "1 soğan", "2 diş sarımsak", "Maydanoz", "Tuz, karabiber, kimyon"]),
    steps: JSON.stringify(["Tüm malzemeleri yoğurun", "Köfte şekli verin", "Izgarada pişirin", "Yanında salata ile servis edin"]),
  },
  {
    name: "Yumurtalı Sebze",
    category: "Sporcu", tag: null, calories: 290, time: "15 dk", difficulty: "Kolay", emoji: "🍳",
    ingredients: JSON.stringify(["4 yumurta", "Ispanak", "Domates", "Biber", "Soğan", "Zeytinyağı", "Tuz, karabiber"]),
    steps: JSON.stringify(["Sebzeleri kavurun", "Yumurtaları kırın", "Karıştırarak pişirin", "Servis edin"]),
  },
  {
    name: "Ton Balıklı Wrap",
    category: "Sporcu", tag: null, calories: 340, time: "10 dk", difficulty: "Kolay", emoji: "🌯",
    ingredients: JSON.stringify(["1 kutu ton balığı", "Tam tahıllı tortilla", "Marul", "Domates", "Yoğurt sosu", "Limon"]),
    steps: JSON.stringify(["Ton balığını hazırlayın", "Tortillayı ısıtın", "Malzemeleri üstüne dizin", "Rulo sarın"]),
  },
  {
    name: "Yulaf Ezmesi",
    category: "Sporcu", tag: "Vegan", calories: 310, time: "10 dk", difficulty: "Kolay", emoji: "🌾",
    ingredients: JSON.stringify(["1 bardak yulaf ezmesi", "2 bardak süt", "Muz", "Yaban mersini", "Bal", "Ceviz"]),
    steps: JSON.stringify(["Yulafı sütle pişirin", "Kıvam alınca indirin", "Meyve ve ceviz ekleyin", "Bal ile tatlandırın"]),
  },
  {
    name: "Fırında Hindi Göğsü",
    category: "Sporcu", tag: null, calories: 220, time: "40 dk", difficulty: "Kolay", emoji: "🦃",
    ingredients: JSON.stringify(["500g hindi göğsü", "Sarımsak", "Limon", "Kekik, biberiye", "Zeytinyağı", "Tuz"]),
    steps: JSON.stringify(["Hindiyi marine edin", "Fırın tepsisine koyun", "180°C'de 35 dk pişirin", "Dinlendir ve dilimle"]),
  },
  {
    name: "Mercimekli Köfte",
    category: "Sporcu", tag: "Vegan", calories: 270, time: "30 dk", difficulty: "Orta", emoji: "🌿",
    ingredients: JSON.stringify(["1 bardak kırmızı mercimek", "1 bardak ince bulgur", "1 soğan", "Salça", "Maydanoz", "Tuz, kimyon, pul biber"]),
    steps: JSON.stringify(["Mercimeği pişirin", "Sıcakken bulguru ekleyin", "Kapağı kapatın", "Soğanı kavurup ekleyin", "Yoğurup şekil verin"]),
  },
  {
    name: "Protein Omlet",
    category: "Sporcu", tag: null, calories: 350, time: "10 dk", difficulty: "Kolay", emoji: "🍳",
    ingredients: JSON.stringify(["4 yumurta", "100g beyaz peynir", "Ispanak", "Domates", "Zeytinyağı", "Tuz, karabiber"]),
    steps: JSON.stringify(["Yumurtaları çırpın", "Sebzeleri ekleyin", "Tavada pişirin", "Peyniri serpin", "İki katla servis et"]),
  },
];

async function main() {
  console.log("Seed başlıyor...");
  // MSSQL'de cascade yok (Recipe→Favorite/WeeklyPlan NoAction)
  // Bu yüzden önce bağımlı tabloları temizle
  await prisma.weeklyPlan.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.shoppingItem.deleteMany();
  await prisma.recipe.deleteMany();
  await prisma.user.deleteMany();

  for (const recipe of recipes) {
    await prisma.recipe.create({ data: recipe });
  }
  console.log(`✅ ${recipes.length} tarif eklendi!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
