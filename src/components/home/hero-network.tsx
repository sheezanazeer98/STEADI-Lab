"use client";

import { useEffect, useRef } from "react";

/**
 * Subtle interactive network: drifting nodes (AI "neurons") linked to a few
 * square "block" nodes (ledger). Nodes gently avoid the pointer. The canvas is
 * purely decorative, pauses when off-screen or hidden, and renders a single
 * static frame when the user prefers reduced motion.
 */

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  kind: "neuron" | "block";
};

const NODE_COUNT = 34;
const LINK_DISTANCE = 150;
const POINTER_RADIUS = 140;

function createNodes(width: number, height: number, random: () => number): Node[] {
  return Array.from({ length: NODE_COUNT }, (_, index) => ({
    x: random() * width,
    y: random() * height,
    vx: (random() - 0.5) * 0.22,
    vy: (random() - 0.5) * 0.22,
    r: 1.6 + random() * 1.8,
    kind: index % 6 === 0 ? "block" : "neuron",
  }));
}

function seededRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

function readColors(element: HTMLElement) {
  const styles = getComputedStyle(element);
  return {
    ink: styles.getPropertyValue("--foreground").trim() || "#4a3f3a",
    accent: styles.getPropertyValue("--primary").trim() || "#cf5a30",
  };
}

export function HeroNetwork({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let nodes: Node[] = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let running = false;
    let visible = true;
    let colors = readColors(canvas);
    const pointer = { x: -9999, y: -9999, active: false };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      nodes = createNodes(width, height, seededRandom(7));
      colors = readColors(canvas);
      draw();
    };

    const step = () => {
      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < -10) node.x = width + 10;
        if (node.x > width + 10) node.x = -10;
        if (node.y < -10) node.y = height + 10;
        if (node.y > height + 10) node.y = -10;

        if (pointer.active) {
          const dx = node.x - pointer.x;
          const dy = node.y - pointer.y;
          const distance = Math.hypot(dx, dy);
          if (distance < POINTER_RADIUS && distance > 0.001) {
            const force = ((POINTER_RADIUS - distance) / POINTER_RADIUS) * 0.35;
            node.x += (dx / distance) * force;
            node.y += (dy / distance) * force;
          }
        }
      }
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      context.lineWidth = 1;
      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const a = nodes[i];
          const b = nodes[j];
          const distance = Math.hypot(a.x - b.x, a.y - b.y);
          if (distance > LINK_DISTANCE) continue;
          const alpha = (1 - distance / LINK_DISTANCE) * 0.35;
          context.strokeStyle = colors.ink;
          context.globalAlpha = alpha;
          context.setLineDash(a.kind === "block" || b.kind === "block" ? [3, 4] : []);
          context.beginPath();
          context.moveTo(a.x, a.y);
          context.lineTo(b.x, b.y);
          context.stroke();
        }
      }
      context.setLineDash([]);
      for (const node of nodes) {
        if (node.kind === "block") {
          context.globalAlpha = 0.9;
          context.strokeStyle = colors.accent;
          context.strokeRect(node.x - 4, node.y - 4, 8, 8);
          context.globalAlpha = 0.25;
          context.fillStyle = colors.accent;
          context.fillRect(node.x - 4, node.y - 4, 8, 8);
        } else {
          context.globalAlpha = 0.55;
          context.fillStyle = colors.ink;
          context.beginPath();
          context.arc(node.x, node.y, node.r, 0, Math.PI * 2);
          context.fill();
        }
      }
      context.globalAlpha = 1;
    };

    const loop = () => {
      if (!running) return;
      step();
      draw();
      frame = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || reduceMotion.matches || !visible || document.hidden) return;
      running = true;
      frame = requestAnimationFrame(loop);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
    };
    const onPointerLeave = () => {
      pointer.active = false;
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    const onMotionChange = () => {
      if (reduceMotion.matches) {
        stop();
        draw();
      } else {
        start();
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { threshold: 0.05 },
    );

    resize();
    observer.observe(canvas);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    reduceMotion.addEventListener("change", onMotionChange);
    const parent = canvas.parentElement ?? canvas;
    parent.addEventListener("pointermove", onPointerMove);
    parent.addEventListener("pointerleave", onPointerLeave);
    const themeObserver = new MutationObserver(() => {
      colors = readColors(canvas);
      if (!running) draw();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      stop();
      observer.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      reduceMotion.removeEventListener("change", onMotionChange);
      parent.removeEventListener("pointermove", onPointerMove);
      parent.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
