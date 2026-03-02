export type ToolCategory = "text" | "developer" | "generators" | "design";

export interface Tool {
  name: string;
  slug: string;
  description: string;
  category: ToolCategory;
  icon: string;
}

export const categories: Record<ToolCategory, { label: string; description: string }> = {
  text: { label: "Text Tools", description: "Transform, analyze and compare text" },
  developer: { label: "Developer Tools", description: "Format, encode, convert and test code" },
  generators: { label: "Generators", description: "Generate passwords, UUIDs, QR codes, images and hashes" },
  design: { label: "Design Tools", description: "Colors, gradients, shadows, flexbox and more" },
};

export const tools: Tool[] = [
  // Text tools
  { name: "Word & Character Counter", slug: "word-counter", description: "Count words, characters, sentences, paragraphs and estimate reading time instantly.", category: "text", icon: "Type" },
  { name: "Text Case Converter", slug: "text-case-converter", description: "Convert text to UPPERCASE, lowercase, Title Case, camelCase, snake_case and more.", category: "text", icon: "CaseSensitive" },
  { name: "Lorem Ipsum Generator", slug: "lorem-ipsum-generator", description: "Generate placeholder text for your designs. Choose paragraphs, sentences or words.", category: "text", icon: "FileText" },
  { name: "Text Diff Checker", slug: "text-diff", description: "Compare two texts side by side and highlight the differences between them.", category: "text", icon: "GitCompare" },
  { name: "Markdown Preview", slug: "markdown-preview", description: "Write markdown and see a live rendered HTML preview side by side.", category: "text", icon: "FileCode" },
  { name: "Slug Generator", slug: "slug-generator", description: "Convert any text into a clean, URL-friendly slug with customizable options.", category: "text", icon: "Link2" },

  // Developer tools
  { name: "JSON Formatter & Validator", slug: "json-formatter", description: "Format, validate and minify JSON data. Beautify with proper indentation.", category: "developer", icon: "Braces" },
  { name: "Base64 Encoder / Decoder", slug: "base64", description: "Encode text to Base64 or decode Base64 strings back to plain text.", category: "developer", icon: "Binary" },
  { name: "URL Encoder / Decoder", slug: "url-encoder", description: "Encode special characters in URLs or decode percent-encoded URL strings.", category: "developer", icon: "Link" },
  { name: "Regex Tester", slug: "regex-tester", description: "Test regular expressions in real-time with match highlighting and group capture.", category: "developer", icon: "Regex" },
  { name: "HTML Entity Encoder", slug: "html-entities", description: "Convert special characters to HTML entities and vice versa. Escape & unescape HTML.", category: "developer", icon: "Code" },
  { name: "JWT Decoder", slug: "jwt-decoder", description: "Decode JWT tokens instantly. View header, payload, and expiration status.", category: "developer", icon: "ShieldCheck" },
  { name: "Unix Timestamp Converter", slug: "timestamp-converter", description: "Convert between Unix timestamps and human-readable dates with relative time.", category: "developer", icon: "Clock" },
  { name: "JSON to CSV Converter", slug: "json-csv", description: "Convert JSON arrays to CSV and CSV back to JSON. Download the result.", category: "developer", icon: "Table" },
  { name: "Cron Expression Parser", slug: "cron-parser", description: "Parse cron expressions into human-readable schedules with next execution times.", category: "developer", icon: "Timer" },
  { name: "SQL Formatter", slug: "sql-formatter", description: "Format and beautify SQL queries with proper indentation and keyword casing.", category: "developer", icon: "Database" },
  { name: "Number Base Converter", slug: "number-base-converter", description: "Convert numbers between decimal, binary, octal, and hexadecimal bases.", category: "developer", icon: "Calculator" },
  { name: "JS Beautifier / Minifier", slug: "js-formatter", description: "Beautify or minify JavaScript code with proper indentation.", category: "developer", icon: "Terminal" },
  { name: "Image to Base64", slug: "image-to-base64", description: "Convert images to Base64 data URIs. Drag & drop or upload. Copy as CSS or HTML.", category: "developer", icon: "ImageIcon" },
  { name: "Chmod Calculator", slug: "chmod-calculator", description: "Calculate Unix file permissions. Convert between numeric (755) and symbolic (rwxr-xr-x).", category: "developer", icon: "Lock" },
  { name: "Meta Tag Generator", slug: "meta-tag-generator", description: "Generate HTML meta tags for SEO, Open Graph, and Twitter Cards with live preview.", category: "developer", icon: "Globe" },
  { name: "JSON to YAML Converter", slug: "json-yaml", description: "Convert between JSON and YAML formats. Supports nested objects and arrays.", category: "developer", icon: "FileJson" },
  { name: "Text to Binary", slug: "text-to-binary", description: "Convert text to binary, octal, hex, or decimal ASCII codes and back.", category: "developer", icon: "Scan" },
  { name: "JSON Schema Generator", slug: "json-schema-generator", description: "Paste JSON and auto-generate a JSON Schema Draft 7 with type inference.", category: "developer", icon: "FileCheck" },
  { name: "JSON Diff Viewer", slug: "json-diff", description: "Compare two JSON objects and visualize added, removed, and changed values.", category: "developer", icon: "GitPullRequest" },
  { name: "Open Graph Preview", slug: "og-preview", description: "Preview how your page looks when shared on Twitter, Facebook, and LinkedIn.", category: "developer", icon: "Share2" },
  { name: "GitHub README Generator", slug: "readme-generator", description: "Generate professional README.md files with badges, install instructions, and more.", category: "developer", icon: "BookOpen" },
  { name: "Regex Explainer", slug: "regex-explainer", description: "Paste a regex and get a plain-English explanation of what each part does.", category: "developer", icon: "HelpCircle" },
  { name: "Docker Run to Compose", slug: "docker-compose", description: "Convert docker run commands to docker-compose.yml format instantly.", category: "developer", icon: "Container" },
  { name: "Nginx Config Generator", slug: "nginx-config", description: "Generate Nginx configs for static sites, reverse proxies, SPAs, and more.", category: "developer", icon: "Server" },

  // Generators
  { name: "Password Generator", slug: "password-generator", description: "Generate strong, secure random passwords with customizable length and character types.", category: "generators", icon: "KeyRound" },
  { name: "UUID Generator", slug: "uuid-generator", description: "Generate random UUID v4 identifiers. Create one or bulk generate multiple UUIDs.", category: "generators", icon: "Fingerprint" },
  { name: "QR Code Generator", slug: "qr-code-generator", description: "Generate QR codes from any text or URL. Download as PNG image.", category: "generators", icon: "QrCode" },
  { name: "Hash Generator", slug: "hash-generator", description: "Generate MD5, SHA-1, SHA-256 and SHA-512 hashes from any text input.", category: "generators", icon: "Hash" },
  { name: "Placeholder Image Generator", slug: "placeholder-image", description: "Generate placeholder images with custom size, colors and text. Download as PNG.", category: "generators", icon: "ImagePlus" },
  { name: "Fake Data Generator", slug: "fake-data-generator", description: "Generate fake names, emails, addresses, and more for testing. 100% client-side.", category: "generators", icon: "Users" },
  { name: "RSA Key Pair Generator", slug: "rsa-generator", description: "Generate RSA key pairs using Web Crypto API. Keys never leave your browser.", category: "generators", icon: "KeySquare" },

  // Design tools
  { name: "Color Picker & Converter", slug: "color-picker", description: "Pick colors and convert between HEX, RGB, and HSL formats. Copy CSS values.", category: "design", icon: "Palette" },
  { name: "CSS Gradient Generator", slug: "css-gradient-generator", description: "Create beautiful CSS gradients with a visual editor. Copy the CSS code instantly.", category: "design", icon: "Paintbrush" },
  { name: "CSS Box Shadow Generator", slug: "box-shadow-generator", description: "Create CSS box shadows visually with multiple layers, inset support, and live preview.", category: "design", icon: "Layers" },
  { name: "CSS Flexbox Generator", slug: "flexbox-generator", description: "Visual flexbox playground. Configure container and item properties with live preview.", category: "design", icon: "LayoutGrid" },
  { name: "CSS Border Radius Generator", slug: "border-radius-generator", description: "Visual border-radius editor with independent corner controls and live preview.", category: "design", icon: "Square" },
  { name: "Color Palette Generator", slug: "color-palette-generator", description: "Generate harmonious color palettes. Complementary, analogous, triadic and more.", category: "design", icon: "SwatchBook" },
  { name: "SVG Preview & Optimizer", slug: "svg-preview", description: "Preview SVG code, optimize it and download. Remove comments, metadata and whitespace.", category: "design", icon: "Eye" },
  { name: "CSS Animation Generator", slug: "animation-generator", description: "Build CSS keyframe animations visually with timeline, presets, and live preview.", category: "design", icon: "Play" },
  { name: "CSS Grid Generator", slug: "grid-generator", description: "Visual CSS Grid layout builder with drag-and-drop areas and live preview.", category: "design", icon: "Grid3x3" },
  { name: "Glassmorphism Generator", slug: "glassmorphism-generator", description: "Create trendy glassmorphism CSS effects with blur, transparency, and borders.", category: "design", icon: "Sparkles" },
  { name: "Fluid Typography Calculator", slug: "fluid-typography", description: "Generate CSS clamp() values for responsive fluid font sizes across viewports.", category: "design", icon: "ALargeSmall" },
  { name: "Aspect Ratio Calculator", slug: "aspect-ratio", description: "Calculate aspect ratios and resize dimensions while maintaining proportions.", category: "design", icon: "Maximize2" },
  { name: "Tailwind Color Finder", slug: "tailwind-colors", description: "Find the closest Tailwind CSS color to any hex value with visual comparison.", category: "design", icon: "Search" },
  { name: "CSS to Tailwind Converter", slug: "css-to-tailwind", description: "Convert CSS properties to Tailwind utility classes. Paste CSS, get Tailwind.", category: "design", icon: "Wind" },

  // More developer tools
  { name: "JSON to TypeScript", slug: "json-to-typescript", description: "Paste JSON and generate TypeScript interfaces or type aliases automatically.", category: "developer", icon: "FileType" },
  { name: "Curl to Code", slug: "curl-to-code", description: "Convert curl commands to JavaScript fetch, axios, Python requests, Go, and PHP.", category: "developer", icon: "ArrowRightLeft" },
  { name: "HTML to JSX", slug: "html-to-jsx", description: "Convert HTML to React JSX. Transforms class, style, events and self-closing tags.", category: "developer", icon: "FileCode2" },
  { name: "CSV Viewer & Editor", slug: "csv-viewer", description: "Paste or upload CSV files. View as table, sort, filter, edit and export.", category: "developer", icon: "Sheet" },
  { name: "Crontab Visual Builder", slug: "cron-builder", description: "Build cron expressions visually with dropdowns, presets and next run times.", category: "developer", icon: "CalendarClock" },
  { name: "JWT Builder", slug: "jwt-builder", description: "Create and sign JWT tokens with HS256. Edit header, payload and secret key.", category: "developer", icon: "Ticket" },
  { name: "HTTP Status Codes", slug: "http-status-codes", description: "Searchable reference of all HTTP status codes with descriptions and use cases.", category: "developer", icon: "Info" },
  { name: "Encoding Playground", slug: "encoding-playground", description: "Chain multiple encode/decode steps: Base64, URL, hex, ROT13, HTML entities.", category: "developer", icon: "Repeat" },

  // More generators
  { name: "HMAC Generator", slug: "hmac-generator", description: "Generate HMAC signatures with SHA-256/384/512 using Web Crypto API.", category: "generators", icon: "ShieldEllipsis" },
  { name: "Emoji Picker & Search", slug: "emoji-picker", description: "Search and copy emojis by name or category. 200+ emojis organized and searchable.", category: "generators", icon: "Smile" },

  // High-traffic tools
  { name: "HTML to BBCode", slug: "html-to-bbcode", description: "Convert HTML markup to BBCode for forums. Supports bold, links, images, lists and more.", category: "developer", icon: "MessageSquareCode" },
  { name: "IP Subnet Calculator", slug: "subnet-calculator", description: "Calculate network, broadcast, host range, wildcard mask and CIDR from any IP.", category: "developer", icon: "Network" },
  { name: "Markdown Table Generator", slug: "markdown-table", description: "Build markdown tables visually with a grid editor. Set alignment and export.", category: "developer", icon: "TableProperties" },
  { name: "XML Formatter & Validator", slug: "xml-formatter", description: "Format, minify, and validate XML documents with proper indentation.", category: "developer", icon: "FileCode" },
  { name: "TypeScript to JavaScript", slug: "ts-to-js", description: "Strip TypeScript types, interfaces, and annotations to get clean JavaScript.", category: "developer", icon: "FileType2" },
  { name: "CSS Minifier / Beautifier", slug: "css-minifier", description: "Minify or beautify CSS code. Remove comments, whitespace, or add indentation.", category: "developer", icon: "Minimize2" },
  { name: "Text to Speech", slug: "text-to-speech", description: "Convert text to speech using Web Speech API. Choose voice, speed, and pitch.", category: "text", icon: "Volume2" },
  { name: "Image Compressor", slug: "image-compressor", description: "Compress images in your browser using Canvas API. Adjust quality and resize.", category: "design", icon: "ImageDown" },
  { name: "Color Contrast Checker", slug: "contrast-checker", description: "Check WCAG 2.0 color contrast ratios for accessibility compliance (AA/AAA).", category: "design", icon: "Contrast" },

  // Premium tools (free here, paid elsewhere)
  { name: "PDF Merge", slug: "pdf-merge", description: "Combine multiple PDF files into one. Reorder pages and download. No limits, 100% free.", category: "generators", icon: "Merge" },
  { name: "PDF Split", slug: "pdf-split", description: "Split PDF files by page ranges. Extract specific pages into a new PDF. Unlimited and free.", category: "generators", icon: "Scissors" },
  { name: "PDF Compress", slug: "pdf-compress", description: "Compress PDF files to reduce size. Remove metadata and optimize. No upload limits.", category: "generators", icon: "FileOutput" },
{ name: "Code Diff Viewer", slug: "code-diff", description: "Compare two code snippets side by side with line-by-line diff highlighting.", category: "developer", icon: "Columns2" },
  { name: "Code to Image", slug: "code-to-image", description: "Generate beautiful code screenshots with custom themes and backgrounds. Like Carbon.sh but free.", category: "developer", icon: "Camera" },
  { name: "JSON/CSV to Excel", slug: "json-to-excel", description: "Convert JSON or CSV data to a real .xlsx Excel file with formatted headers. No signup required.", category: "developer", icon: "FileSpreadsheet" },
  { name: "Excel Viewer", slug: "excel-viewer", description: "Open and view Excel (.xlsx) files in your browser. Browse sheets, sort columns, and search.", category: "developer", icon: "Table2" },

  // Dev-focused tools
  { name: "API Request Builder", slug: "api-tester", description: "Build and test HTTP requests (GET, POST, PUT, DELETE) with custom headers and body. View responses instantly.", category: "developer", icon: "Send" },
  { name: "Env Variables Editor", slug: "env-editor", description: "Edit environment variables visually. Convert between .env, JSON, YAML, and docker-compose formats.", category: "developer", icon: "FileKey" },
  { name: "Git Command Builder", slug: "git-command-builder", description: "Build git commands visually with dropdowns and checkboxes. Merge, rebase, reset, stash and more explained.", category: "developer", icon: "GitBranch" },
  { name: "SQL to MongoDB Converter", slug: "sql-to-nosql", description: "Convert SQL queries to MongoDB equivalents. SELECT, INSERT, UPDATE, DELETE to find, insertOne, updateOne, deleteOne.", category: "developer", icon: "DatabaseZap" },

  // React / TS / Tailwind tools
  { name: "SVG to React Component", slug: "svg-to-react", description: "Convert SVG markup to React JSX/TSX components with TypeScript props, forwardRef and memo.", category: "developer", icon: "CodeXml" },
  { name: "JSON to Zod Schema", slug: "json-to-zod", description: "Generate Zod validation schemas from JSON data automatically. Supports nested objects, arrays, and type inference.", category: "developer", icon: "ShieldPlus" },
  { name: "React Component Generator", slug: "react-generator", description: "Generate React functional components with TypeScript, hooks, forwardRef, memo and custom props.", category: "developer", icon: "Component" },
  { name: "Tailwind CSS Playground", slug: "tailwind-playground", description: "Preview Tailwind CSS classes in real-time. See rendered output and generated CSS instantly.", category: "developer", icon: "WandSparkles" },

  // New tools — reaching 100
  { name: "Favicon Generator", slug: "favicon-generator", description: "Generate favicons from text, emoji or initials. Download as PNG in all standard sizes (16×16 to 512×512).", category: "generators", icon: "ImageIcon" },
  { name: "Bcrypt Generator", slug: "bcrypt-generator", description: "Hash and verify passwords using a bcrypt-compatible algorithm in your browser. Never sends data to a server.", category: "generators", icon: "Shield" },
  { name: "Discord Timestamp", slug: "discord-timestamp", description: "Generate Discord timestamp tags from any date and time. Copy the <t:unix:format> code instantly.", category: "generators", icon: "MessageSquare" },
  { name: "YAML to JSON", slug: "yaml-to-json", description: "Convert YAML to JSON instantly. Supports nested objects, arrays, anchors and multi-line strings.", category: "developer", icon: "FileCode" },
  { name: "CSV to JSON", slug: "csv-to-json", description: "Convert CSV files to JSON arrays. Auto-detects headers, handles quoted fields and type inference.", category: "developer", icon: "Table" },
  { name: "JSON to SQL", slug: "json-to-sql", description: "Convert a JSON array to SQL CREATE TABLE and INSERT statements. Supports MySQL, PostgreSQL and SQLite.", category: "developer", icon: "Database" },
  { name: "GraphQL Formatter", slug: "graphql-formatter", description: "Format and prettify GraphQL queries, mutations, and schema definitions with proper indentation.", category: "developer", icon: "Braces" },
  { name: "URL Parser", slug: "url-parser", description: "Break down any URL into its components: protocol, host, port, path, query params, and hash.", category: "developer", icon: "Link" },
  { name: "HTTP Headers Inspector", slug: "http-headers", description: "Paste HTTP response headers and get a plain-English explanation of what each header does.", category: "developer", icon: "Server" },
  { name: "Base64 Image Viewer", slug: "base64-image", description: "Paste a Base64 image string and preview it instantly. Detect format, dimensions and file size.", category: "developer", icon: "ImageIcon" },
  { name: "Binary to Text", slug: "binary-to-text", description: "Convert binary (0s and 1s) to readable text and text back to binary. Supports ASCII and UTF-8.", category: "developer", icon: "Binary" },
  { name: "Markdown to HTML", slug: "markdown-to-html", description: "Convert Markdown to raw HTML source code. See the generated tags and copy the output.", category: "developer", icon: "FileCode" },
  { name: "CSS Clip-path Generator", slug: "clip-path-generator", description: "Generate CSS clip-path shapes visually. Create polygons, circles, ellipses with live preview.", category: "design", icon: "Scissors" },
  { name: "Color Blindness Simulator", slug: "color-blindness", description: "Simulate how your designs look to users with color blindness. Upload an image and preview all types.", category: "design", icon: "Eye" },
  { name: "CSS Variables Generator", slug: "css-variables", description: "Define design tokens — colors, spacing, typography — and generate a :root CSS variables block.", category: "design", icon: "Palette" },
];

export function getToolsByCategory(category: ToolCategory): Tool[] {
  return tools.filter((t) => t.category === category);
}

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug);
}

export function getRelatedTools(slug: string, max = 3): Tool[] {
  const tool = getToolBySlug(slug);
  if (!tool) return [];
  return tools.filter((t) => t.category === tool.category && t.slug !== slug).slice(0, max);
}

export function getAdjacentTools(slug: string): { prev: Tool | null; next: Tool | null } {
  const idx = tools.findIndex((t) => t.slug === slug);
  return {
    prev: idx > 0 ? tools[idx - 1] : null,
    next: idx < tools.length - 1 ? tools[idx + 1] : null,
  };
}
