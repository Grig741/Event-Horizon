// Interface strings in English, Russian, Armenian and Spanish. News stories themselves stay in the
// language of their source (English). Each entry: [en, ru, hy, es]. {name} placeholders are filled by t().
export const LANGS = ["en", "ru", "hy", "es"];
export const LANG_NAMES = { en: "English", ru: "Русский", hy: "Հայերեն", es: "Español" };
const LOCALE = { en: "en-GB", ru: "ru-RU", hy: "hy-AM", es: "es-ES" };

const D = {
  "nav.today": ["Today", "Сегодня", "Այսօր", "Hoy"],
  "nav.news": ["News", "Новости", "Նորություններ", "Noticias"],
  "nav.planets": ["Planets", "Планеты", "Մոլորակներ", "Planetas"],
  "nav.learn": ["Learn", "Уроки", "Դասեր", "Aprender"],
  "nav.pro": ["Pro", "Pro", "Pro", "Pro"],
  "nav.sections": ["Sections", "Разделы", "Բաժիններ", "Secciones"],
  "nav.language": ["Language", "Язык", "Լեզու", "Idioma"],

  "hero.tagline": [
    "Today's space news, told by the thing it's about. A black hole presents black-hole news, Mars presents Mars.",
    "Космические новости дня рассказывает тот, о ком они. Новости о чёрных дырах ведёт чёрная дыра, о Марсе — Марс.",
    "Օրվա տիեզերական նորությունները պատմում է հենց այն, ում մասին դրանք են։ Սև խոռոչների մասին նորությունները վարում է սև խոռոչը, Մարսի մասին՝ Մարսը։",
    "Las noticias espaciales del día, contadas por su protagonista. Un agujero negro presenta las de agujeros negros; Marte, las de Marte."],
  "brief.presentedBy": ["Presented by", "Ведущий:", "Վարում է՝", "Presenta:"],
  "brief.count": ["{i} of {n}", "{i} из {n}", "{i} / {n}", "{i} de {n}"],
  "brief.loading": ["Tuning in…", "Настраиваемся…", "Միանում ենք…", "Sintonizando…"],
  "brief.readAt": ["Read the full story at {site}", "Читать полностью на {site}", "Կարդալ ամբողջությամբ՝ {site}", "Leer completo en {site}"],
  "brief.read": ["Read the full story", "Читать полностью", "Կարդալ ամբողջությամբ", "Leer la noticia completa"],
  "brief.skip": ["Show all text", "Показать весь текст", "Ցույց տալ ամբողջ տեքստը", "Mostrar todo el texto"],
  "brief.prev": ["Previous story", "Предыдущая новость", "Նախորդ նորությունը", "Noticia anterior"],
  "brief.next": ["Next story", "Следующая новость", "Հաջորդ նորությունը", "Noticia siguiente"],
  "brief.dot": ["Story {i}: {title}", "Новость {i}: {title}", "Նորություն {i}՝ {title}", "Noticia {i}: {title}"],
  "brief.sourceLang": ["", "Текст новости — на языке источника (английском).", "Նորության տեքստը աղբյուրի լեզվով է (անգլերեն)։", "El texto de la noticia está en el idioma de la fuente (inglés)."],

  "host.blackhole": ["A black hole", "Чёрная дыра", "Սև խոռոչ", "Un agujero negro"],
  "host.sun": ["The Sun", "Солнце", "Արեգակ", "El Sol"],
  "host.mercury": ["Mercury", "Меркурий", "Մերկուրի", "Mercurio"],
  "host.venus": ["Venus", "Венера", "Վեներա", "Venus"],
  "host.earth": ["Earth", "Земля", "Երկիր", "La Tierra"],
  "host.moon": ["The Moon", "Луна", "Լուսին", "La Luna"],
  "host.mars": ["Mars", "Марс", "Մարս", "Marte"],
  "host.jupiter": ["Jupiter", "Юпитер", "Յուպիտեր", "Júpiter"],
  "host.saturn": ["Saturn", "Сатурн", "Սատուրն", "Saturno"],
  "host.uranus": ["Uranus", "Уран", "Ուրան", "Urano"],
  "host.neptune": ["Neptune", "Нептун", "Նեպտուն", "Neptuno"],
  "host.galaxy": ["A galaxy", "Галактика", "Գալակտիկա", "Una galaxia"],
  "host.exoplanet": ["An exoplanet", "Экзопланета", "Էկզոմոլորակ", "Un exoplaneta"],
  "host.comet": ["A comet", "Комета", "Գիսաստղ", "Un cometa"],
  "host.transit": ["a planet is crossing: the starlight dips", "планета проходит по диску: блеск падает", "մոլորակն անցնում է աստղի առջևով․ լույսը թուլանում է", "un planeta pasa por delante: la luz baja"],
  "host.brightness": ["brightness of the star", "блеск звезды", "աստղի պայծառությունը", "brillo de la estrella"],

  "planet.Mercury": ["Mercury", "Меркурий", "Մերկուրի", "Mercurio"],
  "planet.Venus": ["Venus", "Венера", "Վեներա", "Venus"],
  "planet.Earth": ["Earth", "Земля", "Երկիր", "Tierra"],
  "planet.Mars": ["Mars", "Марс", "Մարս", "Marte"],
  "planet.Jupiter": ["Jupiter", "Юпитер", "Յուպիտեր", "Júpiter"],
  "planet.Saturn": ["Saturn", "Сатурн", "Սատուրն", "Saturno"],
  "planet.Uranus": ["Uranus", "Уран", "Ուրան", "Urano"],
  "planet.Neptune": ["Neptune", "Нептун", "Նեպտուն", "Neptuno"],

  "tonight.title": ["Tonight's sky", "Небо сегодня", "Այսօրվա երկինքը", "El cielo de esta noche"],
  "tonight.all": ["All planets", "Все планеты", "Բոլոր մոլորակները", "Todos los planetas"],
  "where.all night": ["Up all night, opposite the Sun", "Видна всю ночь, напротив Солнца", "Երևում է ամբողջ գիշեր՝ Արեգակի հակառակ կողմում", "Visible toda la noche, opuesto al Sol"],
  "where.evening": ["Evening sky, west after sunset", "Вечером, на западе после заката", "Երեկոյան՝ արևմուտքում, մայրամուտից հետո", "Al anochecer, al oeste tras la puesta de sol"],
  "where.morning": ["Morning sky, east before sunrise", "Утром, на востоке перед рассветом", "Առավոտյան՝ արևելքում, արևածագից առաջ", "Al amanecer, al este antes de la salida del sol"],
  "where.hidden": ["Lost in the Sun's glare", "Скрыта в лучах Солнца", "Թաքնված է Արեգակի լույսում", "Oculto por el resplandor del Sol"],
  "where.home": ["You are here", "Вы здесь", "Դուք այստեղ եք", "Estás aquí"],
  "moon.0": ["New Moon", "Новолуние", "Նորալուսին", "Luna nueva"],
  "moon.1": ["Waxing crescent", "Растущий серп", "Աճող մահիկ", "Creciente"],
  "moon.2": ["First quarter", "Первая четверть", "Առաջին քառորդ", "Cuarto creciente"],
  "moon.3": ["Waxing gibbous", "Растущая Луна", "Աճող լուսին", "Gibosa creciente"],
  "moon.4": ["Full Moon", "Полнолуние", "Լիալուսին", "Luna llena"],
  "moon.5": ["Waning gibbous", "Убывающая Луна", "Նվազող լուսին", "Gibosa menguante"],
  "moon.6": ["Last quarter", "Последняя четверть", "Վերջին քառորդ", "Cuarto menguante"],
  "moon.7": ["Waning crescent", "Убывающий серп", "Նվազող մահիկ", "Menguante"],
  "moon.line": [
    "Moon: {phase}, {pct}% lit. Visibility is for mid-latitudes; a planet near the Sun stays low in twilight.",
    "Луна: {phase}, освещено {pct}%. Видимость дана для средних широт; планета рядом с Солнцем видна низко в сумерках.",
    "Լուսին՝ {phase}, լուսավորված է {pct}%-ով։ Տեսանելիությունը տրված է միջին լայնությունների համար․ Արեգակին մոտ մոլորակը մթնշաղին ցածր է երևում։",
    "Luna: {phase}, {pct}% iluminada. La visibilidad es para latitudes medias; un planeta cerca del Sol se ve bajo en el crepúsculo."],
  "apod.title": ["NASA picture of the day", "Фото дня NASA", "NASA-ի օրվա լուսանկարը", "Foto del día de la NASA"],

  "news.title": ["News", "Новости", "Նորություններ", "Noticias"],
  "news.lede": [
    "Live from the Spaceflight News API. Tap a story and its host will tell it.",
    "Живая лента из Spaceflight News API. Нажмите на новость, и её расскажет свой ведущий. Тексты новостей на английском, как в источниках.",
    "Ուղիղ Spaceflight News API-ից։ Սեղմեք նորության վրա, և այն կպատմի իր վարողը։ Նորությունների տեքստերը անգլերեն են, ինչպես աղբյուրներում։",
    "En directo desde Spaceflight News API. Toca una noticia y su presentador te la contará. Los textos están en inglés, como en las fuentes."],
  "news.filter": ["Filter by topic", "Фильтр по теме", "Զտել ըստ թեմայի", "Filtrar por tema"],
  "f.all": ["All", "Все", "Բոլորը", "Todas"],
  "f.blackhole": ["Black holes", "Чёрные дыры", "Սև խոռոչներ", "Agujeros negros"],
  "f.sun": ["The Sun", "Солнце", "Արեգակ", "El Sol"],
  "f.moon": ["The Moon", "Луна", "Լուսին", "La Luna"],
  "f.mars": ["Mars", "Марс", "Մարս", "Marte"],
  "f.jupiter": ["Jupiter", "Юпитер", "Յուպիտեր", "Júpiter"],
  "f.saturn": ["Saturn", "Сатурн", "Սատուրն", "Saturno"],
  "f.galaxy": ["Deep space", "Дальний космос", "Խորը տիեզերք", "Espacio profundo"],
  "f.exoplanet": ["Exoplanets", "Экзопланеты", "Էկզոմոլորակներ", "Exoplanetas"],
  "f.comet": ["Comets & asteroids", "Кометы и астероиды", "Գիսաստղեր և աստերոիդներ", "Cometas y asteroides"],
  "f.earth": ["Launches & Earth orbit", "Запуски и орбита Земли", "Արձակումներ և Երկրի ուղեծիր", "Lanzamientos y órbita terrestre"],
  "news.toldBy": ["Told by {name}", "Рассказывает: {name}", "Պատմում է՝ {name}", "Lo cuenta: {name}"],
  "news.more": ["Show more stories", "Показать ещё", "Ցույց տալ ավելին", "Mostrar más noticias"],
  "news.empty": ["No stories on this topic in the last few days. Try another one.", "За последние дни новостей по этой теме нет. Выберите другую.", "Վերջին օրերին այս թեմայով նորություններ չկան։ Ընտրեք մեկ այլ թեմա։", "No hay noticias de este tema en los últimos días. Prueba otro."],
  "news.offline": ["The news feed is not reachable right now. Check your connection and try again.", "Лента новостей сейчас недоступна. Проверьте подключение и попробуйте снова.", "Նորությունների հոսքը հիմա հասանելի չէ։ Ստուգեք կապը և փորձեք նորից։", "El feed de noticias no está disponible ahora. Revisa tu conexión e inténtalo de nuevo."],
  "news.retry": ["Try again", "Попробовать снова", "Կրկին փորձել", "Reintentar"],
  "news.locked": [
    "<b>That's the free part of the feed.</b> Pro opens the full archive and sends a digest to Telegram every morning.",
    "<b>Это бесплатная часть ленты.</b> Pro открывает весь архив и каждое утро присылает дайджест в Telegram.",
    "<b>Սա հոսքի անվճար մասն է։</b> Pro-ն բացում է ամբողջ արխիվը և ամեն առավոտ ամփոփում է ուղարկում Telegram-ով։",
    "<b>Esta es la parte gratuita del feed.</b> Pro abre el archivo completo y envía un resumen a Telegram cada mañana."],
  "news.seePro": ["See Pro · {price} Stars a month", "Pro · {price} звёзд в месяц", "Pro · {price} աստղ ամսական", "Ver Pro · {price} estrellas al mes"],

  "time.min": ["{n} min ago", "{n} мин назад", "{n} րոպե առաջ", "hace {n} min"],
  "time.h": ["{n} h ago", "{n} ч назад", "{n} ժամ առաջ", "hace {n} h"],
  "time.yesterday": ["yesterday", "вчера", "երեկ", "ayer"],
  "time.days": ["{n} days ago", "{n} дн. назад", "{n} օր առաջ", "hace {n} días"],

  "planets.title": ["Planets, right now", "Планеты прямо сейчас", "Մոլորակները հենց հիմա", "Los planetas, ahora mismo"],
  "planets.lede": [
    "Real positions, computed in your browser from NASA JPL orbital elements. Distances from the Sun are drawn on a square-root scale so Neptune still fits.",
    "Настоящие положения, рассчитанные в вашем браузере по орбитальным элементам NASA JPL. Расстояния от Солнца показаны в масштабе квадратного корня, чтобы поместился Нептун.",
    "Իրական դիրքեր՝ հաշվարկված ձեր բրաուզերում NASA JPL-ի ուղեծրային տարրերով։ Արեգակից հեռավորությունները ցույց են տրված քառակուսի արմատի մասշտաբով, որ Նեպտունն էլ տեղավորվի։",
    "Posiciones reales, calculadas en tu navegador con los elementos orbitales del JPL de la NASA. Las distancias al Sol se dibujan en escala de raíz cuadrada para que quepa Neptuno."],
  "planets.canvas": ["Map of the Solar System seen from above. Select a planet to see its details.", "Карта Солнечной системы сверху. Выберите планету, чтобы увидеть подробности.", "Արեգակնային համակարգի քարտեզը վերևից։ Ընտրեք մոլորակ՝ մանրամասները տեսնելու համար։", "Mapa del sistema solar visto desde arriba. Elige un planeta para ver sus datos."],
  "planets.today": ["Today", "Сегодня", "Այսօր", "Hoy"],
  "planets.play": ["Play", "Пуск", "Միացնել", "Reproducir"],
  "planets.pause": ["Pause", "Пауза", "Դադար", "Pausa"],
  "planets.days": ["Days from today", "Дней от сегодня", "Օրեր այսօրվանից", "Días desde hoy"],
  "planets.choose": ["Choose a planet", "Выберите планету", "Ընտրեք մոլորակ", "Elige un planeta"],
  "planets.onDate": ["On that date: {where}", "В этот день: {where}", "Այդ օրը՝ {where}", "En esa fecha: {where}"],
  "planets.above": ["Seen from above the Solar System · ♈ direction →", "Вид сверху на Солнечную систему · направление ♈ →", "Տեսքը Արեգակնային համակարգի վերևից · ♈ ուղղություն →", "Vista desde encima del sistema solar · dirección ♈ →"],
  "pf.distEarth": ["Distance from Earth", "Расстояние до Земли", "Հեռավորությունը Երկրից", "Distancia a la Tierra"],
  "pf.km": ["Same in km", "То же в км", "Նույնը կմ-ով", "Lo mismo en km"],
  "pf.million": ["{n} million", "{n} млн", "{n} միլիոն", "{n} millones"],
  "pf.light": ["Light takes", "Свет идёт", "Լույսը հասնում է", "La luz tarda"],
  "pf.min": ["{n} min", "{n} мин", "{n} րոպե", "{n} min"],
  "pf.hmin": ["{h} h {m} min", "{h} ч {m} мин", "{h} ժ {m} ր", "{h} h {m} min"],
  "pf.fromSun": ["From the Sun", "От Солнца", "Արեգակից", "Desde el Sol"],
  "pf.diameter": ["Diameter", "Диаметр", "Տրամագիծ", "Diámetro"],
  "pf.mass": ["Mass", "Масса", "Զանգված", "Masa"],
  "pf.massVal": ["{n} × Earth", "{n} × Земли", "{n} × Երկրի", "{n} × Tierra"],
  "pf.day": ["Day", "Сутки", "Օր", "Día"],
  "pf.year": ["Year", "Год", "Տարի", "Año"],
  "pf.moons": ["Moons", "Спутники", "Արբանյակներ", "Lunas"],
  "pf.none": ["none", "нет", "չկան", "ninguna"],
  "pf.temp": ["Temperature", "Температура", "Ջերմաստիճան", "Temperatura"],
  "pf.gravity": ["Gravity", "Гравитация", "Ձգողություն", "Gravedad"],
  "u.earthDays": ["{n} Earth days", "{n} земных суток", "{n} երկրային օր", "{n} días terrestres"],
  "u.hm": ["{h} h {m} min", "{h} ч {m} мин", "{h} ժ {m} ր", "{h} h {m} min"],
  "u.h": ["{h} hours", "{h} часа", "{h} ժամ", "{h} horas"],
  "u.days": ["{n} days", "{n} дней", "{n} օր", "{n} días"],
  "u.years": ["{n} years", "{n} лет", "{n} տարի", "{n} años"],
  "u.retro": ["; spins backwards", "; вращается в обратную сторону", "․ պտտվում է հակառակ ուղղությամբ", "; gira al revés"],
  "u.tAvg": ["{t} °C average", "в среднем {t} °C", "միջինը {t} °C", "{t} °C de media"],
  "u.tClouds": ["{t} °C at cloud tops", "{t} °C у верхней границы облаков", "{t} °C ամպերի վերին շերտում", "{t} °C en la cima de las nubes"],
  "u.au": ["AU", "а. е.", "ա. մ.", "UA"],
  "u.km": ["km", "км", "կմ", "km"],
  "u.ms2": ["m/s²", "м/с²", "մ/վ²", "m/s²"],
  "u.t": ["{t} °C", "{t} °C", "{t} °C", "{t} °C"],
  "note.Mercury": ["The smallest planet. A year there is shorter than its day.", "Самая маленькая планета. Год там короче суток.", "Ամենափոքր մոլորակը։ Այնտեղ տարին ավելի կարճ է, քան օրը։", "El planeta más pequeño. Allí un año dura menos que un día."],
  "note.Venus": ["The hottest planet: a thick CO₂ atmosphere traps heat.", "Самая горячая планета: плотная атмосфера из CO₂ удерживает тепло.", "Ամենաշոգ մոլորակը․ CO₂-ի խիտ մթնոլորտը պահում է ջերմությունը։", "El planeta más caliente: una densa atmósfera de CO₂ atrapa el calor."],
  "note.Earth": ["The only world known to host life.", "Единственный известный мир, где есть жизнь.", "Միակ հայտնի աշխարհը, որտեղ կյանք կա։", "El único mundo conocido con vida."],
  "note.Mars": ["Home of Olympus Mons, the tallest volcano known in the Solar System.", "Здесь находится Олимп — самый высокий известный вулкан Солнечной системы.", "Այստեղ է Օլիմպոս լեռը՝ Արեգակնային համակարգի ամենաբարձր հայտնի հրաբուխը։", "Hogar del Olympus Mons, el volcán más alto conocido del sistema solar."],
  "note.Jupiter": ["More than twice the mass of all other planets combined.", "Масса больше, чем у всех остальных планет вместе, более чем вдвое.", "Զանգվածը երկու անգամից ավելի մեծ է, քան մնացած բոլոր մոլորակներինը միասին։", "Tiene más del doble de masa que todos los demás planetas juntos."],
  "note.Saturn": ["Its rings are mostly water ice, yet often only about 10 m thick.", "Его кольца в основном из водяного льда, а толщина часто всего около 10 м.", "Նրա օղակները հիմնականում ջրային սառույց են, իսկ հաստությունը հաճախ ընդամենը մոտ 10 մ է։", "Sus anillos son sobre todo hielo de agua, y a menudo de solo unos 10 m de espesor."],
  "note.Uranus": ["Tipped over by 98°: it rolls around the Sun on its side.", "Наклонён на 98°: он движется вокруг Солнца, лёжа на боку.", "Թեքված է 98°-ով․ Արեգակի շուրջը պտտվում է կողքի վրա պառկած։", "Inclinado 98°: gira alrededor del Sol tumbado de lado."],
  "note.Neptune": ["The fastest winds measured on any planet, over 2,000 km/h.", "Самые быстрые ветры среди планет — более 2000 км/ч.", "Մոլորակներից ամենաարագ քամիները՝ ավելի քան 2000 կմ/ժ։", "Los vientos más rápidos medidos en un planeta, más de 2000 km/h."],
  "note.moons": [" Moon counts keep rising as surveys find small moons.", " Число спутников растёт: обзоры находят новые мелкие луны.", " Արբանյակների թիվն աճում է՝ դիտարկումները նորանոր փոքր լուսիններ են գտնում։", " El número de lunas sigue creciendo a medida que se descubren lunas pequeñas."],

  "learn.title": ["Learn by playing", "Учитесь, играя", "Սովորեք՝ խաղալով", "Aprende jugando"],
  "learn.lede": ["Each lesson is a small working model of the real physics. Move things and watch what happens.", "Каждый урок — маленькая рабочая модель настоящей физики. Двигайте объекты и смотрите, что происходит.", "Յուրաքանչյուր դաս իրական ֆիզիկայի փոքրիկ աշխատող մոդել է։ Շարժեք առարկաները և տեսեք, թե ինչ է կատարվում։", "Cada lección es un pequeño modelo de la física real. Mueve las cosas y mira qué pasa."],
  "learn.back": ["← All lessons", "← Все уроки", "← Բոլոր դասերը", "← Todas las lecciones"],
  "learn.free": ["Free", "Бесплатно", "Անվճար", "Gratis"],
  "learn.pro": ["Pro", "Pro", "Pro", "Pro"],
  "learn.unlocked": ["Pro · unlocked", "Pro · открыт", "Pro · բաց է", "Pro · desbloqueada"],
  "l.orbits": ["Orbits", "Орбиты", "Ուղեծրեր", "Órbitas"],
  "l.orbits.b": ["Throw bodies around a black hole and find out what makes an orbit, an escape or a fall.", "Бросайте тела вокруг чёрной дыры и узнайте, отчего получается орбита, побег или падение.", "Մարմիններ նետեք սև խոռոչի շուրջը և պարզեք, թե երբ է ստացվում ուղեծիր, փախուստ կամ անկում։", "Lanza cuerpos alrededor de un agujero negro y descubre qué produce una órbita, una fuga o una caída."],
  "l.kepler": ["Kepler's laws", "Законы Кеплера", "Կեպլերի օրենքները", "Leyes de Kepler"],
  "l.kepler.b": ["Ellipses, equal areas in equal times, and why T² = a³. Try Earth, Mars and Halley's Comet.", "Эллипсы, равные площади за равное время и почему T² = a³. Попробуйте Землю, Марс и комету Галлея.", "Էլիպսներ, հավասար ժամանակում՝ հավասար մակերեսներ, և ինչու T² = a³։ Փորձեք Երկիրը, Մարսը և Հալլեյի գիսաստղը։", "Elipses, áreas iguales en tiempos iguales y por qué T² = a³. Prueba la Tierra, Marte y el cometa Halley."],
  "l.scale": ["The true scale", "Настоящий масштаб", "Իրական մասշտաբը", "La escala real"],
  "l.scale.b": ["Ride a beam of light from the Sun to Neptune at real distances and real speed.", "Пролетите на луче света от Солнца до Нептуна по настоящим расстояниям и с настоящей скоростью.", "Լույսի ճառագայթով թռեք Արեգակից մինչև Նեպտուն՝ իրական հեռավորություններով և արագությամբ։", "Viaja en un rayo de luz del Sol a Neptuno a distancias y velocidad reales."],
  "learn.locked": ["<b>{title} is a Pro lesson.</b> {blurb}", "<b>«{title}» — урок для Pro.</b> {blurb}", "<b>«{title}»-ը Pro դաս է։</b> {blurb}", "<b>{title} es una lección Pro.</b> {blurb}"],
  "learn.unlock": ["Unlock with Pro · {price} Stars a month", "Открыть с Pro · {price} звёзд в месяц", "Բացել Pro-ով · {price} աստղ ամսական", "Desbloquear con Pro · {price} estrellas al mes"],
  "learn.fail": ["This lesson could not load. Check your connection and try again.", "Урок не загрузился. Проверьте подключение и попробуйте снова.", "Դասը չբեռնվեց։ Ստուգեք կապը և փորձեք նորից։", "La lección no se pudo cargar. Revisa tu conexión e inténtalo de nuevo."],
  "learn.failToast": ["Lesson failed to load", "Урок не загрузился", "Դասը չբեռնվեց", "No se pudo cargar la lección"],

  "pro.lede": ["Space news every morning, told by the right host, and every lesson unlocked.", "Космические новости каждое утро от нужного ведущего и все уроки открыты.", "Տիեզերական նորություններ ամեն առավոտ՝ ճիշտ վարողից, և բոլոր դասերը բաց են։", "Noticias espaciales cada mañana, contadas por el presentador adecuado, y todas las lecciones desbloqueadas."],
  "pro.li1": ["<b>Morning digest in Telegram.</b> The day's top stories and tonight's sky, before breakfast.", "<b>Утренний дайджест в Telegram.</b> Главные новости дня и небо на вечер — ещё до завтрака.", "<b>Առավոտյան ամփոփում Telegram-ում։</b> Օրվա գլխավոր նորությունները և երեկոյան երկինքը՝ նախաճաշից առաջ։", "<b>Resumen matinal en Telegram.</b> Las noticias del día y el cielo de esta noche, antes del desayuno."],
  "pro.li2": ["<b>The full news archive.</b> Free shows the latest 24 stories.", "<b>Полный архив новостей.</b> Бесплатно видны последние 24.", "<b>Նորությունների ամբողջ արխիվը։</b> Անվճար տարբերակում երևում են վերջին 24-ը։", "<b>El archivo completo de noticias.</b> La versión gratuita muestra las últimas 24."],
  "pro.li3": ["<b>Every Pro lesson.</b> Kepler's laws and the true scale of the Solar System, with more on the way.", "<b>Все Pro-уроки.</b> Законы Кеплера и настоящий масштаб Солнечной системы, скоро будут новые.", "<b>Բոլոր Pro դասերը։</b> Կեպլերի օրենքները և Արեգակնային համակարգի իրական մասշտաբը, շուտով՝ նորերը։", "<b>Todas las lecciones Pro.</b> Las leyes de Kepler y la escala real del sistema solar, y más en camino."],
  "pro.price": ["{price} Telegram Stars <small>per month · cancel any time in Telegram</small>", "{price} Telegram Stars <small>в месяц · отменить можно в любой момент в Telegram</small>", "{price} Telegram Stars <small>ամսական · կարող եք չեղարկել ցանկացած պահի Telegram-ում</small>", "{price} Telegram Stars <small>al mes · cancela cuando quieras en Telegram</small>"],
  "pro.buy": ["Subscribe in Telegram", "Оформить в Telegram", "Բաժանորդագրվել Telegram-ում", "Suscribirse en Telegram"],
  "pro.hintTg": ["Payment opens right here in Telegram.", "Оплата откроется прямо здесь, в Telegram.", "Վճարումը կբացվի հենց այստեղ՝ Telegram-ում։", "El pago se abre aquí mismo, en Telegram."],
  "pro.hintWeb": ["Pro lives in Telegram: the button opens our bot, where you pay with Stars. Then open the app from the bot to use Pro features.", "Pro работает через Telegram: кнопка откроет нашего бота, там вы оплатите звёздами. Потом откройте приложение из бота, чтобы пользоваться Pro.", "Pro-ն աշխատում է Telegram-ի միջոցով․ կոճակը կբացի մեր բոտը, որտեղ կվճարեք աստղերով։ Հետո բացեք հավելվածը բոտից՝ Pro-ից օգտվելու համար։", "Pro funciona en Telegram: el botón abre nuestro bot, donde pagas con estrellas. Luego abre la app desde el bot para usar Pro."],
  "pro.active": ["You have Pro until {date}. It renews automatically; manage it in Telegram → Settings → My Stars.", "У вас Pro до {date}. Продлевается автоматически; управлять можно в Telegram → Настройки → Мои звёзды.", "Ձեր Pro-ն գործում է մինչև {date}։ Երկարաձգվում է ավտոմատ․ կառավարել կարող եք Telegram → Կարգավորումներ → Իմ աստղերը։", "Tienes Pro hasta el {date}. Se renueva automáticamente; gestiónalo en Telegram → Ajustes → Mis estrellas."],
  "pro.tab": ["Pro ✓", "Pro ✓", "Pro ✓", "Pro ✓"],
  "toast.paid": ["Payment received. Welcome to Pro!", "Оплата получена. Добро пожаловать в Pro!", "Վճարումը ստացվեց։ Բարի գալուստ Pro!", "Pago recibido. ¡Bienvenido a Pro!"],
  "toast.failed": ["The payment did not go through. Nothing was charged.", "Оплата не прошла. Деньги не списаны.", "Վճարումը չանցավ։ Ոչինչ չի գանձվել։", "El pago no se completó. No se cobró nada."],
  "toast.openBot": ["Open Event Horizon from the Telegram bot to subscribe.", "Чтобы оформить подписку, откройте Event Horizon из Telegram-бота.", "Բաժանորդագրվելու համար բացեք Event Horizon-ը Telegram բոտից։", "Abre Event Horizon desde el bot de Telegram para suscribirte."],
  "toast.payErr": ["Could not start the payment. Try again.", "Не удалось начать оплату. Попробуйте снова.", "Չհաջողվեց սկսել վճարումը։ Փորձեք նորից։", "No se pudo iniciar el pago. Inténtalo de nuevo."],
  "toast.noBot": ["The Telegram bot is not configured yet.", "Telegram-бот ещё не настроен.", "Telegram բոտը դեռ կարգավորված չէ։", "El bot de Telegram aún no está configurado."],

  "foot": [
    'News via the <a href="https://spaceflightnewsapi.net" target="_blank" rel="noopener">Spaceflight News API</a>; picture of the day by <a href="https://apod.nasa.gov" target="_blank" rel="noopener">NASA APOD</a>. Planet positions from JPL orbital elements. Hosts are illustrations, not photographs.',
    'Новости: <a href="https://spaceflightnewsapi.net" target="_blank" rel="noopener">Spaceflight News API</a>; фото дня: <a href="https://apod.nasa.gov" target="_blank" rel="noopener">NASA APOD</a>. Положения планет по орбитальным элементам JPL. Ведущие — иллюстрации, а не фотографии.',
    'Նորությունները՝ <a href="https://spaceflightnewsapi.net" target="_blank" rel="noopener">Spaceflight News API</a>, օրվա լուսանկարը՝ <a href="https://apod.nasa.gov" target="_blank" rel="noopener">NASA APOD</a>։ Մոլորակների դիրքերը՝ JPL-ի ուղեծրային տարրերով։ Վարողները նկարազարդումներ են, ոչ թե լուսանկարներ։',
    'Noticias de <a href="https://spaceflightnewsapi.net" target="_blank" rel="noopener">Spaceflight News API</a>; foto del día de <a href="https://apod.nasa.gov" target="_blank" rel="noopener">NASA APOD</a>. Posiciones planetarias con elementos orbitales del JPL. Los presentadores son ilustraciones, no fotografías.'],

  // Built-in stories shown before the live feed answers
  "off.1.t": ["The first image of a black hole", "Первое изображение чёрной дыры", "Սև խոռոչի առաջին պատկերը", "La primera imagen de un agujero negro"],
  "off.1.s": [
    "In 2017 eight radio observatories at six sites worked as one Earth-sized telescope and photographed M87*. The result, released in April 2019, shows a bright ring of hot gas around the shadow of a black hole of 6.5 billion solar masses, 55 million light-years away.",
    "В 2017 году восемь радиообсерваторий на шести площадках работали как один телескоп размером с Землю и сфотографировали M87*. Снимок, опубликованный в апреле 2019 года, показывает яркое кольцо горячего газа вокруг тени чёрной дыры массой 6,5 миллиарда Солнц в 55 миллионах световых лет от нас.",
    "2017 թվականին վեց վայրում գտնվող ութ ռադիոաստղադիտարան աշխատեցին որպես Երկրի չափ մեկ աստղադիտակ և լուսանկարեցին M87*-ը։ 2019 թվականի ապրիլին հրապարակված պատկերը ցույց է տալիս տաք գազի պայծառ օղակ՝ 6,5 միլիարդ Արեգակի զանգվածով սև խոռոչի ստվերի շուրջ, 55 միլիոն լուսատարի հեռավորության վրա։",
    "En 2017, ocho radioobservatorios en seis lugares funcionaron como un telescopio del tamaño de la Tierra y fotografiaron M87*. La imagen, publicada en abril de 2019, muestra un anillo brillante de gas caliente alrededor de la sombra de un agujero negro de 6500 millones de masas solares, a 55 millones de años luz."],
  "off.2.t": ["Mars is a world of giants", "Марс — мир гигантов", "Մարսը հսկաների աշխարհ է", "Marte, un mundo de gigantes"],
  "off.2.s": [
    "Olympus Mons rises about 22 kilometres, more than twice the height of Everest, and the canyon system Valles Marineris would stretch across the United States. Both formed because Mars has no moving plates to spread volcanic activity around.",
    "Гора Олимп поднимается примерно на 22 километра, больше чем вдвое выше Эвереста, а каньоны долин Маринер протянулись бы через все США. Они такие огромные потому, что на Марсе нет движущихся плит, которые рассредоточили бы вулканизм.",
    "Օլիմպոս լեռը բարձրանում է մոտ 22 կիլոմետր՝ Էվերեստից ավելի քան երկու անգամ բարձր, իսկ Մարիների հովիտների կիրճերը կձգվեին ամբողջ ԱՄՆ-ով մեկ։ Դրանք այդքան հսկայական են, որովհետև Մարսում շարժվող սալեր չկան, որոնք կցրեին հրաբխային ակտիվությունը։",
    "El Olympus Mons se eleva unos 22 kilómetros, más del doble que el Everest, y los cañones de Valles Marineris cruzarían Estados Unidos. Son tan enormes porque Marte no tiene placas en movimiento que repartan la actividad volcánica."],
  "off.3.t": ["Sunlight is eight minutes old", "Солнечному свету восемь минут", "Արևի լույսը ութ րոպեական է", "La luz del Sol tiene ocho minutos"],
  "off.3.s": [
    "Light leaves the Sun's surface and reaches Earth in about 8 minutes 20 seconds. The energy in it was made in the core by fusing hydrogen into helium, and took many thousands of years to work its way out to the surface.",
    "Свет покидает поверхность Солнца и доходит до Земли примерно за 8 минут 20 секунд. Сама энергия родилась в ядре при слиянии водорода в гелий и пробиралась к поверхности многие тысячи лет.",
    "Լույսը թողնում է Արեգակի մակերևույթը և հասնում Երկիր մոտ 8 րոպե 20 վայրկյանում։ Իսկ նրա էներգիան ծնվել է միջուկում՝ ջրածնից հելիում սինթեզելիս, և հազարավոր տարիներ է ծախսել մակերևույթ հասնելու համար։",
    "La luz sale de la superficie del Sol y llega a la Tierra en unos 8 minutos y 20 segundos. Su energía nació en el núcleo al fusionar hidrógeno en helio y tardó muchos miles de años en llegar a la superficie."],
};

