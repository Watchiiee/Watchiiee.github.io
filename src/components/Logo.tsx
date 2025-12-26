import { useState } from "react";

export default function Logo() {
  const [isHovered, setIsHovered] = useState(false);

  // 클릭 시 페이지 새로고침 함수
  const reload = () => {
    window.location.reload();
  };

  return (
    // 로고 전체 영역 컨테이너
    <div
      className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 cursor-pointer font-mono text-lg md:text-xl font-bold tracking-wider text-cyan-400"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={reload}
    >
      <div className="relative">
        {/* 기본 로고: 호버 시 투명해짐 */}
        <span
          className={`absolute top-0 left-1/2 transform -translate-x-1/2 whitespace-nowrap transition-opacity duration-300 ${
            isHovered ? "opacity-0" : "opacity-100"
          }`}
        >
          &lt;Watchiiee/&gt;
        </span>

        {/* 호버 시 나타나는 로고 */}
        <span
          className={`absolute top-0 left-1/2 transform -translate-x-1/2 whitespace-nowrap transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          &lt;Watchiiee/ onClick={"{reload}"}/&gt;
        </span>

        {/* 레이아웃 유지를 위한 투명한 공간 확보용 (가장 긴 텍스트 기준) */}
        <span className="opacity-0 whitespace-nowrap pointer-events-none">
          &lt;Watchiiee/ onClick={"{reload}"}/&gt;
        </span>
      </div>
    </div>
  );
}
