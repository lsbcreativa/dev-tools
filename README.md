# DevTools Online — 100+ Developer Tools in Your Browser

> Free, fast, and privacy-first developer tools. No signup. No servers. Everything runs 100% client-side.

**[→ toolboxurl.com](https://toolboxurl.com)**

---

## Why DevTools Online?

| Feature | DevTools Online | codebeautify.org | it-tools.tech |
|---------|:--------------:|:----------------:|:-------------:|
| 100% client-side | ✅ | ❌ | ✅ |
| No signup / no account | ✅ | ❌ | ✅ |
| Download output | ✅ | partial | ❌ |
| SEO guides & blog | ✅ | ❌ | ❌ |
| Open source | ✅ | ❌ | ✅ |
| Dark mode | ✅ | ❌ | ✅ |

Your data never leaves your browser. No telemetry, no cookies.

---

## Tools

### Text Tools (7)
Word & Character Counter · Text Case Converter · Lorem Ipsum Generator · Text Diff Checker · Markdown Preview · Slug Generator · Text to Speech

### Developer Tools (60)
JSON Formatter · Base64 Encoder/Decoder · URL Encoder/Decoder · Regex Tester · Regex Explainer · HTML Entity Encoder · JWT Decoder · JWT Builder · Unix Timestamp Converter · JSON to CSV · Cron Parser · Crontab Builder · SQL Formatter · SQL to MongoDB · Number Base Converter · JS Beautifier/Minifier · Image to Base64 · Base64 Image Viewer · Chmod Calculator · Meta Tag Generator · JSON to YAML · YAML to JSON · Text to Binary · Binary to Text · JSON Schema Generator · JSON Diff Viewer · Open Graph Preview · GitHub README Generator · Docker Run to Compose · Nginx Config Generator · JSON to TypeScript · JSON to Zod Schema · JSON to SQL · JSON/CSV to Excel · Excel Viewer · Curl to Code · HTML to JSX · HTML to BBCode · CSV Viewer & Editor · CSV to JSON · HTTP Status Codes · HTTP Headers Inspector · Encoding Playground · IP Subnet Calculator · Markdown Table Generator · Markdown to HTML · XML Formatter · GraphQL Formatter · TypeScript to JavaScript · CSS Minifier/Beautifier · Code Diff Viewer · Code to Image · API Request Builder · Env Variables Editor · Git Command Builder · SVG to React Component · React Component Generator · Tailwind CSS Playground · URL Parser

### Generators (15)
Password Generator · UUID Generator · QR Code Generator · Hash Generator (MD5, SHA-256, SHA-512) · HMAC Generator · Bcrypt Generator · RSA Key Pair Generator · Placeholder Image Generator · Fake Data Generator · Favicon Generator · Emoji Picker · Discord Timestamp Generator · PDF Merge · PDF Split · PDF Compress

### Design Tools (19)
Color Picker & Converter · CSS Gradient Generator · CSS Box Shadow Generator · CSS Flexbox Generator · CSS Grid Generator · CSS Border Radius Generator · CSS Animation Generator · CSS Clip-path Generator · CSS Variables Generator · CSS to Tailwind Converter · Color Palette Generator · Color Contrast Checker (WCAG) · Color Blindness Simulator · SVG Preview & Optimizer · Glassmorphism Generator · Fluid Typography Calculator · Aspect Ratio Calculator · Tailwind Color Finder · Image Compressor

---

## Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router, `output: "export"` — zero server costs)
- **Language**: TypeScript 5.9
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Notable libs**: pdf-lib · exceljs · html-to-image · isomorphic-dompurify

## Local Development

```bash
git clone https://github.com/lsbcreativa/dev-tools.git
cd dev-tools
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Contributing

Pull requests are welcome. To add a new tool:

1. Create `src/app/your-tool-name/page.tsx` — follow any existing tool as reference
2. Add your entry to `src/lib/tools.ts`
3. Open a PR with a short description of what the tool does

Issues with bugs or feature requests are also welcome.

## License

MIT
