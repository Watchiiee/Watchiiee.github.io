// src/components/sections/Hero.tsx
// ScrollIndicator 컴포넌트 import
import ScrollIndicator from "@/components/ScrollIndicator";

export default function Hero() {
  return (
    <section className="relative pt-40 pb-20 md:pt-52 md:pb-32 container mx-auto px-4 text-center flex flex-col items-center justify-center min-h-screen bg-[#0a192f] text-white">
      <div className="z-10 uppercase">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4">
          Jung MyeongSeong
        </h1>
        <h2 className="text-xl md:text-2xl font-semibold text-cyan-400 mb-10 tracking-[0.2em]">
          Front-End Developer
        </h2>
      </div>

      {/*스크롤 유도 아이콘 추가*/}
      <ScrollIndicator />

      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
      </div>
    </section>
  );
}
