"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";

/* ---------- Constants ---------- */

const SAMPLE_HTML = `<form class="login-form" action="/login" method="post" enctype="multipart/form-data">
  <!-- Login form header -->
  <div class="form-group">
    <label for="email">Email Address</label>
    <input type="email" class="form-control" id="email" placeholder="Enter email" tabindex="1" readonly>
  </div>
  <div class="form-group">
    <label for="password">Password</label>
    <input type="password" class="form-control" id="password" maxlength="128" tabindex="2">
  </div>
  <div class="form-check">
    <input type="checkbox" class="form-check-input" id="remember" checked disabled>
    <label class="form-check-label" for="remember">Remember me</label>
  </div>
  <hr>
  <img src="/logo.png" alt="Logo" class="logo">
  <br>
  <a href="/forgot" onclick="trackClick()" class="link">Forgot password?</a>
  <button type="submit" class="btn btn-primary" style="color: red; font-size: 16px; background-color: #333; margin-top: 10px" tabindex="3">
    Log In
  </button>
  <meta charset="utf-8">
  <link rel="stylesheet" href="/styles.css" crossorigin="anonymous">
  <table cellpadding="4" cellspacing="0">
    <tr>
      <td colspan="2" rowspan="1">Cell</td>
    </tr>
  </table>
  <select onchange="handleChange()">
    <option value="a" selected>A</option>
    <option value="b">B</option>
  </select>
</form>`;

const VOID_ELEMENTS = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input",
  "link", "meta", "param", "source", "track", "wbr",
]);

const ATTR_MAP: Record<string, string> = {
  class: "className",
  for: "htmlFor",
  tabindex: "tabIndex",
  readonly: "readOnly",
  maxlength: "maxLength",
  colspan: "colSpan",
  rowspan: "rowSpan",
  cellpadding: "cellPadding",
  cellspacing: "cellSpacing",
  enctype: "encType",
  crossorigin: "crossOrigin",
  charset: "charSet",
  "http-equiv": "httpEquiv",
  accesskey: "accessKey",
  autocomplete: "autoComplete",
  autofocus: "autoFocus",
  autoplay: "autoPlay",
  formaction: "formAction",
  formenctype: "formEncType",
  formmethod: "formMethod",
  formnovalidate: "formNoValidate",
  formtarget: "formTarget",
  frameborder: "frameBorder",
  hreflang: "hrefLang",
  inputmode: "inputMode",
  novalidate: "noValidate",
  srcdoc: "srcDoc",
  srclang: "srcLang",
  srcset: "srcSet",
  usemap: "useMap",
  // Event handlers
  onclick: "onClick",
  onchange: "onChange",
  onsubmit: "onSubmit",
  onblur: "onBlur",
  onfocus: "onFocus",
  oninput: "onInput",
  onkeydown: "onKeyDown",
  onkeyup: "onKeyUp",
  onkeypress: "onKeyPress",
  onmouseover: "onMouseOver",
  onmouseout: "onMouseOut",
  onmousedown: "onMouseDown",
  onmouseup: "onMouseUp",
  onmousemove: "onMouseMove",
  onmouseenter: "onMouseEnter",
  onmouseleave: "onMouseLeave",
  ondblclick: "onDoubleClick",
  onscroll: "onScroll",
  onwheel: "onWheel",
  ontouchstart: "onTouchStart",
  ontouchend: "onTouchEnd",
  ontouchmove: "onTouchMove",
  ondrag: "onDrag",
  ondragend: "onDragEnd",
  ondragenter: "onDragEnter",
  ondragleave: "onDragLeave",
  ondragover: "onDragOver",
  ondragstart: "onDragStart",
  ondrop: "onDrop",
  onload: "onLoad",
  onerror: "onError",
  onresize: "onResize",
  oncontextmenu: "onContextMenu",
  oncopy: "onCopy",
  oncut: "onCut",
  onpaste: "onPaste",
  onselect: "onSelect",
  onanimationstart: "onAnimationStart",
  onanimationend: "onAnimationEnd",
  onanimationiteration: "onAnimationIteration",
  ontransitionend: "onTransitionEnd",
};

const BOOLEAN_ATTRS = new Set([
  "checked", "disabled", "selected", "required", "multiple",
  "autofocus", "autoplay", "controls", "default", "defer",
  "formnovalidate", "hidden", "loop", "muted", "novalidate",
  "open", "readonly", "reversed", "scoped", "seamless",
  "allowfullscreen", "async", "nomodule",
]);

/* ---------- CSS style conversion ---------- */

