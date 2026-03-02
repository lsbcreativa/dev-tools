"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";
import SeoContent from "@/components/tools/SeoContent";

type ServerType = "static" | "reverse-proxy" | "spa" | "php";

function generateNginxConfig(opts: {
  serverType: ServerType;
  domain: string;
  port: number;
  root: string;
  upstream: string;
  ssl: boolean;
  gzip: boolean;
  cors: boolean;
}): string {
  const { serverType, domain, port, root, upstream, ssl, gzip, cors } = opts;
  const lines: string[] = [];

  // HTTP to HTTPS redirect block
  if (ssl) {
    lines.push("server {");
    lines.push("    listen 80;");
    lines.push("    listen [::]:80;");
    lines.push(`    server_name ${domain || "example.com"};`);
    lines.push("");
    lines.push("    return 301 https://$host$request_uri;");
    lines.push("}");
    lines.push("");
  }

  // Upstream block for reverse proxy
  if (serverType === "reverse-proxy" && upstream) {
    lines.push("upstream backend {");
    lines.push(`    server ${upstream.replace(/^https?:\/\//, "")};`);
    lines.push("}");
    lines.push("");
  }

  lines.push("server {");

  if (ssl) {
    lines.push("    listen 443 ssl http2;");
    lines.push("    listen [::]:443 ssl http2;");
  } else {
    lines.push(`    listen ${port};`);
    lines.push(`    listen [::]:${port};`);
  }

  lines.push(`    server_name ${domain || "example.com"};`);

  if (ssl) {
    lines.push("");
    lines.push("    # SSL Configuration");
    lines.push(`    ssl_certificate /etc/letsencrypt/live/${domain || "example.com"}/fullchain.pem;`);
    lines.push(`    ssl_certificate_key /etc/letsencrypt/live/${domain || "example.com"}/privkey.pem;`);
    lines.push("    ssl_protocols TLSv1.2 TLSv1.3;");
    lines.push("    ssl_ciphers HIGH:!aNULL:!MD5;");
    lines.push("    ssl_prefer_server_ciphers on;");
  }

  if (serverType !== "reverse-proxy") {
    lines.push(`    root ${root};`);
  }

  // Gzip
  if (gzip) {
    lines.push("");
    lines.push("    # Gzip Compression");
    lines.push("    gzip on;");
    lines.push("    gzip_vary on;");
    lines.push("    gzip_proxied any;");
    lines.push("    gzip_comp_level 6;");
    lines.push("    gzip_min_length 256;");
    lines.push("    gzip_types");
    lines.push("        text/plain");
    lines.push("        text/css");
    lines.push("        text/javascript");
    lines.push("        application/javascript");
    lines.push("        application/json");
    lines.push("        application/xml");
    lines.push("        image/svg+xml;");
  }

  // CORS
  if (cors) {
    lines.push("");
    lines.push("    # CORS Headers");
    lines.push('    add_header Access-Control-Allow-Origin "*";');
    lines.push('    add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";');
    lines.push('    add_header Access-Control-Allow-Headers "Origin, Content-Type, Accept, Authorization";');
    lines.push("");
    lines.push("    if ($request_method = OPTIONS) {");
    lines.push("        return 204;");
    lines.push("    }");
  }

  lines.push("");

  // Location blocks
  switch (serverType) {
    case "static":
      lines.push("    index index.html index.htm;");
      lines.push("");
      lines.push("    location / {");
      lines.push("        try_files $uri $uri/ =404;");
      lines.push("    }");
      lines.push("");
      lines.push("    # Cache static assets");
      lines.push("    location ~* \\.(css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$ {");
      lines.push("        expires 30d;");
      lines.push("        add_header Cache-Control \"public, immutable\";");
      lines.push("    }");
      break;

    case "reverse-proxy":
      lines.push("    location / {");
      lines.push("        proxy_pass http://backend;");
      lines.push("        proxy_http_version 1.1;");
      lines.push('        proxy_set_header Upgrade $http_upgrade;');
      lines.push("        proxy_set_header Connection 'upgrade';");
      lines.push("        proxy_set_header Host $host;");
      lines.push("        proxy_set_header X-Real-IP $remote_addr;");
      lines.push("        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;");
      lines.push("        proxy_set_header X-Forwarded-Proto $scheme;");
      lines.push("        proxy_cache_bypass $http_upgrade;");
      lines.push("    }");
      break;

    case "spa":
      lines.push("    index index.html;");
      lines.push("");
      lines.push("    location / {");
      lines.push("        try_files $uri $uri/ /index.html;");
      lines.push("    }");
      lines.push("");
      lines.push("    # Cache static assets");
      lines.push("    location ~* \\.(css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$ {");
      lines.push("        expires 1y;");
      lines.push("        add_header Cache-Control \"public, immutable\";");
      lines.push("    }");
      break;

    case "php":
      lines.push("    index index.php index.html index.htm;");
      lines.push("");
      lines.push("    location / {");
      lines.push("        try_files $uri $uri/ /index.php?$query_string;");
      lines.push("    }");
      lines.push("");
      lines.push("    location ~ \\.php$ {");
      lines.push("        fastcgi_pass unix:/var/run/php/php-fpm.sock;");
      lines.push("        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;");
      lines.push("        include fastcgi_params;");
      lines.push("        fastcgi_index index.php;");
      lines.push("    }");
      lines.push("");
      lines.push("    location ~ /\\.ht {");
      lines.push("        deny all;");
      lines.push("    }");
      break;
  }

  lines.push("");
  lines.push("    # Security headers");
  lines.push('    add_header X-Frame-Options "SAMEORIGIN" always;');
  lines.push('    add_header X-Content-Type-Options "nosniff" always;');
  lines.push('    add_header X-XSS-Protection "1; mode=block" always;');

  lines.push("}");

  return lines.join("\n");
}

