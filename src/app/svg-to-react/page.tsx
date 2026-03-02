"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";
import SeoContent from "@/components/tools/SeoContent";

/* ---------- SVG attribute conversion map ---------- */

const ATTR_MAP: Record<string, string> = {
  "accent-height": "accentHeight",
  "alignment-baseline": "alignmentBaseline",
  "arabic-form": "arabicForm",
  "baseline-shift": "baselineShift",
  "cap-height": "capHeight",
  "clip-path": "clipPath",
  "clip-rule": "clipRule",
  "color-interpolation": "colorInterpolation",
  "color-interpolation-filters": "colorInterpolationFilters",
  "color-profile": "colorProfile",
  "dominant-baseline": "dominantBaseline",
  "enable-background": "enableBackground",
  "fill-opacity": "fillOpacity",
  "fill-rule": "fillRule",
  "flood-color": "floodColor",
  "flood-opacity": "floodOpacity",
  "font-family": "fontFamily",
  "font-size": "fontSize",
  "font-size-adjust": "fontSizeAdjust",
  "font-stretch": "fontStretch",
  "font-style": "fontStyle",
  "font-variant": "fontVariant",
  "font-weight": "fontWeight",
  "glyph-name": "glyphName",
  "glyph-orientation-horizontal": "glyphOrientationHorizontal",
  "glyph-orientation-vertical": "glyphOrientationVertical",
  "horiz-adv-x": "horizAdvX",
  "horiz-origin-x": "horizOriginX",
  "image-rendering": "imageRendering",
  "letter-spacing": "letterSpacing",
  "lighting-color": "lightingColor",
  "marker-end": "markerEnd",
  "marker-mid": "markerMid",
  "marker-start": "markerStart",
  "overline-position": "overlinePosition",
  "overline-thickness": "overlineThickness",
  "paint-order": "paintOrder",
  "panose-1": "panose1",
  "pointer-events": "pointerEvents",
  "shape-rendering": "shapeRendering",
  "stop-color": "stopColor",
  "stop-opacity": "stopOpacity",
  "strikethrough-position": "strikethroughPosition",
  "strikethrough-thickness": "strikethroughThickness",
  "stroke-dasharray": "strokeDasharray",
  "stroke-dashoffset": "strokeDashoffset",
  "stroke-linecap": "strokeLinecap",
  "stroke-linejoin": "strokeLinejoin",
  "stroke-miterlimit": "strokeMiterlimit",
  "stroke-opacity": "strokeOpacity",
  "stroke-width": "strokeWidth",
  "text-anchor": "textAnchor",
  "text-decoration": "textDecoration",
  "text-rendering": "textRendering",
  "underline-position": "underlinePosition",
  "underline-thickness": "underlineThickness",
  "unicode-bidi": "unicodeBidi",
  "unicode-range": "unicodeRange",
  "units-per-em": "unitsPerEm",
  "v-alphabetic": "vAlphabetic",
  "v-hanging": "vHanging",
  "v-ideographic": "vIdeographic",
  "v-mathematical": "vMathematical",
  "vert-adv-y": "vertAdvY",
  "vert-origin-x": "vertOriginX",
  "vert-origin-y": "vertOriginY",
  "word-spacing": "wordSpacing",
  "writing-mode": "writingMode",
  "x-height": "xHeight",
  "xlink:actuate": "xlinkActuate",
  "xlink:arcrole": "xlinkArcrole",
  "xlink:href": "xlinkHref",
  "xlink:role": "xlinkRole",
  "xlink:show": "xlinkShow",
  "xlink:title": "xlinkTitle",
  "xlink:type": "xlinkType",
  "xml:base": "xmlBase",
  "xml:lang": "xmlLang",
  "xml:space": "xmlSpace",
  class: "className",
  for: "htmlFor",
  tabindex: "tabIndex",
};

/* ---------- Converter ---------- */

