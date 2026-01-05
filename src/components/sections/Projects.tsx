import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderOpen,
  X,
  Github,
  ExternalLink,
  Calendar,
  Layers,
  Code2,
} from "lucide-react";

interface Project {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  period: string;
  stack: string[];
  githubLink?: string;
  demoLink?: string;
  image: string | null;
  description: string[];
  learning: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "포트폴리오 웹사이트",
    subtitle: "개인 포트폴리오 및 소개 페이지",
    category: "Web / Portfolio",
    period: "2025.12 ~ 진행중",
    stack: ["TypeScript", "Astro", "Tailwind CSS"],
    githubLink: "https://github.com/Watchiiee/Watchiiee.github.io",
    demoLink: "https://watchiiee.github.io/",
    image: null,
    description: [
      "Astro 프레임워크를 활용한 고성능 정적 웹사이트 구축",
      "React 컴포넌트와 Tailwind CSS를 활용한 모던 UI 디자인",
      "GitHub Actions를 통한 자동 배포 파이프라인 구축",
    ],
    learning:
      "Astro의 아일랜드 아키텍처를 이해하고, 불필요한 JS 로딩을 줄여 성능을 최적화하는 방법을 익혔습니다.",
  },
  {
    id: 2,
    title: "WhyNot?",
    subtitle: "가천대 카카오엔터프라이즈 미러링 실습 4팀",
    category: "Team Project / Web",
    period: "2025.09 ~ 2025.10",
    stack: ["React", "JavaScript", "Zustand", "CSS3"],
    githubLink: "https://github.com/KE-WhyNot",
    demoLink: "https://www.youth-fi.com",
    image: null,
    description: [
      "팀 프로젝트 협업 및 애자일 방법론 적용",
      "Zustand를 활용한 전역 상태 관리",
      "사용자 친화적인 UI/UX 기획 및 구현",
    ],
    learning:
      "기업 연계 미러링 실습을 통해 현업과 유사한 환경에서 협업하는 방식을 경험했습니다. Zustand를 처음 도입해보며 Redux보다 가벼운 상태 관리의 장점을 체감했습니다.",
  },
  {
    id: 3,
    title: "G.O.A.T",
    subtitle: "카카오엔터프라이즈 & 디케이테크인 기업실무 1팀",
    category: "Team Project / Web",
    period: "2025.10 ~ 2025.12",
    stack: [
      "React",
      "TypeScript",
      "Vite",
      "Zustand",
      "Tailwind CSS",
      "Framer Motion",
      "Canvas",
    ],
    githubLink: "https://github.com/Watchiiee/G.O.A.T",
    demoLink: "https://haezocorp.space/",
    image: null,
    description: [
      "Canvas API를 활용한 그래픽 요소 구현",
      "Framer Motion을 이용한 자연스러운 애니메이션 효과",
      "Vite 기반의 빠른 개발 환경 세팅 및 최적화",
    ],
    learning:
      "TypeScript를 실무 프로젝트에 본격적으로 도입하여 타입 안정성을 확보하는 중요성을 배웠습니다.",
  },
  {
    id: 4,
    title: "UNI_SWAP",
    subtitle: "고급웹프로그래밍: 대학교 중고거래 플랫폼",
    category: "Team Project / Platform",
    period: "2025.05 ~ 2025.06",
    stack: ["React", "JavaScript", "CSS3"],
    githubLink: "https://github.com/Watchiiee/UNISWAP",
    image: null,
    description: [
      "대학생 인증 기반의 폐쇄형 커뮤니티 기능",
      "게시판 CRUD 및 실시간 검색 기능 구현",
      "React Hooks를 활용한 컴포넌트 로직 분리",
    ],
    learning:
      "웹 프로그래밍 수업을 통해 React의 생명주기와 Hooks의 원리를 깊이 있게 이해하게 되었습니다.",
  },
  {
    id: 5,
    title: "Zipter",
    subtitle: "소프트웨어공학: 부동산 추천 및 지역 커뮤니티",
    category: "Team Project / Service",
    period: "2025.05 ~ 2025.06",
    stack: ["React", "JavaScript", "CSS3"],
    githubLink: "https://github.com/Watchiiee/Zipter_Front",
    image: null,
    description: [
      "지도 API 연동을 통한 매물 위치 시각화",
      "필터링 시스템을 통한 맞춤형 매물 추천",
      "커뮤니티 기능을 통한 사용자 간 정보 공유",
    ],
    learning:
      "소프트웨어 공학 이론을 바탕으로 요구사항 분석부터 설계, 구현, 테스트까지의 전체 SDLC 과정을 경험했습니다.",
  },
  {
    id: 6,
    title: "Speed Quiz Game",
    subtitle: "컴퓨터 네트워크: 텀 프로젝트",
    category: "Team Project / Java GUI",
    period: "2024.11 ~ 2024.12",
    stack: ["Java", "Java Swing"],
    githubLink: "https://github.com/Watchiiee/Network_TermProject",
    image: null,
    description: [
      "Java Socket 프로그래밍을 이용한 실시간 멀티플레이 구현",
      "스레드(Thread) 관리를 통한 동시 접속 처리",
      "Java Swing을 활용한 GUI 클라이언트 제작",
    ],
    learning:
      "웹이 아닌 TCP/IP 소켓 통신을 직접 구현해보며 네트워크 3-4 계층의 흐름과 패킷 통신에 대한 깊은 이해를 얻었습니다.",
  },
];

