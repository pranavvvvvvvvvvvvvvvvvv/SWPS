import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import WaterBackground from "@/components/site/WaterBackground";

const MAX_RIPPLES = 8;

const VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform float uAspect;
uniform vec4 uRipples[8];

void main() {
  vec2 uv = vUv;
  vec2 p = vec2(uv.x * uAspect, uv.y);

  // deep water gradient
  vec3 top = vec3(0.012, 0.129, 0.243);
  vec3 mid = vec3(0.024, 0.169, 0.302);
  vec3 col = mix(top, mid, smoothstep(0.0, 1.0, uv.y));

  // soft light pools
  float g1 = distance(p, vec2(uAspect * 0.15, 0.15));
  float g2 = distance(p, vec2(uAspect * 0.85, 0.85));
  col += vec3(0.10, 0.20, 0.28) * (0.55 / (1.0 + g1 * g1 * 2.2));
  col += vec3(0.06, 0.14, 0.20) * (0.45 / (1.0 + g2 * g2 * 2.6));

  // rolling base waves
  float w = sin(uv.y * 26.0 + uTime * 0.7 + sin(uv.x * 7.0 + uTime * 0.35) * 1.4);
  float w2 = sin(uv.y * 15.0 - uTime * 0.45 + uv.x * 5.0);
  col += vec3(0.02, 0.05, 0.07) * (w * 0.5 + w2 * 0.5);

  // soft caustics light drifting across
  vec2 cl = vec2(uAspect * (0.5 + 0.42 * sin(uTime * 0.11)), 0.62 + 0.18 * sin(uTime * 0.07));
  float cd = distance(p, cl);
  float caust = pow(max(0.0, sin(cd * 22.0 - uTime * 1.6)), 3.0) * exp(-cd * 1.6);
  col += vec3(0.16, 0.34, 0.42) * caust * 0.55;

  // interactive ripples
  float ripple = 0.0;
  for (int i = 0; i < 8; i++) {
    vec4 r = uRipples[i];
    if (r.w <= 0.0) continue;
    float age = uTime - r.z;
    vec2 c = vec2(r.x * uAspect, r.y);
    float d = distance(p, c);
    float radius = age * 0.34;
    float ring = sin((d - radius) * 46.0) * exp(-abs(d - radius) * 10.0);
    float decay = r.w * exp(-age * 1.5) * smoothstep(0.0, 0.06, age);
    ripple += ring * decay;
  }
  col += vec3(0.35, 0.65, 0.85) * max(ripple, 0.0) * 0.6;
  col -= vec3(0.10, 0.16, 0.20) * max(-ripple, 0.0) * 0.5;

  gl_FragColor = vec4(col, 1.0);
}
`;

/** Interactive hero water layer. Preferred path: a lightweight WebGL ripple
 *  shader (three.js, lazy-loaded) where the cursor / touch creates ripples
 *  that spread and fade. Falls back to the animated SVG waves + bubbles on
 *  mobile, low-power devices, reduced motion or WebGL failure. Rendering
 *  pauses when the tab is hidden or the hero is off-screen. */
export default function WaterSurface({ className }) {
  const reduce = useReducedMotion();
  const [failed, setFailed] = useState(false);
  const hostRef = useRef(null);

  const capable =
    !reduce &&
    !failed &&
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: fine)").matches &&
    (navigator.hardwareConcurrency || 8) >= 4;

  useEffect(() => {
    if (!capable) return;
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      try {
        const THREE = await import("three");
        const host = hostRef.current;
        const parent = host?.parentElement;
        if (disposed || !host || !parent) return;

        const renderer = new THREE.WebGLRenderer({
          antialias: false,
          alpha: false,
          powerPreference: "low-power",
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        renderer.setSize(parent.clientWidth, parent.clientHeight);
        host.appendChild(renderer.domElement);

        const ripples = Array.from({ length: MAX_RIPPLES }, () => new THREE.Vector4(0, 0, -100, 0));
        let next = 0;
        const uniforms = {
          uTime: { value: 0 },
          uAspect: { value: 1 },
          uRipples: { value: ripples },
        };
        const geometry = new THREE.PlaneGeometry(2, 2);
        const material = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms });
        const scene = new THREE.Scene();
        scene.add(new THREE.Mesh(geometry, material));
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

        const addRipple = (x, y, strength) => {
          ripples[next].set(x, y, uniforms.uTime.value, strength);
          next = (next + 1) % MAX_RIPPLES;
        };
        let lastMove = 0;
        const onMove = (e) => {
          const now = performance.now();
          if (now - lastMove < 90) return;
          lastMove = now;
          const rect = host.getBoundingClientRect();
          addRipple(
            (e.clientX - rect.left) / rect.width,
            1 - (e.clientY - rect.top) / rect.height,
            0.55
          );
        };
        const onDown = (e) => {
          const rect = host.getBoundingClientRect();
          addRipple(
            (e.clientX - rect.left) / rect.width,
            1 - (e.clientY - rect.top) / rect.height,
            1.0
          );
        };
        parent.addEventListener("pointermove", onMove);
        parent.addEventListener("pointerdown", onDown);

        const onResize = () => {
          renderer.setSize(parent.clientWidth, parent.clientHeight);
          uniforms.uAspect.value = parent.clientWidth / Math.max(parent.clientHeight, 1);
        };
        onResize();
        window.addEventListener("resize", onResize);

        let visible = true;
        const io = new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting;
        }, { rootMargin: "80px" });
        io.observe(host);

        const clock = new THREE.Clock();
        let raf = 0;
        const loop = () => {
          raf = requestAnimationFrame(loop);
          if (!visible || document.hidden) return;
          uniforms.uTime.value = clock.getElapsedTime();
          renderer.render(scene, camera);
        };
        loop();

        cleanup = () => {
          cancelAnimationFrame(raf);
          io.disconnect();
          window.removeEventListener("resize", onResize);
          parent.removeEventListener("pointermove", onMove);
          parent.removeEventListener("pointerdown", onDown);
          geometry.dispose();
          material.dispose();
          renderer.dispose();
          if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
        };
      } catch {
        if (!disposed) setFailed(true);
      }
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, [capable]);

  if (!capable) {
    return <WaterBackground className={className} />;
  }

  return (
    <div
      ref={hostRef}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {failed && <WaterBackground />}
    </div>
  );
}
