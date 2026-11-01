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
  Wrench, // 트러블슈팅 아이콘 추가
  Images,
  ChevronLeft,
  ChevronRight,
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
  imageFit?: "cover" | "contain"; // 로고처럼 잘리면 안 되는 대표 이미지는 contain
  detailImage?: string; // 상세 모달에서 대표 이미지 대신 보여줄 서비스 화면
  gallery?: { src: string; caption: string }[]; // 상세 모달 Screenshots 섹션 (클릭 시 확대)
  description: string[];
  troubleshooting?: string[]; // 트러블슈팅 항목 추가 (선택 사항)
  learning: string;
}

const projects: Project[] = [
  {
    id: 8,
    title: "AiAn",
    subtitle: "전기 분야 민원 자동분류 · RAG 답변 초안 시스템 (1인 풀스택)",
    category: "Solo Project / Full-Stack / Backend / AI / Web",
    period: "2026.06 ~ 2026.07",
    stack: [
      "FastAPI",
      "LangGraph",
      "PostgreSQL",
      "React",
      "ChromaDB",
      "Docker",
      "NCP",
      "GitHub Actions",
    ],
    githubLink: "https://github.com/Watchiiee/AiAn",
    image: "/aian/cover.webp",
    detailImage: "/aian/review.webp",
    gallery: [
      { src: "/aian/inquiry.webp", caption: "민원인 문의 작성" },
      { src: "/aian/submitted.webp", caption: "문의 접수 및 번호 발급" },
      {
        src: "/aian/review.webp",
        caption: "담당자 검토: AI 분류·확신도·부서 배정과 답변 초안",
      },
      {
        src: "/aian/evidence.webp",
        caption: "RAG 근거 문서: 답변에 사용된 문서와 참고 문서 구분",
      },
      {
        src: "/aian/copilot.webp",
        caption: "AI 코파일럿 질의와 승인된 최종 답변",
      },
      {
        src: "/aian/pipeline.webp",
        caption: "LangGraph 파이프라인: 재검색·재생성 루프",
      },
      {
        src: "/aian/architecture.webp",
        caption: "NCP 배포 아키텍처: Private 백엔드, LB, Auto Scaling, NAT",
      },
    ],
    description: [
      "LangGraph 14개 노드 Adaptive RAG 파이프라인으로 민원 분류 → 부서 배정 → 근거 검색 → 답변 초안 생성 → 할루시네이션 검증까지 자동화",
      "FastAPI REST API와 JWT(bcrypt) 인증, 3단계 RBAC(general/staff/master) 기반 부서별 검토 큐 및 부서 재배정 승인 흐름 구현",
      "담당자가 AI 판단 근거를 실시간으로 물어볼 수 있는 SSE 스트리밍 코파일럿 구현",
      "NCP 3-tier 배포: VPC와 용도별 서브넷 4개, Private 백엔드 + Load Balancer + CPU 기반 Auto Scaling + NAT Gateway + Bastion 구성",
      "89문항 골든셋으로 실측 평가하여 도메인 분류 정확도 97.8%, 정답 대비 답변 정확성 95.0% 달성",
      "GitHub Actions 스케줄로 Langfuse 트레이스를 집계해 이상 패턴을 메일로 보고하는 Ops 일일 리포트 자동화",
    ],
    troubleshooting: [
      "도메인 분류 편향: 전문용어가 포함된 기술 질문이 행정으로 오분류되는 패턴을 10회 반복 실행으로 확정하고, 프롬프트 지시와 폴백 키워드를 보강해 정확도를 87.6%에서 97.8%로 개선",
      "지표 급락 원인 추적: 정확도가 34.8%로 급락한 현상을 코드 버그로 단정하지 않고 원본 오류 로그로 LLM API 분당 요청 한도 초과임을 확정, 오류 유형별 차등 backoff 재시도로 해결",
      "Private 서브넷 아웃바운드: 공인 IP 없는 백엔드가 외부 DB와 LLM API에 접속하지 못하는 문제를 NAT Gateway와 라우팅 테이블 구성으로 해결",
      "Auto Scaling 헬스체크: 이미지 복제 후 컨테이너가 자동 기동되지 않는 문제를 restart 정책과 로드밸런서 기반 헬스체크로 해결하고, stress-ng 부하테스트로 2대 → 3대 → 2대 스케일링을 검증",
    ],
    learning:
      "기획부터 백엔드, 프론트엔드, 클라우드 인프라까지 혼자 구축하며 서비스 전체 구조를 설계하는 경험을 했습니다. 특히 '논리적으로 타당해 보이는 개선'도 골든셋으로 실측하기 전에는 반영하지 않는 원칙을 세웠고, 실제로 하이브리드 검색은 측정 결과 recall이 떨어져 기각하는 등 데이터로 의사결정하는 습관을 길렀습니다. Private 서브넷, NAT, Auto Scaling을 직접 구성하며 겪은 장애를 통해 인프라가 애플리케이션 동작에 미치는 영향도 깊이 이해하게 되었습니다.",
  },
  {
    id: 2,
    title: "ISeeU",
    subtitle: "간호대생 중환자실(ICU) 임상 실습 및 학습 플랫폼 (외주)",
    category: "Freelance / Web Platform",
    period: "2026.02 ~ 2026.02",
    stack: ["React", "TypeScript", "Zustand", "Tailwind CSS", "Axios", "xlsx"],
    githubLink: "https://github.com/Watchiiee/IseeU",
    demoLink: "https://www.iseeu.kr/",
    image: "/IseeU.png",
    detailImage: "/iseeu/preceptor.webp",
    gallery: [
      {
        src: "/iseeu/topics.webp",
        caption: "ICU 학습주제: 주제별 멀티미디어 학습 콘텐츠",
      },
      {
        src: "/iseeu/preceptor.webp",
        caption: "AI 프리셉터: LLM 기반 임상 추론 시나리오 롤플레잉",
      },
      {
        src: "/iseeu/guide.webp",
        caption: "실습 안내: 일정·시간표·집담회 정보 (실명 마스킹)",
      },
      {
        src: "/iseeu/students.webp",
        caption: "관리자 학생 관리: 검색·페이지네이션 (개인정보 마스킹)",
      },
      {
        src: "/iseeu/evaluation.webp",
        caption: "학습 현황 대시보드: 다중 헤더 통계 테이블 (개인정보 마스킹)",
      },
    ],

    description: [
      "학습 콘텐츠(ICU 8대 주제 영상/퀴즈, 심전도, EKG 등) 제공 및 실습 일지 웹 작성/PDF 반출 기능 구현",
      "전공 서적 기반 RAG(검색 증강 생성) 챗봇 연동 및 LLM 기반의 임상 추론 시나리오 평가(SBAR) UI 구축",
      "메뉴 체류 시간, PDF 열람 유무, 영상 클릭 등 세밀한 사용자 행동 이벤트 로깅(Session Tracking) 처리",
      "저작권 보호를 위해 다운로드/인쇄를 차단한 커스텀 PDF 뷰어와 약물 계산 랜덤 퀴즈 로직 구현",
      "실시간 접속자 모니터링 및 복잡한 학생 학습 데이터의 다중 Depth 엑셀 다운로드를 포함한 관리자 대시보드 구축",
    ],

    troubleshooting: [
      "보안/인증 고도화: HttpOnly 쿠키 기반 Silent Refresh 구현 시 발생한 CORS 및 인터셉터 무한 루프 문제를 전용 Axios 인스턴스 분리로 해결하여 안전한 인증 흐름 구축",
      "다중 세션 동기화: 다중 기기 접속 시 발생하는 토큰 만료 충돌을 Zustand 스토어 초기화 및 즉각적인 401 예외 처리 로직으로 방어",
      "저작권 보호 뷰어: 강의 자료(PDF)의 무단 다운로드 및 인쇄를 막기 위해 브라우저 기본 뷰어를 대체하는 커스텀 UI 및 우클릭/드래그 방지 적용",
      "대시보드 RWD 최적화: 수십 개의 컬럼을 가진 방대한 통계 테이블에 커스텀 가로 스크롤 및 Tailwind Breakpoints 기반 동적 레이아웃을 적용하여 모바일 사용성 극대화",
    ],

    learning:
      "프리랜서 외주 개발자로서 클라이언트 요구사항을 분석하고 Figma 시안을 바탕으로 프론트엔드 전반을 독자적으로 구축했습니다. 단순 UI 구현을 넘어, LLM 챗봇 연동과 세밀한 사용자 이벤트 로깅 등 난이도 높은 기능들을 처리하며 프론트엔드의 역할 확장을 경험했습니다. 또한 JWT와 HttpOnly 쿠키를 조합한 안전한 인증 흐름을 설계하며 보안 지식을 쌓았고, AI 어시스턴트를 적극 활용해 복잡한 테이블 렌더링 최적화와 트러블슈팅 시간을 크게 단축했습니다.",
  },
  {
    id: 9,
    title: "SafetyTrip",
    subtitle: "재난안전 여행 가이드 AI 에이전트 (2인 팀, 백엔드)",
    category: "Team Project / Backend / AI",
    period: "2026.07 ~ 2026.07",
    stack: [
      "FastAPI",
      "LangGraph",
      "Supabase",
      "pgvector",
      "Docker",
      "GCP",
      "GitHub Actions",
    ],
    githubLink: "https://github.com/SafetyTrip2026/BE",
    image: "/safetytrip-logo.png",
    imageFit: "contain",
    detailImage: "/safetytrip-demo.webp",
    description: [
      "행정안전부 긴급재난문자 3개년 53,631건과 국민행동요령 751건을 수집·정제해 Supabase(Postgres + pgvector)에 적재",
      "LangGraph 에이전트로 질문 파싱 → 지역·시기별 재난 통계 SQL 집계 / 벡터 검색 → 2중 게이트 → 답변 생성 흐름 구현, FastAPI SSE로 스트리밍",
      "대화 세션 체크포인트로 후속 질문에서 이전 턴의 지역·시기·동반자 맥락을 자동으로 유지",
      "CI/CD 자동화: PR 시 lint·test, 스키마 변경 시 DB 자동 마이그레이션, Docker 이미지 빌드 → GHCR → GCE 자동 배포 및 헬스체크",
    ],
    troubleshooting: [
      "근거 없는 답변 차단: 벡터 거리 기반 1차 게이트에 LLM 적합성 2차 판정을 추가하고, 자체 평가셋 30건으로 반복 캘리브레이션해 에스컬레이션 판단 F1을 50%에서 73.7%로 개선",
      "데이터 공백 대응: 표본이 부족한 지역은 상위 행정구역으로 자동 확대하고, 그래도 부족하면 표본 부족을 사용자에게 명시하는 폴백 구현",
      "LLM 장애 대응: 호출별 30초 timeout, 일시 오류에만 지수 백오프 재시도, 최종 실패 시 행동요령 원문과 연락처로 안전하게 강등하는 3단 방어 구현",
    ],
    learning:
      "안전 도메인에서는 그럴듯한 오답이 실제 위험으로 이어질 수 있기 때문에, '모르면 모른다고 하는' 시스템을 목표로 설계했습니다. 통계는 SQL 집계로, 행동 지침은 공식 문서 인용으로만 답하게 하고 그 판단의 정확도를 precision/recall로 측정하며, 감이 아닌 지표로 품질을 관리하는 방법을 배웠습니다. 또한 DB 마이그레이션부터 컨테이너 배포까지 CI/CD 파이프라인을 구축하며 팀 개발의 배포 흐름을 자동화했습니다.",
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
    image: "/HAEZO.png",
    detailImage: "/goat/dashboard.webp",
    gallery: [
      {
        src: "/goat/login.webp",
        caption: "로그인: 서버 연결 상태 표시 (Offline 시 게임 제공)",
      },
      { src: "/goat/signup.webp", caption: "마스터 회원가입: 2단계 이메일 인증" },
      {
        src: "/goat/dashboard.webp",
        caption: "대시보드: 질의량 추이·응답 유형 KPI 시각화",
      },
      {
        src: "/goat/documents.webp",
        caption: "문서 관리: 부서별 문서 업로드·승인 상태 관리",
      },
      { src: "/goat/faq.webp", caption: "FAQ 관리: 부서별 FAQ CRUD와 AI 추천" },
      {
        src: "/goat/organization.webp",
        caption: "조직 관리: Canvas 조직도와 구성원 관리",
      },
      {
        src: "/goat/history.webp",
        caption: "이력 관리: 관리자 활동·에러 로그 기록",
      },
      {
        src: "/goat/mypage.webp",
        caption: "마이페이지: 프로필·권한 확인 (이메일 마스킹)",
      },
    ],
    description: [
      "RBAC(Master/Admin/User) 권한 시스템 및 JWT(Access/Refresh) 기반의 보안 로그인/인터셉터 구현",
      "KPI 지표 시각화(Line/Bar/Pie) 및 서버 연결 실패 시 오프라인 게임(Flappy Bird) 제공",
      "S3 기반 3단계 문서 업로드(URL발급→업로드→완료), 미리보기, 승인 결재 시스템 및 버전 관리",
      "Canvas API를 활용한 반응형 조직도(줌/스크롤, 드래그 앤 드롭) 및 부서/구성원 CRUD 관리",
    ],
    learning:
      "방대한 기능을 팀원들과 분담하여 개발하면서 Git Flow 전략과 코드 리뷰 문화를 정착시켰습니다. TypeScript와 인터셉터를 활용해 복잡한 인증/권한 로직을 안정적으로 처리하는 구조를 설계했고, 서로 다른 모듈을 통합하는 과정에서 발생한 충돌을 해결하며 긴밀한 소통 역량을 키웠습니다.",
  },
  {
    id: 4,
    title: "WhyNot?",
    subtitle: "가천대 카카오엔터프라이즈 미러링 실습 4팀",
    category: "Team Project / Web",
    period: "2025.09 ~ 2025.10",
    stack: ["React", "JavaScript", "Zustand", "CSS3", "React Query", "MSW"],
    githubLink: "https://github.com/KE-WhyNot",
    demoLink: "https://www.youth-fi.com",
    image: "/youthfi.png",
    description: [
      "Figma와 Cursor MCP를 활용하여 초기 UI 구조 및 코드 패턴을 신속하게 정립",
      "Axios 인스턴스 모듈화 및 React Query + Zustand를 통한 효율적인 서버/클라이언트 상태 통합 관리",
      "ECharts/Nivo 라이브러리 기반의 데이터 시각화로 직관적인 대시보드 UX 제공",
      "MSW(Mock Service Worker)를 도입해 백엔드 API 개발 대기 시간을 줄인 선행 개발 환경 구축",
    ],
    learning:
      "기업 연계 미러링 실습을 통해 기획부터 배포까지의 전체적인 애자일 프로세스를 경험했습니다. 특히 MSW를 활용해 백엔드 의존성을 낮추어 팀원 간 병렬 개발 효율을 극대화했고, 전역 상태 관리 전략을 수립하며 팀원들과 코드 컨벤션을 맞추는 협업의 중요성을 깊이 배웠습니다.",
  },
  {
    id: 5,
    title: "UNI_SWAP",
    subtitle: "고급웹프로그래밍: 대학교 중고거래 플랫폼",
    category: "Team Project / Platform",
    period: "2025.05 ~ 2025.06",
    stack: ["React", "JavaScript", "CSS3"],
    githubLink: "https://github.com/Watchiiee/UNISWAP",
    image: "/uniswap.png",
    description: [
      "대학생 인증 기반의 폐쇄형 커뮤니티 기능",
      "게시판 CRUD 및 실시간 검색 기능 구현",
      "React Hooks를 활용한 컴포넌트 로직 분리",
    ],
    learning:
      "웹 프로그래밍 수업을 통해 React의 생명주기와 Hooks의 원리를 깊이 있게 이해하게 되었습니다.",
  },
  {
    id: 6,
    title: "Zipter",
    subtitle: "소프트웨어공학: 부동산 추천 및 지역 커뮤니티",
    category: "Team Project / Service",
    period: "2025.05 ~ 2025.06",
    stack: ["React", "JavaScript", "CSS3"],
    githubLink: "https://github.com/Watchiiee/Zipter_Front",
    image: "/zipter.png",
    description: [
      "지도 API 연동을 통한 매물 위치 시각화",
      "필터링 시스템을 통한 맞춤형 매물 추천",
      "커뮤니티 기능을 통한 사용자 간 정보 공유",
    ],
    learning:
      "소프트웨어 공학 이론을 바탕으로 요구사항 분석부터 설계, 구현, 테스트까지의 전체 SDLC 과정을 경험했습니다.",
  },
  {
    id: 7,
    title: "Speed Quiz Game",
    subtitle: "컴퓨터 네트워크: 텀 프로젝트",
    category: "Team Project / Backend / Java GUI",
    period: "2024.11 ~ 2024.12",
    stack: ["Java", "Java Swing"],
    githubLink: "https://github.com/Watchiiee/Network_TermProject",
    image: "/network.png",
    description: [
      "Java Socket 프로그래밍을 이용한 실시간 멀티플레이 구현",
      "스레드(Thread) 관리를 통한 동시 접속 처리",
      "Java Swing을 활용한 GUI 클라이언트 제작",
    ],
    learning:
      "웹이 아닌 TCP/IP 소켓 통신을 직접 구현해보며 네트워크 3-4 계층의 흐름과 패킷 통신에 대한 깊은 이해를 얻었습니다.",
  },
  {
    id: 1,
    title: "포트폴리오 웹사이트",
    subtitle: "개인 포트폴리오 및 소개 페이지",
    category: "Web / Portfolio",
    period: "2025.12 ~ 진행중",
    stack: ["TypeScript", "Astro", "Tailwind CSS", "Three.js"],
    githubLink: "https://github.com/Watchiiee/Watchiiee.github.io",
    demoLink: "https://watchiiee.github.io/",
    image: null,
    description: [
      "Astro 프레임워크를 활용한 고성능 정적 웹사이트 구축",
      "React 컴포넌트와 Tailwind CSS를 활용한 모던 UI 디자인",
      "Three.js 셰이더 기반 파티클 배경을 Hero에만 아일랜드로 분리해 로드",
      "GitHub Actions를 통한 자동 배포 파이프라인 구축",
    ],
    learning:
      "Astro의 아일랜드 아키텍처를 이해하고, 불필요한 JS 로딩을 줄여 성능을 최적화하는 방법을 익혔습니다.",
  },
];

