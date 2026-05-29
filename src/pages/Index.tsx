import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

function useNow() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);
  return now;
}

function getStatus(now: Date) {
  const h = now.getHours();
  const m = now.getMinutes();
  const total = h * 60 + m;
  const open = 10 * 60;
  const close = 23 * 60;
  const isOpen = total >= open && total < close;

  const todaySession = 18 * 60;
  const tomorrowSession = 18 * 60;

  let nextLabel = "";
  if (isOpen) {
    if (total < todaySession) {
      const diff = todaySession - total;
      nextLabel = `Сеанс через ${diff >= 60 ? Math.floor(diff / 60) + " ч " : ""}${diff % 60 > 0 ? (diff % 60) + " мин" : ""}`;
    } else if (total < tomorrowSession + 60) {
      nextLabel = "Сеанс идёт сейчас";
    } else {
      nextLabel = "Следующий сеанс завтра в 18:00";
    }
  } else if (total < open) {
    const diff = open - total;
    nextLabel = `Откроется через ${diff >= 60 ? Math.floor(diff / 60) + " ч " : ""}${diff % 60 > 0 ? (diff % 60) + " мин" : ""}`;
  } else {
    nextLabel = "Откроется завтра в 10:00";
  }

  const pad = (n: number) => String(n).padStart(2, "0");
  const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

  return { isOpen, nextLabel, timeStr };
}

const FIXIKI_IMG = "https://cdn.poehali.dev/projects/6c1b7431-f2a4-40eb-9d1f-2a5c16c8780e/bucket/8f0c15ed-e452-49b5-af03-02ef5a123a8d.jpg";
const SMESHARIKI_IMG = "https://cdn.poehali.dev/projects/6c1b7431-f2a4-40eb-9d1f-2a5c16c8780e/bucket/5fd11de8-d597-42f4-9076-b97eb120c6d4.jpg";

const films = [
  {
    id: 1,
    title: "Фиксики против кработов",
    year: 2019,
    age: "0+",
    duration: "77 мин",
    genre: "Анимация, Приключения",
    description:
      "Фиксики снова в деле! На этот раз маленьким героям предстоит сразиться с загадочными кработами — роботами-крабами, захватившими дом. Весёлое и захватывающее приключение для всей семьи.",
    poster: FIXIKI_IMG,
    today: true,
    time: "18:00",
    rating: 7.2,
  },
  {
    id: 2,
    title: "Смешарики. Начало",
    year: 2011,
    age: "0+",
    duration: "60 мин",
    genre: "Анимация, Семейный",
    description:
      "История о том, как появился удивительный мир Смешариков. Круглые и добрые герои раскрывают секреты своей дружбы и рассказывают о самом начале своих приключений.",
    poster: SMESHARIKI_IMG,
    today: false,
    time: "18:00",
    rating: 7.8,
  },
];

const sections = ["Главная", "Расписание", "Фильмы", "О нас"];

