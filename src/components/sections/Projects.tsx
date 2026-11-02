import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderOpen,
  X,
  Github,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// 트러블슈팅: 원인·결과를 따로 적을 게 없으면 생략
interface Trouble {
  title: string;
  problem: string;
  cause?: string;
  solution: string;
  result?: string;
}

interface Project {
  id: number;
  title: string;
  subtitle: string;
  role?: string;
  category: string;
  period: string;
  stack: string[];
  githubLink?: string;
  demoLink?: string;
  image: string | null;
  imageFit?: "cover" | "contain"; // 로고처럼 잘리면 안 되는 대표 이미지는 contain
  detailImage?: string; // 상세 모달에서 대표 이미지 대신 보여줄 서비스 화면
  gallery?: { src: string; caption: string }[]; // 상세 모달 화면 섹션 (클릭 시 확대)
  description: string[];
  troubleshooting?: Trouble[];
  learning: string;
}

const projects: Project[] = [
  {
    id: 8,
    title: "AiAn",
    subtitle: "전기 분야 민원을 분류하고 답변 초안을 써 주는 시스템",
    role: "1인 개발 (기획 · 백엔드 · 프론트엔드 · 인프라)",
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
      { src: "/aian/inquiry.webp", caption: "민원인이 문의를 작성하는 화면" },
      { src: "/aian/submitted.webp", caption: "접수 완료와 문의 번호 안내" },
      {
        src: "/aian/review.webp",
        caption: "담당자 검토 화면 (분류 결과, 확신도, 답변 초안)",
      },
      {
        src: "/aian/evidence.webp",
        caption: "답변에 쓴 근거 문서와 참고만 한 문서",
      },
      { src: "/aian/copilot.webp", caption: "코파일럿 질문과 승인된 답변" },
      { src: "/aian/pipeline.webp", caption: "LangGraph 처리 흐름" },
      { src: "/aian/architecture.webp", caption: "네이버클라우드 배포 구조" },
    ],
    description: [
      "민원이 들어오면 분류, 부서 배정, 근거 문서 검색, 답변 초안 작성, 검증까지 이어지는 흐름을 LangGraph로 만들었습니다.",
      "AI가 답변을 바로 보내지 않고, 담당자가 초안과 근거를 확인한 뒤 승인하도록 설계했습니다.",
      "FastAPI로 API를 만들고 JWT 로그인과 3단계 권한을 붙였습니다. 담당자는 자기 부서 민원만 보고, 부서 변경은 관리자가 승인합니다.",
      "담당자가 'AI가 왜 이 문서를 골랐는지' 물어볼 수 있는 코파일럿을 SSE 스트리밍으로 만들었습니다.",
      "네이버클라우드에 VPC를 만들고 백엔드를 Private 서브넷에 둔 뒤, 로드밸런서와 Auto Scaling, NAT Gateway, Bastion을 붙여 배포했습니다.",
      "89문항 평가셋을 직접 만들어 측정했고, 도메인 분류 97.8%, 정답 대비 답변 정확도 95.0%가 나왔습니다.",
    ],
    troubleshooting: [
      {
        title: "반복 실행으로 분류 편향의 원인 확정",
        problem:
          "전문용어가 들어간 기술 질문 일부가 행정 민원으로 분류됐습니다. LLM은 같은 질문에도 답이 흔들릴 수 있어서, 우연인지 실제 결함인지부터 가려야 했습니다.",
        cause:
          "같은 질문을 10번씩 돌려 10번 모두 틀리는 것을 보고 결함으로 확정했습니다. 원인은 두 단계였습니다. 모델이 분류 대신 설명부터 써서 JSON 파싱이 실패했고, 그때 쓰는 대체 키워드 목록에 'CT', '절연저항' 같은 용어가 없어 기본값인 행정으로 떨어졌습니다.",
        solution:
          "'설명하지 말고 분류만 하라'는 지시를 넣고, 실패 사례에서 나온 용어로 키워드를 보강했습니다.",
        result:
          "도메인 분류 정확도 87.6% → 97.8% (89문항 평가셋). 이후 반복 실행으로 노이즈와 결함을 구분하는 것을 검증 절차로 정했습니다.",
      },
      {
        title: "지표 급락을 코드 탓으로 단정하지 않기",
        problem:
          "위 수정을 다시 검증하자 카테고리 정확도가 86.5%에서 34.8%로 떨어졌습니다. 방금 바꾼 코드가 원인처럼 보였습니다.",
        cause:
          "평가 스크립트가 감추던 원본 오류를 출력해 보니, LLM API의 분당 요청 한도 초과였습니다. 89문항을 쉬지 않고 문항마다 두 번씩 호출하는 구조가 한도를 넘겼습니다.",
        solution:
          "요청 사이에 간격을 두고, 한도 초과는 길게, 그 외 일시 오류는 짧게 기다렸다 다시 시도하도록 오류 유형별로 나눴습니다.",
        result:
          "재측정에서 의도한 지표만 오르고 나머지는 원래 수치로 돌아온 것을 확인했습니다.",
      },
      {
        title: "측정해 보니 나빠진 개선안은 버리기",
        problem:
          "영문 약어나 표준명이 임베딩 검색에서 밀리는 문제를 보완하려고 BM25 키워드 검색을 섞는 하이브리드 검색을 만들었습니다. 논리적으로는 좋아질 것 같았습니다.",
        solution:
          "평가셋으로 비교하니 recall이 97.2%에서 94.4%로 오히려 떨어져, 기본값에서 빼고 옵션으로만 남겼습니다. 같은 기준으로 복합 질문 분해 기능도 파이프라인에 붙이기 전 단독 측정에서 오분해율 53.6%가 나와 폐기했습니다.",
        result:
          "반대로 실패 사례의 정답 순위(4~6위)를 근거로 정한 동적 검색 개수(min_k=6)는 측정에서 효과가 확인돼 기본값으로 채택했습니다.",
      },
      {
        title: "헬스체크 기준을 '서버'에서 '서비스 응답'으로",
        problem:
          "Auto Scaling으로 띄운 서버가 로드밸런서 헬스체크를 계속 통과하지 못했습니다.",
        cause:
          "이미지를 복제한 서버는 켜지지만 Docker 컨테이너는 자동으로 다시 실행되지 않았습니다. 헬스체크를 '서버' 기준으로 두면 이런 상태를 정상으로 잘못 판단하게 됩니다.",
        solution:
          "컨테이너에 restart 정책을 넣고, 헬스체크를 GET /health 응답을 보는 로드밸런서 기준으로 바꿨습니다. NCP에서는 이 설정을 생성 후 수정할 수 없어 Auto Scaling 그룹을 새로 만들었습니다.",
        result:
          "stress-ng로 CPU 부하를 걸어 2대 → 3대 → 2대로 늘고 주는 것을 확인했습니다. 테스트 중 LLM API 장애가 실제로 발생했을 때, 근거 문서를 인용한 대체 답변으로 넘어가는 것도 확인했습니다.",
      },
    ],
    learning:
      "혼자 기획부터 배포까지 하다 보니, 그럴듯해 보이는 개선을 바로 넣고 싶을 때가 많았습니다. 그래서 평가셋으로 재기 전에는 반영하지 않는다는 규칙을 정했고, 실제로 하이브리드 검색은 재 보니 recall이 오히려 떨어져서 뺐습니다. 인프라를 직접 만지면서는 코드가 맞아도 네트워크 설정 하나로 서비스가 멈출 수 있다는 것을 알게 됐습니다.",
  },
  {
    id: 2,
    title: "ISeeU",
    subtitle: "간호학과 학생의 중환자실 실습과 학습을 돕는 플랫폼",
    role: "외주 · 프론트엔드 전체",
    category: "Freelance / Web Platform",
    period: "2026.02",
    stack: ["React", "TypeScript", "Zustand", "Tailwind CSS", "Axios", "xlsx"],
    githubLink: "https://github.com/Watchiiee/IseeU",
    demoLink: "https://www.iseeu.kr/",
    image: "/IseeU.png",
    detailImage: "/iseeu/preceptor.webp",
    gallery: [
      { src: "/iseeu/topics.webp", caption: "ICU 학습주제 목록" },
      { src: "/iseeu/preceptor.webp", caption: "AI 프리셉터 임상 추론 연습" },
      { src: "/iseeu/guide.webp", caption: "실습 안내 (실명은 가렸습니다)" },
      {
        src: "/iseeu/students.webp",
        caption: "관리자 학생 관리 (개인정보는 가렸습니다)",
      },
      {
        src: "/iseeu/evaluation.webp",
        caption: "학습 현황 표 (개인정보는 가렸습니다)",
      },
    ],
    description: [
      "ICU 8대 주제 영상과 퀴즈, 심전도 학습, 실습 일지 작성과 PDF 내보내기를 만들었습니다.",
      "전공 서적 기반 RAG 챗봇을 연결하고, LLM으로 임상 추론 시나리오(SBAR)를 평가하는 화면을 만들었습니다.",
      "메뉴 체류 시간, PDF 열람 여부, 영상 클릭 같은 학습 기록을 남기도록 했습니다.",
      "강의 자료 저작권을 지키기 위해 다운로드와 인쇄를 막은 PDF 뷰어를 직접 만들었습니다.",
      "관리자 화면에서 실시간 접속자를 보고, 학생별 학습 데이터를 엑셀로 내려받을 수 있게 했습니다.",
    ],
    troubleshooting: [
      {
        title: "쿠키 기반 인증에서 생긴 재발급 무한 루프",
        problem:
          "토큰 탈취를 막으려고 HttpOnly 쿠키에 두고, 만료되면 자동으로 재발급(Silent Refresh)하도록 만들었습니다. 그런데 재발급 요청이 끝없이 반복되며 CORS 오류가 함께 났습니다.",
        cause:
          "재발급 요청도 같은 Axios 인스턴스를 써서, 재발급이 실패하면 인터셉터가 다시 재발급을 시도하는 구조였습니다.",
        solution:
          "재발급 전용 인스턴스를 분리해 인터셉터를 거치지 않게 했습니다. 여러 기기 접속으로 토큰이 엇갈릴 때는 401을 받는 즉시 Zustand 스토어를 비워, 만료된 사용자 정보가 화면에 남지 않게 했습니다.",
      },
    ],
    learning:
      "외주라서 요구사항 정리부터 Figma 시안 구현까지 프론트엔드를 혼자 책임졌습니다. 화면뿐 아니라 챗봇 연결, 학습 기록, 쿠키 기반 인증까지 맡으면서 프론트엔드가 다루는 범위가 생각보다 넓다는 것을 알게 됐습니다. 복잡한 표 렌더링이나 버그를 잡을 때는 AI 어시스턴트를 적극적으로 활용해 시간을 줄였습니다.",
  },
  {
    id: 9,
    title: "SafetyTrip",
    subtitle: "여행지와 시기에 맞춰 재난 위험과 행동요령을 알려 주는 AI 에이전트",
    role: "2인 팀 · 백엔드",
    category: "Team Project / Backend / AI",
    period: "2026.07",
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
      "긴급재난문자 3년치 53,631건과 국민행동요령 751건을 모아 정리한 뒤 Supabase(Postgres + pgvector)에 넣었습니다.",
      "재난 통계는 SQL로 집계하고 행동요령은 벡터 검색으로 찾는 LangGraph 에이전트를 만들었습니다. 답변은 FastAPI SSE로 스트리밍합니다.",
      "'노약자는 뭘 더 챙겨야 해?' 같은 후속 질문에서도 앞서 말한 지역, 시기, 동반자를 기억하도록 대화 상태를 저장했습니다.",
      "PR마다 lint와 테스트를 돌리고, 스키마가 바뀌면 DB를 마이그레이션하고, main에 올라가면 GCE까지 자동으로 배포되게 했습니다.",
    ],
    troubleshooting: [
      {
        title: "답하지 말아야 할 때를 가려내는 2중 게이트",
        problem:
          "안전 정보는 근거 없는 답변이 실제 위험으로 이어질 수 있습니다. 그런데 벡터 거리 기준 하나로 '답할지 말지'를 정하면, 답하면 안 되는 질문을 가려내는 판단의 F1이 50%에 그쳤습니다.",
        solution:
          "LLM이 '이 근거로 답할 수 있는가'를 한 번 더 판정하는 2차 게이트를 붙였습니다. 기준은 행동요령이 있는 상황 20건, 없는 상황 10건(경계 사례 포함)으로 만든 평가셋으로 여러 번 조정했습니다.",
        result:
          "판단 F1 50% → 73.7%. 게이트를 통과하지 못한 질문은 답을 만들지 않고 재난 유형별 신고 전화로 안내합니다.",
      },
      {
        title: "LLM이 실패해도 안전 정보는 전달되도록",
        problem:
          "외부 LLM API가 느려지거나 실패하면 사용자는 아무 정보도 받지 못합니다. 재난 상황에서는 그 자체가 문제였습니다.",
        solution:
          "호출마다 30초 제한, 일시 오류에만 지수 백오프 재시도, 최종 실패 시 행동요령 원문과 연락처로 대체하는 3단계로 나눴습니다. 표본이 부족한 지역은 상위 행정구역으로 넓혀 집계하고, 그래도 부족하면 그 사실을 그대로 알립니다.",
      },
    ],
    learning:
      "안전 정보는 틀린 답이 아예 답하지 않는 것보다 위험하다고 생각했습니다. 그래서 통계는 SQL 집계로만, 행동 지침은 공식 문서를 인용해서만 답하게 했고, 답하지 않기로 한 판단이 맞았는지도 precision과 recall로 따로 쟀습니다. 배포를 자동화하면서는 두 명이 같은 서버에 부담 없이 코드를 올릴 수 있는 흐름을 만드는 법을 익혔습니다.",
  },
  {
    id: 10,
    title: "LostOnCampus",
    subtitle: "캠퍼스 분실물·습득물 게시판 '다시봄'",
    role: "네이버클라우드 아카데미 · 프론트엔드 단독",
    category: "Team Project / Web",
    period: "2026.06 ~ 2026.07",
    stack: ["React", "TypeScript", "Vite", "Docker", "Nginx", "NCP"],
    githubLink: "https://github.com/LostOnCampus/LOC-FE",
    image: "/loc-cover.webp",
    description: [
      "Spring 백엔드 팀과 API 명세를 먼저 맞추고, 프론트엔드를 따로 진행했습니다.",
      "VITE_API_URL이 없으면 mock 데이터로, 있으면 실제 서버로 요청하도록 API 코드를 한 파일에 모았습니다. 백엔드가 나오기 전에 화면을 먼저 끝냈고, 연동할 때 페이지 코드는 거의 고치지 않았습니다.",
      "응답 래퍼를 벗기고 snake_case와 camelCase 필드를 맞추는 일도 같은 파일에서 처리했습니다.",
      "게시글 작성·수정·삭제와 처리 상태 변경, 댓글, 검색, 이미지 업로드, 로그인, 문의를 연결했습니다.",
      "Docker로 빌드해 Nginx로 서빙하고, /api 요청은 VPC 안의 백엔드 로드밸런서로 넘기도록 설정해 네이버클라우드에 배포했습니다.",
    ],
    learning:
      "백엔드를 기다리지 않고 화면부터 끝내는 구조를 처음 제대로 설계해 봤습니다. 환경 변수 하나로 mock과 실제 API를 바꾸게 해 두니 연동 단계에서 고칠 게 거의 없었습니다. 반대로 배포에서는 로컬에서 멀쩡하던 것이 Docker와 Nginx를 거치며 하나씩 어긋났고, 그걸 고치면서 빌드 시점과 실행 시점의 차이를 확실히 이해했습니다.",
  },
  {
    id: 3,
    title: "G.O.A.T",
    subtitle: "사내 문서 기반 AI 챗봇 관리 시스템 'HAEZO'",
    role: "카카오엔터프라이즈 & 디케이테크인 기업실무 1팀 · 프론트엔드",
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
      { src: "/goat/login.webp", caption: "로그인 (서버 연결 상태 표시)" },
      { src: "/goat/signup.webp", caption: "마스터 회원가입과 이메일 인증" },
      { src: "/goat/dashboard.webp", caption: "대시보드" },
      { src: "/goat/documents.webp", caption: "부서별 문서 관리" },
      { src: "/goat/faq.webp", caption: "FAQ 관리" },
      { src: "/goat/organization.webp", caption: "Canvas로 그린 조직도" },
      { src: "/goat/history.webp", caption: "관리자 활동과 에러 로그" },
      { src: "/goat/mypage.webp", caption: "마이페이지 (이메일은 가렸습니다)" },
    ],
    description: [
      "마스터·관리자·사용자 3단계 권한과 JWT 로그인, 토큰을 붙이고 갱신하는 인터셉터를 만들었습니다.",
      "질의량 추이와 응답 유형을 그래프로 보여 주는 대시보드를 만들었습니다. 서버에 연결되지 않으면 오프라인 미니게임이 나옵니다.",
      "S3 업로드를 URL 발급, 업로드, 완료 3단계로 나누고 미리보기와 승인, 버전 관리를 붙였습니다.",
      "Canvas로 확대·스크롤·드래그가 되는 조직도를 그리고, 부서와 구성원을 관리할 수 있게 했습니다.",
    ],
    learning:
      "기능이 많아 팀원들과 나눠 개발하면서 Git Flow와 코드 리뷰를 팀 규칙으로 자리 잡게 했습니다. 인증과 권한은 여러 화면이 같이 쓰는 부분이라 타입과 인터셉터로 한곳에서 관리했고, 각자 만든 모듈을 합치며 생긴 충돌은 팀원들과 직접 이야기하며 풀었습니다.",
  },
  {
    id: 4,
    title: "WhyNot?",
    subtitle: "청년 정책, 예적금, 모의투자를 한곳에서 보는 서비스 'YouthFi'",
    role: "가천대 카카오엔터프라이즈 미러링 실습 4팀 · 프론트엔드",
    category: "Team Project / Web",
    period: "2025.09 ~ 2025.10",
    stack: ["React", "JavaScript", "Zustand", "CSS3", "React Query", "MSW"],
    githubLink: "https://github.com/KE-WhyNot",
    demoLink: "https://www.youth-fi.com",
    image: "/youthfi.png",
    detailImage: "/youthfi/invest.webp",
    gallery: [
      { src: "/youthfi/home.webp", caption: "홈" },
      { src: "/youthfi/policy.webp", caption: "청년정책 검색" },
      { src: "/youthfi/savings.webp", caption: "예·적금 검색" },
      {
        src: "/youthfi/invest.webp",
        caption: "모의투자 대시보드 (사용자 ID는 가렸습니다)",
      },
      { src: "/youthfi/portfolio.webp", caption: "포트폴리오 추천" },
      { src: "/youthfi/chatbot.webp", caption: "투자 정보 챗봇" },
    ],
    description: [
      "Figma 시안과 Cursor MCP로 초기 화면 구조와 코드 패턴을 빠르게 잡았습니다.",
      "Axios 인스턴스를 모듈로 나누고, 서버 데이터는 React Query로, 화면 상태는 Zustand로 관리했습니다.",
      "ECharts와 Nivo로 지수 차트, 자산 배분 같은 투자 대시보드를 그렸습니다.",
      "MSW로 가짜 API를 먼저 띄워, 백엔드를 기다리지 않고 프론트엔드를 진행했습니다.",
    ],
    learning:
      "기업 연계 실습에서 기획부터 배포까지 애자일 방식으로 진행했습니다. MSW 덕분에 백엔드와 프론트엔드가 서로를 기다리지 않고 함께 작업할 수 있었고, 전역 상태를 어디까지 둘지 정하면서 팀원들과 코드 컨벤션을 맞추는 일이 중요하다는 것을 배웠습니다.",
  },
  {
    id: 5,
    title: "UNI_SWAP",
    subtitle: "대학생끼리 거래하는 중고거래 플랫폼",
    role: "고급웹프로그래밍 팀 프로젝트",
    category: "Team Project / Platform",
    period: "2025.05 ~ 2025.06",
    stack: ["React", "JavaScript", "CSS3"],
    githubLink: "https://github.com/Watchiiee/UNISWAP",
    image: "/uniswap.png",
    detailImage: "/uniswap/home.webp",
    gallery: [
      { src: "/uniswap/auth.webp", caption: "로그인과 회원가입" },
      { src: "/uniswap/home.webp", caption: "상품 목록" },
      { src: "/uniswap/search.webp", caption: "검색 필터" },
      {
        src: "/uniswap/detail.webp",
        caption: "상품 상세 (판매자 정보는 가렸습니다)",
      },
      { src: "/uniswap/register.webp", caption: "상품 등록과 거래 장소 지도" },
      { src: "/uniswap/wishlist.webp", caption: "찜한 상품" },
      { src: "/uniswap/reviews.webp", caption: "거래 후기" },
      { src: "/uniswap/report.webp", caption: "신고하기" },
    ],
    description: [
      "학번, 학교, 학과로 가입하는 대학생 전용 커뮤니티를 만들었습니다.",
      "상품 게시글 작성·수정·삭제와 검색을 구현했습니다.",
      "카카오맵으로 캠퍼스 안 거래 장소를 고르는 기능을 만들었습니다.",
      "React Hooks로 화면과 로직을 나눴습니다.",
    ],
    troubleshooting: [
      {
        title: "팀원과 다른 빌드 환경을 하나로 합치기",
        problem:
          "저는 Vite, 팀원은 CRA로 개발을 시작해 develop에 합치자 package.json과 진입 파일이 충돌했고, 합친 뒤에는 제가 만든 거래 장소 지도가 표시되지 않았습니다.",
        cause:
          "CRA는 public/index.html을 진입점으로 쓰는데, 카카오맵 SDK는 Vite용 index.html에만 들어 있었습니다.",
        solution:
          "팀 기준인 CRA로 통일하고, 제 코드의 진입점과 SDK 로드 위치, 앱 키를 거기에 맞췄습니다.",
      },
    ],
    learning:
      "웹 프로그래밍 수업에서 처음으로 팀을 꾸려 끝까지 만들어 본 서비스이고, 웹 개발이 재미있다고 느낀 계기였습니다. 카카오맵을 붙여 캠퍼스 거래 장소가 지도에 처음 찍혔을 때 정말 뿌듯했습니다. Git Flow도 여기서 처음 배웠습니다. main, develop, feature 브랜치를 나누고 PR로 합치면서, 코드만큼 팀이 같은 환경에서 일하도록 맞추는 일이 중요하다는 것을 알게 됐습니다. 지금 다시 보면 지도 컴포넌트의 useEffect가 렌더링마다 다시 실행될 수 있는 구조라 아쉽지만, 그게 보인다는 것도 그동안 성장했다는 뜻이라고 생각합니다.",
  },
  {
    id: 6,
    title: "Zipter",
    subtitle: "부동산 매물 추천과 지역 커뮤니티 서비스",
    role: "소프트웨어공학 팀 프로젝트",
    category: "Team Project / Service",
    period: "2025.05 ~ 2025.06",
    stack: ["React", "JavaScript", "CSS3"],
    githubLink: "https://github.com/Watchiiee/Zipter_Front",
    image: "/zipter.png",
    description: [
      "지도 API로 매물 위치를 표시했습니다.",
      "조건 필터로 원하는 매물을 추천하도록 했습니다.",
      "지역 주민끼리 정보를 나누는 커뮤니티를 만들었습니다.",
    ],
    learning:
      "소프트웨어공학 수업에서 배운 대로 요구사항 분석, 설계, 구현, 테스트를 순서대로 밟아 본 프로젝트입니다.",
  },
  {
    id: 7,
    title: "Speed Quiz Game",
    subtitle: "여러 명이 동시에 겨루는 실시간 퀴즈 게임",
    role: "컴퓨터 네트워크 텀 프로젝트",
    category: "Team Project / Backend / Java GUI",
    period: "2024.11 ~ 2024.12",
    stack: ["Java", "Java Swing"],
    githubLink: "https://github.com/Watchiiee/Network_TermProject",
    image: "/network.png",
    description: [
      "Java 소켓으로 서버와 클라이언트를 직접 만들어 실시간 멀티플레이를 구현했습니다.",
      "접속자마다 스레드를 두어 여러 명이 동시에 들어와도 처리되게 했습니다.",
      "클라이언트 화면은 Java Swing으로 만들었습니다.",
    ],
    learning:
      "웹 프레임워크 없이 TCP 소켓으로 통신을 직접 짜 보면서, 평소 쓰던 HTTP 아래에서 어떤 일이 일어나는지 감을 잡았습니다.",
  },
  {
    id: 1,
    title: "포트폴리오 웹사이트",
    subtitle: "지금 보고 계신 이 사이트",
    role: "개인 프로젝트",
    category: "Web / Portfolio",
    period: "2025.12 ~ 진행 중",
    stack: [
      "TypeScript",
      "Astro",
      "React",
      "Tailwind CSS",
      "Three.js",
      "Framer Motion",
      "GitHub Actions",
    ],
    githubLink: "https://github.com/Watchiiee/Watchiiee.github.io",
    demoLink: "https://watchiiee.github.io/",
    image: "/portfolio.webp",
    description: [
      "Astro로 대부분을 정적 HTML로 만들고, 움직임이 필요한 부분만 React로 불러옵니다.",
      "첫 화면의 파티클 물결은 Three.js 셰이더로 그렸습니다. 화면에서 벗어나면 렌더링을 멈추고, 모바일에서는 파티클 수를 줄입니다.",
      "프로젝트 데이터에 항목만 추가하면 상세 화면과 갤러리가 늘어나도록 만들었습니다.",
      "스크린샷은 WebP로 줄여 장당 100KB 안팎으로 맞췄고, 화면 속 개인정보는 모자이크했습니다.",
      "main에 푸시하면 GitHub Actions로 GitHub Pages에 자동 배포됩니다.",
    ],
    troubleshooting: [
      {
        title: "눈대중 대신 측정으로 찾은 깜빡임의 원인",
        problem:
          "확대한 사진을 닫을 때 사진이 한 번 번쩍였습니다. 눈으로는 페이드 순서 문제처럼 보였지만, 순서를 바꿔도 사라지지 않았습니다.",
        cause:
          "매 프레임 투명도를 기록해 보니, framer-motion 애니메이션이 끝나는 프레임에 값이 시작 값(1)으로 한 번 돌아가고 있었습니다.",
        solution:
          "확대 보기만 CSS transition으로 바꾸고, 완전히 사라진 뒤(transitionend)에 화면에서 제거했습니다.",
        result:
          "열기와 닫기 모두 프레임 기록에서 투명도가 거꾸로 튀는 구간이 0이 된 것을 확인했습니다.",
      },
    ],
    learning:
      "포트폴리오도 하나의 프로젝트라고 생각하고 만들었습니다. 깜빡임처럼 눈으로만 보면 원인을 짐작하기 어려운 문제는 프레임 단위로 재서 원인을 확인한 뒤에 고쳤습니다. 실제 서비스 화면을 올리면서 학생과 사용자 정보를 하나하나 가리다 보니, 결과물을 공개하는 일에도 책임이 따른다는 것을 느꼈습니다.",
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
                {/* 좌측 패널: 대표 화면과 기본 정보 */}
                <div className="w-full md:w-2/5 bg-slate-800/30 p-8 flex flex-col">
                  {selectedProject.detailImage ? (
                    // 서비스 화면은 클릭하면 원본 크기로 볼 수 있도록 링크로 감쌈
                    <a
                      href={selectedProject.detailImage}
                      target="_blank"
                      rel="noreferrer"
                      className="group/detail relative block aspect-video bg-slate-700 rounded-lg overflow-hidden mb-6"
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
                    <div className="aspect-video bg-slate-700 rounded-lg overflow-hidden mb-6 flex items-center justify-center">
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

                  <h3 className="text-2xl font-bold text-white">
                    {selectedProject.title}
                  </h3>
                  <p className="mt-2 text-slate-300 leading-relaxed break-keep">
                    {selectedProject.subtitle}
                  </p>

                  <dl className="mt-6 space-y-3 text-sm">
                    {selectedProject.role && (
                      <div className="flex gap-4">
                        <dt className="w-10 shrink-0 text-slate-500">역할</dt>
                        <dd className="text-slate-200 break-keep">
                          {selectedProject.role}
                        </dd>
                      </div>
                    )}
                    <div className="flex gap-4">
                      <dt className="w-10 shrink-0 text-slate-500">기간</dt>
                      <dd className="text-slate-200">{selectedProject.period}</dd>
                    </div>
                    <div className="flex gap-4">
                      <dt className="w-10 shrink-0 text-slate-500">기술</dt>
                      <dd className="flex flex-wrap gap-1.5">
                        {selectedProject.stack.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 border border-slate-600 text-slate-300 rounded text-xs"
                          >
                            {tech}
                          </span>
                        ))}
                      </dd>
                    </div>
                  </dl>

                  {(selectedProject.githubLink || selectedProject.demoLink) && (
                    <div className="mt-6 flex flex-wrap gap-2">
                      {selectedProject.githubLink && (
                        <a
                          href={selectedProject.githubLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-slate-600 text-sm text-slate-200 hover:border-cyan-400 hover:text-cyan-400 transition-colors"
                        >
                          <Github className="w-4 h-4" />
                          GitHub
                        </a>
                      )}
                      {selectedProject.demoLink && (
                        <a
                          href={selectedProject.demoLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-slate-600 text-sm text-slate-200 hover:border-cyan-400 hover:text-cyan-400 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          서비스 보기
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {/* 우측 패널: 섹션은 아이콘이나 색 박스 없이 구분선으로만 나눔 */}
                <div className="w-full md:w-3/5 p-8 overflow-y-auto divide-y divide-slate-700/60 [&>section]:py-7 [&>section:first-child]:pt-0 [&>section:last-child]:pb-0">
                  <section>
                    <h4 className="text-base font-semibold text-white mb-4">
                      Key Features
                    </h4>
                    <ul className="space-y-2.5 text-sm leading-relaxed text-slate-300 break-keep list-disc pl-4 marker:text-slate-500">
                      {selectedProject.description.map((desc, i) => (
                        <li key={i}>{desc}</li>
                      ))}
                    </ul>
                  </section>

                  {selectedProject.troubleshooting && (
                    <section>
                      <h4 className="text-base font-semibold text-white mb-4">
                        Troubleshooting
                      </h4>
                      <div className="space-y-6">
                        {selectedProject.troubleshooting.map((t, i) => (
                          <div key={t.title}>
                            <p className="text-sm font-semibold text-slate-100 break-keep">
                              <span className="text-slate-500 mr-2">
                                {i + 1}.
                              </span>
                              {t.title}
                            </p>
                            <dl className="mt-2 space-y-1.5 text-sm leading-relaxed">
                              {(
                                [
                                  ["문제", t.problem],
                                  ["원인", t.cause],
                                  ["해결", t.solution],
                                  ["결과", t.result],
                                ] as const
                              ).map(
                                ([label, text]) =>
                                  text && (
                                    <div key={label} className="flex gap-3">
                                      <dt
                                        className={`w-8 shrink-0 ${
                                          label === "결과"
                                            ? "text-cyan-400"
                                            : "text-slate-500"
                                        }`}
                                      >
                                        {label}
                                      </dt>
                                      <dd className="text-slate-300 break-keep">
                                        {text}
                                      </dd>
                                    </div>
                                  )
                              )}
                            </dl>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {gallery.length > 0 && (
                    <section>
                      <h4 className="text-base font-semibold text-white mb-4">
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
                            <div className="aspect-video rounded-md overflow-hidden bg-slate-800/60 border border-slate-700 group-hover/shot:border-slate-400 transition-colors">
                              <img
                                src={shot.src}
                                alt={shot.caption}
                                loading="lazy"
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <span className="block mt-1.5 text-xs text-slate-400 leading-snug break-keep">
                              {shot.caption}
                            </span>
                          </button>
                        ))}
                      </div>
                    </section>
                  )}

                  <section>
                    <h4 className="text-base font-semibold text-white mb-4">
                      What I Learned
                    </h4>
                    <p className="text-slate-300 text-sm leading-7 break-keep">
                      {selectedProject.learning}
                    </p>
                  </section>
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
              <span className="text-slate-500 mr-2">
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
