// src/components/Navbar.tsx
// 상단 고정 내비게이션: 왼쪽 로고(<Watchiiee/>), 오른쪽 섹션 메뉴 + GitHub
// 맨 위에서는 투명, 스크롤하면 반투명 블러 배경으로 바뀌고, 지금 보고 있는 섹션의 메뉴를 강조
import { useEffect, useState } from "react";
import { Github, Menu, X } from "lucide-react";

const links = [
  { id: "expertise", label: "Expertise" },
  { id: "projects", label: "Projects" },
  { id: "resume", label: "Resume" },
  { id: "contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoHovered, setLogoHovered] = useState(false);

  // 스크롤 여부에 따라 배경 전환
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 화면 세로 가운데 근처를 지나는 섹션을 현재 섹션으로 판단
  useEffect(() => {
    const sections = links
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((el) => observer.observe(el));

    // Hero로 돌아오면 강조 해제
    const hero = document.getElementById("hero");
    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setActive(null);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    if (hero) heroObserver.observe(hero);

    return () => {
      observer.disconnect();
      heroObserver.disconnect();
    };
  }, []);

  // 모바일 메뉴: ESC로 닫기
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const scrollToTop = () => {
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const solid = scrolled || menuOpen;

  return (
    // hero-intro-fade-only: 인트로 동안 숨겼다가 Hero 텍스트와 함께 나타남 (Hero.astro의 전역 스타일)
    // header에는 배경용 transition-colors가 있어 투명도 전환은 바깥 래퍼에서 처리
    <div className="hero-intro-fade-only">
      <header
        className={`fixed inset-x-0 top-0 z-[100] border-b transition-colors duration-300 ${
          solid
            ? "bg-[#0a192f]/85 backdrop-blur-md border-slate-800"
            : "bg-transparent border-transparent"
        }`}
      >
        <nav className="container mx-auto flex h-16 items-center justify-between px-6">
          {/* 로고: 마우스를 올리면 onClick={scrollToTop}이 펼쳐짐 */}
          <button
            type="button"
            onClick={scrollToTop}
            onMouseEnter={() => setLogoHovered(true)}
            onMouseLeave={() => setLogoHovered(false)}
            onFocus={() => setLogoHovered(true)}
            onBlur={() => setLogoHovered(false)}
            aria-label="맨 위로 이동"
            className="flex items-center font-mono text-lg font-bold tracking-wider text-cyan-400 whitespace-nowrap"
          >
            <span>&lt;Watchiiee</span>
            <span
              className={`hidden sm:flex overflow-hidden transition-all duration-300 ease-in-out items-center ${
                logoHovered
                  ? "max-w-[300px] opacity-100 ml-2"
                  : "max-w-0 opacity-0 ml-0"
              }`}
            >
              <span className="text-cyan-200">onClick</span>
              <span className="text-white">=</span>
              <span className="text-yellow-300">{"{scrollToTop}"}</span>
            </span>
            <span>/&gt;</span>
          </button>

          {/* 데스크톱 메뉴 */}
          <ul className="hidden md:flex items-center gap-8 font-mono text-sm">
            {links.map(({ id, label }, idx) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-current={active === id ? "location" : undefined}
                  className={`group relative py-2 transition-colors ${
                    active === id
                      ? "text-cyan-400"
                      : "text-slate-300 hover:text-cyan-400"
                  }`}
                >
                  <span className="text-cyan-400/60 mr-1">0{idx + 1}.</span>
                  {label}
                  <span
                    className={`absolute -bottom-0.5 left-0 h-px bg-cyan-400 transition-all duration-300 ${
                      active === id ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </a>
              </li>
            ))}
            <li>
              <a
                href="https://github.com/Watchiiee"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-600 text-slate-200 hover:border-cyan-400 hover:text-cyan-400 transition-colors"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
            </li>
          </ul>

          {/* 모바일 메뉴 버튼 */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="md:hidden p-2 -mr-2 text-slate-200 hover:text-cyan-400 transition-colors"
          >
            {menuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </nav>

        {/* 모바일 메뉴 패널 */}
        <div
          id="mobile-menu"
          className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ${
            menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <ul className="container mx-auto px-6 pb-6 pt-2 flex flex-col gap-1 font-mono">
            {links.map(({ id, label }, idx) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={() => setMenuOpen(false)}
                  tabIndex={menuOpen ? 0 : -1}
                  className={`block py-3 border-b border-slate-800 transition-colors ${
                    active === id ? "text-cyan-400" : "text-slate-200"
                  }`}
                >
                  <span className="text-cyan-400/60 mr-2">0{idx + 1}.</span>
                  {label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="https://github.com/Watchiiee"
                target="_blank"
                rel="noreferrer"
                tabIndex={menuOpen ? 0 : -1}
                className="flex items-center gap-2 py-3 text-slate-200"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
            </li>
          </ul>
        </div>
      </header>
    </div>
  );
}