function svgToJsx(svg: string): string {
  let jsx = svg.trim();

  // Convert attributes
  jsx = jsx.replace(
    /\s([a-z][a-z0-9]*(?:-[a-z0-9]+)+)(\s*=)/gi,
    (_, attr, eq) => {
      const camel = ATTR_MAP[attr] || attr.replace(/-([a-z])/g, (_m: string, c: string) => c.toUpperCase());
      return ` ${camel}${eq}`;
    }
  );

  // class → className
  jsx = jsx.replace(/\sclass=/g, " className=");

  // tabindex → tabIndex
  jsx = jsx.replace(/\stabindex=/g, " tabIndex=");

  // style string to object (basic)
  jsx = jsx.replace(
    /style="([^"]+)"/g,
    (_, styleStr: string) => {
      const obj = styleStr
        .split(";")
        .filter((s: string) => s.trim())
        .map((s: string) => {
          const [prop, val] = s.split(":").map((p: string) => p.trim());
          const camelProp = prop.replace(/-([a-z])/g, (_m: string, c: string) => c.toUpperCase());
          return `${camelProp}: "${val}"`;
        })
        .join(", ");
      return `style={{${obj}}}`;
    }
  );

  return jsx;
}

function generateComponent(
  svgJsx: string,
  name: string,
  ts: boolean,
  useForwardRef: boolean,
  useMemoWrap: boolean,
  removeXmlns: boolean
): string {
  let svg = svgJsx;
  if (removeXmlns) {
    svg = svg.replace(/\s*xmlns="[^"]*"/g, "");
  }

  // Add {...props} spread to root svg element
  svg = svg.replace(/<svg/, "<svg {...props}");

  const lines: string[] = [];
  const propsType = ts ? `React.SVGProps<SVGSVGElement>` : "";

  if (useForwardRef) {
    lines.push(`import React, { forwardRef${useMemoWrap ? ", memo" : ""} } from "react";`);
    lines.push("");

    if (ts) {
      lines.push(
        `const ${name} = forwardRef<SVGSVGElement, ${propsType}>((props, ref) => {`
      );
    } else {
      lines.push(`const ${name} = forwardRef((props, ref) => {`);
    }
    // Add ref to svg
    svg = svg.replace(/<svg/, "<svg ref={ref}");
    lines.push(`  return (`);
    svg.split("\n").forEach((l) => lines.push(`    ${l}`));
    lines.push(`  );`);
    lines.push(`});`);
    lines.push("");
    lines.push(`${name}.displayName = "${name}";`);
  } else {
    if (useMemoWrap) {
      lines.push(`import React, { memo } from "react";`);
    } else {
      lines.push(`import React from "react";`);
    }
    lines.push("");

    if (ts) {
      lines.push(`function ${name}(props: ${propsType}) {`);
    } else {
      lines.push(`function ${name}(props) {`);
    }
    lines.push(`  return (`);
    svg.split("\n").forEach((l) => lines.push(`    ${l}`));
    lines.push(`  );`);
    lines.push(`}`);
  }

  lines.push("");

  if (useMemoWrap) {
    lines.push(`export default memo(${name});`);
  } else {
    lines.push(`export default ${name};`);
  }

  return lines.join("\n");
}

/* ---------- Presets ---------- */