export default function Index() {
  const [activeSection, setActiveSection] = useState("Главная");
  const [menuOpen, setMenuOpen] = useState(false);
  const now = useNow();
  const { isOpen, nextLabel, timeStr } = getStatus(now);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const sectionIds: Record<string, string> = {
    Главная: "hero",
    Расписание: "schedule",
    Фильмы: "films",
    "О нас": "about",
  };

  return (
    <div className="min-h-screen bg-background text-foreground grain-overlay">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => scrollTo("hero")}
            className="font-display text-xl font-bold tracking-wider text-gold hover:opacity-80 transition-opacity"
          >
            🎬 КИНО ВАНИ
          </button>

          <div className="hidden md:flex items-center gap-8">
            {sections.map((s) => (
              <button
                key={s}
                onClick={() => { setActiveSection(s); scrollTo(sectionIds[s]); }}
                className={`nav-link text-sm font-body font-medium tracking-wide ${activeSection === s ? "text-gold" : ""}`}
              >
                {s}
              </button>
            ))}
          </div>

          <button
            className="md:hidden text-foreground"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Icon name={menuOpen ? "X" : "Menu"} size={24} />
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-card border-t border-border px-6 py-4 flex flex-col gap-4 animate-fade-in">
            {sections.map((s) => (
              <button
                key={s}
                onClick={() => { setActiveSection(s); scrollTo(sectionIds[s]); }}
                className="text-left font-body text-base text-muted-foreground hover:text-gold transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <section
        id="hero"
        className="relative pt-16 min-h-screen flex flex-col justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-[#1a1200] pointer-events-none" />
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 60% 40% at 70% 50%, hsl(38 95% 55%) 0%, transparent 70%)",
          }}
        />
        <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-[hsl(38_95%_55%_/_0.15)] to-transparent" />

        <div className="relative max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className={`inline-flex items-center gap-2 border text-xs font-body font-medium px-3 py-1.5 rounded-full mb-3 animate-fade-in ${isOpen ? "bg-gold/10 border-gold/30 text-gold" : "bg-red-500/10 border-red-500/30 text-red-400"}`}>
              <span className={`w-2 h-2 rounded-full ${isOpen ? "bg-gold animate-pulse" : "bg-red-400"}`} />
              {isOpen ? "Открыто сейчас" : "Закрыто"}
              <span className="opacity-60">· {timeStr}</span>
            </div>

            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-muted-foreground text-xs font-body px-3 py-1.5 rounded-full mb-6 animate-fade-in">
              <Icon name="Clock3" size={12} />
              {nextLabel}
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-bold leading-none tracking-tight mb-6 animate-fade-up">
              КИНОТЕАТР
              <br />
              <span className="text-gold">ВАНИ</span>
            </h1>

            <p className="font-body text-muted-foreground text-lg leading-relaxed mb-8 animate-fade-up-delay-1">
              {isOpen
                ? "Кинотеатр Вани открыт для вас. Смотрите любимые фильмы в тёплой атмосфере нашего кинотеатра."
                : "Кинотеатр сейчас закрыт. Ждём вас ежедневно с 10:00 до 23:00."}
            </p>

            <div className="flex flex-wrap gap-4 animate-fade-up-delay-2">
              <button
                onClick={() => scrollTo("schedule")}
                className="bg-gold text-background font-display font-semibold tracking-wider px-8 py-3 rounded-lg hover:bg-gold/90 transition-all hover:scale-105 active:scale-95"
              >
                РАСПИСАНИЕ
              </button>
              <button
                onClick={() => scrollTo("films")}
                className="border border-border text-foreground font-display font-semibold tracking-wider px-8 py-3 rounded-lg hover:border-gold hover:text-gold transition-all"
              >
                ФИЛЬМЫ
              </button>
            </div>
          </div>

          <div className="relative h-80 md:h-[440px] animate-fade-up-delay-1">
            <div
              className="absolute right-8 top-0 w-52 h-72 md:w-64 md:h-[360px] rounded-xl overflow-hidden shadow-2xl"
              style={{ transform: "rotate(4deg)" }}
            >
              <img src={SMESHARIKI_IMG} alt="Смешарики" className="w-full h-full object-cover" />
            </div>
            <div
              className="absolute left-0 top-8 w-52 h-72 md:w-64 md:h-[360px] rounded-xl overflow-hidden shadow-2xl border border-gold/20"
              style={{ transform: "rotate(-3deg)" }}
            >
              <img src={FIXIKI_IMG} alt="Фиксики" className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 bg-gold text-background text-xs font-display font-bold px-2 py-1 rounded">
                СЕГОДНЯ
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SCHEDULE */}
      <section id="schedule" className="py-20 max-w-6xl mx-auto px-6">
        <div className="section-line" />
        <h2 className="font-display text-4xl font-bold tracking-wide mb-2">РАСПИСАНИЕ</h2>
        <p className="text-muted-foreground font-body mb-10">Актуальные сеансы на сегодня и завтра</p>

        <div className="grid gap-5">
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="bg-gold/10 border-b border-gold/20 px-6 py-3 flex items-center gap-3">
              <Icon name="Calendar" size={16} className="text-gold" />
              <span className="font-display font-semibold tracking-wider text-gold text-sm">СЕГОДНЯ — 29 МАЯ 2026</span>
            </div>
            <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={FIXIKI_IMG} alt="Фиксики" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-display text-xl font-semibold tracking-wide">Фиксики против кработов</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="age-badge">0+</span>
                    <span className="text-muted-foreground text-sm font-body">2019 · 77 мин · Анимация</span>
                  </div>
                </div>
              </div>
              <div className="bg-gold text-background font-display font-bold text-2xl tracking-widest px-6 py-3 rounded-xl">
                18:00
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="bg-secondary/50 border-b border-border px-6 py-3 flex items-center gap-3">
              <Icon name="Calendar" size={16} className="text-muted-foreground" />
              <span className="font-display font-semibold tracking-wider text-muted-foreground text-sm">ЗАВТРА — 30 МАЯ 2026</span>
            </div>
            <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={SMESHARIKI_IMG} alt="Смешарики" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-display text-xl font-semibold tracking-wide">Смешарики. Начало</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="age-badge">6+</span>
                    <span className="text-muted-foreground text-sm font-body">2011 · 60 мин · Анимация</span>
                  </div>
                </div>
              </div>
              <div className="bg-secondary border border-border text-foreground font-display font-bold text-2xl tracking-widest px-6 py-3 rounded-xl">
                18:00
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FILMS */}
      <section id="films" className="py-20 bg-card/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="section-line" />
          <h2 className="font-display text-4xl font-bold tracking-wide mb-2">КАТАЛОГ ФИЛЬМОВ</h2>
          <p className="text-muted-foreground font-body mb-10">Все фильмы в репертуаре кинотеатра</p>

          <div className="grid md:grid-cols-2 gap-8">
            {films.map((film) => (
              <div
                key={film.id}
                className="bg-card border border-border rounded-2xl overflow-hidden card-hover"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={film.poster}
                    alt={film.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="age-badge">{film.age}</span>
                    {film.today && (
                      <span className="bg-gold text-background text-xs font-display font-bold px-2 py-0.5 rounded">
                        СЕГОДНЯ
                      </span>
                    )}
                  </div>
                  <div className="absolute top-4 right-4 flex items-center gap-1 bg-background/70 backdrop-blur-sm px-2 py-1 rounded-lg">
                    <Icon name="Star" size={14} className="text-gold fill-gold" />
                    <span className="font-display font-bold text-sm text-gold">{film.rating}</span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-display text-2xl font-bold tracking-wide mb-1">{film.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-muted-foreground font-body">
                    <span className="flex items-center gap-1">
                      <Icon name="CalendarDays" size={14} />
                      {film.year}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="Clock" size={14} />
                      {film.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="Film" size={14} />
                      {film.genre}
                    </span>
                  </div>
                  <p className="text-muted-foreground font-body text-sm leading-relaxed mb-5">{film.description}</p>

                  <div className="flex items-center gap-2">
                    <Icon name="Clock3" size={16} className="text-gold" />
                    <span className="font-display font-semibold text-gold tracking-widest">{film.time}</span>
                    <span className="text-muted-foreground text-xs font-body">
                      {film.today ? "— сегодня" : "— завтра"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-20 max-w-6xl mx-auto px-6">
        <div className="section-line" />
        <h2 className="font-display text-4xl font-bold tracking-wide mb-2">О КИНОТЕАТРЕ</h2>
        <p className="text-muted-foreground font-body mb-12">История и особенности нашего кинотеатра</p>

        <div className="grid md:grid-cols-3 gap-6 mb-14">
          {[
            { icon: "Popcorn", title: "Уютная атмосфера", desc: "Тёплая домашняя атмосфера для просмотра любимых фильмов" },
            { icon: "Users", title: "Для всей семьи", desc: "Репертуар подобран специально для семейного просмотра" },
            { icon: "Heart", title: "С любовью", desc: "Кинотеатр создан с любовью к кино и для любителей кино" },
          ].map((item) => (
            <div key={item.title} className="bg-card border border-border rounded-2xl p-6 hover:border-gold/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-4">
                <Icon name={item.icon} fallback="Star" size={22} className="text-gold" />
              </div>
              <h3 className="font-display text-lg font-semibold tracking-wide mb-2">{item.title}</h3>
              <p className="text-muted-foreground font-body text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="p-8 grid md:grid-cols-2 gap-8 items-start">
            <div>
              <h3 className="font-display text-2xl font-bold tracking-wide mb-6">КАК НАС НАЙТИ</h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon name="MapPin" size={18} className="text-gold" />
                  </div>
                  <div>
                    <p className="font-body text-sm text-muted-foreground mb-1">Адрес</p>
                    <p className="font-body font-medium">Тамбов, Тамбовская область</p>
                    <p className="font-body font-medium">ул. Мичуринская, 203</p>
                    <p className="font-body text-muted-foreground text-sm">подъезд 3, этаж 5, кв. 100</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <Icon name="Clock" size={18} className="text-gold" />
                  </div>
                  <div>
                    <p className="font-body text-sm text-muted-foreground mb-1">Режим работы</p>
                    <p className="font-body font-medium">Пн – Вс, ежедневно · 10:00 – 23:00</p>
                    <span className={`inline-flex items-center gap-1.5 mt-1 text-xs font-body font-medium px-2 py-0.5 rounded-full ${isOpen ? "bg-gold/10 text-gold" : "bg-red-500/10 text-red-400"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? "bg-gold animate-pulse" : "bg-red-400"}`} />
                      {isOpen ? `Открыто · ${timeStr}` : `Закрыто · ${timeStr}`}
                    </span>
                  </div>
                </div>
              </div>

              <a
                href="https://yandex.ru/maps/?text=Тамбов+Мичуринская+203"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-6 bg-gold text-background font-display font-semibold tracking-wider px-6 py-3 rounded-lg hover:bg-gold/90 transition-all hover:scale-105 active:scale-95 text-sm"
              >
                <Icon name="Map" size={16} />
                ОТКРЫТЬ НА КАРТЕ
              </a>
            </div>

            <div className="rounded-xl overflow-hidden h-64 md:h-72 bg-secondary border border-border">
              <iframe
                src="https://yandex.ru/map-widget/v1/?text=Тамбов%2C+Мичуринская+203&z=16&l=map"
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen
                className="w-full h-full"
                title="Кинотеатр Вани на карте"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-display text-lg font-bold text-gold tracking-wider">🎬 КИНОТЕАТР ВАНИ</div>
          <p className="text-muted-foreground font-body text-sm text-center">
            г. Тамбов, ул. Мичуринская, 203 · подъезд 3, этаж 5
          </p>
          <p className="text-muted-foreground font-body text-xs">© 2026 Кинотеатр Вани</p>
        </div>
      </footer>
    </div>
  );
}