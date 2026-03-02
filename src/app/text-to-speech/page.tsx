"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import ToolLayout from "@/components/tools/ToolLayout";

export default function TextToSpeechTool() {
  const [text, setText] = useState("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState(0);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [status, setStatus] = useState<"Ready" | "Speaking..." | "Paused">("Ready");
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
        // Try to select an English voice by default
        const englishIndex = availableVoices.findIndex(
          (v) => v.lang.startsWith("en") && v.default
        );
        if (englishIndex >= 0) {
          setSelectedVoiceIndex(englishIndex);
        }
      }
    };

    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      speechSynthesis.cancel();
      speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const handlePlay = useCallback(() => {
    if (!text.trim() || typeof window === "undefined" || !window.speechSynthesis) return;

    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if (voices[selectedVoiceIndex]) {
      utterance.voice = voices[selectedVoiceIndex];
    }
    utterance.rate = rate;
    utterance.pitch = pitch;

    utterance.onstart = () => setStatus("Speaking...");
    utterance.onend = () => setStatus("Ready");
    utterance.onerror = () => setStatus("Ready");
    utterance.onpause = () => setStatus("Paused");
    utterance.onresume = () => setStatus("Speaking...");

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  }, [text, voices, selectedVoiceIndex, rate, pitch]);

  const handlePauseResume = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    if (speechSynthesis.paused) {
      speechSynthesis.resume();
    } else if (speechSynthesis.speaking) {
      speechSynthesis.pause();
    }
  }, []);

  const handleStop = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    speechSynthesis.cancel();
    setStatus("Ready");
  }, []);

  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  // Average speaking rate: ~150 words per minute at rate 1.0
  const estimatedSeconds = wordCount > 0 ? Math.ceil((wordCount / (150 * rate)) * 60) : 0;
  const estimatedMinutes = Math.floor(estimatedSeconds / 60);
  const remainingSeconds = estimatedSeconds % 60;

  return (
    <ToolLayout
      title="Text to Speech"
      description="Convert text to speech using your browser's built-in speech synthesis engine."
      slug="text-to-speech"
    >
      <div className="space-y-4">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-3 text-xs text-[var(--muted-foreground)]">
          Uses your browser&apos;s built-in speech synthesis. Available voices depend on your OS and browser.
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Text to speak</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to convert to speech..."
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] p-3 text-sm"
            rows={8}
          />
        </div>

        {/* Voice selector */}
        <div>
          <label className="mb-1 block text-sm font-medium">Voice</label>
          <select
            value={selectedVoiceIndex}
            onChange={(e) => setSelectedVoiceIndex(Number(e.target.value))}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm"
          >
            {voices.length === 0 && (
              <option value={0}>Loading voices...</option>
            )}
            {voices.map((voice, i) => (
              <option key={`${voice.name}-${i}`} value={i}>
                {voice.name} ({voice.lang}){voice.default ? " - Default" : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Rate and pitch sliders */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 flex items-center justify-between text-sm font-medium">
              <span>Rate</span>
              <span className="text-xs text-[var(--muted-foreground)]">{rate.toFixed(1)}x</span>
            </label>
            <input
              type="range"
              min={0.5}
              max={2}
              step={0.1}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full accent-[var(--primary)]"
            />
            <div className="mt-0.5 flex justify-between text-xs text-[var(--muted-foreground)]">
              <span>0.5x</span>
              <span>2x</span>
            </div>
          </div>

          <div>
            <label className="mb-1 flex items-center justify-between text-sm font-medium">
              <span>Pitch</span>
              <span className="text-xs text-[var(--muted-foreground)]">{pitch.toFixed(1)}</span>
            </label>
            <input
              type="range"
              min={0.5}
              max={2}
              step={0.1}
              value={pitch}
              onChange={(e) => setPitch(Number(e.target.value))}
              className="w-full accent-[var(--primary)]"
            />
            <div className="mt-0.5 flex justify-between text-xs text-[var(--muted-foreground)]">
              <span>0.5</span>
              <span>2.0</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handlePlay}
            disabled={!text.trim()}
            className="rounded-lg bg-[var(--primary)] px-5 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] disabled:opacity-50 btn-press"
          >
            Play
          </button>
          <button
            onClick={handlePauseResume}
            disabled={status === "Ready"}
            className="rounded-lg border border-[var(--border)] px-5 py-2 text-sm font-medium hover:bg-[var(--muted)] disabled:opacity-50 btn-press"
          >
            {status === "Paused" ? "Resume" : "Pause"}
          </button>
          <button
            onClick={handleStop}
            disabled={status === "Ready"}
            className="rounded-lg border border-[var(--border)] px-5 py-2 text-sm font-medium hover:bg-[var(--muted)] disabled:opacity-50 btn-press"
          >
            Stop
          </button>

          <div className="ml-auto flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                status === "Speaking..."
                  ? "bg-[var(--success)]/15 text-[var(--success)]"
                  : status === "Paused"
                  ? "bg-[var(--primary)]/15 text-[var(--primary)]"
                  : "bg-[var(--muted)] text-[var(--muted-foreground)]"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  status === "Speaking..."
                    ? "bg-[var(--success)] animate-pulse"
                    : status === "Paused"
                    ? "bg-[var(--primary)]"
                    : "bg-[var(--muted-foreground)]"
                }`}
              />
              {status}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-4 text-xs text-[var(--muted-foreground)]">
          <span>{charCount.toLocaleString()} character{charCount !== 1 ? "s" : ""}</span>
          <span>{wordCount.toLocaleString()} word{wordCount !== 1 ? "s" : ""}</span>
          {estimatedSeconds > 0 && (
            <span>
              Estimated duration: {estimatedMinutes > 0 ? `${estimatedMinutes}m ` : ""}
              {remainingSeconds}s (at {rate.toFixed(1)}x)
            </span>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
