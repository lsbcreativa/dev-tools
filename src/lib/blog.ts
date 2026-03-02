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
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
  return blogPosts.map((p) => p.slug);
}
