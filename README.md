# 정명성 포트폴리오

풀스택 개발자 정명성의 포트폴리오 웹사이트입니다.

**🔗 https://watchiiee.github.io**

![포트폴리오 미리보기](public/og-image.png)

## 소개

화면부터 서버, 클라우드 인프라까지 직접 설계하고 배포한 프로젝트들을 정리한 사이트입니다.

- **Hero**: Three.js 셰이더로 그린 파티클 물결. 첫 접속 시 파티클이 *Build → Ship → Experience*를 차례로 그린 뒤 물결로 풀리고, 커서와 클릭에 반응
- **Expertise**: Frontend · Backend · Cloud & DevOps · AI/LLM 기술 스택
- **Projects**: 프로젝트별 상세 설명, 스크린샷 갤러리, 트러블슈팅 기록
- **Resume**: 학력·교육·활동 타임라인과 수상, 자격증
- **Contact**: 이메일 복사 버튼과 연락 링크
- **Navigation**: 스크롤하면 블러 배경으로 바뀌고 현재 섹션을 강조하는 상단 메뉴 (모바일은 햄버거 메뉴)

## 기술 스택

| 분류 | 사용 기술 |
| :-- | :-- |
| Framework | Astro, React |
| Language | TypeScript |
| Styling | Tailwind CSS, shadcn/ui |
| Animation · 3D | Framer Motion, Three.js |
| Deploy | GitHub Actions, GitHub Pages |

## 구현 포인트

- **필요한 곳만 JavaScript**: 대부분은 Astro로 정적 HTML을 만들고, 움직임이 필요한 컴포넌트만 React로 불러옵니다(Astro Islands).
- **가벼운 3D 배경**: 파티클 위치는 버텍스 셰이더에서 계산해 CPU 부담을 줄였습니다. 화면에서 벗어나면 렌더링을 멈추고, 모바일에서는 파티클 수를 줄입니다.
- **파티클 문구 인트로**: 오프스크린 캔버스에 단어를 그려 픽셀 좌표를 뽑고, 같은 파티클이 흩어짐 → 단어 → 다음 단어 → 물결 순으로 이동합니다. 짧은 단어에 입자가 몰려 과하게 밝아지지 않도록 단어 면적에 맞춰 밝기를 보정했습니다.
- **인트로 깜빡임 방지**: 재생 여부를 페이지가 그려지기 전에 인라인 스크립트로 정해, Hero 텍스트가 보였다가 사라지는 일이 없도록 했습니다. 같은 탭 재방문, 움직임 최소화 설정, WebGL 미지원 환경에서는 인트로를 생략합니다.
- **마우스 반응**: 커서 위치를 물결 평면에 레이캐스팅해 주변 파티클을 솟아오르게 하고, 클릭 지점에서는 파문이 퍼집니다.
- **데이터 기반 프로젝트 목록**: `Projects.tsx`의 데이터에 항목만 추가하면 카드, 상세 화면, 갤러리가 함께 생성됩니다.
- **이미지 최적화**: 스크린샷은 WebP로 변환해 장당 100KB 안팎으로 맞췄고, 화면 속 개인정보는 모자이크했습니다.
- **자동 배포**: `main` 브랜치에 푸시하면 GitHub Actions가 빌드 후 GitHub Pages에 배포합니다.

## 프로젝트 구조

```text
/
├── .github/workflows/deploy.yml   # GitHub Pages 자동 배포
├── public/                        # 프로젝트 스크린샷, OG 이미지, 파비콘
└── src/
    ├── components/
    │   ├── sections/              # Hero, Expertise, Projects, Resume, Contact
    │   ├── ui/                    # 공통 UI 컴포넌트 (button, card, badge 등)
    │   ├── Navbar.tsx             # 상단 내비게이션
    │   └── ParticleWave.tsx       # Three.js 파티클 배경, 인트로, 마우스 반응
    ├── layouts/Layout.astro       # 공통 레이아웃, 메타 태그
    ├── pages/index.astro          # 메인 페이지
    └── styles/global.css
```

## 로컬에서 실행하기

```sh
npm install      # 의존성 설치
npm run dev      # 개발 서버 실행 (http://localhost:4321)
npm run build    # 프로덕션 빌드 (./dist)
npm run preview  # 빌드 결과 미리보기
```

## Contact

- Email: op7970@gmail.com
- GitHub: [@Watchiiee](https://github.com/Watchiiee)
