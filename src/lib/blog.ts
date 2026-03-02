export interface BlogFaq {
  question: string;
  answer: string;
}

export interface BlogSection {
  h2: string;
  body: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  relatedTool: { name: string; href: string };
  intro: string;
  sections: BlogSection[];
  faqs: BlogFaq[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "what-is-base64-encoding",
    title: "What Is Base64 Encoding and When to Use It",
    description:
      "Learn what Base64 encoding is, how it works, and when to use it in web development, APIs, and data storage.",
    date: "2026-03-02",
    category: "Developer Guides",
    relatedTool: { name: "Base64 Encoder / Decoder", href: "/base64-encoder" },
    intro:
      "Base64 is a binary-to-text encoding scheme that converts binary data into a string of ASCII characters. It is one of the most commonly used encoding methods in web development, showing up in everything from email attachments to JSON Web Tokens to embedding images directly in HTML. Understanding Base64 will help you work more effectively with APIs, authentication, and data transfer.",
    sections: [
      {
        h2: "How Base64 Encoding Works",
        body: "Base64 takes every 3 bytes of binary data and converts them into 4 ASCII characters. Each character represents 6 bits of data, chosen from an alphabet of 64 characters: A–Z, a–z, 0–9, +, and /. When the input length is not divisible by 3, padding characters (=) are added to the end to fill the 4-character group. The result is always about 33% larger than the original data — a trade-off for text compatibility. For example, the string \"Hello\" in binary becomes \"SGVsbG8=\" in Base64. The process is fully reversible: decoding converts the ASCII string back to the original binary data without any loss.",
      },
      {
        h2: "Common Use Cases for Base64",
        body: "Base64 is used in many places across modern web development. Email clients use it to encode binary attachments because email protocols were designed for plain text. JWT (JSON Web Tokens) encode their header and payload as Base64 URL-safe strings so they can be included in URLs and HTTP headers. CSS and HTML can embed small images as Base64 data URIs to reduce HTTP requests. APIs sometimes accept image uploads as Base64 strings in JSON body, and HTTP Basic Authentication encodes credentials as Base64 before sending them in the Authorization header. Data URIs in CSS background images are also common: background-image: url('data:image/png;base64,...').",
      },
      {
        h2: "Base64 vs Base64 URL-Safe",
        body: "Standard Base64 uses + and / characters, which have special meaning in URLs. Base64 URL-safe encoding replaces + with - and / with _ to make the output safe for use in URLs and filenames without percent-encoding. JWTs use Base64 URL-safe encoding, which is why the three parts of a JWT look like \"eyJ...\" — that is Base64 URL-safe encoded JSON. When working with tokens and URL parameters, always check which variant is expected. Most Base64 tools on the web support both variants.",
      },
      {
        h2: "When NOT to Use Base64",
        body: "Base64 is not a form of encryption or compression. It should never be used to secure sensitive data, because decoding is trivial. It adds 33% overhead to file size, so it is not ideal for large binary files like images or videos that should instead be served via CDN as separate assets. If you need to transfer binary data efficiently between two systems that both support binary, use binary directly. Base64 is best reserved for contexts where the protocol or format requires text-only data.",
      },
    ],
    faqs: [
      {
        question: "Is Base64 the same as encryption?",
        answer:
          "No. Base64 is encoding, not encryption. Anyone can decode a Base64 string instantly without a key. Use TLS for transport security and proper encryption algorithms (AES, RSA) for data security.",
      },
      {
        question: "Why does Base64 output end with = or ==?",
        answer:
          "Base64 works in groups of 3 bytes. If the input is not divisible by 3, padding characters (=) are added to complete the final group. One = means 1 byte was padded; == means 2 bytes were padded.",
      },
      {
        question: "Can Base64 encode any type of data?",
        answer:
          "Yes. Base64 can encode any binary data — images, PDFs, audio, video, or arbitrary bytes — into a plain text string. The decoder will reproduce the original binary exactly.",
      },
      {
        question: "What is the difference between Base64 and Base64 URL?",
        answer:
          "Standard Base64 uses + and / which are not URL-safe. Base64 URL replaces + with - and / with _ to make the output safe for URLs and HTTP headers without escaping. JWTs use Base64 URL encoding.",
      },
    ],
  },
  {
    slug: "how-to-decode-jwt-tokens",
    title: "How to Decode JWT Tokens Online (No Libraries Needed)",
    description:
      "Learn the structure of JWT tokens, how to decode them in the browser, and what each part means for authentication.",
    date: "2026-03-02",
    category: "Developer Guides",
    relatedTool: { name: "JWT Decoder", href: "/jwt-decoder" },
    intro:
      "JSON Web Tokens (JWTs) are the most popular format for stateless authentication in modern web applications. If you have ever inspected an Authorization header, a cookie, or a localStorage entry and seen a long string with two dots in it, you were looking at a JWT. Understanding how to read and decode JWTs is an essential skill for any developer working with REST APIs or OAuth systems.",
    sections: [
      {
        h2: "The Structure of a JWT",
        body: "A JWT consists of three parts separated by dots: Header.Payload.Signature. The header is a Base64 URL-encoded JSON object that specifies the token type and signing algorithm (e.g., {\"alg\":\"HS256\",\"typ\":\"JWT\"}). The payload is another Base64 URL-encoded JSON object containing claims — key-value pairs that describe the user and the token (e.g., sub for subject, exp for expiry, iat for issued-at). The signature is a cryptographic hash of the header and payload, used to verify the token has not been tampered with. Only a server with the secret key can verify the signature.",
      },
      {
        h2: "How to Decode a JWT Without Libraries",
        body: "Because the header and payload are simply Base64 URL-encoded, you can decode them with native browser APIs. In JavaScript: const [header, payload] = token.split('.'); const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/'))); This gives you the raw claims object. The signature cannot be verified on the client without the secret key — but you can still read all the claims to debug issues like expired tokens (check the exp field as a Unix timestamp) or missing permissions. Our JWT decoder tool does exactly this, displaying all claims in a human-readable format.",
      },
      {
        h2: "Common JWT Claims You Should Know",
        body: "The JWT specification defines several registered claim names. sub (subject) identifies the user, often as a user ID. iss (issuer) identifies which server issued the token. aud (audience) specifies who the token is intended for. exp (expiration time) is a Unix timestamp after which the token is invalid. iat (issued at) is when the token was created. nbf (not before) specifies the earliest time the token is valid. jti (JWT ID) is a unique identifier to prevent replay attacks. Custom claims for roles, permissions, and user metadata are also commonly added alongside these standard ones.",
      },
      {
        h2: "JWT Security Best Practices",
        body: "Never store JWTs in localStorage for sensitive applications — use HttpOnly cookies instead to prevent XSS attacks from stealing tokens. Always validate the signature server-side before trusting any claims. Set short expiry times (15 minutes for access tokens) and use refresh tokens to issue new ones. Use strong algorithms: RS256 or ES256 are preferred over HS256 for distributed systems because they use asymmetric keys. Never put sensitive data like passwords or credit card numbers in JWT payloads — the payload is only encoded, not encrypted, and anyone can read it.",
      },
    ],
    faqs: [
      {
        question: "Can I decode a JWT without the secret key?",
        answer:
          "You can decode and read the header and payload without the secret key — they are just Base64 URL encoded. However, you cannot verify the signature without the secret, so client-side decoding should only be used for debugging, never for security decisions.",
      },
      {
        question: "What does 'Token expired' mean in JWT?",
        answer:
          "The exp claim in the payload contains a Unix timestamp. If the current time is past that timestamp, the token is considered expired. You need to request a new token using a refresh token or by logging in again.",
      },
      {
        question: "Is it safe to paste my JWT into an online decoder?",
        answer:
          "If the token contains sensitive user data and is still valid, be careful. Our tool runs entirely in your browser — nothing is sent to any server. For production tokens, consider using browser DevTools console instead of any online tool.",
      },
      {
        question: "What is the difference between HS256 and RS256?",
        answer:
          "HS256 uses a single shared secret key for both signing and verification. RS256 uses a public/private key pair — the server signs with the private key and anyone can verify with the public key. RS256 is better for distributed systems where multiple services need to verify tokens.",
      },
    ],
  },
  {
    slug: "json-formatting-guide",
    title: "JSON Formatting Guide: Validate, Format, and Minify",
    description:
      "Complete guide to working with JSON: how to format, validate, and minify JSON data for APIs, config files, and development.",
    date: "2026-03-02",
    category: "Developer Guides",
    relatedTool: { name: "JSON Formatter & Validator", href: "/json-formatter" },
    intro:
      "JSON (JavaScript Object Notation) is the universal language of web APIs and configuration files. Whether you are debugging an API response, writing a config file, or preparing data for a database, knowing how to format and validate JSON correctly will save you hours of frustration. This guide covers everything from JSON syntax rules to practical formatting strategies.",
    sections: [
      {
        h2: "JSON Syntax Rules You Must Know",
        body: "JSON has strict syntax rules that are unforgiving of mistakes. Keys must be double-quoted strings — single quotes are not valid JSON. Values can be strings (double-quoted), numbers, booleans (true/false, lowercase), null, arrays, or objects. Trailing commas after the last item in an array or object are not allowed, even though JavaScript allows them. Comments are not part of the JSON spec, so // and /* */ comments will cause parse errors. Unicode characters are supported in strings, but control characters like newlines must be escaped as \\n. Understanding these rules will help you diagnose parse errors quickly.",
      },
      {
        h2: "How to Format JSON for Readability",
        body: "Formatting JSON means adding consistent indentation and line breaks to make the structure visible. The standard is 2-space or 4-space indentation. In JavaScript, JSON.stringify(data, null, 2) formats with 2 spaces. In Python, json.dumps(data, indent=2) does the same. In command line environments, cat file.json | python3 -m json.tool or echo 'json' | jq '.' are common approaches. Most code editors have built-in JSON formatting shortcuts — in VS Code, Shift+Alt+F (Windows) or Shift+Option+F (Mac) formats the current document. For quick online formatting without installing anything, paste your JSON into our formatter above.",
      },
      {
        h2: "Minifying JSON for Production",
        body: "Minifying JSON removes all whitespace (spaces, tabs, newlines) that is not part of string values. This reduces file size — a formatted JSON file can be 30-50% larger than its minified version. Minification matters for API responses that are sent on every request, especially on mobile networks. In JavaScript, JSON.stringify(data) without the third argument produces minified output. For large datasets, the size difference can be significant: a 10KB formatted config file might be 6KB minified. Our tool minifies JSON instantly — just click Minify after pasting your data.",
      },
      {
        h2: "Debugging JSON Parse Errors",
        body: "The most common JSON errors are: trailing commas (\"value\",}), single-quoted strings ('key' instead of \"key\"), unescaped special characters in strings (a raw newline inside a string), and missing quotes around keys ({key: \"value\"} instead of {\"key\": \"value\"}). When JSON.parse() throws a SyntaxError, the message often includes the position of the error — use that line and column number to navigate to the problem. If the error position points to valid-looking JSON, check the character immediately before it. Our validator highlights the exact error position to speed up debugging.",
      },
    ],
    faqs: [
      {
        question: "What is the difference between JSON and JavaScript objects?",
        answer:
          "JSON is a text format based on JavaScript object syntax, but stricter. JSON requires double-quoted keys, does not allow trailing commas, has no comments, and only supports a subset of JavaScript values. A JavaScript object is a runtime data structure that can have methods, Symbol keys, and undefined values.",
      },
      {
        question: "Can JSON have comments?",
        answer:
          "No, standard JSON does not support comments. This is a common frustration with config files. Some tools use JSONC (JSON with Comments) or JSON5 as extensions that allow comments, but these are not valid JSON and cannot be parsed with standard JSON.parse().",
      },
      {
        question: "Why is my JSON valid in the browser but fails on the server?",
        answer:
          "Likely causes: different parsers handle edge cases differently, BOM (byte order mark) at the start of the file, encoding mismatches, or invisible Unicode characters. Copy the raw text, paste it into a validator like our tool, and look for non-printable characters.",
      },
      {
        question: "What is the maximum size of a JSON file?",
        answer:
          "There is no official limit in the JSON spec, but parsers have practical limits based on available memory. Most browser JSON.parse() implementations handle files up to hundreds of megabytes, but processing very large files should use streaming parsers instead of loading the entire file into memory.",
      },
    ],
  },
  {
    slug: "url-encoding-explained",
    title: "URL Encoding Explained: %20, %2F, and Everything In Between",
    description:
      "Understand URL encoding (percent encoding): why spaces become %20, which characters need encoding, and how to encode/decode URLs correctly.",
    date: "2026-03-02",
    category: "Developer Guides",
    relatedTool: { name: "URL Encoder / Decoder", href: "/url-encoder" },
    intro:
      "If you have ever seen %20 in a URL where a space should be, or %3A instead of a colon, you have encountered URL encoding (also called percent encoding). URLs can only contain a limited set of ASCII characters, so any character outside that set — including spaces, non-ASCII characters, and many punctuation marks — must be encoded. Understanding URL encoding is essential for building web applications, working with APIs, and debugging network requests.",
    sections: [
      {
        h2: "Why URLs Need Encoding",
        body: "The URI specification (RFC 3986) defines a strict set of allowed characters in URLs: letters (A-Z, a-z), digits (0-9), and a handful of special characters (- _ . ! ~ * ' ( )). Characters like spaces, ampersands, equals signs, question marks, and forward slashes have special meaning in URL structure. If you put an unencoded & in a query parameter value, the browser will interpret it as a separator between two parameters instead of part of the value. Encoding ensures that data passed in URLs is interpreted correctly regardless of its content.",
      },
      {
        h2: "How Percent Encoding Works",
        body: "Percent encoding replaces each unsafe byte with a % followed by two hexadecimal digits representing the byte value. A space (ASCII 32 = 0x20) becomes %20. A forward slash (ASCII 47 = 0x2F) becomes %2F. An at sign (ASCII 64 = 0x40) becomes %40. For non-ASCII characters like é or 中, the character is first converted to UTF-8 bytes, then each byte is percent encoded. So é (U+00E9) becomes the UTF-8 bytes 0xC3 0xA9, which encodes to %C3%A9. This is why international domain names and non-ASCII query parameters look like long sequences of percent-encoded bytes.",
      },
      {
        h2: "encodeURI vs encodeURIComponent",
        body: "JavaScript provides two built-in functions for URL encoding. encodeURI() encodes a complete URL and preserves characters that have structural meaning in URLs: : / ? # [ ] @ ! $ & ' ( ) * + , ; =. Use this when encoding a full URL. encodeURIComponent() encodes a single value that will be placed inside a URL component (like a query parameter value) and also encodes : / ? # [ ] @ ! $ & ' ( ) * + , ; =. Use this when encoding a value that should be treated as data, not as URL structure. The difference matters: encoding a URL with encodeURIComponent would break it by encoding the slashes.",
      },
      {
        h2: "Common Encoding Mistakes and How to Fix Them",
        body: "Double-encoding is a frequent bug: encoding an already-encoded string turns %20 into %2520 (encoding the % as %25). Always decode first, then re-encode if needed. Another issue is encoding entire URLs when only parameter values should be encoded — this breaks the URL structure. Query strings built by concatenating strings should use encodeURIComponent() on each value, or use URLSearchParams which handles encoding automatically: new URLSearchParams({q: 'hello world'}).toString() produces q=hello+world. Note that URLSearchParams uses + for spaces in query strings, while encodeURIComponent uses %20.",
      },
    ],
    faqs: [
      {
        question: "What is the difference between %20 and + for spaces?",
        answer:
          "Both represent a space in URLs, but in different contexts. %20 is the standard percent encoding of a space and works everywhere. + as a space only works in query strings (the application/x-www-form-urlencoded format). In path segments, + is a literal plus sign, not a space.",
      },
      {
        question: "Do I need to encode URLs before storing them in a database?",
        answer:
          "Store URLs in their decoded form in the database for readability and searchability. Encode them when building href attributes in HTML or when constructing API request URLs. This avoids double-encoding issues.",
      },
      {
        question: "Why does my URL look different after pasting into a browser?",
        answer:
          "Modern browsers automatically encode non-ASCII characters and spaces in the address bar. When you paste a URL with spaces, the browser converts them to %20 before sending the request. This is normal behavior.",
      },
      {
        question: "Are URL encoding and HTML encoding the same?",
        answer:
          "No. URL encoding uses % notation (%20 for space). HTML encoding uses & notation (&amp; for &, &lt; for <). Both are needed in web development but in different contexts: URL encoding for URL components, HTML encoding for text inside HTML documents.",
      },
    ],
  },
  {
    slug: "regex-cheat-sheet-2026",
    title: "Regular Expressions Cheat Sheet 2026",
    description:
      "Complete regex cheat sheet with syntax reference, examples, and tips for JavaScript, Python, and other languages.",
    date: "2026-03-02",
    category: "Developer Guides",
    relatedTool: { name: "Regex Tester", href: "/regex-tester" },
    intro:
      "Regular expressions (regex) are one of the most powerful tools in a developer's toolkit — and one of the most feared. Once you understand the syntax, regex can replace dozens of lines of string-parsing code with a single compact pattern. This cheat sheet covers the essential regex syntax you will use most often, with practical examples for JavaScript and Python.",
    sections: [
      {
        h2: "Character Classes and Quantifiers",
        body: "Character classes match a set of characters. \\d matches any digit (0-9). \\w matches word characters (a-z, A-Z, 0-9, underscore). \\s matches whitespace (space, tab, newline). The dot . matches any character except newline. Uppercase versions are negations: \\D matches non-digits, \\W matches non-word characters, \\S matches non-whitespace. Square brackets define custom classes: [aeiou] matches any vowel, [0-9a-f] matches hex digits, [^abc] matches anything except a, b, or c. Quantifiers control repetition: * means zero or more, + means one or more, ? means zero or one, {3} means exactly 3, {2,5} means 2 to 5. By default quantifiers are greedy (match as much as possible) — add ? to make them lazy: .+? matches the minimum possible.",
      },
      {
        h2: "Anchors, Groups, and Alternation",
        body: "Anchors match positions rather than characters. ^ matches the start of a string (or start of a line in multiline mode). $ matches the end of a string. \\b matches a word boundary — the position between a word character and a non-word character. Parentheses create capturing groups: (\\d{4}) captures a 4-digit year. Use (?:...) for non-capturing groups when you need grouping without capture. Backreferences \\1, \\2 refer to what was captured by groups 1 and 2. Named groups (?<year>\\d{4}) give descriptive names accessible as match.groups.year. The pipe | is alternation (OR): cat|dog matches either 'cat' or 'dog'. Lookaheads and lookbehinds are zero-width assertions: (?=...) positive lookahead, (?!...) negative lookahead.",
      },
      {
        h2: "Practical Regex Patterns",
        body: "Email (simple): /^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}$/ — validates basic email format. URL: /https?:\\/\\/[\\w.-]+(?:\\.[\\w.-]+)+[\\w.\\-_~:/?#[\\]@!$&'()*+,;=]*/ — matches http and https URLs. Date (YYYY-MM-DD): /^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$/ — validates ISO date format. IP address: /^(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$/ — validates IPv4 addresses. Hex color: /^#(?:[0-9a-fA-F]{3}){1,2}$/ — matches 3 or 6 character hex colors. Phone (US): /^\\+?1?[-. ]?\\(?\\d{3}\\)?[-. ]?\\d{3}[-. ]?\\d{4}$/ — flexible US phone format.",
      },
      {
        h2: "Regex Flags and Language Differences",
        body: "Regex flags modify matching behavior. i makes matching case-insensitive. g enables global search to find all matches instead of just the first. m makes ^ and $ match start/end of each line rather than the whole string. s (dotall) makes . match newlines too. Most languages support these flags. JavaScript regex has a few quirks: the y (sticky) flag only matches at the current lastIndex position, and the u flag enables full Unicode support including emoji and non-BMP characters. Python uses re.IGNORECASE, re.MULTILINE, re.DOTALL flags. In Python, raw strings r'pattern' are recommended to avoid double-escaping backslashes. Our regex tester supports JavaScript regex syntax with real-time match highlighting.",
      },
    ],
    faqs: [
      {
        question: "How do I match a literal dot in regex?",
        answer:
          "Escape it with a backslash: \\. matches a literal period. Without the backslash, . matches any character except newline. This is a very common regex mistake.",
      },
      {
        question: "What does greedy vs lazy mean in regex?",
        answer:
          "Greedy quantifiers (*, +, {n,m}) match as much as possible. Lazy quantifiers (*?, +?, {n,m}?) match as little as possible. For example, /<.+>/ on '<b>text</b>' matches the whole string, while /<.+?>/ matches just '<b>'.",
      },
      {
        question: "Why does my regex work in one language but not another?",
        answer:
          "Regex syntax varies between languages. Python uses re module syntax, JavaScript has built-in regex literals, and .NET has its own extensions. Common differences: lookahead/lookbehind support, named groups syntax, and which characters need escaping. Always test in the target language.",
      },
      {
        question: "What is catastrophic backtracking?",
        answer:
          "Some regex patterns cause exponential backtracking when they fail to match, making the regex engine hang for seconds or minutes. This often happens with nested quantifiers like (a+)+. Use atomic groups or possessive quantifiers to prevent it, and always test regex patterns against adversarial inputs.",
      },
    ],
  },
  {
    slug: "password-hashing-bcrypt",
    title: "Password Hashing with Bcrypt: A Developer Guide",
    description:
      "Learn how bcrypt password hashing works, why it is the industry standard, and how to implement it correctly in your applications.",
    date: "2026-03-02",
    category: "Security",
    relatedTool: { name: "Bcrypt Generator", href: "/bcrypt-generator" },
    intro:
      "Storing passwords is one of the most security-critical tasks in web development. Storing them in plaintext is catastrophic, simple MD5 or SHA hashing is almost as bad, and even SHA-256 without a salt is vulnerable. Bcrypt was designed specifically for password hashing and has been the industry standard for over 25 years. This guide explains how bcrypt works and how to use it correctly.",
    sections: [
      {
        h2: "Why Regular Hash Functions Are Not Enough",
        body: "Cryptographic hash functions like MD5, SHA-1, and SHA-256 are designed to be fast. This is a problem for password storage: an attacker with a GPU can compute billions of SHA-256 hashes per second, making brute-force and dictionary attacks feasible for weak passwords. Even with a salt (random data added before hashing), fast algorithms only add a constant-time delay. Bcrypt was designed to be slow by design — it performs many iterations of the Blowfish cipher, making each hash computation take tens of milliseconds instead of microseconds. This 1000× speed difference means an attacker trying 1 billion passwords per second with SHA-256 can only try 1 million per second with bcrypt.",
      },
      {
        h2: "How Bcrypt Works",
        body: "Bcrypt takes a password, a random 128-bit salt, and a cost factor (also called work factor or rounds). The cost factor is an exponent: cost 10 means 2^10 = 1024 iterations, cost 12 means 2^12 = 4096 iterations. Each increase in cost factor roughly doubles the computation time. The output is a 60-character string that includes the algorithm version ($2b$), the cost factor (10), and the salt and hash concatenated (53 characters). Because the salt is embedded in the output, you do not need to store it separately — just store the full bcrypt string and pass it to the verify function along with the user's input. The verify function extracts the salt and cost factor from the stored hash and recomputes it to check for a match.",
      },
      {
        h2: "Choosing the Right Cost Factor",
        body: "The recommended cost factor in 2026 is 12, which takes approximately 250ms per hash on a modern server. Cost 10 (around 60ms) is still acceptable for high-traffic applications where authentication latency matters. OWASP recommends choosing a cost factor so that hashing takes at least 1 second on your server hardware — this prevents brute-force attacks even if the database is compromised. You can and should increase the cost factor over time as hardware gets faster. Because bcrypt stores the cost factor in the hash, you can re-hash passwords at login with a higher cost factor transparently to users.",
      },
      {
        h2: "Bcrypt Limitations and Alternatives",
        body: "Bcrypt has a 72-byte input limit — passwords longer than 72 characters are silently truncated. If you need to support passphrases, consider pre-hashing the password with SHA-256 before passing it to bcrypt, but be careful about how you encode the output. Modern alternatives include Argon2 (winner of the Password Hashing Competition in 2015), which uses memory-hard computation to resist GPU attacks even better. scrypt is another memory-hard option used by many systems. For new applications, Argon2id is recommended over bcrypt by OWASP, but bcrypt with cost 12+ is still considered secure for most use cases.",
      },
    ],
    faqs: [
      {
        question: "What bcrypt cost factor should I use?",
        answer:
          "Start with cost 12 in 2026. Test on your production hardware and aim for 250ms–1000ms per hash. Higher is more secure but slower. You can increase it over time — existing hashes remain valid and new hashes use the new cost.",
      },
      {
        question: "Can I use bcrypt for API tokens or session IDs?",
        answer:
          "No. Bcrypt is designed for passwords (short human-memorable strings). For API tokens or session IDs, use SHA-256 with HMAC or store them with random salt in a fast lookup table. Bcrypt's slowness is only needed for human passwords.",
      },
      {
        question: "Does bcrypt need a separate salt column in the database?",
        answer:
          "No. The bcrypt output string contains everything needed for verification: algorithm, cost, salt, and hash. Just store the single bcrypt string (60 characters) and pass it to your bcrypt verify function.",
      },
      {
        question: "Is bcrypt secure against GPU attacks?",
        answer:
          "Bcrypt is more resistant to GPU attacks than SHA-based hashes because it uses sequential memory access patterns. However, Argon2id is considered more resistant to GPU and ASIC attacks due to its memory-hard design. Both are secure in practice for most applications.",
      },
    ],
  },
  {
    slug: "markdown-to-html-guide",
    title: "Markdown to HTML: Complete Conversion Guide",
    description:
      "Learn how Markdown converts to HTML, what each element maps to, and how to use Markdown effectively in documentation and web content.",
    date: "2026-03-02",
    category: "Developer Guides",
    relatedTool: { name: "Markdown to HTML Converter", href: "/markdown-to-html" },
    intro:
      "Markdown is a lightweight markup language designed by John Gruber in 2004 to let you write content in plain text that is readable as-is but also converts cleanly to HTML. It is now the standard format for README files, documentation, blog posts, and comments across GitHub, Stack Overflow, Reddit, and hundreds of other platforms. Understanding how Markdown maps to HTML will make you a more effective technical writer.",
    sections: [
      {
        h2: "Core Markdown Syntax and HTML Equivalents",
        body: "Every Markdown element maps to a specific HTML tag. Headings use pound signs: # H1 becomes <h1>, ## H2 becomes <h2>, up to ###### H6. Bold text uses **text** or __text__ → <strong>. Italic uses *text* or _text_ → <em>. Inline code uses `code` → <code>. Code blocks use triple backticks ``` → <pre><code>. Paragraphs are separated by blank lines and become <p> tags. Horizontal rules use ---, ***, or ___ → <hr>. Blockquotes use > prefix → <blockquote>. Links use [text](url) → <a href='url'>text</a>. Images use ![alt](src) → <img alt='alt' src='src'>. Unordered lists use - or * → <ul><li>. Ordered lists use 1. 2. → <ol><li>.",
      },
      {
        h2: "Extended Markdown: Tables, Task Lists, and More",
        body: "Standard Markdown (CommonMark) covers the basics, but most platforms support GitHub Flavored Markdown (GFM) with additional features. Tables use pipe characters: | Header | Header | with --- rows for separation → <table><thead><tr><th>. Task lists use - [ ] for unchecked and - [x] for checked items → <ul> with checkbox inputs. Strikethrough uses ~~text~~ → <del>. Footnotes use [^1] references and [^1]: definition format. Syntax highlighting in code blocks uses ``` language to specify the language. Autolinked URLs and email addresses are converted to links without brackets. These extensions are not part of the CommonMark spec but are supported by GitHub, GitLab, and most Markdown processors.",
      },
      {
        h2: "When to Use Markdown vs HTML",
        body: "Markdown is ideal when you want to write content that is readable in its raw form: documentation, READMEs, blog posts, comments. It is faster to type than HTML and easier to review in version control diffs. Use raw HTML inside Markdown when you need elements that Markdown does not support: <details> for collapsible sections, <kbd> for keyboard shortcuts, <mark> for highlights, <sub> and <sup> for subscript and superscript, or <div> with classes for custom styling. Most Markdown processors allow inline HTML, and it passes through to the output unchanged. Our converter handles both Markdown syntax and inline HTML in the same document.",
      },
      {
        h2: "Sanitizing Markdown HTML for User Input",
        body: "If you accept Markdown from users and render it as HTML, you must sanitize the output to prevent XSS attacks. Raw HTML in Markdown (like <script> or <iframe>) is a security risk. Use a library like DOMPurify on the client side or sanitize-html on the server to strip dangerous elements and attributes after conversion. Configure it to allow safe tags (p, h1-h6, a, strong, em, code, pre, ul, ol, li, blockquote) while removing script, style, iframe, and on* event handlers. Never render user-provided Markdown without sanitization in production applications.",
      },
    ],
    faqs: [
      {
        question: "What is the difference between CommonMark and GitHub Flavored Markdown?",
        answer:
          "CommonMark is a strict, unambiguous specification of standard Markdown. GitHub Flavored Markdown (GFM) is a superset that adds tables, task lists, strikethrough, and autolinks. Most platforms support GFM or a similar extension of CommonMark.",
      },
      {
        question: "Can I use HTML inside Markdown?",
        answer:
          "Yes, most Markdown processors allow inline HTML. HTML tags pass through to the output unchanged. This is useful for elements that Markdown does not support natively, like <details>, <sub>, <sup>, or <mark>.",
      },
      {
        question: "Why does my Markdown look different on different platforms?",
        answer:
          "Markdown has many dialects (CommonMark, GFM, MultiMarkdown, Pandoc). Each platform uses a different parser with slightly different rules for edge cases. For maximum compatibility, stick to standard CommonMark syntax.",
      },
      {
        question: "How do I add a line break inside a paragraph in Markdown?",
        answer:
          "End a line with two spaces before pressing Enter, or use a backslash \\ at the end of the line (GFM). A blank line creates a new paragraph. Without the trailing spaces or backslash, a single newline is treated as a space by most parsers.",
      },
    ],
  },
  {
    slug: "color-formats-hex-rgb-hsl",
    title: "Color Formats Explained: HEX, RGB, HSL, and When to Use Each",
    description:
      "Understand HEX, RGB, HSL, and other CSS color formats — learn what each means, how to convert between them, and which to use in your projects.",
    date: "2026-03-02",
    category: "Design",
    relatedTool: { name: "Color Converter", href: "/color-converter" },
    intro:
      "CSS supports over a dozen color formats, but HEX, RGB, and HSL are the three you will use in practically every project. Each format has strengths that make it the right choice for different situations. Understanding how colors are represented in code will make you a better designer and developer, and help you work more effectively with design systems and color palettes.",
    sections: [
      {
        h2: "HEX Colors: The Web Standard",
        body: "HEX (hexadecimal) colors are the most common format on the web. A HEX color like #FF5733 consists of three pairs of hexadecimal digits: FF for red (255), 57 for green (87), and 33 for blue (51). Values range from 00 (0) to FF (255). Shorthand HEX uses 3 digits where each is doubled: #F53 is equivalent to #FF5533. An optional 4th pair (or 4th digit in shorthand) adds an alpha channel for opacity: #FF5733CC has 80% opacity (CC = 204/255 ≈ 0.8). HEX is compact, widely supported, and easy to copy from design tools like Figma. Its main downside is that it is not intuitive — it is hard to guess what #8B6914 looks like without a color picker.",
      },
      {
        h2: "RGB and RGBA: Explicit Channel Values",
        body: "RGB (Red, Green, Blue) expresses color as three values from 0 to 255: rgb(255, 87, 51). It maps directly to how monitors produce light — each color channel corresponds to an LED intensity. RGBA adds an alpha channel from 0 (transparent) to 1 (opaque): rgba(255, 87, 51, 0.8) for 80% opacity. Modern CSS also supports the space-separated syntax: rgb(255 87 51) and rgb(255 87 51 / 0.8). RGB is useful when you need to adjust individual channels programmatically or work with values from APIs that return RGB data. It is more readable than HEX when you want to understand the channel balance — rgb(255, 0, 0) is obviously pure red.",
      },
      {
        h2: "HSL: The Most Intuitive Format",
        body: "HSL (Hue, Saturation, Lightness) is the most human-friendly color format. Hue is a degree on the color wheel from 0 to 360 (0=red, 120=green, 240=blue). Saturation is a percentage from 0% (grayscale) to 100% (full color). Lightness is a percentage from 0% (black) to 100% (white), with 50% being the pure color. hsl(11, 100%, 60%) is the orange-red of #FF5733. HSL makes it easy to create variations: adjust only lightness to go from dark to light, adjust saturation to go from muted to vivid. Design systems use HSL extensively because changing the lightness of a hue gives you the complete tonal scale for a color palette. HSLA adds opacity: hsla(11, 100%, 60%, 0.8).",
      },
      {
        h2: "OKLCH: The Modern Color Space for Design Systems",
        body: "OKLCH (Lightness, Chroma, Hue in the Oklab color space) is a newer CSS color format that is gaining adoption in 2025-2026. Unlike HSL, OKLCH is perceptually uniform — equal steps in lightness or chroma produce visually equal steps in any color, making it ideal for generating accessible color scales algorithmically. All modern browsers support oklch(): oklch(0.63 0.21 29) represents a similar orange to #FF5733. Tailwind CSS v4 and many modern design tokens now use OKLCH as the primary color format. If you are building a new design system in 2026, OKLCH is worth considering for its superior perceptual accuracy over HEX and HSL.",
      },
    ],
    faqs: [
      {
        question: "Which color format should I use in CSS?",
        answer:
          "Use HEX for static colors from design specs. Use HSL when you need to programmatically generate or adjust colors (tints, shades, palettes). Use RGBA when you need opacity without setting a background color. For new design systems, consider OKLCH for perceptually uniform scales.",
      },
      {
        question: "How do I convert HEX to RGB?",
        answer:
          "Split the HEX into pairs and convert each from base-16 to base-10. #FF5733: FF=255, 57=87, 33=51 → rgb(255, 87, 51). Our color converter tool does this instantly for any format.",
      },
      {
        question: "What does the alpha channel do?",
        answer:
          "Alpha controls opacity from 0 (fully transparent) to 1 in CSS (or 0-255 in HEX 8-digit format). An alpha of 0.5 makes the color 50% transparent, letting the background show through. This is different from the CSS opacity property which affects the entire element and its children.",
      },
      {
        question: "Why do colors look different on different screens?",
        answer:
          "Different displays have different color gamuts (the range of colors they can reproduce) and may be calibrated differently. sRGB is the standard color space for the web, but wide-gamut displays (P3) can show more vivid colors. The CSS color-gamut media query and P3 color values let you target wide-gamut displays specifically.",
      },
    ],
  },
  {
    slug: "qr-code-guide",
    title: "QR Code Guide: How They Work and How to Generate Them",
    description:
      "Learn how QR codes work, what data they store, how error correction keeps them readable, and how to generate them programmatically for any use case.",
    date: "2026-03-02",
    category: "Developer Guides",
    relatedTool: { name: "QR Code Generator", href: "/qr-code-generator" },
    intro:
      "QR codes (Quick Response codes) are two-dimensional barcodes that can encode text, URLs, contact cards, Wi-Fi credentials, and more. First developed by Denso Wave in 1994 for tracking automotive parts, they have become ubiquitous in marketing, payments, authentication, and logistics. Unlike a traditional barcode that stores data in one horizontal dimension, a QR code uses a grid of black and white squares in two dimensions, allowing far more data in a smaller space. Understanding how QR codes work — and how to generate them correctly — is increasingly important for web and mobile developers who need to bridge the physical and digital worlds. This guide covers the internal structure of a QR code, error correction levels, encoding modes, and the practical considerations for generating high-quality codes in your applications.",
    sections: [
      {
        h2: "How QR Codes Store Data",
        body: "A QR code is a matrix of black and white modules (squares) arranged on a grid. The version of a QR code determines its size: Version 1 is 21x21 modules, and each higher version adds 4 modules per side, up to Version 40 at 177x177. The actual data is encoded in one of four modes depending on the content: Numeric mode (digits only, most compact at 3.33 bits per character), Alphanumeric mode (digits, uppercase letters, and nine symbols — 5.5 bits per character), Byte mode (any 8-bit data including UTF-8, at 8 bits per character), and Kanji mode (for Japanese characters). For URLs and most text, Byte mode is used. Beyond the data itself, every QR code contains finder patterns (the three large squares in three corners) that allow the scanner to detect orientation and size, timing patterns for calibration, alignment patterns (in Version 2 and above) to correct for distortion, and format information about error correction and masking.",
      },
      {
        h2: "Error Correction and Why It Matters",
        body: "One of the most powerful features of QR codes is built-in error correction using Reed-Solomon encoding. This allows a QR code to remain scannable even when part of it is damaged, obscured, or printed over with a logo. There are four error correction levels: L (Low) restores up to 7% damaged data, M (Medium) restores up to 15%, Q (Quartile) restores up to 25%, and H (High) restores up to 30%. Higher correction levels require more modules for the redundancy data, which means the code must be larger to encode the same payload. For a clean, high-contrast print, Level M is usually sufficient. If you plan to overlay a logo on the QR code, use Level H so the code remains scannable after the logo occupies some of the data area. The Reed-Solomon algorithm distributes the redundancy across the entire code, so damage must exceed the threshold before scanning fails.",
      },
      {
        h2: "Generating QR Codes Programmatically",
        body: "In JavaScript, the most popular library is qrcode (npm install qrcode), which generates QR codes as PNG images, SVG strings, or canvas elements. A simple usage is QRCode.toDataURL('https://example.com', { errorCorrectionLevel: 'H', width: 300 }) to get a base64 PNG data URL suitable for an img src. For Node.js server-side generation, QRCode.toFile('qr.png', 'https://example.com') writes directly to disk. In Python, the qrcode library provides similar functionality: qr = qrcode.make('https://example.com'); qr.save('qr.png'). For React applications, react-qr-code renders a QR code as an inline SVG with no canvas dependency. When specifying size, always use a minimum of 200x200 pixels for reliable scanning on mobile devices. Set a quiet zone (white margin) of at least 4 modules around the code — scanners need this blank border to detect the code edges.",
      },
      {
        h2: "QR Code Design and Scanning Best Practices",
        body: "Color and contrast are critical for reliable scanning. The dark modules should be significantly darker than the light modules — a contrast ratio of at least 4:1 is recommended. Avoid reversing the colors (dark background with light modules) as many older scanners cannot handle inverted QR codes. If using custom colors for brand purposes, always test the code with multiple devices and scanner apps before deploying. For dynamic QR codes used in marketing, point the QR code to a redirect URL that you control so you can update the destination without reprinting. Keep the payload as short as possible: a shorter URL produces a simpler, lower-version QR code that prints smaller and scans more reliably. Avoid encoding full long URLs when a short redirect will do. Always generate a test batch at the intended print size and scan with both iOS and Android before finalizing production materials.",
      },
    ],
    faqs: [
      {
        question: "What is the maximum amount of data a QR code can store?",
        answer:
          "A Version 40 QR code at error correction level L can store up to 7,089 numeric characters, 4,296 alphanumeric characters, or 2,953 bytes of binary data. In practice, keep payloads short — simpler codes scan faster and more reliably across all devices and lighting conditions.",
      },
      {
        question: "What error correction level should I use?",
        answer:
          "Use Level M for most applications — it corrects up to 15% damage and produces a reasonable-sized code. Use Level H if you plan to overlay a logo on the code. Use Level L only when the code will be printed at a very small size and you need to fit as much data as possible.",
      },
      {
        question: "Can a QR code expire?",
        answer:
          "The QR code image itself does not expire — it is just a pattern of squares. However, the URL it encodes can expire (redirect service disabled, domain expired, page deleted). Dynamic QR codes use a redirect URL that you control so you can change or expire the destination independently of the printed code.",
      },
      {
        question: "Why does my QR code not scan?",
        answer:
          "Common causes: insufficient contrast between modules and background, missing quiet zone margin, code printed too small (minimum ~2cm for most scanners), damage or smearing exceeding the error correction capacity, or inverted colors. Test at the exact print size with multiple devices before publishing.",
      },
    ],
  },
  {
    slug: "css-grid-vs-flexbox",
    title: "CSS Grid vs Flexbox: When to Use Each",
    description:
      "Understand the difference between CSS Grid and Flexbox, when each layout model excels, and how to combine them for modern responsive web design.",
    date: "2026-03-02",
    category: "Design",
    relatedTool: { name: "Flexbox Generator", href: "/flexbox-generator" },
    intro:
      "CSS Grid and Flexbox are the two foundational layout models in modern CSS, and understanding when to use each is one of the most important skills a front-end developer can have. Both solve layout problems that were previously hacked together with floats, tables, and absolute positioning — but they solve different problems. Flexbox is a one-dimensional layout model designed to distribute space along a single axis. Grid is a two-dimensional layout model designed to place items on rows and columns simultaneously. They are not competing tools but complementary ones, and many real-world components use both at the same time — Grid for the page-level structure and Flexbox for the item-level alignment inside each cell. This guide explains the mental model behind each, the use cases where each excels, and how to combine them effectively.",
    sections: [
      {
        h2: "The Flexbox Mental Model",
        body: "Flexbox operates along one axis at a time — either a row (horizontal) or a column (vertical). You set display: flex on a container, then the direct children become flex items. The flex-direction property sets the main axis: row (default) or column. Items flow along the main axis and are aligned on the cross axis. The key properties are justify-content (alignment along the main axis — space-between, center, flex-start, etc.), align-items (alignment along the cross axis — stretch, center, flex-start), and gap (spacing between items). Individual items use flex-grow, flex-shrink, and flex-basis to control how they expand and contract relative to available space. The shorthand flex: 1 makes an item grow to fill available space. Flexbox shines for components whose size is determined by their content: navigation bars, button groups, card footers, form rows, and any component where you want items to line up along one axis and the spacing to adapt automatically.",
      },
      {
        h2: "The CSS Grid Mental Model",
        body: "Grid operates in two dimensions simultaneously — rows and columns. You set display: grid on a container, then define the track structure with grid-template-columns and grid-template-rows. The repeat() function and the fr unit (fractional unit) are grid-specific: grid-template-columns: repeat(3, 1fr) creates three equal columns that share available space. grid-template-columns: 200px 1fr auto creates a fixed sidebar, a flexible main area, and a content-sized third column. Children can span multiple cells using grid-column: 1 / 3 or grid-column: span 2. Named grid areas with grid-template-areas give layouts a readable, visual structure directly in CSS. Grid is the right tool for page-level structure: the overall application shell with header, sidebar, main content, and footer; image galleries; dashboard card grids; and any layout where you need explicit control over both row and column placement.",
      },
      {
        h2: "Side-by-Side Comparison: When to Use Which",
        body: "Use Flexbox when the layout is one-dimensional and driven by content size — you want items to wrap naturally, shrink and grow fluidly, or you are aligning a small number of elements in a line. Navigation menus, tag lists, button toolbars, and form fields are classic Flexbox use cases. Use Grid when the layout is two-dimensional and driven by a defined structure — you know the column count upfront, you need items to align across both axes, or you want gaps and tracks to be consistent regardless of item content. Page shells, card grids, and data tables are classic Grid use cases. The practical rule: if you are thinking about columns AND rows at the same time, use Grid. If you are thinking about a row OR a column, use Flexbox. Many real components combine both: a Grid defines the card layout, and inside each card a Flex container handles the icon, title, and description alignment.",
      },
      {
        h2: "Common Patterns and Code Examples",
        body: "A responsive card grid in CSS Grid: display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem. This single rule creates as many 280px-minimum columns as fit, with no media queries. A centered hero section in Flexbox: display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh. A sticky sidebar layout in Grid: display: grid; grid-template-columns: 240px 1fr; grid-template-rows: auto 1fr auto; with the sidebar spanning all rows using grid-row: 1 / -1. Nesting works naturally — any Grid cell or Flex item can itself be a Grid or Flex container. There is no performance penalty for nesting. Modern browsers support both models fully, so choose based on which model matches your layout requirements, not on compatibility concerns.",
      },
    ],
    faqs: [
      {
        question: "Should I use Grid or Flexbox for a navigation bar?",
        answer:
          "Flexbox is usually the better choice for navigation bars. A nav bar is a single row of items where you want flexible spacing (space-between for logo and links, or gap between items). Flexbox handles this naturally. Use Grid only if the nav has complex multi-column or multi-row structure.",
      },
      {
        question: "Can I use Grid and Flexbox together?",
        answer:
          "Absolutely — this is the recommended approach. Use Grid for the top-level page structure and Flexbox inside individual Grid cells for aligning their content. There is no performance penalty for nesting, and combining both gives you the right tool for each level of the layout hierarchy.",
      },
      {
        question: "What is the fr unit in CSS Grid?",
        answer:
          "The fr (fractional) unit represents a fraction of the available space in the grid container after fixed and auto tracks are allocated. grid-template-columns: 1fr 2fr creates two columns where the second is twice as wide as the first. It is similar to flex-grow in Flexbox but applied to tracks, not items.",
      },
      {
        question: "Is Flexbox still relevant now that Grid exists?",
        answer:
          "Yes. Flexbox and Grid solve different problems. Flexbox is still the best tool for one-dimensional, content-driven layouts. Grid replaced floats and table-based layouts for two-dimensional structure, but it did not replace Flexbox. Both are essential parts of modern CSS layout.",
      },
    ],
  },
  {
    slug: "xml-vs-json",
    title: "XML vs JSON: Which Data Format Should You Use?",
    description:
      "Compare XML and JSON for APIs, configuration, and data storage. Understand their syntax, strengths, and when each format is the right choice.",
    date: "2026-03-02",
    category: "Developer Guides",
    relatedTool: { name: "XML Formatter", href: "/xml-formatter" },
    intro:
      "XML and JSON are two of the most widely used data interchange formats in software development. JSON (JavaScript Object Notation) has become the dominant format for web APIs and modern applications, while XML (Extensible Markup Language) remains deeply embedded in enterprise systems, document formats, configuration files, and many legacy integrations. Understanding the structural differences between them, their respective strengths, and the contexts where each is still the right choice will help you make informed decisions about data format selection and integration work. Neither format is universally better — each was designed with different priorities, and both are still actively used in production systems worldwide.",
    sections: [
      {
        h2: "Syntax and Structure Comparison",
        body: "JSON represents data as nested objects (key-value pairs in curly braces) and arrays (ordered lists in square brackets). Keys must be double-quoted strings, values can be strings, numbers, booleans, null, objects, or arrays. A JSON object has no metadata, no schema attached, and no way to include attributes separate from values — everything is a value. XML represents data as a tree of elements defined by opening and closing tags: <user id=\"42\"><name>Alice</name></user>. Elements can have attributes (key-value pairs inside the opening tag) and text content as well as child elements, allowing richer structural expressiveness. XML also supports namespaces (xmlns:prefix) to avoid element name collisions when combining documents from different sources. JSON is generally more compact and easier to read for simple data; XML is more verbose but offers more structural precision through attributes, namespaces, and mixed content (text interspersed with child elements).",
      },
      {
        h2: "When JSON Is the Right Choice",
        body: "JSON is the default choice for modern REST APIs, mobile applications, NoSQL databases (MongoDB stores BSON, a binary superset of JSON), and browser-to-server communication. JavaScript can parse it natively with JSON.parse() — no library required. Every major programming language has a built-in or standard library JSON parser. The format is smaller on the wire than equivalent XML — a simple API response in JSON might be 30-40% smaller than the same data in XML — which matters at scale for mobile network consumption and API server bandwidth. JSON is also the native format for many modern configuration systems, package managers (package.json, composer.json), and serverless function payloads. If you are building a new API in 2026 without specific requirements for schemas or document structure, JSON is the correct default.",
      },
      {
        h2: "When XML Is the Right Choice",
        body: "XML remains the right choice in several important domains. SOAP web services use XML envelopes with WSDL (Web Services Description Language) schemas — enterprise integrations with banking, healthcare (HL7 FHIR has both XML and JSON representations), and government systems often mandate XML. Office document formats (DOCX, XLSX, PPTX) are ZIP archives containing XML files — understanding this is essential for programmatic document generation. SVG (Scalable Vector Graphics) and XHTML are XML-based. RSS and Atom feeds for content syndication use XML. Configuration files for Java ecosystems (Maven pom.xml, Spring beans) and many build tools use XML. Android layout files are XML. When you need document-centric data (where text and markup are interleaved), when you need XML-specific validation (XML Schema, DTD, RelaxNG), or when integrating with systems that mandate XML, the choice is made for you.",
      },
      {
        h2: "Schema Validation, Transformation, and Tooling",
        body: "XML has a mature ecosystem of schema and transformation standards. XML Schema Definition (XSD) provides strict type validation for XML documents, including complex type inheritance, facet constraints, and namespace-aware validation. XSLT (Extensible Stylesheet Language Transformations) is a declarative language specifically for transforming XML into HTML, text, or other XML structures — widely used in CMS systems and document pipelines. XPath provides a query language for selecting nodes from an XML document tree, and XQuery extends this into a full query language for XML databases. JSON has its own schema system (JSON Schema) which has matured significantly and is now used in OpenAPI specifications and many configuration validation tools. JSON does not have an equivalent to XSLT for structural transformation — developers typically transform JSON using code. If your workflow requires schema-validated documents, complex transformations, or integration with XSLT pipelines, XML tooling is more mature.",
      },
    ],
    faqs: [
      {
        question: "Is JSON always faster to parse than XML?",
        answer:
          "In most practical cases yes — JSON parsers are simpler and JSON payloads are smaller. However, highly optimized XML parsers (SAX streaming parsers) can parse large XML files faster than JSON for document-centric workloads. For typical API payloads under 1MB, the difference is negligible.",
      },
      {
        question: "Can I convert between XML and JSON?",
        answer:
          "There is no universal lossless conversion because the formats have different structural capabilities — XML has attributes, namespaces, mixed content, and processing instructions that have no direct JSON equivalent. Conversions require decisions about how to represent attributes (as @attr keys, or nested objects), and the mapping is often application-specific.",
      },
      {
        question: "Why do some APIs offer both XML and JSON?",
        answer:
          "Older APIs that started with XML (like many payment gateways and government services) added JSON support as web developers moved away from XML. Offering both lets them serve legacy integrations that depend on XML and modern clients that prefer JSON without breaking backward compatibility.",
      },
      {
        question: "What is the best format for configuration files?",
        answer:
          "It depends on the ecosystem. JSON is common for Node.js tooling (package.json, tsconfig.json), YAML is preferred for Docker Compose, Kubernetes, and CI/CD pipelines due to its comment support and human-readability, TOML is used by Rust and some Python tools, and XML is standard for Java and Android build systems. Choose what fits your stack.",
      },
    ],
  },
  {
    slug: "rsa-encryption-explained",
    title: "RSA Encryption Explained: Public Keys, Private Keys, and Signatures",
    description:
      "Understand how RSA encryption works, what public and private keys do, how digital signatures are verified, and when to use RSA in modern applications.",
    date: "2026-03-02",
    category: "Security",
    relatedTool: { name: "RSA Key Generator", href: "/rsa-generator" },
    intro:
      "RSA is one of the oldest and most widely deployed public-key cryptographic algorithms, invented in 1977 by Ron Rivest, Adi Shamir, and Leonard Adleman. It underlies HTTPS certificates, SSH key authentication, code signing, JWT RS256 tokens, and PGP email encryption. Unlike symmetric encryption (where the same key encrypts and decrypts), RSA uses a mathematically linked key pair: a public key that anyone can know and a private key that must be kept secret. Data encrypted with the public key can only be decrypted by the private key, and data signed with the private key can be verified by anyone with the public key. This asymmetric structure solves the fundamental problem of key distribution — you can share your public key openly without compromising security.",
    sections: [
      {
        h2: "The Mathematics Behind RSA",
        body: "RSA security is based on the practical difficulty of factoring the product of two large prime numbers. Key generation begins by selecting two distinct large prime numbers, p and q (each typically 1024 bits or larger). Their product n = p * q is the modulus, used in both the public and private keys. The totient function phi(n) = (p-1)(q-1) is computed. A public exponent e is chosen (usually 65537, a common prime) such that it is coprime with phi(n). The private exponent d is computed as the modular multiplicative inverse of e modulo phi(n) — meaning e * d ≡ 1 (mod phi(n)). The public key is the pair (n, e) and the private key is the pair (n, d). Encryption of a message M is computed as C = M^e mod n. Decryption is M = C^d mod n. The security relies on the fact that while n is public, factoring n back into p and q is computationally infeasible for sufficiently large key sizes with current classical computers.",
      },
      {
        h2: "Key Sizes and Modern Security Recommendations",
        body: "RSA security scales with key size because larger keys have larger moduli that are harder to factor. A 1024-bit RSA key is no longer considered secure against well-resourced adversaries — NIST deprecated it for government use in 2010. A 2048-bit key provides approximately 112 bits of security and is the current minimum for most applications. A 4096-bit key provides approximately 140 bits of security and is preferred for long-lived certificate authorities and keys protecting highly sensitive data. The trade-off is performance: RSA operations are computationally expensive compared to symmetric algorithms. TLS connections use RSA for an initial handshake to establish a shared secret, then switch to fast symmetric encryption (AES) for the actual data. In 2026, 2048-bit RSA is the practical minimum, 3072-bit is recommended for new deployments, and 4096-bit is appropriate for certificate authorities. Post-quantum cryptography (algorithms like CRYSTALS-Kyber and Dilithium) is being standardized as a future replacement for RSA against quantum computer attacks.",
      },
      {
        h2: "RSA Digital Signatures",
        body: "Digital signatures work in the reverse direction from encryption. To sign a document, the signer computes a cryptographic hash of the document (SHA-256 is standard), then encrypts that hash with their private key. The result is the digital signature. To verify, the verifier decrypts the signature with the signer\'s public key (which anyone can have) and compares the decrypted hash to their own hash of the document. If they match, two things are proven: the document has not been altered since signing (integrity), and only the holder of the private key could have created the signature (authentication). This is the mechanism behind code signing, TLS certificates, JWT RS256 tokens, and SSH host verification. In practice, RSA signature padding matters significantly — use RSASSA-PSS (probabilistic signature scheme) for new implementations rather than the older PKCS#1 v1.5 padding, as PSS provides stronger security proofs.",
      },
      {
        h2: "RSA in Practice: Common Use Cases and Pitfalls",
        body: "RSA is used for asymmetric key exchange in TLS handshakes, SSH server authentication, JWT signing with the RS256 algorithm, PGP email encryption, X.509 certificate signatures, and code signing for software distribution. Common pitfalls include using RSA to directly encrypt large data (RSA can only encrypt data smaller than the key size minus padding — use RSA to encrypt a symmetric key, then use that key to encrypt the actual data — this is called hybrid encryption). Another pitfall is using the same RSA key pair for both encryption and signing, which can create security vulnerabilities. Generate separate key pairs for each purpose. Never use RSA with no padding (textbook RSA) — always use OAEP padding for encryption and PSS padding for signatures. Store private keys in hardware security modules (HSMs) or encrypted key stores, never in plaintext files in the repository.",
      },
    ],
    faqs: [
      {
        question: "What is the difference between RSA encryption and RSA signing?",
        answer:
          "In encryption, the public key encrypts and the private key decrypts — used to send a secret to the key owner. In signing, the private key signs and the public key verifies — used to prove that a message came from the key owner. Both use the same underlying math but in opposite directions.",
      },
      {
        question: "Is RSA-2048 still safe in 2026?",
        answer:
          "Yes, RSA-2048 remains secure against classical computers in 2026. It is the minimum recommended key size. For new systems, prefer 3072-bit or 4096-bit keys. Note that large-scale quantum computers could break RSA in the future, which is why post-quantum cryptography standards are being finalized.",
      },
      {
        question: "Why is RSA slow compared to AES?",
        answer:
          "RSA operations involve modular exponentiation on very large numbers (2048+ bits), which requires significant CPU work. AES operates on fixed 128-bit blocks with simple substitution and permutation operations that are extremely fast. In practice, RSA is used only to securely exchange a symmetric key, and AES handles all the bulk data encryption.",
      },
      {
        question: "What is the difference between RSA public key and certificate?",
        answer:
          "A public key is just the mathematical values (n, e). An X.509 certificate is a public key bundled with metadata (owner identity, validity period, issuer) and signed by a Certificate Authority. The certificate proves that the public key belongs to who they claim to be, not just that the key exists.",
      },
    ],
  },
  {
    slug: "timestamp-unix-guide",
    title: "Unix Timestamps Explained: Convert, Compare, and Use Them",
    description:
      "Learn what Unix timestamps are, how to convert them to human-readable dates in JavaScript and Python, and how to avoid common timezone pitfalls.",
    date: "2026-03-02",
    category: "Developer Guides",
    relatedTool: { name: "Timestamp Converter", href: "/timestamp-converter" },
    intro:
      "A Unix timestamp is the number of seconds (or milliseconds) that have elapsed since January 1, 1970, 00:00:00 UTC — a reference point known as the Unix Epoch. This simple integer representation of time is universal across operating systems, programming languages, and databases. Unlike human-readable date strings (which vary by locale, timezone, and format), a Unix timestamp is always timezone-agnostic and unambiguous. Whether you are logging events, sorting records chronologically, calculating time differences, implementing JWT expiry, or scheduling tasks, Unix timestamps are the most reliable way to represent and compare moments in time. Understanding how to work with them — and how to avoid common timezone mistakes — is an essential skill for every developer.",
    sections: [
      {
        h2: "Unix Timestamps in JavaScript",
        body: "In JavaScript, Date.now() returns the current time as a Unix timestamp in milliseconds (not seconds). Divide by 1000 and floor to get seconds: Math.floor(Date.now() / 1000). To convert a timestamp back to a Date object: new Date(timestamp * 1000) for second-precision timestamps, or new Date(timestamp) for millisecond timestamps. To get a human-readable string: new Date(timestamp * 1000).toISOString() returns an ISO 8601 string like '2026-03-02T14:30:00.000Z' always in UTC. For locale-aware formatting, use toLocaleString() with an options object specifying timeZone. To parse a date string to a timestamp: Math.floor(new Date('2026-03-02T00:00:00Z').getTime() / 1000). Be careful with the Date constructor when passing date strings without a time component — 'YYYY-MM-DD' is interpreted as UTC midnight by modern engines, but this was inconsistent in older engines. Always include the time and timezone offset in date strings to avoid ambiguity.",
      },
      {
        h2: "Unix Timestamps in Python and Other Languages",
        body: "In Python, import time; time.time() returns the current Unix timestamp as a float (seconds since epoch, with subsecond precision). int(time.time()) rounds it to whole seconds. To convert to a datetime: datetime.utcfromtimestamp(ts) gives a naive UTC datetime, datetime.fromtimestamp(ts, tz=timezone.utc) gives a timezone-aware UTC datetime (preferred). To go the other direction, datetime.timestamp() on a timezone-aware datetime gives the Unix timestamp. In Go, time.Now().Unix() returns seconds and time.Now().UnixMilli() returns milliseconds. In Rust, std::time::SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_secs() gives seconds. In SQL, most databases have built-in functions: UNIX_TIMESTAMP() in MySQL, EXTRACT(EPOCH FROM NOW()) in PostgreSQL. Most database timestamp columns should store values as UTC and convert to local time only in the application layer for display.",
      },
      {
        h2: "Timezone Pitfalls and How to Avoid Them",
        body: "The most common Unix timestamp bug is mixing timezone-aware and timezone-naive datetimes. In Python, naive datetimes (without timezone info) are assumed to be local time by default, which means datetime.fromtimestamp(ts) returns local time while datetime.utcfromtimestamp(ts) returns UTC without timezone info — comparing them causes bugs. Always use timezone-aware datetimes: datetime.fromtimestamp(ts, tz=timezone.utc). In JavaScript, the Date object is always stored as UTC internally but displayed in local time by methods like toString() and toLocaleString(). getTime() always returns milliseconds in UTC. getHours() returns local hours. getUTCHours() returns UTC hours. A second major pitfall is Daylight Saving Time (DST): when a user\'s timezone observes DST, local clocks jump forward or back, meaning the same local time can correspond to two different UTC moments or no UTC moment at all (the missing hour). Unix timestamps are immune to DST because they are always UTC-based — another strong argument for using them internally.",
      },
      {
        h2: "Practical Patterns: Expiry, Duration, and Scheduling",
        body: "Unix timestamps are the standard way to implement time-sensitive logic. JWT tokens use the exp claim as a Unix timestamp in seconds: Math.floor(Date.now() / 1000) + 3600 sets expiry one hour from now. To check if a JWT is expired: exp < Math.floor(Date.now() / 1000). To calculate the duration between two events, subtract their timestamps: end_ts - start_ts gives duration in seconds, divide by 60 for minutes, by 3600 for hours. For displaying human-friendly relative times ('3 hours ago'), libraries like date-fns formatDistanceToNow or Luxon\'s DateTime.fromSeconds(ts).toRelative() handle the edge cases. For scheduling, store the target Unix timestamp in your database and run a periodic job that queries for records where scheduled_at <= UNIX_TIMESTAMP() (MySQL) or scheduled_at <= EXTRACT(EPOCH FROM NOW()) (PostgreSQL). This approach is timezone-agnostic and works correctly across DST transitions.",
      },
    ],
    faqs: [
      {
        question: "What is the Unix Epoch?",
        answer:
          "The Unix Epoch is January 1, 1970, 00:00:00 UTC — the reference point from which Unix timestamps are counted. The choice of 1970 was arbitrary but has become the universal baseline for timestamp systems across operating systems and programming languages.",
      },
      {
        question: "Why is 2038 a problem for Unix timestamps?",
        answer:
          "32-bit signed integers storing seconds since the epoch overflow on January 19, 2038 at 03:14:07 UTC, wrapping to negative values that represent dates in 1901. Modern systems use 64-bit integers which push the overflow date billions of years into the future. Check your database column types and any legacy 32-bit systems still in use.",
      },
      {
        question: "Should I store timestamps in seconds or milliseconds?",
        answer:
          "Unix convention is seconds, and most specifications (JWT exp, HTTP headers, POSIX) use seconds. JavaScript uses milliseconds internally (Date.now()). For most applications seconds are sufficient. Use milliseconds when you need sub-second precision for event ordering, performance logging, or financial systems.",
      },
      {
        question: "How do I get the current timestamp without any libraries?",
        answer:
          "In JavaScript: Math.floor(Date.now() / 1000). In Python: int(time.time()). In bash: date +%s. In SQL (PostgreSQL): EXTRACT(EPOCH FROM NOW())::int. In SQL (MySQL): UNIX_TIMESTAMP(). All of these return the current UTC time as seconds since the Unix Epoch.",
      },
    ],
  },
  {
    slug: "what-is-lorem-ipsum",
    title: "What Is Lorem Ipsum? The History and Uses of Placeholder Text",
    description:
      "Discover the history of Lorem Ipsum placeholder text, where it comes from, why designers use it, and how to generate the right amount for your project.",
    date: "2026-03-02",
    category: "Developer Guides",
    relatedTool: { name: "Lorem Ipsum Generator", href: "/lorem-ipsum-generator" },
    intro:
      "Lorem Ipsum is the standard placeholder text used by designers, typographers, and developers worldwide to fill space in layouts before the real content is written. If you have ever seen text beginning with \"Lorem ipsum dolor sit amet, consectetur adipiscing elit\" in a mockup, wireframe, or design template, you have encountered it. The text looks like Latin but is actually a scrambled, abbreviated excerpt from a 1st-century BC philosophical work by Cicero. Its non-word appearance is intentional — it allows reviewers to focus on the visual design without being distracted by the meaning of the text. Understanding what Lorem Ipsum is, where it comes from, and how to use it correctly is useful for developers, designers, and content strategists working on layout and design systems.",
    sections: [
      {
        h2: "The History of Lorem Ipsum",
        body: "Lorem Ipsum is derived from \"de Finibus Bonorum et Malorum\" (On the Ends of Good and Evil), a treatise on ethics written by Marcus Tullius Cicero in 45 BC. The original passage begins: \"Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...\" meaning \"Nor is there anyone who loves or pursues or desires pain itself because it is pain...\" The Lorem Ipsum version that has become standard was created by an unknown typographer in the 1500s who took a passage from Cicero, scrambled the words, and removed some sections to make it appear like Latin while being meaningless on close reading. The text gained its near-universal adoption in the 1960s when Letraset (a dry-transfer lettering company) used it on their typeface specimen sheets. Aldus Corporation then included Lorem Ipsum as default placeholder text in PageMaker desktop publishing software, cementing its use across the design industry. Today, virtually every design tool generates Lorem Ipsum: Figma, Sketch, Adobe XD, and dozens of online generators.",
      },
      {
        h2: "Why Designers and Developers Use Lorem Ipsum",
        body: "The purpose of placeholder text is to simulate the visual weight and rhythm of real copy without the distraction of meaningful content. When reviewing a design mockup, human brains are wired to read and evaluate text. If the placeholder text says something meaningful — or worse, something funny or inappropriate — reviewers focus on the words rather than the layout, typography, whitespace, and overall visual hierarchy. Lorem Ipsum\'s scrambled pseudo-Latin sidesteps this problem: it has the appearance of language (word lengths, punctuation, paragraph breaks) without conveying meaning, directing attention where it belongs. From a developer\'s perspective, Lorem Ipsum is useful for testing text rendering: checking how fonts handle long words, how line wrapping behaves at various viewport widths, how many characters fit in a truncated element, and how a card component looks with one paragraph versus three. It is also used in database seeding, automated tests, and load testing to generate realistic-volume text content.",
      },
      {
        h2: "Types of Lorem Ipsum and How to Generate It",
        body: "The standard Lorem Ipsum paragraph begins with \"Lorem ipsum dolor sit amet\" and continues with 5 sentences totaling about 440 characters. Generators typically offer output measured in words, sentences, or paragraphs. For most design placeholders, 1-3 paragraphs (roughly 150-450 words) is appropriate for body content areas. Short text variants (one sentence or 5-10 words) are useful for button labels, captions, and heading placeholders. The original Lorem Ipsum text is finite — most generators either use the original cyclically or produce algorithmically varied versions that maintain the same word-frequency distribution. Alternatives to classic Lorem Ipsum include Hipster Ipsum (pop-culture references), Corporate Ipsum (business jargon), Cupcake Ipsum (food-themed), and Blind Text Generator for typographic testing. For internationalization testing, it is better to use actual text in the target language than Lorem Ipsum, since character widths, word lengths, and line-breaking rules differ significantly between Latin, CJK, Arabic, and other scripts.",
      },
      {
        h2: "When NOT to Use Lorem Ipsum",
        body: "Lorem Ipsum is a tool for early-stage design, not a substitute for content strategy. One of the most common design failures is shipping a product where Lorem Ipsum was never replaced with real content — this has happened in print materials, published websites, and mobile app stores. Always treat placeholder text as a signal that real content is needed, not a finished state. More importantly, Lorem Ipsum can hide content-related design problems. If your component only looks good with 50 words of text, you need to know what happens with 5 words and with 500 words before the design is complete. Test your layouts with real content variation — short titles, long titles, absent images, very long descriptions — rather than relying on uniform Lorem Ipsum paragraphs that never stress-test the design. For accessibility testing, use real or realistic text because screen reader testing and translation memory systems need meaningful content.",
      },
    ],
    faqs: [
      {
        question: "Is Lorem Ipsum actual Latin?",
        answer:
          "No. It is scrambled and abbreviated text derived from Cicero\'s Latin, but the words have been rearranged and shortened so that the passage is meaningless as Latin. The first word \"Lorem\" does not exist in classical Latin — it is a fragment of \"dolorem\" (pain/sorrow) with the first two characters removed.",
      },
      {
        question: "How long is a standard Lorem Ipsum paragraph?",
        answer:
          "The classic Lorem Ipsum paragraph that starts with \"Lorem ipsum dolor sit amet\" contains approximately 440 characters (72 words) across 5 sentences. Most generators let you specify output in words, sentences, or paragraphs and produce additional text by cycling through the source material.",
      },
      {
        question: "Are there alternatives to Lorem Ipsum for content testing?",
        answer:
          "Yes. For internationalization testing, use actual text in the target language. For typographic stress testing, Blind Text Generator provides options tuned to specific typefaces. For product demos, industry-specific placeholder text (medical, legal, tech jargon) is often more convincing than generic Lorem Ipsum.",
      },
      {
        question: "Can I use Lorem Ipsum on a live website?",
        answer:
          "Technically you can, but it is a clear sign of unfinished content and will harm SEO (search engines may flag it as thin or duplicate content) and user trust. Always replace Lorem Ipsum with real content before publishing. Set up a review checklist that includes a search for the string \"Lorem ipsum\" before any deployment.",
      },
    ],
  },
  {
    slug: "css-gradient-guide",
    title: "CSS Gradients Guide: Linear, Radial, Conic with Examples",
    description:
      "Master CSS gradients: learn linear-gradient, radial-gradient, and conic-gradient syntax with practical examples for backgrounds, text, and UI effects.",
    date: "2026-03-02",
    category: "Design",
    relatedTool: { name: "CSS Gradient Generator", href: "/css-gradient-generator" },
    intro:
      "CSS gradients let you create smooth transitions between colors directly in CSS, without any image files. They are one of the most versatile tools in front-end design, used for background effects, button styles, text fills, progress bars, decorative overlays, and complex visual treatments that previously required Photoshop assets. CSS supports three main gradient types: linear-gradient for straight-line transitions, radial-gradient for circular or elliptical transitions from a center point, and conic-gradient for angular transitions around a center point (useful for pie charts and color wheels). Understanding the full syntax of each type, including multi-stop gradients, color hints, and repeating variants, will dramatically expand what you can create in pure CSS.",
    sections: [
      {
        h2: "Linear Gradients: Syntax and Direction Control",
        body: "The linear-gradient() function creates a gradient along a straight line. The first argument is the direction, and the remaining arguments are color stops. Direction can be specified as a keyword (to right, to bottom right, to top) or as an angle (0deg = to top, 90deg = to right, 180deg = to bottom, 270deg = to left). Background: linear-gradient(to right, #667eea, #764ba2) creates a horizontal gradient from blue to purple. Color stops can include a position: linear-gradient(to right, red 0%, blue 50%, green 100%) places each color precisely. A color hint between two stops changes the midpoint of the transition: linear-gradient(to right, red, 30%, blue) shifts the red-to-blue midpoint to the 30% mark, making the transition happen more quickly. Hard stops create sharp color boundaries with no transition: linear-gradient(to right, red 50%, blue 50%) splits the element exactly in half with no blending. Repeating-linear-gradient() tiles the gradient: repeating-linear-gradient(45deg, #f06 0px, #f06 10px, transparent 10px, transparent 20px) creates a striped pattern.",
      },
      {
        h2: "Radial Gradients: Shape, Size, and Position",
        body: "The radial-gradient() function radiates colors from a center point outward. By default it creates an ellipse that fits the element\'s bounding box. The shape keyword circle or ellipse can be specified explicitly: radial-gradient(circle, #f06, #4d9) creates a circular gradient. Size keywords control how far the gradient extends: closest-side stops at the nearest edge of the element, farthest-corner extends to the far corner (default), closest-corner stops at the nearest corner, farthest-side stops at the farthest edge. The at keyword positions the center: radial-gradient(circle at 70% 30%, #fff, #000) places the bright center at 70% from the left and 30% from the top. Multiple color stops work the same as in linear gradients. A practical spotlight effect: background: radial-gradient(ellipse at top, #1a1a2e 0%, #16213e 50%, #0f3460 100%) creates a dark background with a lighter glow at the top. Repeating-radial-gradient() creates concentric rings: useful for target patterns and water-ripple effects.",
      },
      {
        h2: "Conic Gradients: Angular Transitions and Pie Charts",
        body: "The conic-gradient() function transitions colors around a central point by angle rather than distance, like the hands sweeping around a clock face. The basic syntax is conic-gradient(red, yellow, green, blue, red), which creates a full color wheel. The from keyword sets the starting angle: conic-gradient(from 90deg, red, blue) starts the rotation at 3 o\'clock instead of 12 o\'clock. The at keyword positions the center: conic-gradient(at 25% 50%, red, blue) moves the rotation center off-center. Conic gradients are perfect for pie charts using hard stops: conic-gradient(#4CAF50 0% 40%, #2196F3 40% 70%, #FF5722 70% 100%) creates a three-segment donut chart. Combine with border-radius: 50% to make the element circular. Conic gradients also create checkerboard patterns: conic-gradient(#eee 25%, white 25% 50%, #eee 50% 75%, white 75%) repeated with background-size to control the square size. All modern browsers support conic-gradient without prefixes.",
      },
      {
        h2: "Advanced Techniques: Layered Gradients and Text Fills",
        body: "CSS background accepts multiple values separated by commas — you can layer multiple gradients: background: linear-gradient(to right, rgba(102,126,234,0.8), rgba(118,75,162,0.8)), url(photo.jpg) center / cover creates a color overlay on top of an image. Stacking gradients with transparency lets you compose complex visual effects entirely in CSS. To fill text with a gradient, use background-clip: text (with the -webkit- prefix still needed for Safari): .gradient-text { background: linear-gradient(90deg, #f06, #4d9); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }. For animated gradients, CSS custom properties with @property allow smooth transitions on gradient color stops in supporting browsers. background-size: 200% 200% combined with a background-position animation on the gradient creates a flowing shimmer effect without JavaScript. For glassmorphism effects, combine a semi-transparent background (rgba or color with alpha), backdrop-filter: blur(), and a subtle border with a gradient border-image.",
      },
    ],
    faqs: [
      {
        question: "What is the difference between 0deg and to top in linear-gradient?",
        answer:
          "They produce the same result — a gradient going from bottom to top. CSS gradients use the \"to\" direction convention where 0deg points to the top, 90deg points to the right, 180deg points to the bottom. This differs from SVG gradients which use standard mathematical angles (0deg = right).",
      },
      {
        question: "How do I make a hard color stop with no blending?",
        answer:
          "Place two color stops at the same position: linear-gradient(to right, red 50%, blue 50%). There is no transition — the color changes instantly at the 50% mark. This technique creates striped patterns when combined with repeating-linear-gradient.",
      },
      {
        question: "Can I animate a CSS gradient?",
        answer:
          "CSS cannot directly animate gradient color stops in most browsers without @property (the Houdini API). A common workaround is animating background-position on a gradient with background-size: 200% 200%, which creates a moving shimmer effect. Another approach uses opacity transitions between layered gradient pseudo-elements.",
      },
      {
        question: "How do I create a transparent gradient fade effect?",
        answer:
          "Use rgba() or the modern color / alpha syntax with a transparent keyword: linear-gradient(to bottom, rgba(0,0,0,0.8), transparent). This creates a gradient from a semi-opaque black to fully transparent, commonly used to overlay text on images with readable contrast at the top fading to the full image below.",
      },
    ],
  },
  {
    slug: "how-to-format-sql",
    title: "How to Format SQL Queries for Readability and Performance",
    description:
      "Learn SQL formatting best practices: keyword casing, indentation, alias conventions, and how clean query structure helps performance and code review.",
    date: "2026-03-02",
    category: "Developer Guides",
    relatedTool: { name: "SQL Formatter", href: "/sql-formatter" },
    intro:
      "SQL formatting is often overlooked until a query grows to 50 lines and becomes impossible to read or debug. Well-formatted SQL is not just cosmetic — it makes queries faster to review in pull requests, easier to debug when they return wrong results, and less likely to contain logical errors that are hidden by dense, unpunctuated syntax. Unlike application code where linters and formatters are standard in most workflows, SQL lives in many different places (ORM-generated queries, stored procedures, migration files, BI tool editors, database consoles) and often lacks automatic formatting. This guide covers the formatting conventions that experienced database developers use to write SQL that is readable, maintainable, and less error-prone.",
    sections: [
      {
        h2: "Keyword Casing and Basic Structure",
        body: "The most fundamental SQL formatting decision is keyword casing. The two dominant conventions are uppercase keywords (SELECT, FROM, WHERE, JOIN, GROUP BY, ORDER BY, HAVING, LIMIT) with lowercase identifiers (table names, column names, aliases), or all-lowercase. Uppercase keywords is the traditional convention used in most SQL textbooks, enterprise style guides, and SQL formatting tools. It makes the structural keywords visually distinct from the identifiers, which helps when scanning a long query. The opening keyword of each clause should start at the left margin (or at a consistent indent level), with related items indented beneath it. SELECT should list one column per line for any query with more than two columns, making it easy to add, remove, or reorder columns and to see the full projection at a glance. Commas at the start of the line (leading commas) is a style that makes adding and removing columns easier and avoids trailing-comma syntax errors, though many style guides prefer trailing commas for consistency with other languages.",
      },
      {
        h2: "JOIN and WHERE Clause Formatting",
        body: "JOINs are the most complex part of SQL queries to format clearly. Each JOIN should start on a new line at the same indentation level as FROM. The ON condition should be indented one level below the JOIN: FROM orders o JOIN customers c ON c.id = o.customer_id JOIN order_items oi ON oi.order_id = o.id. For compound ON conditions, each AND/OR starts on a new line indented further: ON c.id = o.customer_id AND c.is_active = 1. The WHERE clause should list each condition on its own line with AND/OR at the start of continuation lines: WHERE o.created_at >= \'2026-01-01\' AND o.status = \'completed\' AND c.country = \'US\'. This makes it trivial to comment out a single condition during debugging without restructuring the entire WHERE clause. Parentheses for grouped conditions should be placed to make operator precedence explicit, even when not technically required: WHERE (status = \'active\' OR status = \'pending\') AND created_at > \'2026-01-01\'.",
      },
      {
        h2: "Aliases, Subqueries, and CTEs",
        body: "Table aliases should be short but meaningful. Single-letter aliases (o for orders, c for customers) are readable in short queries but become ambiguous in complex joins. Two or three-letter abbreviations work better for large queries. Always use the AS keyword explicitly for clarity: SELECT o.id AS order_id rather than SELECT o.id order_id — the explicit AS makes it immediately clear this is an alias. Common Table Expressions (CTEs) introduced with the WITH keyword dramatically improve readability of complex queries by naming intermediate result sets. Instead of nesting subqueries three levels deep, extract each logical step into a named CTE: WITH monthly_revenue AS (SELECT ...), top_customers AS (SELECT ... FROM monthly_revenue WHERE ...) SELECT ... FROM top_customers. Each CTE is separated by a comma and a new WITH clause name. Subqueries that must remain inline should be indented consistently and their closing parenthesis aligned with the opening keyword.",
      },
      {
        h2: "Formatting for Performance: Readable Queries Are Often Faster Queries",
        body: "Formatting discipline and query performance are related because the habits that produce readable SQL also produce more efficient SQL. Writing each column explicitly in SELECT (instead of SELECT *) is both a formatting practice and a performance improvement — it reduces the data transferred from the database and prevents silent breakage when table schemas change. Placing the most selective WHERE conditions first (for query planners that evaluate left-to-right) and being explicit about JOIN types (INNER JOIN vs LEFT JOIN vs CROSS JOIN) makes the optimizer\'s job clearer and the query intent explicit. Using EXISTS instead of IN for correlated subqueries, avoiding functions on indexed columns in WHERE clauses (WHERE YEAR(created_at) = 2026 prevents index use — use WHERE created_at >= \'2026-01-01\' instead), and being explicit about NULL handling with IS NULL instead of = NULL are all practices that are easier to spot and enforce when the query is well-formatted. Code reviewers catching performance anti-patterns is much easier when the query is legible. Consistent formatting also makes it practical to use EXPLAIN or EXPLAIN ANALYZE on specific sections without having to first untangle a dense, unformatted query.",
      },
    ],
    faqs: [
      {
        question: "Should SQL keywords be uppercase or lowercase?",
        answer:
          "Uppercase is the traditional and most widely used convention (SELECT, FROM, WHERE). It makes keywords visually distinct from identifiers and is the default of most SQL formatters. Lowercase is also valid and preferred by some teams for consistency with other languages. Pick one style and enforce it consistently across your codebase.",
      },
      {
        question: "What is a CTE and when should I use it?",
        answer:
          "A Common Table Expression (CTE) is a named temporary result set defined with the WITH keyword before a SELECT statement. Use CTEs to break complex queries into readable, named steps rather than nesting multiple subqueries. They improve readability significantly and can sometimes enable query optimizer improvements in databases like PostgreSQL.",
      },
      {
        question: "Does SQL formatting affect query performance?",
        answer:
          "Formatting itself does not affect execution — the SQL engine ignores whitespace. However, the discipline that comes with clean formatting (explicit column names instead of SELECT *, clear JOIN types, avoiding functions on indexed columns) directly correlates with better-performing queries. Readable SQL is also more likely to be reviewed and optimized.",
      },
      {
        question: "What SQL formatter tools are available?",
        answer:
          "Our online SQL Formatter handles standard SQL, PostgreSQL, MySQL, and T-SQL dialects. Other options include the sqlformat Python package for command-line use, the Prettier SQL plugin for editor integration, pgFormatter for PostgreSQL, and the built-in formatter in database IDEs like DataGrip and DBeaver.",
      },
    ],
  },
  {
    slug: "http-status-codes-guide",
    title: "HTTP Status Codes Explained: 200, 404, 500 and More",
    description:
      "A complete guide to HTTP status codes: what 200, 301, 400, 404, 500 mean, when servers send them, and how to handle them in your applications.",
    date: "2026-03-02",
    category: "Developer Guides",
    relatedTool: { name: "HTTP Status Codes Reference", href: "/http-status-codes" },
    intro:
      "Every HTTP request your browser or application makes gets a response with a three-digit status code. These codes are the universal language between clients and servers, telling you whether a request succeeded, failed, or needs to go somewhere else. As a developer, knowing what each range of codes means — and when to use specific codes in your own APIs — is a foundational skill. This guide breaks down every major status code category with practical context for both API consumers and API builders.",
    sections: [
      {
        h2: "1xx and 2xx: Informational and Success Codes",
        body: "The 1xx range is rarely seen in everyday development. 100 Continue tells a client to proceed with sending a large request body. 101 Switching Protocols is used when upgrading an HTTP connection to WebSocket — the server acknowledges the upgrade before the protocol changes. The 2xx range signals success. 200 OK is the most common response, meaning the request was received, understood, and fulfilled. 201 Created is returned after a POST request that creates a new resource — well-designed REST APIs always return 201 (not 200) when creating resources, and often include a Location header pointing to the new resource URL. 204 No Content is used for successful DELETE requests or actions that have no response body to return. 206 Partial Content is sent when serving a range request, such as when a video player requests a specific byte range of a video file rather than the whole thing. Using the correct 2xx code makes your API self-documenting and easier to consume correctly.",
      },
      {
        h2: "3xx: Redirects — Permanent, Temporary, and Conditional",
        body: "The 3xx range handles redirects, and picking the right one matters for SEO and client behavior. 301 Moved Permanently tells clients (and search engines) that a URL has moved forever — the client should update bookmarks and search engines should transfer ranking to the new URL. 302 Found is a temporary redirect that tells the client to use the new URL for this request only, but to keep using the original URL in the future. 303 See Other is used after POST requests to redirect to a GET resource, preventing the browser from resubmitting the form on a refresh. 307 Temporary Redirect is like 302 but explicitly requires the client to use the same HTTP method — a POST redirect stays a POST. 308 Permanent Redirect is the method-preserving equivalent of 301. The distinction between 301 and 308 matters for POST-heavy applications. 304 Not Modified is returned by a server when conditional GET headers (If-None-Match or If-Modified-Since) match, telling the client to use its cached copy — this is the foundation of HTTP caching.",
      },
      {
        h2: "4xx: Client Errors — What Went Wrong on Your End",
        body: "The 4xx range means the client made an error. 400 Bad Request is a catch-all for malformed requests — invalid JSON body, missing required fields, or invalid parameter formats. 401 Unauthorized actually means unauthenticated: the client needs to provide credentials. 403 Forbidden means credentials were provided and accepted, but the authenticated user does not have permission to access the resource. 404 Not Found means the resource does not exist at that URL. 405 Method Not Allowed means the HTTP method (GET, POST, etc.) is not supported for that endpoint. 409 Conflict is used when a request conflicts with existing state — such as trying to create a resource with a duplicate unique identifier. 410 Gone is like 404 but permanent — the resource existed but has been deliberately removed and will not return. 422 Unprocessable Entity is preferred over 400 for semantic validation errors (e.g., a field value fails business logic even though the JSON is syntactically valid). 429 Too Many Requests is returned when rate limiting kicks in, and should include a Retry-After header.",
      },
      {
        h2: "5xx: Server Errors — Something Went Wrong on the Back End",
        body: "The 5xx range means the server encountered an error — the client\'s request may have been valid, but the server failed to fulfill it. 500 Internal Server Error is the generic catch-all for unhandled exceptions, database failures, and unexpected crashes. It is the most common error seen in production incidents and means something went wrong that the server operator needs to investigate. 502 Bad Gateway means a reverse proxy (like NGINX or a load balancer) received an invalid response from an upstream server — common when a backend service is down or restarting. 503 Service Unavailable means the server is temporarily unable to handle requests due to overload or maintenance — it should include a Retry-After header. 504 Gateway Timeout occurs when a proxy\'s upstream server does not respond in time — different from 503 in that it is specifically about a timeout rather than refusal. In your own APIs, never swallow exceptions silently — return 500 with a request ID so you can correlate client reports with server logs.",
      },
    ],
    faqs: [
      {
        question: "What is the difference between 401 and 403?",
        answer:
          "401 Unauthorized means the client is not authenticated — it needs to provide credentials (like a token or login). 403 Forbidden means the client is authenticated but does not have permission to access the resource. The naming is historically confusing, but that is the correct semantic distinction.",
      },
      {
        question: "Should I return 400 or 422 for validation errors?",
        answer:
          "Return 400 Bad Request for malformed requests (invalid JSON, missing Content-Type header, unparseable input). Return 422 Unprocessable Entity when the request is syntactically valid but semantically invalid — for example, an end date that comes before a start date. Many APIs use 400 for both, which is acceptable but less precise.",
      },
      {
        question: "What does a 304 Not Modified response mean?",
        answer:
          "It means the resource has not changed since the client\'s cached version. The server sends no body — the client uses its local cache. This reduces bandwidth and speeds up repeat requests. It relies on caching headers like ETag and Last-Modified being set correctly on previous responses.",
      },
      {
        question: "Why do I get a 502 Bad Gateway instead of a 500 error?",
        answer:
          "A 502 means a proxy or load balancer is in front of your application server and the backend returned an invalid or no response. Common causes are the app server crashing, returning a non-HTTP response, or being restarted. Check your application logs on the backend server, not the proxy logs.",
      },
    ],
  },
  {
    slug: "what-is-a-uuid",
    title: "What Is a UUID and How to Generate One",
    description:
      "Learn what UUIDs are, the difference between UUID v1, v4, and v7, when to use them as database primary keys, and how to generate them in any language.",
    date: "2026-03-02",
    category: "Developer Guides",
    relatedTool: { name: "UUID Generator", href: "/uuid-generator" },
    intro:
      "A UUID (Universally Unique Identifier) is a 128-bit number formatted as a 36-character string like 550e8400-e29b-41d4-a716-446655440000. UUIDs are designed to be unique across all systems and all time without requiring a central authority to assign them. They are the standard solution for generating primary keys in distributed databases, tracking sessions and events, and any situation where you need a unique identifier that can be created independently on multiple machines without coordination.",
    sections: [
      {
        h2: "UUID Versions: v1, v4, v5, and v7",
        body: "UUID version 1 generates IDs based on the current timestamp and the MAC address of the generating machine. This makes v1 UUIDs sortable by creation time, but it leaks the host machine\'s MAC address and the exact creation timestamp — a privacy concern for user-facing IDs. UUID version 4 is entirely random: 122 of its 128 bits are random, with the remaining bits set to fixed values to identify the version and variant. V4 is the most widely used version because it requires no coordination, reveals no information about the generating machine, and is practically guaranteed to be unique (the probability of two v4 UUIDs colliding is astronomically small). UUID version 5 is deterministic — given the same namespace and name, it always produces the same UUID, using SHA-1 hashing. This is useful for creating stable identifiers from known inputs, such as generating a consistent UUID for a given email address or URL. UUID version 7, finalized in the 2022 RFC, combines a millisecond-precision timestamp prefix with random bits, making v7 UUIDs both unique and naturally sortable by creation time — the ideal choice for database primary keys in 2026.",
      },
      {
        h2: "Generating UUIDs in Popular Languages",
        body: "In JavaScript and Node.js, the crypto module provides crypto.randomUUID() natively since Node 14.17 — no library needed. In the browser, the Web Crypto API also exposes window.crypto.randomUUID() in all modern browsers. In Python, the built-in uuid module provides uuid.uuid4() for v4 and uuid.uuid1() for v1. In Go, the google/uuid package is the standard choice: uuid.New() returns a v4 UUID. In Java, java.util.UUID.randomUUID() generates v4 UUIDs. In PostgreSQL, the gen_random_uuid() function generates v4 UUIDs natively without extensions. In PHP, Symfony\'s Uid component and Laravel\'s Str::uuid() both use RFC-compliant v4 generation. For UUID v7, which is not yet in all standard libraries, packages like uuid7 (npm) and uuid-utils (Python) provide compliant implementations. Our UUID Generator tool produces v4 UUIDs in your browser without any network requests.",
      },
      {
        h2: "UUIDs as Database Primary Keys: Pros and Cons",
        body: "Using UUIDs as primary keys instead of auto-incrementing integers has real trade-offs. The main advantage is that IDs can be generated anywhere — in the client, in microservices, in multiple database shards — without coordination. This eliminates a single point of failure and makes merging data from different sources trivial. UUIDs also do not leak record counts or creation order to external users. The main disadvantage is performance: random v4 UUIDs cause index fragmentation in B-tree indexes because each new row inserts into a random position rather than appending to the end. This leads to more page splits and worse write performance at scale. The solution is UUID v7, which has a timestamp prefix that keeps new rows roughly sequential, giving near-integer performance while retaining the distributed generation benefits. For PostgreSQL, store UUIDs as the native uuid type (16 bytes) not as varchar (36 bytes) to save space and improve comparison speed.",
      },
      {
        h2: "UUID vs ULID vs NanoID: Choosing the Right Format",
        body: "UUIDs are not the only option for unique identifiers. ULID (Universally Unique Lexicographically Sortable Identifier) is a 128-bit ID encoded in 26 characters using Crockford Base32 — it is URL-safe, case-insensitive, sortable, and more compact than a UUID string. ULIDs embed a 48-bit timestamp prefix like UUID v7. NanoID is a smaller JavaScript library that generates URL-safe random strings of configurable length (21 characters by default) using a custom alphabet. NanoIDs are smaller than UUIDs in string form and can be customized for readability, but they are not a standard with an RFC. For interoperability with external systems, standards compliance, and database native types, UUID v4 or v7 remains the safest choice. Use ULID or NanoID when you control both ends of the system and prefer a more compact representation.",
      },
    ],
    faqs: [
      {
        question: "Can two UUIDs ever be the same?",
        answer:
          "Theoretically yes, but the probability is negligible. UUID v4 has 122 random bits, giving 5.3 x 10^36 possible values. To have a 50% chance of a collision you would need to generate approximately 2.7 x 10^18 UUIDs. In practice, UUID collisions do not happen.",
      },
      {
        question: "Should I use UUID v4 or v7 for database primary keys in 2026?",
        answer:
          "UUID v7 is the better choice for database primary keys because its timestamp prefix keeps insertions roughly sequential, which prevents B-tree index fragmentation and significantly improves write performance at scale. Use v4 when you do not need sortability or when the library you use does not yet support v7.",
      },
      {
        question: "Are UUIDs case-sensitive?",
        answer:
          "UUID characters are case-insensitive by the RFC specification. 550E8400-E29B-41D4-A716-446655440000 and 550e8400-e29b-41d4-a716-446655440000 represent the same UUID. However, store them consistently (lowercase is the convention) and normalize input before comparison in your application.",
      },
      {
        question: "Can I generate a UUID on the client side safely?",
        answer:
          "Yes. Modern browsers expose window.crypto.randomUUID() which uses the OS cryptographically secure random number generator, the same source used by server-side UUID libraries. Client-generated UUIDs are safe for use as identifiers. Avoid Math.random()-based UUID implementations as they are not cryptographically secure.",
      },
    ],
  },
  {
    slug: "cron-job-syntax-guide",
    title: "Cron Job Syntax: Format, Examples, and Common Schedules",
    description:
      "Master cron job syntax with field-by-field explanations, real-world schedule examples, special strings, and tips for testing cron expressions reliably.",
    date: "2026-03-02",
    category: "Developer Guides",
    relatedTool: { name: "Cron Job Parser", href: "/cron-parser" },
    intro:
      "Cron is a time-based job scheduler built into Unix-like operating systems that has been running background tasks since 1975. Despite its age, cron syntax is still used in Linux crontabs, AWS EventBridge, GitHub Actions scheduled workflows, Kubernetes CronJobs, and virtually every cloud platform. Understanding the five-field cron format — and its common extensions — is essential for any developer who manages automated tasks, data pipelines, or scheduled maintenance jobs.",
    sections: [
      {
        h2: "The Five-Field Cron Format Explained",
        body: "A standard cron expression has five space-separated fields: minute, hour, day of month, month, and day of week. Each field accepts specific values. Minute: 0-59. Hour: 0-23. Day of month: 1-31. Month: 1-12 (or JAN-DEC). Day of week: 0-7 where both 0 and 7 represent Sunday (or SUN-SAT). An asterisk in any field means every valid value for that field. A comma separates multiple values: 1,15 in the day field means the 1st and 15th. A hyphen specifies a range: 9-17 in the hour field means every hour from 9am to 5pm inclusive. A slash specifies a step: */15 in the minute field means every 15 minutes (0, 15, 30, 45). Steps can also apply to ranges: 0-30/5 means every 5 minutes in the first half of the hour. Combining these: 30 9-17 * * 1-5 runs at 9:30am, 10:30am, through 5:30pm on every weekday.",
      },
      {
        h2: "Common Cron Schedules With Examples",
        body: "Here are the most commonly used cron expressions and what they mean. \"0 * * * *\" runs at the start of every hour. \"0 0 * * *\" runs at midnight every day (daily reset tasks, report generation). \"0 0 * * 0\" runs at midnight every Sunday (weekly backups). \"0 0 1 * *\" runs at midnight on the first day of every month (monthly billing jobs). \"*/5 * * * *\" runs every 5 minutes (health checks, polling). \"0 9 * * 1-5\" runs at 9am on weekdays (business-hours notifications). \"0 2 * * *\" runs at 2am daily (database backups, off-peak processing). \"30 6 1,15 * *\" runs at 6:30am on the 1st and 15th of each month (bi-monthly payroll). \"0 */6 * * *\" runs every 6 hours (cache refreshes, feed imports). The @reboot special string runs once at system startup. Always think about timezone — cron on a server runs in the server\'s configured timezone, which may differ from your users\'.",
      },
      {
        h2: "Extended Cron Syntax: Seconds, Years, and Special Strings",
        body: "Standard cron has five fields, but many modern schedulers extend this. AWS EventBridge and Quartz (Java) support a 6-field format with seconds as the first field: \"0 30 9 * * ?\" means 9:30:00 AM every day. Some systems add a 7th field for year. The question mark is used in Quartz to mean no specific value — required when day-of-month and day-of-week would conflict. The L character means last: L in the day-of-month field means the last day of the month, 5L in the day-of-week field means the last Friday of the month. W means nearest weekday: 15W means the weekday nearest to the 15th. The hash character specifies the Nth occurrence of a weekday: 2#3 means the third Monday of the month. Systems like GitHub Actions accept special strings: @yearly (0 0 1 1 *), @monthly (0 0 1 * *), @weekly (0 0 * * 0), @daily (0 0 * * *), @hourly (0 * * * *). Always check which cron dialect your target system uses before relying on extended syntax.",
      },
      {
        h2: "Testing and Debugging Cron Expressions",
        body: "Cron bugs are notoriously hard to catch because you often have to wait for the next scheduled run to see if the expression is correct. Use a cron parser tool (like ours above) to see the next 5-10 execution times for any expression before deploying it. For timezone issues, always specify the timezone explicitly if your platform supports it, and verify by checking the first few upcoming run times in your local timezone. When a cron job fails silently, check two places: first, the system mail for the user that owns the crontab (cron sends stderr output to the local mail by default), and second, the system log (grep for cron in /var/log/syslog or journalctl -u cron). Redirect output explicitly: append to a log file with 2>&1 in your cron command to capture both stdout and stderr. For cron jobs in Docker containers or Kubernetes, remember that the container environment may not have the same PATH as your interactive shell — use full absolute paths to executables.",
      },
    ],
    faqs: [
      {
        question: "What does */15 mean in a cron expression?",
        answer:
          "The slash in cron means step. */15 in the minute field means every 15 minutes starting from 0 — so at minutes 0, 15, 30, and 45 of every hour. The asterisk before the slash means every value in the range, so */15 is equivalent to 0-59/15.",
      },
      {
        question: "What is the difference between 0 and 7 in the day-of-week field?",
        answer:
          "Both 0 and 7 represent Sunday in standard cron. The day-of-week field goes from 0 (Sunday) to 6 (Saturday), but 7 is also accepted as Sunday for compatibility. Named values SUN through SAT are supported in most cron implementations as well.",
      },
      {
        question: "Why did my cron job not run at the expected time?",
        answer:
          "The most common reasons are: timezone mismatch between the server and your expected schedule, PATH issues causing the command to not be found, the cron daemon not running, or a syntax error that caused the crontab to be rejected silently. Check system logs and verify the expression with a parser tool showing next run times.",
      },
      {
        question: "Can cron run a job every 30 seconds?",
        answer:
          "Standard five-field cron cannot schedule sub-minute intervals because the finest granularity is one minute. A workaround is to run two cron jobs one minute apart with a sleep command in the second. For true sub-minute scheduling, use a language-level scheduler like node-cron, APScheduler (Python), or a message queue with a delay.",
      },
    ],
  },
  {
    slug: "css-box-shadow-guide",
    title: "CSS Box Shadow Guide: Syntax, Examples, and Generators",
    description:
      "Master CSS box-shadow with complete syntax reference, layered shadow techniques, inset shadows, neumorphism, and performance tips for production use.",
    date: "2026-03-02",
    category: "Design",
    relatedTool: { name: "Box Shadow Generator", href: "/box-shadow-generator" },
    intro:
      "The CSS box-shadow property is one of the most versatile tools in a front-end developer\'s design arsenal. A single property can produce drop shadows, inner shadows, glows, borders, and complex layered visual effects — all without any extra HTML elements. But the syntax has multiple parameters that interact in non-obvious ways, and poor shadow usage is a common cause of UI that looks dated or cluttered. This guide covers every aspect of box-shadow from basic syntax to advanced layering techniques.",
    sections: [
      {
        h2: "Box Shadow Syntax: Every Parameter Explained",
        body: "The full box-shadow syntax is: box-shadow: [inset] offset-x offset-y [blur-radius] [spread-radius] color. Only offset-x and offset-y are required. Offset-x controls horizontal displacement: positive values move the shadow right, negative move it left. Offset-y controls vertical displacement: positive moves the shadow down, negative moves it up. Blur-radius is optional (defaults to 0): a value of 0 produces a sharp shadow with no blur, and higher values create a softer, more diffuse shadow. The blur algorithm uses a Gaussian blur, so the shadow feathers out and becomes more transparent with distance. Spread-radius is optional (defaults to 0): positive values expand the shadow in all directions, negative values contract it. Setting a large spread with zero blur creates a solid border-like effect. The color can be any CSS color value — using rgba() or hsla() to set opacity is essential for natural-looking shadows that do not look painted on. The optional inset keyword moves the shadow inside the element rather than outside it.",
      },
      {
        h2: "Layered Shadows and Real-World Design Patterns",
        body: "You can layer multiple box-shadows on a single element by comma-separating them: box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24). This technique, popularized by Google\'s Material Design, creates more realistic shadows by simulating both the ambient occlusion (soft, large, low-opacity shadow) and the direct light shadow (sharp, small, higher-opacity shadow). A single-layer shadow with high blur looks artificial; two layers at different scales look volumetric. For elevated cards, use something like: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1). Negative spread values pull the shadow inward so it does not bleed beyond the card edges on the sides. For hover states, animate the shadow to give feedback — transition: box-shadow 0.2s ease is smooth and cheap to animate compared to transform-heavy effects.",
      },
      {
        h2: "Inset Shadows and Inner Glow Effects",
        body: "The inset keyword flips the shadow to the inside of the element, casting it from the element\'s border inward. Inset shadows are useful for pressed-button states, input field focus indicators, and inner-glow effects. box-shadow: inset 0 2px 4px rgba(0,0,0,0.15) gives a subtle pressed appearance when a button is active. Inset shadows can be layered with outset shadows on the same element — just list them both in the same property, comma-separated. Neumorphism (the soft-UI trend from around 2020) relies entirely on layered inset and outset shadows in complementary light and dark shades of the background color to simulate extruded plastic or clay. A typical neumorphic card uses two shadows: one light shadow on the top-left and one dark shadow on the bottom-right. The technique looks striking but has poor accessibility — avoid it for interactive elements where shadow is the only affordance indicating interactivity.",
      },
      {
        h2: "Performance Considerations and When to Avoid Box Shadow",
        body: "Box-shadow triggers paint in the browser\'s rendering pipeline. Unlike CSS filter: drop-shadow(), which operates on the GPU compositing layer, box-shadow forces the browser to repaint the element\'s background layer. For elements that animate (slide in, scale, or fade), applying a box-shadow during the animation can cause jank on low-powered devices. The best practice for animated elements is to put the shadow on a pseudo-element (::after or ::before), then animate that pseudo-element\'s opacity separately — this isolates the shadow repaint from the transform animation and keeps the animation on the GPU. Another option is to use filter: drop-shadow() which runs on the compositor thread. Note that filter: drop-shadow() respects transparency in the element (it casts shadow through transparent pixels), while box-shadow does not — it shadows the rectangular box regardless of the element\'s visual shape.",
      },
    ],
    faqs: [
      {
        question: "Why does my box shadow get cut off inside a parent element?",
        answer:
          "The parent element likely has overflow: hidden set, which clips the child\'s box shadow along with any overflowing content. Remove overflow: hidden from the parent, or add padding to the parent element to give the shadow room to show. Alternatively, use a wrapper element that does not clip.",
      },
      {
        question: "How do I create a box shadow on only one side of an element?",
        answer:
          "Use a negative spread radius to cancel out the shadow on the sides you do not want. For a shadow only on the bottom: box-shadow: 0 4px 6px -4px rgba(0,0,0,0.3). The negative spread pulls the shadow in, and the positive y-offset pushes it down, resulting in a shadow visible only below the element.",
      },
      {
        question: "What is the difference between box-shadow and filter: drop-shadow()?",
        answer:
          "box-shadow shadows the rectangular bounding box of the element, ignoring transparent areas. filter: drop-shadow() follows the actual visible pixels, making it useful for non-rectangular elements like PNGs with transparency or SVGs. drop-shadow also runs on the GPU compositor in some browsers, but box-shadow is more widely supported for complex layering.",
      },
      {
        question: "Can I animate box-shadow for hover effects?",
        answer:
          "Yes, box-shadow is animatable with CSS transitions. Use transition: box-shadow 0.2s ease on the base element and define a different box-shadow on the :hover state. For best performance on frequently animated elements, consider the pseudo-element opacity trick or filter: drop-shadow() to keep the animation on the compositor thread.",
      },
    ],
  },
  {
    slug: "how-to-parse-csv-files",
    title: "How to Parse CSV Files: A Developer\'s Guide",
    description:
      "Learn how to parse CSV files correctly in JavaScript, Python, and Go — handling quoted fields, special characters, headers, and large files efficiently.",
    date: "2026-03-02",
    category: "Developer Guides",
    relatedTool: { name: "CSV to JSON Converter", href: "/csv-to-json" },
    intro:
      "CSV (Comma-Separated Values) is one of the oldest and most universal data exchange formats. Almost every database, spreadsheet application, and SaaS platform can export CSV, making it the de facto lingua franca for tabular data. Parsing CSV sounds simple — just split on commas, right? But the real world is messier: fields can contain commas, newlines, and quotes that require careful handling. This guide covers how CSV actually works and how to parse it correctly in popular languages.",
    sections: [
      {
        h2: "How CSV Actually Works: The RFC 4180 Standard",
        body: "RFC 4180 is the closest thing CSV has to a formal specification. The rules are: records are separated by CRLF line endings (though most parsers accept LF-only). The last record may or may not have a trailing line ending. An optional header record in the first row contains column names in the same format as data rows. Fields are separated by commas. Fields may optionally be enclosed in double quotes. If a field contains a comma, a double quote, or a newline, it must be enclosed in double quotes. A double quote inside a quoted field is escaped by doubling it. In practice, many CSV files deviate from this spec — they use semicolons or tabs as delimiters, have inconsistent quoting, use single quotes, or include BOM (byte order mark) characters at the start of the file from Windows programs like Excel. A robust CSV parser needs to handle all of these variations.",
      },
      {
        h2: "Parsing CSV in JavaScript and Node.js",
        body: "Never parse CSV with a simple string split on comma — this breaks on quoted fields containing commas. In Node.js, the csv-parse library (part of the csv project) is the most mature and RFC-compliant option. It supports streaming for large files: pipe a readable stream into parse() and process records as they arrive without loading the whole file into memory. For browser environments, the Papa Parse library is the standard — it works in both browser and Node.js, auto-detects delimiters, handles quoted fields correctly, and parses multi-gigabyte files using Web Workers. Papa Parse returns an array of objects when header: true is set, using the first row as keys. The Worker option offloads parsing to a background thread so the UI does not freeze. For simple in-browser transformations without a library, the CSV to JSON tool on this site handles conversion instantly in your browser.",
      },
      {
        h2: "Parsing CSV in Python and Go",
        body: "Python has a built-in csv module in the standard library that is fully RFC 4180 compliant. Use csv.DictReader to iterate over rows as dictionaries with column names as keys: it automatically handles quoted fields, escaped quotes, and different line endings. Specify the delimiter and quotechar parameters if the file uses non-standard separators. For large CSV files in Python, pandas read_csv() is the go-to for data science work — it handles encoding detection, type inference, chunked reading with the chunksize parameter, and can parse dates automatically. In Go, the encoding/csv package in the standard library provides a Reader that is configurable and handles quoting correctly. Set reader.Comma to a tab character for TSV files. Go\'s csv.Reader.Read() returns one record at a time, making memory-efficient streaming straightforward. Always open files with explicit encoding handling — most production CSV bugs are encoding issues, particularly files from Windows systems that use Windows-1252 or include UTF-8 BOM.",
      },
      {
        h2: "Handling Edge Cases: Encoding, Large Files, and Malformed CSV",
        body: "The most common CSV parsing failures in production come from four edge cases. First, encoding: Excel saves CSV files in the system locale encoding (often Windows-1252 on Windows, not UTF-8), which causes garbled text for accented characters when parsed as UTF-8. Always detect or specify encoding explicitly — Python\'s chardet library or the charset-normalizer package can detect encoding automatically. Second, BOM: Excel adds a UTF-8 BOM at the start of UTF-8 CSVs, which appears as a junk character in the first field name. Strip it by specifying utf-8-sig encoding in Python. Third, very large files: never load a 5GB CSV into memory all at once — use streaming parsers and process chunks. Fourth, malformed CSV from user uploads: always validate the number of fields per row, reject files with more than a configurable number of columns, and never execute any field value as code. When exporting CSV from your own application, always quote all fields that could contain user input to prevent injection attacks in downstream tools.",
      },
    ],
    faqs: [
      {
        question: "Why can\'t I just split CSV rows by commas?",
        answer:
          "Fields in CSV can contain commas if the field is quoted. For example: John,\"Smith, Jr.\",30 has three fields, not four. A naive split on commas would incorrectly treat the comma inside the quoted field as a delimiter. Always use an RFC 4180-compliant parser.",
      },
      {
        question: "What is the difference between CSV and TSV?",
        answer:
          "TSV (Tab-Separated Values) uses a tab character as the delimiter instead of a comma. TSV is often preferred for data with many commas (like text fields) because tabs are rarely present in natural text. Most CSV parsers support TSV by setting the delimiter to a tab character.",
      },
      {
        question: "How do I handle CSV files that are too large to open in Excel?",
        answer:
          "Excel has a row limit of approximately 1 million rows. For larger files, use Python with pandas read_csv() with the chunksize parameter to process the file in batches, or use command-line tools like csvkit or DuckDB which can query CSV files directly with SQL without loading them fully into memory.",
      },
      {
        question: "How should I encode special characters when generating CSV output?",
        answer:
          "Always quote any field that contains a comma, double quote, or newline. Escape double quotes inside quoted fields by doubling them. Output UTF-8 encoding. If your users will open the file in Excel on Windows, add a UTF-8 BOM at the beginning of the file to prevent character corruption.",
      },
    ],
  },
  {
    slug: "sql-vs-nosql",
    title: "SQL vs NoSQL: When to Use Each",
    description:
      "Compare SQL and NoSQL databases across data modeling, scalability, consistency, and use cases to make the right architectural choice for your project.",
    date: "2026-03-02",
    category: "Developer Guides",
    relatedTool: { name: "SQL to NoSQL Converter", href: "/sql-to-nosql" },
    intro:
      "Choosing between a SQL (relational) database and a NoSQL database is one of the most consequential early architectural decisions for any application. Both are mature, production-proven technologies, but they make very different trade-offs around data modeling, consistency, scalability, and query flexibility. The answer is rarely about which one is better in the abstract — it is about which one fits your data access patterns, team expertise, and consistency requirements.",
    sections: [
      {
        h2: "SQL Databases: Relational Model and ACID Guarantees",
        body: "SQL databases (PostgreSQL, MySQL, SQLite, SQL Server) store data in tables with predefined schemas. Rows in a table have the same columns, foreign keys enforce relationships between tables, and JOINs combine data from multiple tables at query time. The relational model was designed specifically to prevent data anomalies — duplicate data, inconsistent updates, orphaned records — through normalization. The key guarantee of SQL databases is ACID: Atomicity (a transaction either fully succeeds or fully rolls back), Consistency (the database moves from one valid state to another), Isolation (concurrent transactions do not interfere), and Durability (committed data survives crashes). These properties make SQL the right choice for financial transactions, inventory systems, user accounts, and any domain where data integrity is non-negotiable. PostgreSQL in particular is one of the most capable databases available — it supports JSONB columns for semi-structured data, full-text search, geospatial queries, and can handle billions of rows with proper indexing.",
      },
      {
        h2: "NoSQL Databases: Flexibility, Scale, and Different Trade-Offs",
        body: "NoSQL is not a single technology — it is a category that includes document databases (MongoDB, Firestore), key-value stores (Redis, DynamoDB), wide-column stores (Cassandra, HBase), and graph databases (Neo4j, Amazon Neptune). What they have in common is that they relax one or more relational constraints to gain something else: schema flexibility, horizontal scalability, or special data structure support. MongoDB stores documents as BSON (binary JSON), meaning each document in a collection can have different fields. This is useful when your data is heterogeneous or evolving rapidly. Redis stores data in memory with optional disk persistence, making it ideal for caching, session storage, pub/sub messaging, and rate limiting — operations that need sub-millisecond latency. Cassandra is designed for massive write throughput distributed across many nodes, with linear scalability — adding more nodes increases capacity proportionally. DynamoDB offers fully managed key-value and document storage with single-digit millisecond latency at any scale, but requires careful design of partition keys to avoid hot spots.",
      },
      {
        h2: "CAP Theorem and Consistency Trade-Offs",
        body: "The CAP theorem states that a distributed system can only guarantee two of three properties at once: Consistency (every read receives the most recent write), Availability (every request receives a non-error response), and Partition tolerance (the system continues operating despite network partitions between nodes). Since network partitions are a fact of life in distributed systems, the real choice is between CP (consistent but may be unavailable during partitions) and AP (available but may serve stale data). SQL databases running on a single primary node are consistent and available but not distributed by default. MongoDB and Cassandra sacrifice strong consistency for availability — they can be configured for eventual consistency, where reads may return slightly stale data but the system remains available. PostgreSQL with Citus or read replicas sits somewhere in between. For most business applications with a modest scale, a well-indexed PostgreSQL instance on modern hardware is sufficient and far simpler to operate than a NoSQL cluster.",
      },
      {
        h2: "Choosing the Right Database for Your Use Case",
        body: "Use PostgreSQL (or another SQL database) when your data is relational, integrity constraints matter, you need complex queries and aggregations, your schema is reasonably stable, and you want ACID transactions. This covers the vast majority of applications: SaaS products, e-commerce, CMS, analytics, user management, and financial systems. Use MongoDB when your data is document-centric with variable structure, you are building a content platform where each document is a self-contained unit (like blog posts or product catalogs with varying attributes), and you value developer ergonomics over strict normalization. Use Redis when you need caching, session storage, real-time leaderboards, or pub/sub messaging. Use Cassandra or DynamoDB when you need truly massive write throughput with horizontal scalability and you can design your access patterns around limited query flexibility. The most common mistake is choosing NoSQL for its hype rather than its actual trade-offs — most startups would be better served by PostgreSQL until they genuinely outgrow it.",
      },
    ],
    faqs: [
      {
        question: "Is NoSQL faster than SQL?",
        answer:
          "Not inherently. A well-indexed PostgreSQL query can return results in milliseconds. NoSQL databases like Redis are faster for specific operations (key-value lookups in memory), but for complex queries, SQL databases with proper indexes are often faster than NoSQL databases that lack JOIN support and must denormalize data. Speed depends far more on schema design and indexing than on the database type.",
      },
      {
        question: "Can PostgreSQL replace MongoDB?",
        answer:
          "For most use cases, yes. PostgreSQL\'s JSONB column type provides document-style storage with indexing, querying, and updates on nested fields. If you need schema flexibility and document storage but also want ACID transactions and SQL query power, JSONB in PostgreSQL is often the best of both worlds.",
      },
      {
        question: "What does schema-less mean in NoSQL?",
        answer:
          "Schema-less means the database does not enforce a fixed structure on documents in a collection — each document can have different fields. This provides flexibility during development but shifts schema validation to the application layer. Without application-level validation, schema-less databases can accumulate inconsistent data over time.",
      },
      {
        question: "Can I use both SQL and NoSQL in the same application?",
        answer:
          "Yes, and this is common in production systems. PostgreSQL for relational user and billing data, Redis for caching and sessions, Elasticsearch for full-text search, and S3 for file storage is a typical stack. Use each database for what it does best rather than forcing one system to handle all data types.",
      },
    ],
  },
  {
    slug: "docker-compose-explained",
    title: "Docker Compose Explained: Build Multi-Container Apps",
    description:
      "Learn Docker Compose from scratch: the compose.yml format, service definitions, networking, volumes, environment variables, and production best practices.",
    date: "2026-03-02",
    category: "DevOps",
    relatedTool: { name: "Docker Compose Generator", href: "/docker-compose" },
    intro:
      "Docker Compose is the standard tool for defining and running multi-container applications. With a single YAML file and one command — docker compose up — you can spin up a full development environment with a web server, database, cache, and background workers, all properly networked together. Understanding Docker Compose is essential for any developer working in containerized environments, and its compose.yml format is also the foundation for deploying to platforms like Railway, Render, and Docker Swarm.",
    sections: [
      {
        h2: "The compose.yml Format: Services, Images, and Builds",
        body: "A Docker Compose file (compose.yml or docker-compose.yml) is a YAML document with a top-level services key containing named service definitions. Each service definition specifies how to run one container. The image key pulls a pre-built image from Docker Hub or a registry: image: postgres:16-alpine. The build key builds an image from a Dockerfile in your project: build: . or a more specific context and dockerfile path. The command key overrides the default command defined in the image\'s CMD instruction. The ports key maps host ports to container ports: \"3000:3000\" maps host port 3000 to container port 3000. The depends_on key declares startup order dependencies: your API service can depend_on the database service. Note that depends_on only waits for the container to start, not for the service inside it to be ready — use healthcheck in combination with depends_on condition: service_healthy for true readiness waiting. The restart key (always, unless-stopped, on-failure) controls restart behavior for production-like setups.",
      },
      {
        h2: "Networking and Service Discovery in Compose",
        body: "By default, Docker Compose creates a single network for your entire project and attaches all services to it. Services can reference each other by their service name as a hostname — this is Compose\'s built-in service discovery. If your API service is named api and your database is named db, the API container can connect to the database using the hostname db and the port defined in the database container (not the host-mapped port). For example, PostgreSQL in a compose service named db is reachable at db:5432 from other containers in the same project, regardless of what host port you map. You can define additional networks for more complex topologies: a frontend service on a public network and backend services on a private network, with an API service bridging both. The networks key at the top level defines custom networks, and each service\'s networks key lists which networks it joins. This is useful for segmenting traffic and simulating production network topologies locally.",
      },
      {
        h2: "Volumes, Bind Mounts, and Persistent Data",
        body: "Containers are ephemeral — any data written inside a container is lost when the container is removed. Volumes and bind mounts solve this. Named volumes are managed by Docker and persist across container restarts and removals: define them under the top-level volumes key and reference them in service definitions. Docker stores named volumes in a managed location on the host filesystem. Bind mounts map a specific path on the host into the container: \"./src:/app/src\" mounts your local source code directory into the container, enabling live code reload in development without rebuilding the image on every change. For databases, always use named volumes (not bind mounts) to avoid file permission issues across operating systems. The volumes section also supports external volumes (created outside Compose) and volume drivers for cloud storage backends. In production, prefer named volumes or managed database services over bind-mounted data directories.",
      },
      {
        h2: "Environment Variables, Secrets, and Compose Profiles",
        body: "Docker Compose has several ways to inject configuration into containers. The environment key sets environment variables directly in the compose file — acceptable for non-secret config (PORT, NODE_ENV, LOG_LEVEL) but never for secrets. The env_file key loads variables from a .env file. Compose automatically loads a .env file from the project directory to interpolate variables into the compose file itself. For secrets in production, use Docker Secrets (available in Swarm mode) or inject secrets at runtime via your orchestration platform\'s secret management. Compose profiles let you define services that only start when explicitly requested: add profiles: [\"dev\"] to a service, and it will only start when you run docker compose with the profile flag. This is useful for optional services like database admin UIs, seed data containers, or monitoring tools that you do not want running by default. Override files (docker-compose.override.yml) are automatically merged with the base compose file, providing a clean way to separate development-specific settings from production config.",
      },
    ],
    faqs: [
      {
        question: "What is the difference between docker-compose and docker compose?",
        answer:
          "docker-compose (with a hyphen) is the older standalone Python binary (Compose V1). docker compose (without a hyphen) is the newer Go-based plugin integrated directly into the Docker CLI (Compose V2). Compose V2 is faster, ships with Docker Desktop, and is now the default. The file format is compatible between versions, but Compose V2 is preferred for all new projects.",
      },
      {
        question: "How do I make Compose wait for a database to be ready before starting my app?",
        answer:
          "Add a healthcheck to your database service that runs a connectivity check (pg_isready for PostgreSQL, mysqladmin ping for MySQL). Then in the dependent service, use depends_on with condition: service_healthy instead of just listing the service name. This makes Compose wait until the healthcheck passes before starting the dependent container.",
      },
      {
        question: "Can I use Docker Compose in production?",
        answer:
          "Yes, for single-server deployments. Docker Compose works well for small-to-medium production workloads running on one machine. For multi-server deployments with high availability, use Docker Swarm (which uses the same compose file format) or Kubernetes. Platforms like Render, Railway, and Fly.io also accept Compose files as deployment specs.",
      },
      {
        question: "How do I rebuild containers after changing my Dockerfile?",
        answer:
          "Run docker compose build to rebuild images without starting containers, or docker compose up --build to rebuild and start in one step. Docker caches each Dockerfile instruction as a layer — only instructions that changed (and all subsequent instructions) are re-executed. To force a complete rebuild without cache, add the --no-cache flag.",
      },
    ],
  },
  {
    slug: "nginx-config-guide",
    title: "NGINX Configuration Guide: Server Blocks, Proxies, SSL",
    description:
      "A practical NGINX configuration guide covering server blocks, reverse proxy setup, SSL termination with Let\'s Encrypt, performance tuning, and security headers.",
    date: "2026-03-02",
    category: "DevOps",
    relatedTool: { name: "NGINX Config Generator", href: "/nginx-config" },
    intro:
      "NGINX is the world\'s most popular web server, used by over 34% of all websites according to Netcraft\'s 2025 survey. Beyond static file serving, it is also the standard reverse proxy for Node.js, Python, Go, and other application servers — handling SSL termination, load balancing, rate limiting, and HTTP/2 before traffic ever reaches your application. Understanding how to read and write NGINX configuration is a foundational DevOps skill that will serve you across nearly every production stack.",
    sections: [
      {
        h2: "NGINX Configuration Structure: Contexts and Directives",
        body: "NGINX configuration is organized into nested contexts, each with a specific scope. The main context (top level, outside any block) sets global options like worker_processes and error_log. The events context configures connection handling: worker_connections 1024 sets how many connections each worker process can handle simultaneously. The http context contains all HTTP server configuration: mime types, gzip, logging formats, and server blocks. Inside http, each server block defines a virtual host — it listens on a port, matches server names, and specifies how to handle requests. Inside a server block, location blocks match URL paths with different handling rules. NGINX uses a deterministic priority system to select which server block and location block handles each request: exact matches beat prefix matches, and prefix matches with the longest string win over shorter ones. Regular expression locations are checked after prefix matches. Understanding this matching order is essential for debugging unexpected routing behavior.",
      },
      {
        h2: "Reverse Proxy Configuration for Application Servers",
        body: "The most common NGINX use case in modern infrastructure is as a reverse proxy in front of an application server. The proxy_pass directive forwards requests to a backend: proxy_pass http://localhost:3000 sends requests to a Node.js app on port 3000. Always include the essential proxy headers so your application receives correct client information. proxy_set_header Host $host passes the original Host header. proxy_set_header X-Real-IP $remote_addr passes the client\'s real IP address (otherwise your app sees NGINX\'s loopback address). proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for appends to the forwarded-for chain. proxy_set_header X-Forwarded-Proto $scheme tells the app whether the original request was HTTP or HTTPS — critical for generating correct redirect URLs and CSRF validation. For WebSocket proxying, add proxy_http_version 1.1 and the appropriate Upgrade and Connection headers to handle the HTTP-to-WebSocket protocol upgrade. For load balancing across multiple backend instances, define an upstream block with server directives listing each backend address.",
      },
      {
        h2: "SSL Termination with Let\'s Encrypt and Certbot",
        body: "NGINX handles SSL/TLS termination, decrypting HTTPS traffic and forwarding plain HTTP to your application servers on localhost. The standard setup uses Let\'s Encrypt for free certificates managed by Certbot. After installing certbot and the python3-certbot-nginx plugin, run certbot --nginx -d yourdomain.com and Certbot automatically modifies your NGINX server block to add the SSL listen directive, certificate paths, and include directives for SSL parameters. Always redirect HTTP to HTTPS with a server block listening on port 80 that returns a 301 redirect to the https:// version. For SSL performance, enable ssl_session_cache and ssl_session_timeout to allow session resumption without a full TLS handshake. Use ssl_protocols TLSv1.2 TLSv1.3 to disable older insecure protocols. The HSTS header (Strict-Transport-Security: max-age=31536000; includeSubDomains) tells browsers to always use HTTPS for the next year, preventing downgrade attacks.",
      },
      {
        h2: "Performance Tuning and Security Headers",
        body: "NGINX\'s default configuration is conservative. For production, set worker_processes auto to use one worker per CPU core. Increase worker_connections to 4096 or higher on machines with many concurrent connections. Enable gzip compression with gzip on and gzip_types covering text/plain, text/css, application/json, application/javascript, text/xml, and application/xml — this reduces transfer size by 60-80% for text-based content. Set gzip_min_length 256 to avoid compressing tiny files. For static assets, add aggressive cache headers using expires 1y and Cache-Control: public, immutable. Enable open_file_cache to avoid repeated stat() syscalls on repeated requests to the same files. For security headers, add: X-Content-Type-Options: nosniff to prevent MIME-type sniffing attacks. X-Frame-Options: SAMEORIGIN to prevent clickjacking. Content-Security-Policy to restrict which resources can be loaded. Referrer-Policy: strict-origin-when-cross-origin to limit referrer information leakage. These headers are a first line of defense that add zero latency.",
      },
    ],
    faqs: [
      {
        question: "What is the difference between NGINX and Apache?",
        answer:
          "NGINX uses an event-driven, asynchronous architecture that handles thousands of concurrent connections with a small number of worker processes. Apache traditionally uses a thread-per-connection model that uses more memory under high concurrency. NGINX is generally faster for static files and reverse proxying; Apache has a richer module ecosystem and per-directory configuration via .htaccess files.",
      },
      {
        question: "How do I reload NGINX configuration without downtime?",
        answer:
          "Run nginx -t first to validate the configuration syntax — never reload with a broken config. Then run nginx -s reload or systemctl reload nginx to send the HUP signal. NGINX gracefully completes active connections on old workers while new workers pick up the updated configuration, achieving zero downtime with no dropped connections.",
      },
      {
        question: "Why am I getting a 502 Bad Gateway error in NGINX?",
        answer:
          "A 502 means NGINX successfully connected to the upstream (your app server) but received an invalid response or no response. Common causes: the upstream process crashed and is not listening on the expected port, it returned a non-HTTP response, or the upstream took too long to respond. Check your application logs — NGINX\'s error_log will show connection refused or upstream timed out messages.",
      },
      {
        question: "How do I serve a React or Next.js app with NGINX?",
        answer:
          "For a static React build, point root to the build directory and add try_files $uri $uri/ /index.html to serve the SPA correctly for all client-side routes. For Next.js with a Node.js server, run the Next.js process on a local port and use NGINX as a reverse proxy with proxy_pass. For Next.js static export, serve it like a static React app.",
      },
    ],
  },
  {
    slug: "what-is-a-hash-function",
    title: "What Is a Hash Function? MD5, SHA-256 and Bcrypt Explained",
    description:
      "Learn how hash functions work, the differences between MD5, SHA-1, SHA-256, and bcrypt, and when to use each for checksums, passwords, and data integrity.",
    date: "2026-03-02",
    category: "Security",
    relatedTool: { name: "Hash Generator", href: "/hash-generator" },
    intro:
      "A hash function is a mathematical algorithm that takes an input of any size and produces a fixed-size output — called a hash, digest, or checksum. Hash functions are everywhere in software: verifying file downloads, storing passwords, building blockchain ledgers, deduplicating data, and powering hash tables in every programming language. Understanding the properties that make a hash function useful — and the critical differences between fast hashes and password hashes — is essential knowledge for any developer building secure systems.",
    sections: [
      {
        h2: "Core Properties of Cryptographic Hash Functions",
        body: "A cryptographic hash function must satisfy four properties to be useful for security. Determinism: the same input always produces the same output. Pre-image resistance: given a hash output, it must be computationally infeasible to find the original input — this is the one-way property. Second pre-image resistance: given an input and its hash, it must be infeasible to find a different input that produces the same hash. Collision resistance: it must be infeasible to find any two different inputs that produce the same hash output. These properties make hashes useful for verifying integrity (if the hash of a downloaded file matches the published hash, the file is unmodified), storing passwords (the hash is stored, not the password), and digital signatures (a hash of a document is signed, not the full document). The avalanche effect is also important: changing a single bit in the input should change approximately half the bits in the output — this prevents partial information leakage.",
      },
      {
        h2: "MD5 and SHA-1: Broken and Legacy",
        body: "MD5 produces a 128-bit (32 hex character) hash and SHA-1 produces a 160-bit (40 hex character) hash. Both were once widely used for file integrity verification and password storage. MD5 was broken for collision resistance in 2004 — researchers demonstrated that two different inputs could be crafted to produce the same MD5 hash. SHA-1 was theoretically broken in 2005 and practically broken in 2017 when Google\'s SHAttered project produced two different PDF files with the same SHA-1 hash. Neither should be used for any new security application. However, they remain in use for non-security purposes: MD5 is still used as a fast non-cryptographic checksum for detecting accidental data corruption, and many legacy systems still use SHA-1 internally. If you are auditing an existing codebase, any MD5 or SHA-1 usage in authentication, digital signatures, or certificate contexts should be flagged as a vulnerability.",
      },
      {
        h2: "SHA-256 and the SHA-2 and SHA-3 Families",
        body: "SHA-256 is the current workhorse of cryptographic hashing. It produces a 256-bit (64 hex character) output and has no known practical vulnerabilities. SHA-256 is used in TLS certificates, Bitcoin mining (as a proof-of-work function), HMAC authentication for APIs (HMAC-SHA256 is the standard for JWT signatures and AWS request signing), and general-purpose data integrity verification. SHA-512 provides a 512-bit output and is marginally faster than SHA-256 on 64-bit hardware due to its wider internal block size. The SHA-2 family (SHA-224, SHA-256, SHA-384, SHA-512) uses a similar construction to SHA-1 but with a significantly larger state size that prevents the known attacks. SHA-3 (Keccak) uses a completely different internal structure (sponge construction rather than Merkle-Damgard) and is standardized as a backup in case weaknesses are found in SHA-2. For general-purpose hashing in 2026, SHA-256 remains the standard recommendation unless you have a specific reason to need SHA-3.",
      },
      {
        h2: "Bcrypt, Argon2, and Password-Specific Hashing",
        body: "The most critical distinction in the hashing world is between general-purpose cryptographic hashes (MD5, SHA-256) and password hashing functions (bcrypt, scrypt, Argon2). General-purpose hashes are designed to be fast — SHA-256 can compute billions of hashes per second on modern hardware. This is a feature for integrity verification, but a serious vulnerability for password storage: an attacker who obtains your password database can run GPU-accelerated brute-force attacks at billions of guesses per second. Password hashing functions are intentionally slow and configurable. Bcrypt performs thousands of Blowfish cipher rounds, taking 100-300ms per hash. Scrypt adds memory-hardness, requiring large amounts of RAM per hash to resist GPU and ASIC attacks. Argon2 (winner of the 2015 Password Hashing Competition) provides configurable time, memory, and parallelism parameters and is the current OWASP recommendation for new systems. Argon2id (the hybrid variant) is the strongest choice for password hashing in 2026. Never use SHA-256 directly for passwords, even with a salt — always use a dedicated password hashing function.",
      },
    ],
    faqs: [
      {
        question: "Is MD5 safe to use in 2026?",
        answer:
          "MD5 is not safe for any cryptographic purpose — it is broken for collision resistance. Do not use it for password hashing, digital signatures, or certificate fingerprints. It is still acceptable as a fast non-cryptographic checksum for detecting accidental data corruption (not intentional tampering), as in file transfer integrity checks where collision attacks are not a threat.",
      },
      {
        question: "What is the difference between hashing and encryption?",
        answer:
          "Hashing is one-way — you cannot reverse a hash to get the original input (without brute force). Encryption is two-way — data encrypted with a key can be decrypted with the correct key. Use hashing for passwords and integrity verification. Use encryption for data you need to recover in its original form, like user files or sensitive records.",
      },
      {
        question: "What is a salt and why is it necessary?",
        answer:
          "A salt is a random value added to an input before hashing, making each hash unique even for identical inputs. Without a salt, two users with the same password produce the same hash, and precomputed rainbow tables can instantly reverse common password hashes. A salt forces attackers to brute-force each password individually. Modern password hashing functions like bcrypt and Argon2 generate and embed salts automatically.",
      },
      {
        question: "What does HMAC-SHA256 mean?",
        answer:
          "HMAC (Hash-based Message Authentication Code) is a construction that uses a secret key combined with a hash function to produce a message authentication code. HMAC-SHA256 means HMAC using SHA-256 as the underlying hash. It provides both integrity (the message was not modified) and authenticity (the message came from someone with the secret key). It is the standard for JWT signing with shared secrets and API request signing in AWS, Stripe, and many other services.",
      },
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
  return blogPosts.map((p) => p.slug);
}