function detect() {
  try { const s = localStorage.getItem("eh-lang"); if (LANGS.includes(s)) return s; } catch { /* storage blocked */ }
  const tgLang = window.Telegram?.WebApp?.initDataUnsafe?.user?.language_code;
  for (const l of [tgLang, ...(navigator.languages || [navigator.language])]) {
    const p = String(l || "").slice(0, 2).toLowerCase();
    if (LANGS.includes(p)) return p;
  }
  return "en";
}

export let lang = detect();
const idx = () => LANGS.indexOf(lang);

export function t(key, vars = {}) {
  const row = D[key];
  let s = row ? (row[idx()] ?? row[0]) : key;
  for (const [k, v] of Object.entries(vars)) s = s.split(`{${k}}`).join(v);
  return s;
}

export const locale = () => LOCALE[lang];
export const fmtNum = (n, d = 0) => Number(n).toLocaleString(locale(), { maximumFractionDigits: d, minimumFractionDigits: d });
export const fmtDate = (d, opts = { day: "numeric", month: "short", year: "numeric" }) => new Date(d).toLocaleDateString(locale(), opts);

/** Fills every [data-i18n] element; [data-i18n-html] allows markup; [data-i18n-aria] sets aria-label. */
export function applyStatic(root = document) {
  document.documentElement.lang = lang;
  root.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
  root.querySelectorAll("[data-i18n-html]").forEach(el => { el.innerHTML = t(el.dataset.i18nHtml); });
  root.querySelectorAll("[data-i18n-aria]").forEach(el => { el.setAttribute("aria-label", t(el.dataset.i18nAria)); });
}

const listeners = new Set();
export const onLang = fn => listeners.add(fn);
export function setLang(l) {
  if (!LANGS.includes(l) || l === lang) return;
  lang = l;
  try { localStorage.setItem("eh-lang", l); } catch { /* storage blocked */ }
  applyStatic();
  listeners.forEach(fn => fn(l));
}
