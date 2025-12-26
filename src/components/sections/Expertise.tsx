import { Monitor, Code2, Palette } from "lucide-react";
import CodeBackground from "@/components/ui/CodeBackground";

const expertiseData = [
  {
    icon: <Monitor className="w-10 h-10 mb-4 text-pink-500" />,
    title: "Software Development",
    underlineColor: "bg-pink-500",
    skills: "Python, Java, JavaScript, TypeScript",
    description:
      "다양한 언어를 통해 견고한 로직을 설계하며, 백엔드와 프론트엔드를 아우르는 소프트웨어 개발 역량을 갖추고 있습니다.",
  },
  {
    icon: <Code2 className="w-10 h-10 mb-4 text-blue-500" />,
    title: "Frontend Dev",
    underlineColor: "bg-blue-500",
    skills: "React, Vite, Next.js, Astro",
    description:
      "React 생태계와 최신 모던 웹 프레임워크를 활용하여, 빠르고 사용자 친화적인 웹 애플리케이션을 구축합니다.",
  },
  {
    icon: <Palette className="w-10 h-10 mb-4 text-orange-500" />,
    title: "Web Design",
    underlineColor: "bg-orange-500",
    skills: "CSS3, Figma, TailwindCSS",
    description:
      "단순한 구현을 넘어, Figma를 활용한 UI 설계와 TailwindCSS를 통한 감각적인 디자인 시스템을 구현합니다.",
  },
];

export default function Expertise() {
  return (
    <section
      id="expertise"
      className="relative w-full py-24 bg-[#0a192f] text-white overflow-hidden"
    >
      {/* 배경 코드 컴포넌트 삽입 */}
      <CodeBackground />

      <div className="container mx-auto px-6 relative z-10">
        {/* 섹션 제목 */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">My Expertise</h2>
          <p className="text-slate-400">제가 가진 기술과 경험을 소개합니다.</p>
        </div>

        {/* 3단 그리드 카드 영역 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {expertiseData.map((item, index) => (
            <div
              key={index}
              className="group border border-slate-700 bg-[#112240]/50 backdrop-blur-sm p-8 hover:border-slate-500 transition-colors duration-300 rounded-none"
            >
              {/* 아이콘 */}
              {item.icon}

              {/* 제목과 밑줄 효과 */}
              <div className="relative inline-block mb-4">
                <h3 className="text-2xl font-bold">{item.title}</h3>
                <span
                  className={`absolute bottom-1 left-0 w-full h-3 ${item.underlineColor} opacity-40 -z-10 transform -rotate-2 group-hover:rotate-0 transition-transform duration-300`}
                ></span>
              </div>

              {/* 기술 스택 (강조) */}
              <div className="mb-6 font-mono text-sm text-slate-300">
                &lt;h3&gt;
                <div className="pl-4 py-2 border-l-2 border-slate-700 text-white font-bold text-lg leading-relaxed">
                  {item.skills}
                </div>
                &lt;/h3&gt;
              </div>

              {/* 설명글 */}
              <p className="text-slate-400 leading-relaxed break-keep">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
