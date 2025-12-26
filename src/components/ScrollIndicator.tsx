// src/components/ScrollIndicator.tsx
export default function ScrollIndicator() {
  return (
    // 화면 하단 중앙에 위치
    <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20">
      <svg
        width="30"
        height="50"
        viewBox="0 0 30 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="opacity-80" // 전체적인 투명도 조절
      >
        {/* 마우스 몸체 (테두리) */}
        {/* stroke-dasharray를 설정하여 선이 그려지는 효과의 기반을 마련합니다. */}
        <rect
          x="1.5"
          y="1.5"
          width="27"
          height="47"
          rx="13.5"
          className="stroke-cyan-400 animate-draw"
          strokeWidth="3"
          strokeDasharray="150" // 전체 둘레 길이보다 약간 크게 설정
          strokeDashoffset="150" // 처음에는 완전히 숨김
          strokeLinecap="round" // 선 끝을 둥글게
        />

        {/* 마우스 휠 (움직이는 점) */}
        <circle
          cx="15"
          cy="12"
          r="3"
          className="fill-cyan-400 animate-scroll"
        />
      </svg>
    </div>
  );
}