function cssPropertyToCamel(prop: string): string {
  // Handle vendor prefixes like -webkit-, -moz-
  const cleaned = prop.trim();
  return cleaned.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

function convertStyleString(style: string): string {
  const declarations = style
    .split(";")
    .map((d) => d.trim())
    .filter(Boolean);

  const pairs: string[] = [];
  for (const decl of declarations) {
    const colonIdx = decl.indexOf(":");
    if (colonIdx === -1) continue;
    const prop = decl.slice(0, colonIdx).trim();
    let val = decl.slice(colonIdx + 1).trim();

    const camel = cssPropertyToCamel(prop);

    // Keep numeric values with units as strings, convert pure numbers
    if (/^-?\d+(\.\d+)?$/.test(val)) {
      pairs.push(`${camel}: ${val}`);
    } else {
      pairs.push(`${camel}: '${val}'`);
    }
  }

  return `{{ ${pairs.join(", ")} }}`;
}

/* ---------- Main converter ---------- */

function htmlToJsx(html: string): string {
  let result = html;

  // Remove HTML comments
  result = result.replace(/<!--[\s\S]*?-->/g, "");

  // Convert style attributes
  result = result.replace(
    /style\s*=\s*"([^"]*)"/gi,
    (_, styleStr: string) => `style={${convertStyleString(styleStr)}}`
  );
  result = result.replace(
    /style\s*=\s*'([^']*)'/gi,
    (_, styleStr: string) => `style={${convertStyleString(styleStr)}}`
  );

  // Convert boolean attributes (standalone, without value)
  // Match attribute name that is a boolean attr, not followed by =
  for (const attr of BOOLEAN_ATTRS) {
    // Boolean attr with no value: e.g. `checked` not followed by `=`
    const patternStandalone = new RegExp(
      `(<[^>]*\\s)(${attr})(\\s(?!=)|\\s*>|\\s*/>)`,
      "gi"
    );
    result = result.replace(patternStandalone, (_, before, attrName, after) => {
      const mapped = ATTR_MAP[attrName.toLowerCase()] || attrName;
      return `${before}${mapped}={true}${after}`;
    });

    // Boolean attr with value: e.g. `checked="checked"` or `disabled=""`
    const patternWithValue = new RegExp(
      `(<[^>]*\\s)${attr}\\s*=\\s*(?:"[^"]*"|'[^']*')`,
      "gi"
    );
    result = result.replace(patternWithValue, (match, before) => {
      const mapped = ATTR_MAP[attr.toLowerCase()] || attr;
      return `${before}${mapped}={true}`;
    });
  }

  // Convert mapped attributes (but NOT boolean ones we already handled, and not style which we already handled)
  for (const [htmlAttr, jsxAttr] of Object.entries(ATTR_MAP)) {
    if (BOOLEAN_ATTRS.has(htmlAttr)) continue;
    // Match the attribute with = and a value
    const regex = new RegExp(
      `(<[^>]*\\s)${htmlAttr.replace("-", "\\-")}(\\s*=)`,
      "gi"
    );
    result = result.replace(regex, `$1${jsxAttr}$2`);
  }

  // Self-close void elements that aren't already self-closed
  for (const el of VOID_ELEMENTS) {
    // Match <el ... > (not already self-closed)
    const regex = new RegExp(
      `<(${el})(\\s[^>]*)?>(?!\\s*</${el})`,
      "gi"
    );
    result = result.replace(regex, (match, tag, attrs) => {
      // Remove trailing slash if already there partially
      const cleanAttrs = (attrs || "").replace(/\/\s*$/, "").trimEnd();
      return `<${tag}${cleanAttrs} />`;
    });
  }

  return result;
}

/* ---------- Component ---------- */

export default function HtmlToJsxPage() {
  const [input, setInput] = useState("");

  const output = useMemo(() => {
    if (!input.trim()) return "";
    try {
      return htmlToJsx(input);
    } catch (e) {
      return `// Error: ${(e as Error).message}`;
    }
  }, [input]);

  const loadSample = () => {
    setInput(SAMPLE_HTML);
  };

  return (
    <ToolLayout
      title="HTML to JSX"
      description="Convert HTML markup to valid JSX with proper attribute names, style objects, and self-closing tags."
      slug="html-to-jsx"
    >
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Input */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="block text-sm font-medium">HTML Input</label>
            <button
              onClick={loadSample}
              className="rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-1 text-xs font-medium hover:bg-[var(--muted)] btn-press"
            >
              Load Sample
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='<div class="container">...</div>'
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] p-3 text-sm font-mono"
            rows={18}
            spellCheck={false}
          />
        </div>

        {/* Output */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="block text-sm font-medium">JSX Output</label>
            {output && <CopyButton text={output} />}
          </div>
          <pre className="w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] p-3 text-sm font-mono overflow-auto whitespace-pre-wrap min-h-[calc(18*1.625em+1.5rem)]">
            {output || (
              <span className="text-[var(--muted-foreground)]">
                JSX output will appear here...
              </span>
            )}
          </pre>
        </div>
      </div>
    </ToolLayout>
  );
}
