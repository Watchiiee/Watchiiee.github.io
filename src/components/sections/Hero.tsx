import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="pt-32 pb-16 md:pt-48 md:pb-32 container mx-auto px-4 text-center">
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
        안녕하세요, <br className="md:hidden" />
        <span className="text-blue-600">프론트엔드 개발자</span> 정명성입니다.
      </h1>
      <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
        새로운 기술을 탐구하고, 사용자에게 즐거운 경험을 주는 웹을 만듭니다.
        <br />
        React, TypeScript, 그리고 Astro를 사용하여 효율적인 웹을 구축합니다.
      </p>
      <div className="flex gap-4 justify-center">
        <Button
          size="lg"
          onClick={() =>
            document
              .getElementById("projects")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          프로젝트 보기
        </Button>
        <Button variant="outline" size="lg">
          이력서 다운로드
        </Button>
      </div>
    </section>
  );
}