const categories = ["All", "Web", "Team Project", "Java"];

export default function Projects() {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    if (selectedId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [selectedId]);

  const selectedProject = projects.find((p) => p.id === selectedId);

  return (
    <section id="projects" className="py-24 bg-[#0a192f] text-white relative">
      <div className="container mx-auto px-6">
        {/* 헤더 섹션 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">My Work</h2>
          <p className="text-slate-400 max-w-2xl text-lg leading-relaxed">
            다양한 팀 프로젝트와 개인 연구를 통해 쌓아온 개발 경험입니다.
            <br />
            문제를 해결하고 사용자에게 가치를 전달했던 과정들을 기록했습니다.
          </p>

          <div className="flex flex-wrap gap-6 mt-10 font-mono text-sm">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                className={`hover:text-cyan-400 transition-colors ${
                  idx === 0 ? "text-cyan-400" : "text-slate-500"
                }`}
              >
                {cat}{" "}
                <span className="text-xs align-top opacity-50">0{idx + 1}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* 프로젝트 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => setSelectedId(project.id)}
              className="group cursor-pointer"
            >
              <div className="bg-[#112240] rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="relative h-60 overflow-hidden bg-slate-700">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-800 transition-transform duration-500 group-hover:scale-110 group-hover:bg-slate-700">
                      <FolderOpen className="w-12 h-12 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-400 transition-colors">
                    {project.title}
                  </h3>
                  <div className="text-slate-400 font-mono text-sm mb-4">
                    {project.stack.slice(0, 3).join(" · ")}{" "}
                    {project.stack.length > 3 && "..."}
                  </div>
                  <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                    <span>자세히 보기</span>
                    <span className="h-[2px] w-8 bg-cyan-400 inline-block"></span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 상세 모달 */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedId(null)}
          >
            <motion.div
              layoutId={`project-${selectedProject.id}`}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#112240] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl relative border border-slate-700"
            >
              <button
                onClick={() => setSelectedId(null)}
                className="absolute top-4 right-4 p-2 bg-slate-800/50 hover:bg-slate-700 rounded-full text-white transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex flex-col md:flex-row">
                {/* 좌측 패널 */}
                <div className="w-full md:w-2/5 bg-slate-800/30 p-8 flex flex-col">
                  <div className="aspect-video bg-slate-700 rounded-lg overflow-hidden mb-6 flex items-center justify-center shadow-inner">
                    {selectedProject.image ? (
                      <img
                        src={selectedProject.image}
                        alt={selectedProject.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FolderOpen className="w-16 h-16 text-slate-500" />
                    )}
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-1">
                    {selectedProject.title}
                  </h3>
                  <p className="text-cyan-400 text-sm font-mono mb-6">
                    {selectedProject.subtitle}
                  </p>

                  <div className="space-y-4 text-sm">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-slate-400 shrink-0" />
                      <div>
                        <span className="block text-slate-400 text-xs">
                          Period
                        </span>
                        <span className="text-slate-200">
                          {selectedProject.period}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Layers className="w-5 h-5 text-slate-400 shrink-0" />
                      <div>
                        <span className="block text-slate-400 text-xs">
                          Stack
                        </span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {selectedProject.stack.map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-1 bg-cyan-900/30 text-cyan-300 rounded text-xs"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* ▼▼▼ 3. 링크 렌더링 부분 수정 (둘 다 있으면 둘 다 표시) ▼▼▼ */}
                    {(selectedProject.githubLink ||
                      selectedProject.demoLink) && (
                      <div className="flex flex-col gap-3 pt-4 border-t border-slate-700">
                        {/* GitHub 링크 */}
                        {selectedProject.githubLink && (
                          <div className="flex items-start gap-3">
                            <Github className="w-5 h-5 text-slate-400 shrink-0" />
                            <div className="overflow-hidden">
                              <span className="block text-slate-400 text-xs">
                                GitHub
                              </span>
                              <a
                                href={selectedProject.githubLink}
                                target="_blank"
                                rel="noreferrer"
                                className="text-cyan-400 hover:underline block truncate"
                              >
                                {selectedProject.githubLink}
                              </a>
                            </div>
                          </div>
                        )}
                        {/* 배포(Demo) 링크 */}
                        {selectedProject.demoLink && (
                          <div className="flex items-start gap-3">
                            <ExternalLink className="w-5 h-5 text-slate-400 shrink-0" />
                            <div className="overflow-hidden">
                              <span className="block text-slate-400 text-xs">
                                Deployment
                              </span>
                              <a
                                href={selectedProject.demoLink}
                                target="_blank"
                                rel="noreferrer"
                                className="text-cyan-400 hover:underline block truncate"
                              >
                                {selectedProject.demoLink}
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* 우측 패널 */}
                <div className="w-full md:w-3/5 p-8 overflow-y-auto">
                  <div className="mb-8">
                    <h4 className="flex items-center gap-2 text-lg font-bold text-white mb-4">
                      <Code2 className="w-5 h-5 text-cyan-400" />
                      Key Features
                    </h4>
                    <ul className="space-y-3">
                      {selectedProject.description.map((desc, i) => (
                        <li
                          key={i}
                          className="flex gap-3 text-slate-300 text-sm leading-relaxed"
                        >
                          <span className="text-cyan-500 mt-1.5">•</span>
                          {desc}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-white mb-4 border-l-4 border-pink-500 pl-3">
                      What I Learned
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed bg-slate-800/30 p-4 rounded-lg">
                      {selectedProject.learning}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
