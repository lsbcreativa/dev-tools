"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";
import SeoContent from "@/components/tools/SeoContent";

type OperationType =
  | "base64-encode"
  | "base64-decode"
  | "url-encode"
  | "url-decode"
  | "hex-encode"
  | "hex-decode"
  | "rot13"
  | "reverse"
  | "uppercase"
  | "lowercase"
  | "html-entities-encode"
  | "html-entities-decode";

interface Step {
  id: string;
  operation: OperationType;
}

interface StepResult {
  output: string;
  error: string | null;
}

const OPERATIONS: { value: OperationType; label: string; group: string }[] = [
  { value: "base64-encode", label: "Base64 Encode", group: "Base64" },
  { value: "base64-decode", label: "Base64 Decode", group: "Base64" },
  { value: "url-encode", label: "URL Encode", group: "URL" },
  { value: "url-decode", label: "URL Decode", group: "URL" },
  { value: "hex-encode", label: "Hex Encode", group: "Hex" },
  { value: "hex-decode", label: "Hex Decode", group: "Hex" },
  { value: "rot13", label: "ROT13", group: "Cipher" },
  { value: "reverse", label: "Reverse", group: "Transform" },
  { value: "uppercase", label: "Uppercase", group: "Transform" },
  { value: "lowercase", label: "Lowercase", group: "Transform" },
  { value: "html-entities-encode", label: "HTML Entities Encode", group: "HTML" },
  { value: "html-entities-decode", label: "HTML Entities Decode", group: "HTML" },
];

function applyOperation(input: string, operation: OperationType): StepResult {
  try {
    switch (operation) {
      case "base64-encode":
        return { output: btoa(unescape(encodeURIComponent(input))), error: null };
      case "base64-decode":
        return { output: decodeURIComponent(escape(atob(input))), error: null };
      case "url-encode":
        return { output: encodeURIComponent(input), error: null };
      case "url-decode":
        return { output: decodeURIComponent(input), error: null };
      case "hex-encode": {
        const hex = Array.from(input)
          .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0"))
          .join("");
        return { output: hex, error: null };
      }
      case "hex-decode": {
        const cleaned = input.replace(/\s/g, "");
        if (cleaned.length % 2 !== 0) {
          return { output: "", error: "Hex string must have even number of characters." };
        }
        if (!/^[0-9a-fA-F]*$/.test(cleaned)) {
          return { output: "", error: "Invalid hex characters detected." };
        }
        let decoded = "";
        for (let i = 0; i < cleaned.length; i += 2) {
          decoded += String.fromCharCode(parseInt(cleaned.substring(i, i + 2), 16));
        }
        return { output: decoded, error: null };
      }
      case "rot13": {
        const rot = input.replace(/[a-zA-Z]/g, (c) => {
          const base = c <= "Z" ? 65 : 97;
          return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
        });
        return { output: rot, error: null };
      }
      case "reverse":
        return { output: Array.from(input).reverse().join(""), error: null };
      case "uppercase":
        return { output: input.toUpperCase(), error: null };
      case "lowercase":
        return { output: input.toLowerCase(), error: null };
      case "html-entities-encode": {
        const encoded = input
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#39;");
        return { output: encoded, error: null };
      }
      case "html-entities-decode": {
        const textarea = document.createElement("textarea");
        textarea.innerHTML = input;
        return { output: textarea.value, error: null };
      }
      default:
        return { output: input, error: null };
    }
  } catch (err) {
    return {
      output: "",
      error: err instanceof Error ? err.message : "Operation failed.",
    };
  }
}

let nextId = 0;
function generateId(): string {
  nextId++;
  return `step-${nextId}-${Date.now()}`;
}

