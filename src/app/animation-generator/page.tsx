"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";
import SeoContent from "@/components/tools/SeoContent";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface KeyframeData {
  id: string;
  percent: number;
  translateX: number;
  translateY: number;
  rotate: number;
  scale: number;
  opacity: number;
}

interface AnimationConfig {
  name: string;
  duration: number;
  timingFunction: string;
  iterationCount: string;
  direction: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function genId(): string {
  return Math.random().toString(36).substring(2, 9);
}

function defaultFrame(percent: number): KeyframeData {
  return {
    id: genId(),
    percent,
    translateX: 0,
    translateY: 0,
    rotate: 0,
    scale: 1,
    opacity: 1,
  };
}

/* ------------------------------------------------------------------ */
/*  Presets                                                            */
/* ------------------------------------------------------------------ */
interface Preset {
  label: string;
  frames: Omit<KeyframeData, "id">[];
  config: Partial<AnimationConfig>;
}

const PRESETS: Preset[] = [
  {
    label: "Bounce",
    frames: [
      { percent: 0, translateX: 0, translateY: 0, rotate: 0, scale: 1, opacity: 1 },
      { percent: 20, translateX: 0, translateY: -30, rotate: 0, scale: 1, opacity: 1 },
      { percent: 40, translateX: 0, translateY: 0, rotate: 0, scale: 1, opacity: 1 },
      { percent: 60, translateX: 0, translateY: -15, rotate: 0, scale: 1, opacity: 1 },
      { percent: 80, translateX: 0, translateY: 0, rotate: 0, scale: 1, opacity: 1 },
      { percent: 100, translateX: 0, translateY: 0, rotate: 0, scale: 1, opacity: 1 },
    ],
    config: { duration: 1, timingFunction: "ease", iterationCount: "infinite" },
  },
  {
    label: "Fade In",
    frames: [
      { percent: 0, translateX: 0, translateY: 0, rotate: 0, scale: 1, opacity: 0 },
      { percent: 100, translateX: 0, translateY: 0, rotate: 0, scale: 1, opacity: 1 },
    ],
    config: { duration: 0.6, timingFunction: "ease-in", iterationCount: "1" },
  },
  {
    label: "Slide In",
    frames: [
      { percent: 0, translateX: -100, translateY: 0, rotate: 0, scale: 1, opacity: 0 },
      { percent: 100, translateX: 0, translateY: 0, rotate: 0, scale: 1, opacity: 1 },
    ],
    config: { duration: 0.5, timingFunction: "ease-out", iterationCount: "1" },
  },
  {
    label: "Pulse",
    frames: [
      { percent: 0, translateX: 0, translateY: 0, rotate: 0, scale: 1, opacity: 1 },
      { percent: 50, translateX: 0, translateY: 0, rotate: 0, scale: 1.1, opacity: 1 },
      { percent: 100, translateX: 0, translateY: 0, rotate: 0, scale: 1, opacity: 1 },
    ],
    config: { duration: 1, timingFunction: "ease-in-out", iterationCount: "infinite" },
  },
  {
    label: "Spin",
    frames: [
      { percent: 0, translateX: 0, translateY: 0, rotate: 0, scale: 1, opacity: 1 },
      { percent: 100, translateX: 0, translateY: 0, rotate: 360, scale: 1, opacity: 1 },
    ],
    config: { duration: 1, timingFunction: "linear", iterationCount: "infinite" },
  },
  {
    label: "Shake",
    frames: [
      { percent: 0, translateX: 0, translateY: 0, rotate: 0, scale: 1, opacity: 1 },
      { percent: 10, translateX: -10, translateY: 0, rotate: 0, scale: 1, opacity: 1 },
      { percent: 20, translateX: 10, translateY: 0, rotate: 0, scale: 1, opacity: 1 },
      { percent: 30, translateX: -10, translateY: 0, rotate: 0, scale: 1, opacity: 1 },
      { percent: 40, translateX: 10, translateY: 0, rotate: 0, scale: 1, opacity: 1 },
      { percent: 50, translateX: -5, translateY: 0, rotate: 0, scale: 1, opacity: 1 },
      { percent: 60, translateX: 5, translateY: 0, rotate: 0, scale: 1, opacity: 1 },
      { percent: 70, translateX: -2, translateY: 0, rotate: 0, scale: 1, opacity: 1 },
      { percent: 80, translateX: 2, translateY: 0, rotate: 0, scale: 1, opacity: 1 },
      { percent: 100, translateX: 0, translateY: 0, rotate: 0, scale: 1, opacity: 1 },
    ],
    config: { duration: 0.6, timingFunction: "ease-in-out", iterationCount: "1" },
  },
];

/* ------------------------------------------------------------------ */
/*  CSS generation                                                     */
/* ------------------------------------------------------------------ */
function buildTransform(f: KeyframeData): string {
  const parts: string[] = [];
  if (f.translateX !== 0) parts.push(`translateX(${f.translateX}px)`);
  if (f.translateY !== 0) parts.push(`translateY(${f.translateY}px)`);
  if (f.rotate !== 0) parts.push(`rotate(${f.rotate}deg)`);
  if (f.scale !== 1) parts.push(`scale(${f.scale})`);
  return parts.length > 0 ? parts.join(" ") : "none";
}

function generateCSS(
  frames: KeyframeData[],
  config: AnimationConfig
): string {
  const sorted = [...frames].sort((a, b) => a.percent - b.percent);

  let keyframesCSS = `@keyframes ${config.name} {\n`;
  for (const f of sorted) {
    const transform = buildTransform(f);
    const lines: string[] = [];
    if (transform !== "none") lines.push(`    transform: ${transform};`);
    if (f.opacity !== 1) lines.push(`    opacity: ${f.opacity};`);

    // If no properties differ from default, still output the block
    if (lines.length === 0) {
      lines.push(`    transform: none;`);
    }

    keyframesCSS += `  ${f.percent}% {\n${lines.join("\n")}\n  }\n`;
  }
  keyframesCSS += `}`;

  const iterCount =
    config.iterationCount === "infinite"
      ? "infinite"
      : config.iterationCount;

  const animationCSS = `.animated-element {
  animation: ${config.name} ${config.duration}s ${config.timingFunction} ${iterCount} ${config.direction};
}`;

  return `${keyframesCSS}\n\n${animationCSS}`;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function AnimationGenerator() {
  const [frames, setFrames] = useState<KeyframeData[]>([
    defaultFrame(0),
    defaultFrame(50),
    defaultFrame(100),
  ]);

  const [config, setConfig] = useState<AnimationConfig>({
    name: "myAnimation",
    duration: 1,
    timingFunction: "ease",
    iterationCount: "infinite",
    direction: "normal",
  });

  const [playing, setPlaying] = useState(true);
  const styleRef = useRef<HTMLStyleElement | null>(null);

  const css = generateCSS(frames, config);

  // Inject dynamic style
  useEffect(() => {
    if (!styleRef.current) {
      styleRef.current = document.createElement("style");
      document.head.appendChild(styleRef.current);
    }
    styleRef.current.textContent = css;

    return () => {
      if (styleRef.current) {
        document.head.removeChild(styleRef.current);
        styleRef.current = null;
      }
    };
  }, [css]);

  const updateFrame = (id: string, updates: Partial<KeyframeData>) => {
    setFrames((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
  };

  const addFrame = () => {
    const sorted = [...frames].sort((a, b) => a.percent - b.percent);
    // Find the largest gap
    let bestGap = 0;
    let bestPercent = 50;
    for (let i = 0; i < sorted.length - 1; i++) {
      const gap = sorted[i + 1].percent - sorted[i].percent;
      if (gap > bestGap) {
        bestGap = gap;
        bestPercent = Math.round(
          (sorted[i].percent + sorted[i + 1].percent) / 2
        );
      }
    }
    setFrames((prev) => [...prev, defaultFrame(bestPercent)]);
  };

  const removeFrame = (id: string) => {
    if (frames.length <= 2) return;
    setFrames((prev) => prev.filter((f) => f.id !== id));
  };

  const applyPreset = useCallback((preset: Preset) => {
    setFrames(preset.frames.map((f) => ({ ...f, id: genId() })));
    setConfig((prev) => ({ ...prev, ...preset.config }));
    setPlaying(true);
  }, []);

  const updateConfig = (updates: Partial<AnimationConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const timingOptions = [
    "ease",
    "ease-in",
    "ease-out",
    "ease-in-out",
    "linear",
  ];
  const directionOptions = [
    "normal",
    "reverse",
    "alternate",
    "alternate-reverse",
  ];

  const sortedFrames = [...frames].sort((a, b) => a.percent - b.percent);

  const faqs = [
    {
      question: "What is the difference between CSS animations and transitions?",
      answer: "Transitions animate between two states (e.g., hover) and require a trigger. Animations can run automatically, loop infinitely, and define multiple keyframes. Use transitions for simple interactive effects and animations for complex, multi-step sequences.",
    },
    {
      question: "How do I make an animation loop forever?",
      answer: "Set animation-iteration-count to infinite. For example: animation: spin 1s linear infinite. The 'infinite' keyword makes the animation repeat continuously.",
    },
    {
      question: "What is a CSS timing function?",
      answer: "Timing functions control the speed curve of an animation. 'linear' moves at constant speed, 'ease' starts slow then fast, 'ease-in-out' starts and ends slowly. Use cubic-bezier() for custom curves or 'steps()' for frame-by-frame animation.",
    },
  ];

  return (
    <ToolLayout
      title="CSS Animation Generator"
      description="Create CSS keyframe animations visually with a live preview, presets, and full control over keyframe properties."
      slug="animation-generator"
      faqs={faqs}
      seoContent={
        <SeoContent
          sections={[
            {
              title: "How to Create CSS Animations",
              content: "Build CSS keyframe animations visually using the timeline editor. Select from presets like fade-in, slide, bounce, and rotate, or create custom keyframes by setting CSS properties at different percentage points. Configure duration, timing function, delay, iteration count, and direction. Copy the complete @keyframes rule and animation property.",
            },
            {
              title: "CSS Animation Properties Explained",
              content: "CSS animations use @keyframes to define property changes over time and the animation shorthand to apply them. Key properties include animation-duration (how long), animation-timing-function (easing curve — linear, ease-in, ease-out, cubic-bezier), animation-delay (wait before starting), animation-iteration-count (how many times, or infinite), and animation-direction (normal, reverse, alternate). For simple transitions between two states, use CSS transition instead.",
            },
          ]}
          faqs={faqs}
        />
      }
    >
      {/* Preview */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-medium">Live Preview</label>
          <button
            onClick={() => setPlaying((p) => !p)}
            className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-medium hover:bg-[var(--muted)] btn-press"
          >
            {playing ? "Pause" : "Play"}
          </button>
        </div>
        <div className="flex items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--muted)]" style={{ minHeight: 200 }}>
          <div
            className="animated-element"
            style={{
              width: 80,
              height: 80,
              borderRadius: 12,
              background: "linear-gradient(135deg, var(--primary), #a855f7)",
              animationPlayState: playing ? "running" : "paused",
            }}
          />
        </div>
      </div>

      {/* Presets */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium">Presets</label>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => applyPreset(preset)}
              className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-sm font-medium hover:bg-[var(--muted)] btn-press"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Animation Controls */}
      <div className="mb-6">
        <h3 className="mb-3 text-sm font-semibold">Animation Properties</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Name</label>
            <input
              type="text"
              value={config.name}
              onChange={(e) =>
                updateConfig({
                  name: e.target.value.replace(/[^a-zA-Z0-9_-]/g, "") || "myAnimation",
                })
              }
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-mono"
            />
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-sm font-medium">Duration</label>
              <span className="text-xs text-[var(--muted-foreground)] font-mono">
                {config.duration}s
              </span>
            </div>
            <input
              type="range"
              min={0.1}
              max={5}
              step={0.1}
              value={config.duration}
              onChange={(e) =>
                updateConfig({ duration: parseFloat(e.target.value) })
              }
              className="w-full"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Timing Function
            </label>
            <select
              value={config.timingFunction}
              onChange={(e) =>
                updateConfig({ timingFunction: e.target.value })
              }
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
            >
              {timingOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Iteration Count
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={100}
                value={
                  config.iterationCount === "infinite"
                    ? ""
                    : config.iterationCount
                }
                onChange={(e) =>
                  updateConfig({
                    iterationCount: e.target.value || "1",
                  })
                }
                placeholder="1"
                disabled={config.iterationCount === "infinite"}
                className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-mono disabled:opacity-50"
              />
              <label className="flex items-center gap-1.5 text-sm whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={config.iterationCount === "infinite"}
                  onChange={(e) =>
                    updateConfig({
                      iterationCount: e.target.checked ? "infinite" : "1",
                    })
                  }
                  className="rounded"
                />
                Infinite
              </label>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Direction</label>
            <select
              value={config.direction}
              onChange={(e) => updateConfig({ direction: e.target.value })}
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
            >
              {directionOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Keyframes Editor */}
      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Keyframes</h3>
          <button
            onClick={addFrame}
            className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] btn-press"
          >
            Add Keyframe
          </button>
        </div>
        <div className="space-y-3">
          {sortedFrames.map((frame) => (
            <div
              key={frame.id}
              className="rounded-lg border border-[var(--border)] bg-[var(--muted)]/50 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{frame.percent}%</span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={frame.percent}
                    onChange={(e) =>
                      updateFrame(frame.id, {
                        percent: Number(e.target.value),
                      })
                    }
                    className="w-24"
                  />
                </div>
                {frames.length > 2 && (
                  <button
                    onClick={() => removeFrame(frame.id)}
                    className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-sm font-medium hover:bg-[var(--muted)] btn-press"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <div>
                  <label className="mb-1 block text-xs font-medium">
                    translateX (px)
                  </label>
                  <input
                    type="number"
                    value={frame.translateX}
                    onChange={(e) =>
                      updateFrame(frame.id, {
                        translateX: Number(e.target.value),
                      })
                    }
                    className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">
                    translateY (px)
                  </label>
                  <input
                    type="number"
                    value={frame.translateY}
                    onChange={(e) =>
                      updateFrame(frame.id, {
                        translateY: Number(e.target.value),
                      })
                    }
                    className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">
                    rotate (deg)
                  </label>
                  <input
                    type="number"
                    value={frame.rotate}
                    onChange={(e) =>
                      updateFrame(frame.id, {
                        rotate: Number(e.target.value),
                      })
                    }
                    className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">
                    scale
                  </label>
                  <input
                    type="number"
                    step={0.1}
                    min={0}
                    value={frame.scale}
                    onChange={(e) =>
                      updateFrame(frame.id, {
                        scale: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">
                    opacity
                  </label>
                  <input
                    type="number"
                    step={0.1}
                    min={0}
                    max={1}
                    value={frame.opacity}
                    onChange={(e) =>
                      updateFrame(frame.id, {
                        opacity: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-mono"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CSS Output */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium">CSS Output</span>
          <CopyButton text={css} />
        </div>
        <pre className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4 text-sm font-mono overflow-x-auto max-h-96">
          {css}
        </pre>
      </div>
    </ToolLayout>
  );
}
