// src/components/ParticleWave.tsx
// Hero 배경: 격자 형태의 파티클이 물결치고, 마우스 위치에 따라 카메라가 기울어지는 Three.js 씬
// 첫 접속 시 흩어진 파티클이 "Build" → "Ship" → "Experience"를 차례로 만들었다가 물결로 풀리는 인트로를 재생
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
  Vector3,
  WebGLRenderer,
} from "three";

const INTRO_WORDS = ["Build", "Ship", "Experience"];
// 인트로 재생 여부는 Hero의 인라인 스크립트가 html 클래스로 미리 결정 (텍스트 깜빡임 방지)
const INTRO_CLASS = "intro-pending";

// 인트로 타임라인 (ms)
const GATHER_MS = 1000; // 흩어진 상태 → 첫 단어
const HOLD_MS = 450; // 단어 유지
const SWAP_MS = 850; // 단어 → 다음 단어 (중간에 흩어지며 흐려짐)
const RELEASE_MS = 1500; // 마지막 단어 → 물결

// 인트로는 단계(stage)의 연속: 각 단계는 aFrom → aTo로 이동
// uToWave = 1인 단계에서는 목적지가 물결 위치, uBurst = 1인 단계에서는 이동 중간에 바깥으로 흩어졌다 모임
const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uT;
  uniform float uToWave;
  uniform float uBurst;
  uniform float uDensityFrom;
  uniform float uDensityTo;
  attribute vec3 aFrom;
  attribute vec3 aTo;
  attribute vec3 aScatter;
  attribute float aRand;
  varying float vHeight;
  varying float vAlpha;

  void main() {
    vec3 p = position;
    float wave =
      sin(p.x * 0.22 + uTime * 0.8) * 1.1 +
      cos(p.z * 0.28 + uTime * 0.6) * 0.9 +
      sin((p.x + p.z) * 0.12 + uTime * 0.4) * 0.7;
    p.y += wave;

    // 입자마다 출발 시점을 조금씩 어긋나게 해서 한꺼번에 움직이지 않도록
    float k = clamp(uT * 1.6 - aRand * 0.6, 0.0, 1.0);
    float s = k * k * (3.0 - 2.0 * k);

    // 글자 상태에서도 살짝 떨리게 해서 정지 화면처럼 보이지 않도록
    vec3 shimmer = vec3(
      sin(uTime * 2.0 + aRand * 40.0),
      cos(uTime * 1.7 + aRand * 30.0),
      0.0
    ) * 0.03;
    vec3 to = mix(aTo + shimmer, p, uToWave);
    vec3 pos = mix(aFrom + shimmer, to, s);

    // 단어 교체: 이동 중간에 흩어진 방향으로 밀려났다가 다음 단어로 모임
    float mid = sin(s * 3.14159);
    pos += (aScatter - pos) * mid * 0.35 * uBurst;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // 글자 상태에서는 점을 작게 해서 획이 또렷하도록
    float waveness = uToWave * s;
    gl_PointSize = uSize * (18.0 / -mvPosition.z) * mix(0.55, 1.0, waveness);
    vHeight = mix(1.6, wave, waveness);

    // 짧은 단어는 입자가 몰려 더 밝아지므로 단어 면적에 맞춰 밝기를 보정
    float density = mix(mix(uDensityFrom, uDensityTo, s), 1.0, waveness);
    float fade = 1.0 - mid * 0.75 * uBurst;
    vAlpha = smoothstep(70.0, 12.0, -mvPosition.z) * mix(0.75, 1.0, waveness) * density * fade;
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

type TextSample = { points: Float32Array; aspect: number; filled: number };

// 오프스크린 캔버스에 글자를 그리고, 채워진 픽셀 중 count개를 골라 [-0.5, 0.5] 범위 좌표로 반환
function sampleTextPoints(text: string, count: number): TextSample | null {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;

  const fontSize = 160;
  const font = `800 ${fontSize}px "Pretendard Variable", Pretendard, system-ui, sans-serif`;
  ctx.font = font;
  const width = Math.ceil(ctx.measureText(text).width) + 20;
  const height = Math.ceil(fontSize * 1.3);
  canvas.width = width;
  canvas.height = height;
  ctx.font = font; // 캔버스 크기를 바꾸면 컨텍스트 상태가 초기화됨
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, width / 2, height / 2);

  const { data } = ctx.getImageData(0, 0, width, height);
  const filled: number[] = [];
  for (let y = 0; y < height; y += 2) {
    for (let x = 0; x < width; x += 2) {
      if (data[(y * width + x) * 4 + 3] > 128) filled.push(x, y);
    }
  }
  if (filled.length === 0) return null;

  // 채워진 픽셀을 고르게 뽑아 입자에 배정 (입자가 더 많으면 반복 + 미세한 흔들림)
  const pixels = filled.length / 2;
  const points = new Float32Array(count * 2);
  for (let i = 0; i < count; i++) {
    const j = Math.floor(Math.random() * pixels);
    points[i * 2] = (filled[j * 2] + Math.random() * 2) / width - 0.5;
    points[i * 2 + 1] = 0.5 - (filled[j * 2 + 1] + Math.random() * 2) / height;
  }
  return { points, aspect: width / height, filled: pixels };
}

