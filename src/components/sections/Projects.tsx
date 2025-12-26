import { motion } from "framer-motion";
import { FolderOpen } from "lucide-react";

// 나중에 실제 프로젝트 데이터로 채워넣을 부분
const projects = [
  {
    id: 1,
    title: "포트폴리오 웹사이트",
    category: "React / Astro",
    image: null, // 이미지가 없으면 null
  },
  {
    id: 2,
    title: "이커머스 대시보드",
    category: "Next.js / TypeScript",
    image: null,
  },
  {
    id: 3,
    title: "채팅 애플리케이션",
    category: "React / Socket.io",
    image: null,
  },
  {
    id: 4,
    title: "여행 기록 앱",
    category: "React Native",
    image: null,
  },
  {
    id: 5,
    title: "블로그 CMS",
    category: "Next.js / Supabase",
    image: null,
  },
  {
    id: 6,
    title: "날씨 정보 서비스",
    category: "JavaScript / API",
    image: null,
  },
];

const categories = ["All", "React", "Next.js", "TypeScript", "Mobile"];

export default function Projects() {
  return (
    <section id="projects" className="py-24 bg-[#0a192f] text-white">
      <div className="container mx-auto px-6">
        {/* 1. 헤더 섹션 (My Work) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">My Work</h2>
          <p className="text-slate-400 max-w-2xl text-lg leading-relaxed">
            수천 명의 클라이언트에게 서비스를 제공하는 확장 가능하고 반응형인 웹
            및 하이브리드 모바일 앱을 배포했습니다.
            <br />
            직관적이고 역동적인 상호작용을 갖춘 고성능 애플리케이션에 집중하며,
            데이터 분석 및 시각화에도 열정을 가지고 있습니다.
          </p>

          {/* 카테고리 필터 (디자인 요소) */}
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

        {/* 2. 프로젝트 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }} // 순차적으로 나타나는 효과
              className="group cursor-pointer"
            >
              {/* 카드 컨테이너 */}
              <div className="bg-[#112240] rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
                {/* 이미지 영역 (마우스 오버 시 확대) */}
                <div className="relative h-64 overflow-hidden bg-slate-700">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    // 이미지가 없을 때 보여줄 빈 박스 (아이콘 표시)
                    <div className="w-full h-full flex items-center justify-center bg-slate-800 transition-transform duration-500 group-hover:scale-110 group-hover:bg-slate-700">
                      <FolderOpen className="w-12 h-12 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                    </div>
                  )}

                  {/* 오버레이 (옵션: 마우스 올리면 살짝 어두워짐) */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                </div>

                {/* 텍스트 정보 영역 */}
                <div className="p-6 relative">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-400 transition-colors">
                    {project.title}
                  </h3>

                  {/* 기본 상태: 카테고리 보여줌 */}
                  <div className="text-slate-400 font-mono text-sm transition-all duration-300 group-hover:opacity-0 group-hover:-translate-y-2">
                    {project.category}
                  </div>

                  {/* 호버 상태: '프로젝트 보기' 보여줌 */}
                  <div className="absolute bottom-6 left-6 flex items-center gap-2 text-cyan-400 font-bold opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                    <span>프로젝트 보기</span>
                    <span className="h-[2px] w-12 bg-cyan-400 inline-block ml-2"></span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