export default function EncodingPlayground() {
  const [input, setInput] = useState("");
  const [steps, setSteps] = useState<Step[]>([]);

  const results = useMemo(() => {
    const stepResults: StepResult[] = [];
    let currentInput = input;

    for (const step of steps) {
      if (stepResults.length > 0 && stepResults[stepResults.length - 1].error) {
        // Previous step had an error, don't propagate
        stepResults.push({ output: "", error: "Skipped due to error in previous step." });
        continue;
      }
      const result = applyOperation(currentInput, step.operation);
      stepResults.push(result);
      if (!result.error) {
        currentInput = result.output;
      }
    }

    return stepResults;
  }, [input, steps]);

  const finalOutput = useMemo(() => {
    if (steps.length === 0) return input;
    for (let i = results.length - 1; i >= 0; i--) {
      if (!results[i].error) return results[i].output;
    }
    return "";
  }, [input, steps, results]);

  const addStep = () => {
    setSteps((prev) => [
      ...prev,
      { id: generateId(), operation: "base64-encode" },
    ]);
  };

  const removeStep = (id: string) => {
    setSteps((prev) => prev.filter((s) => s.id !== id));
  };

  const updateStepOperation = (id: string, operation: OperationType) => {
    setSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, operation } : s))
    );
  };

  const clearAllSteps = () => {
    setSteps([]);
  };

  const getOperationLabel = (op: OperationType): string => {
    return OPERATIONS.find((o) => o.value === op)?.label || op;
  };

  const faqs = [
    {
      question: "What is double encoding and why does it happen?",
      answer: "Double encoding occurs when already-encoded data is encoded again — for example, %20 becoming %2520. This happens when encoding functions are applied multiple times, often due to middleware or framework auto-encoding.",
    },
    {
      question: "What encoding steps are available?",
      answer: "This tool supports Base64 encode/decode, URL encode/decode, hex encode/decode, ROT13, HTML entity encode/decode, and more. Each step can be added to the chain independently.",
    },
    {
      question: "How do I decode multi-layered encoded data?",
      answer: "Apply the inverse operations in reverse order. If data was URL-encoded then Base64-encoded, decode Base64 first, then URL-decode. This tool lets you build the chain step by step to find the right sequence.",
    },
  ];

  return (
    <ToolLayout
      title="Encoding Playground"
      description="Chain multiple encoding and decoding operations together. Build complex transformation pipelines."
      slug="encoding-playground"
      faqs={faqs}
      seoContent={
        <SeoContent
          sections={[
            {
              title: "How to Chain Multiple Encodings",
              content: "Enter text and apply multiple encoding/decoding steps in sequence: Base64, URL encoding, hex, ROT13, HTML entities, and more. Each step transforms the output of the previous step, letting you build complex encoding chains. This is useful for debugging encoded data, understanding multi-layer encoding, and testing data transformations.",
            },
            {
              title: "Understanding Text Encoding Layers",
              content: "Data transmitted over networks often goes through multiple encoding layers. A URL parameter might be URL-encoded, then the entire URL might be Base64-encoded in a JWT, which is then transmitted as HTML with entity encoding. Debugging such multi-layer encoding requires applying the inverse transformations in reverse order. This tool lets you experiment with encoding chains interactively.",
            },
          ]}
          faqs={faqs}
        />
      }
    >
      <div className="space-y-4">
        {/* Input */}
        <div>
          <label className="mb-1 block text-sm font-medium">Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to transform..."
            className="w-full rounded-lg border border-[var(--border)] bg-transparent p-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40"
            rows={4}
          />
        </div>

        {/* Steps */}
        {steps.map((step, index) => {
          const result = results[index];
          return (
            <div key={step.id} className="space-y-1">
              {/* Arrow connector */}
              <div className="flex justify-center">
                <svg width="20" height="24" viewBox="0 0 20 24" className="text-[var(--muted-foreground)]">
                  <path d="M10 0 L10 18 M4 14 L10 20 L16 14" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
              </div>

              <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--primary)] text-[10px] font-bold text-white shrink-0">
                    {index + 1}
                  </span>
                  <select
                    value={step.operation}
                    onChange={(e) =>
                      updateStepOperation(step.id, e.target.value as OperationType)
                    }
                    className="flex-1 rounded-lg border border-[var(--border)] bg-transparent px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40"
                  >
                    {OPERATIONS.map((op) => (
                      <option key={op.value} value={op.value}>
                        {op.label}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => removeStep(step.id)}
                    className="rounded-md border border-[var(--border)] px-2 py-1.5 text-xs font-medium text-[var(--destructive)] transition-all hover:bg-[var(--destructive)]/10 btn-press"
                    title="Remove step"
                  >
                    X
                  </button>
                </div>

                {/* Step result */}
                {result && result.error ? (
                  <div className="rounded-md border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 p-2 text-xs text-[var(--destructive)]">
                    {result.error}
                  </div>
                ) : result ? (
                  <div className="rounded-md border border-[var(--border)] bg-[var(--card)] p-2 text-xs font-mono break-all max-h-32 overflow-y-auto">
                    {result.output || (
                      <span className="text-[var(--muted-foreground)] italic">
                        Empty output
                      </span>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}

        {/* Add step / Clear all */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={addStep}
            className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90 btn-press"
          >
            + Add Step
          </button>
          {steps.length > 0 && (
            <button
              onClick={clearAllSteps}
              className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium transition-all hover:bg-[var(--muted)] btn-press"
            >
              Clear All Steps
            </button>
          )}
        </div>

        {/* Final output */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium">
              Final Output
              {steps.length > 0 && (
                <span className="ml-2 text-xs text-[var(--muted-foreground)]">
                  ({steps.map((s) => getOperationLabel(s.operation)).join(" -> ")})
                </span>
              )}
            </label>
            <CopyButton text={finalOutput} />
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-3 text-sm font-mono break-all min-h-[60px] max-h-48 overflow-y-auto">
            {finalOutput || (
              <span className="text-[var(--muted-foreground)] italic">
                Enter some text above to see the output
              </span>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