export default function NginxConfigGenerator() {
  const [serverType, setServerType] = useState<ServerType>("static");
  const [domain, setDomain] = useState("example.com");
  const [port, setPort] = useState(80);
  const [root, setRoot] = useState("/var/www/html");
  const [upstream, setUpstream] = useState("http://127.0.0.1:3000");
  const [ssl, setSsl] = useState(false);
  const [gzip, setGzip] = useState(true);
  const [cors, setCors] = useState(false);

  const config = useMemo(
    () =>
      generateNginxConfig({
        serverType,
        domain,
        port,
        root,
        upstream,
        ssl,
        gzip,
        cors,
      }),
    [serverType, domain, port, root, upstream, ssl, gzip, cors]
  );

  const downloadConfig = () => {
    const blob = new Blob([config], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${domain || "default"}.conf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const serverTypeOptions: { label: string; value: ServerType }[] = [
    { label: "Static Site", value: "static" },
    { label: "Reverse Proxy", value: "reverse-proxy" },
    { label: "SPA (Single Page App)", value: "spa" },
    { label: "PHP", value: "php" },
  ];

  const faqs = [
    { question: "What is the difference between a static site and reverse proxy config?", answer: "A static site config serves files directly from a directory. A reverse proxy config forwards requests to a backend application (Node.js, Python, etc.) running on another port. Use reverse proxy for dynamic applications and static for HTML/CSS/JS files." },
    { question: "How do I enable HTTPS/SSL in Nginx?", answer: "Add ssl_certificate and ssl_certificate_key directives pointing to your SSL certificate files. This tool generates the SSL configuration including recommended cipher suites. Use Let's Encrypt/Certbot for free SSL certificates." },
    { question: "What does try_files do in Nginx?", answer: "try_files $uri $uri/ /index.html tells Nginx to first try the exact file, then the directory, then fall back to index.html. This is essential for single-page applications (React, Vue, Angular) where client-side routing handles URLs." },
  ];

  return (
    <ToolLayout
      title="Nginx Config Generator"
      description="Generate production-ready Nginx configuration files for static sites, reverse proxies, SPAs, and PHP applications."
      slug="nginx-config"
      faqs={faqs}
      seoContent={
        <SeoContent
          sections={[
            { title: "How to Generate Nginx Configuration", content: "Select your use case \u2014 static site, reverse proxy, SPA, or load balancer \u2014 and configure options like server name, port, SSL, gzip compression, and caching headers. The tool generates a complete nginx.conf server block that you can copy and deploy directly. It follows Nginx best practices for security headers, performance optimization, and proper routing." },
            { title: "Nginx Configuration Best Practices", content: "Nginx is the most popular web server, powering over 30% of websites worldwide. Key configuration best practices include enabling gzip compression for text-based assets, setting proper cache headers (Cache-Control, ETag), adding security headers (X-Frame-Options, Content-Security-Policy), configuring SSL with strong ciphers, and using try_files for SPA routing. This tool generates configurations that follow these best practices out of the box." },
          ]}
          faqs={faqs}
        />
      }
    >
      {/* Form */}
      <div className="space-y-4">
        {/* Server type */}
        <div>
          <label className="mb-1 block text-sm font-medium">Server Type</label>
          <select
            value={serverType}
            onChange={(e) => setServerType(e.target.value as ServerType)}
            className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm bg-transparent"
          >
            {serverTypeOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* Domain */}
        <div>
          <label className="mb-1 block text-sm font-medium">Domain Name</label>
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="example.com"
            className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-mono"
          />
        </div>

        {/* Port */}
        <div>
          <label className="mb-1 block text-sm font-medium">Port</label>
          <input
            type="number"
            value={port}
            onChange={(e) => setPort(Number(e.target.value))}
            min={1}
            max={65535}
            className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-mono"
          />
        </div>

        {/* Root directory (hidden for reverse proxy) */}
        {serverType !== "reverse-proxy" && (
          <div>
            <label className="mb-1 block text-sm font-medium">
              Root Directory
            </label>
            <input
              type="text"
              value={root}
              onChange={(e) => setRoot(e.target.value)}
              placeholder="/var/www/html"
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-mono"
            />
          </div>
        )}

        {/* Upstream URL (only for reverse proxy) */}
        {serverType === "reverse-proxy" && (
          <div>
            <label className="mb-1 block text-sm font-medium">
              Upstream URL
            </label>
            <input
              type="text"
              value={upstream}
              onChange={(e) => setUpstream(e.target.value)}
              placeholder="http://127.0.0.1:3000"
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-mono"
            />
          </div>
        )}

        {/* Toggles */}
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={ssl}
              onChange={(e) => setSsl(e.target.checked)}
              className="rounded border-[var(--border)] accent-[var(--primary)]"
            />
            <span>SSL (HTTPS)</span>
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={gzip}
              onChange={(e) => setGzip(e.target.checked)}
              className="rounded border-[var(--border)] accent-[var(--primary)]"
            />
            <span>Gzip Compression</span>
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={cors}
              onChange={(e) => setCors(e.target.checked)}
              className="rounded border-[var(--border)] accent-[var(--primary)]"
            />
            <span>CORS Headers</span>
          </label>
        </div>
      </div>

      {/* Output */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Generated Configuration</span>
          <div className="flex gap-2">
            <CopyButton text={config} />
            <button
              onClick={downloadConfig}
              className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-sm font-medium transition-all hover:bg-[var(--muted)] btn-press"
            >
              Download .conf
            </button>
          </div>
        </div>
        <pre className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4 text-sm font-mono overflow-x-auto whitespace-pre">
          {config}
        </pre>
      </div>
    </ToolLayout>
  );
}