const categories = [
  "All",
  "Full-Stack",
  "Backend",
  "AI",
  "Web",
  "Team Project",
  "Freelance",
  "Java",
];

export default function Projects() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    if (selectedId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [selectedId]);

  const selectedProject = projects.find((p) => p.id === selectedId);
  const gallery = selectedProject?.gallery ?? [];
  // 확대 보기: open=false가 되면 닫힘 트랜지션을 재생하고, 완전히 투명해진 뒤 null로 제거
  const [lightbox, setLightbox] = useState<{
    index: number;
    open: boolean;
  } | null>(null);

  // 처음 렌더링된 투명한 상태를 브라우저가 그린 다음 프레임에 visible로 바꿔야 페이드인이 적용됨
  const [lightboxEntered, setLightboxEntered] = useState(false);
  useEffect(() => {
    if (!lightbox?.open) {
      setLightboxEntered(false);
      return;
    }
    const frame = requestAnimationFrame(() => setLightboxEntered(true));
    return () => cancelAnimationFrame(frame);
  }, [lightbox?.open]);
  const lightboxVisible = !!lightbox?.open && lightboxEntered;

  const openLightbox = (index: number) => setLightbox({ index, open: true });
  const closeLightbox = () =>
    setLightbox((prev) => prev && { ...prev, open: false });
  const moveLightbox = (step: number) =>
    setLightbox(
      (prev) =>
        prev && {
          index: (prev.index + step + gallery.length) % gallery.length,
          open: true,
        }
    );

  const closeModal = () => {
    setLightbox(null);
    setSelectedId(null);
  };

  // ESC: 확대 보기가 열려 있으면 그것부터 닫고, 아니면 모달 닫기 / 좌우 화살표: 이미지 이동
  useEffect(() => {
    if (!selectedId) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (lightbox?.open) {
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowRight") moveLightbox(1);
        if (e.key === "ArrowLeft") moveLightbox(-1);
      } else if (e.key === "Escape") {
        closeModal();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedId, lightbox?.open, gallery.length]);

  const filteredProjects = projects.filter((project) => {
    if (activeCategory === "All") return true;
    return project.category.includes(activeCategory);
  });

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
                onClick={() => setActiveCategory(cat)}
                className={`hover:text-cyan-400 transition-colors ${
                  activeCategory === cat ? "text-cyan-400" : "text-slate-500"
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
          {filteredProjects.map((project, index) => (
            <motion.div
              layout
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
                      className={`w-full h-full transition-transform duration-500 group-hover:scale-110 ${
                        project.imageFit === "contain"
                          ? "object-contain p-6 bg-white"
                          : "object-cover object-top"
                      }`}
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
            onClick={closeModal}
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
                onClick={closeModal}
                aria-label="닫기"
                className="absolute top-4 right-4 p-2 bg-slate-800/50 hover:bg-slate-700 rounded-full text-white transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex flex-col md:flex-row">
                {/* 좌측 패널 */}
                <div className="w-full md:w-2/5 bg-slate-800/30 p-8 flex flex-col">
                  {selectedProject.detailImage ? (
                    // 서비스 화면은 클릭하면 원본 크기로 볼 수 있도록 링크로 감쌈
                    <a
                      href={selectedProject.detailImage}
                      target="_blank"
                      rel="noreferrer"
                      className="group/detail relative block aspect-video bg-slate-700 rounded-lg overflow-hidden mb-6 shadow-inner"
                    >
                      <img
                        src={selectedProject.detailImage}
                        alt={`${selectedProject.title} 서비스 화면`}
                        className="w-full h-full object-cover object-left-top transition-transform duration-500 group-hover/detail:scale-105"
                      />
                      <span className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 rounded bg-black/60 text-xs text-slate-200 opacity-0 group-hover/detail:opacity-100 transition-opacity">
                        <ExternalLink className="w-3 h-3" />
                        원본 크기로 보기
                      </span>
                    </a>
                  ) : (
                    <div className="aspect-video bg-slate-700 rounded-lg overflow-hidden mb-6 flex items-center justify-center shadow-inner">
                      {selectedProject.image ? (
                        <img
                          src={selectedProject.image}
                          alt={selectedProject.title}
                          className={`w-full h-full ${
                            selectedProject.imageFit === "contain"
                              ? "object-contain p-4 bg-white"
                              : "object-cover object-top"
                          }`}
                        />
                      ) : (
                        <FolderOpen className="w-16 h-16 text-slate-500" />
                      )}
                    </div>
                  )}

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

                    {/* 링크 렌더링 부분 */}
                    {(selectedProject.githubLink ||
                      selectedProject.demoLink) && (
                      <div className="flex flex-col gap-3 pt-4 border-t border-slate-700">
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
                  {/* 주요 기능 */}
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

                  {/* 트러블슈팅 (데이터가 있는 경우에만 렌더링) */}
                  {selectedProject.troubleshooting && (
                    <div className="mb-8">
                      <h4 className="flex items-center gap-2 text-lg font-bold text-white mb-4">
                        <Wrench className="w-5 h-5 text-orange-400" />
                        Troubleshooting
                      </h4>
                      <ul className="space-y-3">
                        {selectedProject.troubleshooting.map((issue, i) => {
                          // 첫 번째 콜론을 기준으로 제목과 내용 분리 (내용 안의 콜론은 유지)
                          const sep = issue.indexOf(":");
                          const title = sep > -1 ? issue.slice(0, sep) : issue;
                          const content = sep > -1 ? issue.slice(sep + 1).trim() : "";
                          return (
                            <li
                              key={i}
                              className="text-slate-300 text-sm leading-relaxed bg-slate-800/20 p-3 rounded-lg border-l-2 border-orange-500/50"
                            >
                              {content ? (
                                <>
                                  <strong className="text-orange-300">
                                    {title}:
                                  </strong>{" "}
                                  {content}
                                </>
                              ) : (
                                issue
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}

                  {/* 스크린샷 갤러리 (데이터가 있는 경우에만 렌더링) */}
                  {gallery.length > 0 && (
                    <div className="mb-8">
                      <h4 className="flex items-center gap-2 text-lg font-bold text-white mb-4">
                        <Images className="w-5 h-5 text-sky-400" />
                        Screenshots
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {gallery.map((shot, i) => (
                          <button
                            key={shot.src}
                            type="button"
                            onClick={() => openLightbox(i)}
                            className="group/shot text-left"
                          >
                            <div className="aspect-video rounded-lg overflow-hidden bg-slate-800/60 border border-slate-700 group-hover/shot:border-cyan-400 transition-colors">
                              <img
                                src={shot.src}
                                alt={shot.caption}
                                loading="lazy"
                                className="w-full h-full object-contain transition-transform duration-300 group-hover/shot:scale-105"
                              />
                            </div>
                            <span className="block mt-2 text-xs text-slate-400 leading-snug break-keep">
                              <span className="font-mono text-cyan-400 mr-1">
                                {String(i + 1).padStart(2, "0")}
                              </span>
                              {shot.caption}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 배운 점 */}
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

      {/* 스크린샷 확대 보기 (모달 위에 표시)
          - 배경과 사진이 함께 페이드되면 반투명한 사진 뒤로 모달 글자가 비쳐 깜빡여 보이므로,
            열 때는 배경 → 사진, 닫을 때는 사진 → 배경 순서로 나눠서 페이드
          - framer-motion(WAAPI)은 애니메이션 종료 시 한 프레임 동안 시작 값으로 돌아가 깜빡이므로
            CSS transition으로 처리하고, 배경 페이드아웃이 끝난 뒤(transitionend) 제거 */}
      {lightbox && gallery[lightbox.index] && (
        <div
          onTransitionEnd={(e) => {
            if (
              e.target === e.currentTarget &&
              e.propertyName === "opacity" &&
              !lightbox.open
            )
              setLightbox(null);
          }}
          className={`fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-12 bg-[#020617] transition-opacity duration-150 ${
            lightboxVisible
              ? "opacity-100 ease-out"
              : "opacity-0 ease-in delay-[120ms] pointer-events-none"
          }`}
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            aria-label="확대 보기 닫기"
            className="absolute top-4 right-4 p-2 bg-slate-800/60 hover:bg-slate-700 rounded-full text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {gallery.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  moveLightbox(-1);
                }}
                aria-label="이전 이미지"
                className="absolute left-2 md:left-6 p-2 bg-slate-800/60 hover:bg-slate-700 rounded-full text-white transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  moveLightbox(1);
                }}
                aria-label="다음 이미지"
                className="absolute right-2 md:right-6 p-2 bg-slate-800/60 hover:bg-slate-700 rounded-full text-white transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <figure
            className={`flex flex-col items-center max-w-5xl transition-[opacity,transform] ${
              lightboxVisible
                ? "opacity-100 scale-100 duration-200 delay-150 ease-out"
                : "opacity-0 scale-[0.96] duration-[120ms] ease-in"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={gallery[lightbox.index].src}
              alt={gallery[lightbox.index].caption}
              className="max-h-[78vh] max-w-full object-contain rounded-lg shadow-2xl"
            />
            <figcaption className="mt-4 text-sm text-slate-300 text-center break-keep">
              <span className="font-mono text-cyan-400 mr-2">
                {lightbox.index + 1} / {gallery.length}
              </span>
              {gallery[lightbox.index].caption}
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}
