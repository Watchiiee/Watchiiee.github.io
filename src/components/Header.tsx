import { Button } from "@/components/ui/button";

export default function Header() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div
          className="text-xl font-bold cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          My Portfolio
        </div>
        <nav className="hidden md:flex gap-6">
          <button
            onClick={() => scrollToSection("about")}
            className="text-sm font-medium hover:underline"
          >
            About
          </button>
          <button
            onClick={() => scrollToSection("projects")}
            className="text-sm font-medium hover:underline"
          >
            Projects
          </button>
          <button
            onClick={() => scrollToSection("contact")}
            className="text-sm font-medium hover:underline"
          >
            Contact
          </button>
        </nav>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open("https://github.com/Watchiiee", "_blank")}
        >
          GitHub
        </Button>
      </div>
    </header>
  );
}
