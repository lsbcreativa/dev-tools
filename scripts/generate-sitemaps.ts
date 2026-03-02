import { writeFileSync } from "fs";
import { join } from "path";
import { tools, categories, type ToolCategory } from "../src/lib/tools";

const SITE_URL = "https://toolboxurl.com";
const PUBLIC_DIR = join(__dirname, "..", "public");
const TODAY = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

// Priority mapping
const HIGH_PRIORITY_SLUGS = new Set([
  "json-formatter", "regex-tester", "password-generator", "jwt-decoder",
  "cron-parser", "flexbox-generator", "image-to-base64", "meta-tag-generator",
  "json-schema-generator", "fake-data-generator", "json-diff", "og-preview",
  "readme-generator", "docker-compose", "nginx-config", "rsa-generator",
  "json-to-typescript", "curl-to-code", "html-to-jsx", "jwt-builder",
  "image-compressor", "xml-formatter", "ts-to-js", "pdf-merge", "pdf-split",
  "pdf-compress", "code-to-image", "json-to-excel", "api-tester", "svg-to-react",
  "json-to-zod", "sql-formatter",
]);

function getPriority(slug: string): string {
  if (HIGH_PRIORITY_SLUGS.has(slug)) return "0.9";
  return "0.8";
}

function buildUrlEntry(loc: string, priority: string, changefreq: string, lastmod: string): string {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function buildSitemap(urls: string[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="${SITE_URL}/sitemap-stylesheet.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;
}

function buildSitemapIndex(sitemaps: { loc: string; lastmod: string }[]): string {
  const entries = sitemaps
    .map(
      (s) => `  <sitemap>
    <loc>${s.loc}</loc>
    <lastmod>${s.lastmod}</lastmod>
  </sitemap>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="${SITE_URL}/sitemap-index-stylesheet.xsl"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>
`;
}

// --- Generate sub-sitemaps ---

// 1. Pages sitemap
const pagesUrls = [
  buildUrlEntry(`${SITE_URL}/`, "1.0", "weekly", TODAY),
  buildUrlEntry(`${SITE_URL}/about`, "0.5", "monthly", TODAY),
  buildUrlEntry(`${SITE_URL}/privacy`, "0.3", "monthly", TODAY),
];
writeFileSync(join(PUBLIC_DIR, "sitemap-pages.xml"), buildSitemap(pagesUrls));

// 2. Category sitemaps
const categoryFiles: Record<ToolCategory, string> = {
  text: "sitemap-text-tools.xml",
  developer: "sitemap-developer-tools.xml",
  generators: "sitemap-generators.xml",
  design: "sitemap-design-tools.xml",
};

const sitemapEntries: { loc: string; lastmod: string }[] = [
  { loc: `${SITE_URL}/sitemap-pages.xml`, lastmod: TODAY },
];

for (const [category, filename] of Object.entries(categoryFiles) as [ToolCategory, string][]) {
  const categoryTools = tools.filter((t) => t.category === category);
  const urls = categoryTools.map((t) =>
    buildUrlEntry(`${SITE_URL}/${t.slug}`, getPriority(t.slug), "monthly", TODAY)
  );
  writeFileSync(join(PUBLIC_DIR, filename), buildSitemap(urls));
  sitemapEntries.push({ loc: `${SITE_URL}/${filename}`, lastmod: TODAY });

  const label = categories[category].label;
  console.log(`  ${label.padEnd(20)} → ${filename} (${categoryTools.length} URLs)`);
}

// 3. Sitemap index
writeFileSync(join(PUBLIC_DIR, "sitemap.xml"), buildSitemapIndex(sitemapEntries));

// Summary
const totalTools = tools.length;
console.log(`\n  Sitemap index    → sitemap.xml (${sitemapEntries.length} sitemaps)`);
console.log(`  Pages            → sitemap-pages.xml (3 URLs)`);
console.log(`  Total URLs       → ${totalTools + 3}`);
console.log(`  Last modified    → ${TODAY}`);
console.log(`\n  ✓ All sitemaps generated successfully!\n`);
