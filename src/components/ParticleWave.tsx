// src/components/ParticleWave.tsx
// Hero 배경: 격자 형태의 파티클이 물결치고, 마우스 위치에 따라 카메라가 기울어지는 Three.js 씬
import { useEffect, useRef, useState } from "react";
import {
  AdditiveBlending,
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  Vector2,
  WebGLRenderer,
} from "three";

// 물결 높이는 버텍스 셰이더에서 계산 (CPU에서 매 프레임 좌표를 갱신하지 않음)
const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  varying float vHeight;
  varying float vAlpha;

  void main() {
    vec3 p = position;
    float wave =
      sin(p.x * 0.22 + uTime * 0.8) * 1.1 +
      cos(p.z * 0.28 + uTime * 0.6) * 0.9 +
      sin((p.x + p.z) * 0.12 + uTime * 0.4) * 0.7;
    p.y += wave;

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // 원근감: 멀수록 작게, 멀수록 흐리게
    gl_PointSize = uSize * (18.0 / -mvPosition.z);
    vHeight = wave;
    vAlpha = smoothstep(70.0, 12.0, -mvPosition.z);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColorLow;
  uniform vec3 uColorHigh;
  varying float vHeight;
  varying float vAlpha;

  void main() {
    // 사각형 포인트를 부드러운 원형으로
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.1, d) * vAlpha;

    // 물결의 높은 곳은 시안, 낮은 곳은 짙은 파랑
    vec3 color = mix(uColorLow, uColorHigh, smoothstep(-2.0, 2.2, vHeight));
    gl_FragColor = vec4(color, alpha);
  }
`;

export default function ParticleWave() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isMobile = window.innerWidth < 768;

    // 렌더러
    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ antialias: false, alpha: true });
    } catch {
      return; // WebGL 미지원 환경에서는 배경 없이 표시
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const scene = new Scene();
    const camera = new PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.set(0, 6, 14);

    // 파티클 격자 (모바일은 개수를 줄여 성능 확보)
    const cols = isMobile ? 70 : 140;
    const rows = isMobile ? 60 : 90;
    const spacing = 0.6;
    const positions = new Float32Array(cols * rows * 3);
    let i = 0;
    for (let x = 0; x < cols; x++) {
      for (let z = 0; z < rows; z++) {
        positions[i++] = (x - cols / 2) * spacing;
        positions[i++] = 0;
        positions[i++] = -z * spacing + 10;
      }
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));

    const material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: (isMobile ? 5 : 6) * renderer.getPixelRatio() },
        uColorLow: { value: new Color("#1d4ed8") },
        uColorHigh: { value: new Color("#22d3ee") },
      },
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    });

    const points = new Points(geometry, material);
    scene.add(points);

    // 크기 변경 대응
    const resize = () => {
      const { clientWidth, clientHeight } = container;
      renderer.setSize(clientWidth, clientHeight);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    // 마우스 패럴랙스
    const pointer = new Vector2();
    const onPointerMove = (e: PointerEvent) => {
      pointer.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        (e.clientY / window.innerHeight) * 2 - 1
      );
    };
    window.addEventListener("pointermove", onPointerMove);

    const render = (time: number) => {
      material.uniforms.uTime.value = time / 1000;
      camera.position.x += (pointer.x * 3 - camera.position.x) * 0.03;
      camera.position.y += (6 - pointer.y * 1.5 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, -8);
      renderer.render(scene, camera);
    };

    // Hero가 화면 밖에 있으면 렌더링 중지
    let frameId = 0;
    let visible = true;
    const loop = (time: number) => {
      render(time);
      if (visible) frameId = requestAnimationFrame(loop);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !reducedMotion) {
        cancelAnimationFrame(frameId);
        frameId = requestAnimationFrame(loop);
      }
    });

    if (reducedMotion) {
      render(0); // 움직임 최소화 설정이면 정지된 한 프레임만 표시
    } else {
      observer.observe(container);
    }
    setReady(true);

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`absolute inset-0 transition-opacity duration-1000 ${
        ready ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}
