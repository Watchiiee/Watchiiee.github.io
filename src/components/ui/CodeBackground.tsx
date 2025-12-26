export default function CodeBackground() {
  // ▼▼▼ 여기에 원하는 코드를 작성하세요 (나중에 수정 가능) ▼▼▼
  const codeString = `
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function FrontendMaster() {
  const [skills, setSkills] = useState([
    'React', 'TypeScript', 'Next.js'
  ]);

  useEffect(() => {
    console.log("Rendering optimized UI...");
  }, []);

  return (
    <div className="container">
      <h1>Hello, World!</h1>
      <p>Building the future of web.</p>
      {skills.map(skill => (
        <span key={skill}>{skill}</span>
      ))}
    </div>
  );
}
  `;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none -z-10 flex items-center justify-center opacity-10">
      <pre className="text-sm md:text-base text-slate-500 font-mono leading-relaxed p-4 w-full h-full">
        <code className="block whitespace-pre-wrap blur-[2px]">
          {/* HTML 태그 색상 시뮬레이션 (간단한 하이라이팅) */}
          {codeString.split("\n").map((line, i) => (
            <div key={i} className="py-0.5">
              <span className="text-pink-500">{i + 1} </span>
              {line}
            </div>
          ))}
        </code>
      </pre>

      {/* 위쪽이 자연스럽게 어두워지도록 그라데이션 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a192f] via-transparent to-[#0a192f]"></div>
    </div>
  );
}