const clamp01 = (t: number) => Math.min(Math.max(t, 0), 1);

export default function ParticleWave() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const root = document.documentElement;
    const finishIntro = () => root.classList.remove(INTRO_CLASS);

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isMobile = window.innerWidth < 768;

    // 렌더러
    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ antialias: false, alpha: true });
    } catch {
      finishIntro();
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
    const count = cols * rows;
    const spacing = 0.6;
    const positions = new Float32Array(count * 3);
    let i = 0;
    for (let x = 0; x < cols; x++) {
      for (let z = 0; z < rows; z++) {
        positions[i++] = (x - cols / 2) * spacing;
        positions[i++] = 0;
        positions[i++] = -z * spacing + 10;
      }
    }

    // 인트로용 속성: 흩어진 위치, 단계별 출발·도착 위치, 입자별 난수
    const scatter = new Float32Array(count * 3);
    const rand = new Float32Array(count);
    for (let k = 0; k < count; k++) {
      scatter[k * 3] = (Math.random() - 0.5) * 60;
      scatter[k * 3 + 1] = (Math.random() - 0.3) * 30;
      scatter[k * 3 + 2] = -Math.random() * 40 + 8;
      rand[k] = Math.random();
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
    geometry.setAttribute("aScatter", new Float32BufferAttribute(scatter, 3));
    geometry.setAttribute("aFrom", new Float32BufferAttribute(scatter.slice(), 3));
    geometry.setAttribute(
      "aTo",
      new Float32BufferAttribute(new Float32Array(count * 3), 3)
    );
    geometry.setAttribute("aRand", new Float32BufferAttribute(rand, 1));

    // Hero 인라인 스크립트가 인트로를 허락했을 때만 재생 (재방문·움직임 최소화·스크롤된 상태면 바로 물결)
    const playIntro = root.classList.contains(INTRO_CLASS) && !reducedMotion;
    if (!playIntro) finishIntro();

    const material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: (isMobile ? 5 : 6) * renderer.getPixelRatio() },
        uColorLow: { value: new Color("#1d4ed8") },
        uColorHigh: { value: new Color("#22d3ee") },
        // 인트로가 없으면 처음부터 "물결로 이동 완료" 상태
        uT: { value: 1 },
        uToWave: { value: 1 },
        uBurst: { value: 0 },
        uDensityFrom: { value: 1 },
        uDensityTo: { value: 1 },
      },
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    });
    const u = material.uniforms;

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

    // 단어 좌표를 카메라 정면의 평면에 배치 (화면 폭의 약 80%, 높이의 30% 이내)
    const placeText = (sample: TextSample) => {
      camera.lookAt(0, 0, -8);
      camera.updateMatrixWorld();
      const distance = 16;
      const viewH = 2 * distance * Math.tan((camera.fov * Math.PI) / 360);
      const viewW = viewH * camera.aspect;
      const textW = Math.min(viewW * 0.8, viewH * 0.3 * sample.aspect);
      const textH = textW / sample.aspect;

      const out = new Float32Array(count * 3);
      const v = new Vector3();
      for (let k = 0; k < count; k++) {
        v.set(
          sample.points[k * 2] * textW,
          sample.points[k * 2 + 1] * textH,
          -distance
        ).applyMatrix4(camera.matrixWorld);
        out[k * 3] = v.x;
        out[k * 3 + 1] = v.y;
        out[k * 3 + 2] = v.z;
      }
      // 화면에 차지하는 획 면적 (밝기 보정용)
      const area = (textW * textH * sample.filled) / (sample.points.length / 2);
      return { positions: out, area };
    };

    // 인트로 단계 목록: 흩어짐 → 단어1 → 단어2 → ... → 물결
    type Stage = {
      to: Float32Array | null; // null이면 물결
      density: number;
      duration: number;
      hold: number; // 도착 후 머무는 시간
      burst: boolean;
    };
    let stages: Stage[] = [];
    let stageIndex = -1;
    let stageStart = 0;
    let skipRequested = false; // 스크롤하면 남은 단어를 건너뛰고 물결로
    let disposed = false;

    const fromAttr = geometry.getAttribute("aFrom") as Float32BufferAttribute;
    const toAttr = geometry.getAttribute("aTo") as Float32BufferAttribute;

    const enterStage = (index: number, now: number) => {
      const prev = stages[index - 1];
      const stage = stages[index];
      // 이전 단계의 도착 위치가 이번 단계의 출발 위치
      if (prev?.to) (fromAttr.array as Float32Array).set(prev.to);
      fromAttr.needsUpdate = true;
      if (stage.to) {
        (toAttr.array as Float32Array).set(stage.to);
        toAttr.needsUpdate = true;
      }
      u.uT.value = 0;
      u.uToWave.value = stage.to ? 0 : 1;
      u.uBurst.value = stage.burst ? 1 : 0;
      u.uDensityFrom.value = prev ? prev.density : 1;
      u.uDensityTo.value = stage.density;
      stageIndex = index;
      stageStart = now;
      // 마지막(물결) 단계에 들어서면 Hero 텍스트를 드러냄
      if (!stage.to) finishIntro();
    };

    if (playIntro) {
      u.uT.value = 0;
      u.uToWave.value = 0;
      // 웹폰트가 늦게 오면 기다리지 않고 기본 글꼴로 진행
      const fontReady = Promise.race([
        document.fonts?.load(`800 160px "Pretendard Variable"`, INTRO_WORDS.join("")) ??
          Promise.resolve(),
        new Promise((r) => setTimeout(r, 600)),
      ]).catch(() => undefined);
      fontReady.then(() => {
        if (disposed) return;
        const words = INTRO_WORDS.map((w) => sampleTextPoints(w, count));
        if (words.some((w) => !w)) {
          u.uT.value = 1;
          u.uToWave.value = 1;
          finishIntro();
          return;
        }
        const placed = (words as TextSample[]).map(placeText);
        // 가장 큰 단어 기준으로, 작은 단어는 입자가 몰리는 만큼 흐리게
        const maxArea = Math.max(...placed.map((p) => p.area));
        stages = placed.map((p, idx) => ({
          to: p.positions,
          density: Math.sqrt(p.area / maxArea),
          duration: idx === 0 ? GATHER_MS : SWAP_MS,
          hold: HOLD_MS,
          burst: idx > 0,
        }));
        stages.push({ to: null, density: 1, duration: RELEASE_MS, hold: 0, burst: false });
        stageIndex = -2; // 다음 프레임에서 첫 단계 시작
      });
    }

    const onScroll = () => {
      skipRequested = true;
    };
    if (playIntro) window.addEventListener("scroll", onScroll, { passive: true });

    const updateIntro = (now: number) => {
      if (stageIndex === -2) enterStage(0, now);
      if (stageIndex < 0) return;
      const stage = stages[stageIndex];
      const elapsed = now - stageStart;
      u.uT.value = clamp01(elapsed / stage.duration);

      const isLast = stageIndex === stages.length - 1;
      if (isLast) {
        if (elapsed >= stage.duration) {
          stageIndex = -1; // 인트로 종료
          window.removeEventListener("scroll", onScroll);
        }
        return;
      }
      // 도착 후 머무는 시간까지 끝나면 다음 단계로 (스크롤했으면 바로 물결로)
      const holdDone = elapsed >= stage.duration + (skipRequested ? 0 : stage.hold);
      if (holdDone) enterStage(skipRequested ? stages.length - 1 : stageIndex + 1, now);
    };

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
      updateIntro(time);
      u.uTime.value = time / 1000;
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
      disposed = true;
      finishIntro();
      cancelAnimationFrame(frameId);
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
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