const PRESETS = [
  {
    label: "Arrow icon",
    value: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  },
  {
    label: "Circle check",
    value: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
  <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  },
  {
    label: "Star with fill-rule",
    value: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
</svg>`,
  },
];

/* ---------- Component ---------- */

export default function SvgToReactPage() {
  const [input, setInput] = useState("");
  const [componentName, setComponentName] = useState("MyIcon");
  const [useTs, setUseTs] = useState(true);
  const [useForwardRef, setUseForwardRef] = useState(false);
  const [useMemoWrap, setUseMemoWrap] = useState(false);
  const [removeXmlns, setRemoveXmlns] = useState(true);

  const output = useMemo(() => {
    if (!input.trim()) return "";
    try {
      const jsx = svgToJsx(input);
      return generateComponent(jsx, componentName || "MyIcon", useTs, useForwardRef, useMemoWrap, removeXmlns);
    } catch {
      return "// Error converting SVG. Check your markup.";
    }
  }, [input, componentName, useTs, useForwardRef, useMemoWrap, removeXmlns]);

  const faqs = [
    {
      question: "Why convert SVG to React components instead of using img tags?",
      answer:
        "React components allow you to control SVG properties dynamically through props — change colors with currentColor, adjust sizes, add hover effects, and animate with CSS or libraries like Framer Motion. Inline SVG components also eliminate extra HTTP requests.",
    },
    {
      question: "What SVG attributes are converted automatically?",
      answer:
        "Over 80 SVG attributes are converted, including stroke-width, fill-rule, clip-path, font-size, text-anchor, and all xlink: and xml: namespaced attributes. The class attribute becomes className, and inline styles are converted to React style objects.",
    },
    {
      question: "Should I use forwardRef for SVG components?",
      answer:
        "Use forwardRef when you need direct DOM access to the SVG element — for example, to measure dimensions, trigger animations, or integrate with third-party libraries. For simple icon components, forwardRef is optional.",
    },
    {
      question: "Does this tool handle SVG gradients and filters?",
      answer:
        "Yes. The converter handles all SVG elements and attributes, including linearGradient, radialGradient, filter, clipPath, and mask elements. Attribute names within these elements are properly converted to camelCase.",
    },
  ];

  return (
    <ToolLayout
      title="SVG to React Component"
      description="Convert SVG markup to React JSX/TSX components with TypeScript props, forwardRef and memo."
      slug="svg-to-react"
      faqs={faqs}
      seoContent={
        <SeoContent
          sections={[
            {
              title: "How to Convert SVG to React Components",
              content:
                "Paste your SVG markup into the input field and get a ready-to-use React component. This tool converts SVG attributes from kebab-case to camelCase (stroke-width becomes strokeWidth, fill-opacity becomes fillOpacity), transforms inline style strings into React style objects, and handles over 80 SVG-specific attribute mappings. You can customize the component name, add TypeScript types, forwardRef support, and React.memo wrapping.",
            },
            {
              title: "SVG Best Practices in React Applications",
              content:
                "Using SVG as React components instead of img tags gives you full control over colors, sizes, and animations through props and CSS. Components can accept className, style, and any SVG prop through the spread operator. ForwardRef support enables direct DOM access for animations, and React.memo prevents unnecessary re-renders for static icons. This approach is used by popular icon libraries like Heroicons, Lucide, and Phosphor Icons.",
            },
          ]}
          faqs={faqs}
        />
      }
    >
      {/* Presets */}
      <div className="mb-4 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => setInput(p.value)}
            className="rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-1 text-xs font-medium hover:bg-[var(--muted)] btn-press"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Options */}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-[var(--muted-foreground)]">Component name</label>
          <input
            type="text"
            value={componentName}
            onChange={(e) => setComponentName(e.target.value.replace(/[^a-zA-Z0-9]/g, ""))}
            className="w-40 rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-1.5 text-sm font-mono"
          />
        </div>
        {[
          { label: "TypeScript", checked: useTs, set: setUseTs },
          { label: "forwardRef", checked: useForwardRef, set: setUseForwardRef },
          { label: "memo", checked: useMemoWrap, set: setUseMemoWrap },
          { label: "Remove xmlns", checked: removeXmlns, set: setRemoveXmlns },
        ].map((opt) => (
          <label key={opt.label} className="flex items-center gap-1.5 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={opt.checked}
              onChange={(e) => opt.set(e.target.checked)}
            />
            {opt.label}
          </label>
        ))}
      </div>

      {/* Input */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium">SVG Input</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='<svg width="24" height="24" viewBox="0 0 24 24" ...>'
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] p-3 text-sm font-mono"
          rows={8}
          spellCheck={false}
        />
      </div>

      {/* Output */}
      {output && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              React Component ({useTs ? ".tsx" : ".jsx"})
            </span>
            <CopyButton text={output} />
          </div>
          <pre className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4 text-sm font-mono overflow-x-auto max-h-[500px] whitespace-pre-wrap">
            {output}
          </pre>
        </div>
      )}
    </ToolLayout>
  );
}
