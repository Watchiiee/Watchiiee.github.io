export default function CodeBackground() {
  const codeString = `
import { useState, useEffect } from 'react';
import type { UserExpertise } from '@/types/user';

// Custom Hook: Fetch developer skills with caching
export function useExpertiseData(userId: string) {
  const [data, setData] = useState<UserExpertise | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      try {
        // Optimize: Check local storage cache first
        const cached = localStorage.getItem(\`user_\${userId}\`);
        if (cached) {
          setData(JSON.parse(cached));
          setIsLoading(false);
          return;
        }

        const response = await fetch(\`/api/v1/users/\${userId}/skills\`, {
          signal: controller.signal,
          headers: { 'Authorization': 'Bearer token' }
        });

        const result = await response.json();
        
        // Update state and cache responsibly
        requestAnimationFrame(() => setData(result));
        localStorage.setItem(\`user_\${userId}\`, JSON.stringify(result));

      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error("Failed to load expertise data:", error);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();

    return () => controller.abort();
  }, [userId]);

  return { data, isLoading };
}
  `;

  const highlightCode = (code: string) => {
    let highlighted = code
      // 1. 주석 (// ...) -> 회색
      .replace(/(\/\/.*)/g, '<span class="text-slate-500">$1</span>')
      // 2. 키워드 (import, export, function, const 등) -> 보라색/분홍색 계열
      .replace(
        /\b(import|export|from|const|let|var|function|return|if|else|try|catch|finally|async|await)\b/g,
        '<span class="text-purple-400">$1</span>'
      )
      // 3. 타입/클래스 (대문자로 시작하는 단어) -> 노란색/주황색 계열
      .replace(
        /\b([A-Z][a-zA-Z0-9_]*)\b/g,
        '<span class="text-yellow-300">$1</span>'
      )
      // 4. 문자열 ('...', `...`) -> 초록색 계열
      .replace(/('|`)(.*?)(\1)/g, '<span class="text-green-300">$1$2$3</span>')
      // 5. 함수 호출 (단어 뒤에 '('가 오는 경우) -> 파란색 계열
      .replace(
        /\b([a-zA-Z0-9_]+)(?=\()/g,
        '<span class="text-blue-300">$1</span>'
      )
      // 6. JSX 컴포넌트 (<SomeComponent ... />) -> 노란색 계열 (추가)
      .replace(
        /(<)([A-Z][a-zA-Z0-9_]*)/g,
        '$1<span class="text-yellow-300">$2</span>'
      );

    return highlighted;
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0 flex items-center justify-center">
      {/* 기본 글자색을 cyan-200으로 밝게 설정 */}
      <pre className="text-sm md:text-base text-cyan-200 font-mono leading-relaxed p-4 w-full h-full opacity-40 transform scale-110 -rotate-3 origin-center">
        {/* dangerouslySetInnerHTML을 사용하여 하이라이팅된 HTML을 적용 */}
        <code
          className="block whitespace-pre-wrap blur-[1px]"
          dangerouslySetInnerHTML={{ __html: highlightCode(codeString) }}
        />
      </pre>

      {/* 위/아래가 자연스럽게 어두워지도록 그라데이션 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a192f] via-transparent to-[#0a192f] opacity-90"></div>
    </div>
  );
}
