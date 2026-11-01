import { Code2, Server, Cloud, BrainCircuit } from "lucide-react";
import CodeBackground from "@/components/ui/CodeBackground";

const expertiseData = [
  {
    icon: <Code2 className="w-10 h-10 mb-4 text-blue-500" />,
    title: "Frontend",
    underlineColor: "bg-blue-500",
    skills: "React, Next.js, TypeScript, Zustand, Tailwind CSS",
    description:
      "React와 TypeScript로 인증 흐름, 상태 관리, 데이터 시각화까지 실서비스 수준의 웹 애플리케이션을 구축합니다.",
  },
  {
    icon: <Server className="w-10 h-10 mb-4 text-pink-500" />,
    title: "Backend",
    underlineColor: "bg-pink-500",
    skills: "Python, FastAPI, PostgreSQL, Java",
    description:
      "FastAPI로 REST·SSE API를 설계하고, JWT 인증과 RBAC 권한 체계, PostgreSQL 기반 데이터 모델링을 구현합니다.",
  },
  {
    icon: <Cloud className="w-10 h-10 mb-4 text-orange-500" />,
    title: "Cloud & DevOps",
    underlineColor: "bg-orange-500",
    skills: "NCP, GCP, Docker, GitHub Actions",
    description:
      "VPC, Load Balancer, Auto Scaling 기반 인프라를 구성하고 Docker와 GitHub Actions로 빌드부터 배포까지 자동화합니다.",
  },
  {
    icon: <BrainCircuit className="w-10 h-10 mb-4 text-emerald-500" />,
    title: "AI · LLM",
    underlineColor: "bg-emerald-500",
    skills: "LangGraph, RAG, pgvector, Langfuse",
    description:
      "LangGraph 기반 RAG 파이프라인을 설계하고, 자체 평가셋으로 정확도를 실측하며 개선합니다.",
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
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">My Expertise</h2>
          <p className="text-slate-400 max-w-2xl text-lg leading-relaxed">
            제가 가진 기술과 경험을 소개합니다.
          </p>
        </div>

        {/* 3단 그리드 카드 영역 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
