import { useState, useEffect } from "react";

export default function Logo() {
  const [isHovered, setIsHovered] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-[100] cursor-pointer 
        transition-all duration-300 rounded-full border flex items-center justify-center
        ${
          scrolled
            ? "bg-[#0a192f]/90 backdrop-blur-md border-slate-700 shadow-lg py-2 px-4"
            : "bg-transparent border-transparent py-2 px-2"
        }
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={scrollToTop}
    >
      <div className="flex items-center font-mono text-lg md:text-xl font-bold tracking-wider text-cyan-400 whitespace-nowrap">
        <span>&lt;Watchiiee</span>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out flex items-center
            ${
              isHovered
                ? "max-w-[300px] opacity-100 ml-2"
                : "max-w-0 opacity-0 ml-0"
            }
          `}
        >
          <span className="text-cyan-200">onClick</span>
          <span className="text-white">=</span>
          <span className="text-yellow-300">{"{scrollToTop}"}</span>
        </div>

        <span>/&gt;</span>
      </div>
    </div>
  );
}
