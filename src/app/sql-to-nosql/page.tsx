"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";

/* ---------- Converter ---------- */

function sqlToMongo(sql: string): string {
  const trimmed = sql.trim().replace(/;$/, "").trim();
  if (!trimmed) return "";

  const upper = trimmed.toUpperCase();

  // ---- SELECT ----
  if (upper.startsWith("SELECT")) {
    return convertSelect(trimmed);
  }

  // ---- INSERT ----
  if (upper.startsWith("INSERT")) {
    return convertInsert(trimmed);
  }

  // ---- UPDATE ----
  if (upper.startsWith("UPDATE")) {
    return convertUpdate(trimmed);
  }

  // ---- DELETE ----
  if (upper.startsWith("DELETE")) {
    return convertDelete(trimmed);
  }

  // ---- CREATE TABLE ----
  if (upper.startsWith("CREATE TABLE")) {
    return convertCreateTable(trimmed);
  }

  // ---- DROP TABLE ----
  if (upper.startsWith("DROP TABLE")) {
    const m = trimmed.match(/DROP\s+TABLE\s+(?:IF\s+EXISTS\s+)?(\w+)/i);
    const table = m?.[1] || "collection";
    return `db.${table}.drop()`;
  }

  return "// Unsupported SQL statement. Supported: SELECT, INSERT, UPDATE, DELETE, CREATE TABLE, DROP TABLE.";
}

/* ---------- SELECT ---------- */

function convertSelect(sql: string): string {
  // Extract parts
  const fromMatch = sql.match(/FROM\s+(\w+)/i);
  const collection = fromMatch?.[1] || "collection";

  // Fields
  const selectMatch = sql.match(/SELECT\s+(.*?)\s+FROM/i);
  const fieldsRaw = selectMatch?.[1]?.trim() || "*";
  let projection = "";
  if (fieldsRaw !== "*") {
    const fields = fieldsRaw.split(",").map((f) => f.trim());
    const proj: Record<string, number> = {};
    fields.forEach((f) => {
      // Handle aliases (e.g., name AS n)
      const clean = f.split(/\s+AS\s+/i)[0].trim();
      if (clean !== "*") proj[clean] = 1;
    });
    projection = `, ${JSON.stringify(proj)}`;
  }

  // WHERE
  const filter = parseWhere(sql);

  // ORDER BY
  const orderMatch = sql.match(/ORDER\s+BY\s+(.+?)(?:\s+LIMIT|\s+OFFSET|\s*$)/i);
  let sort = "";
  if (orderMatch) {
    const parts = orderMatch[1].split(",").map((p) => p.trim());
    const sortObj: Record<string, number> = {};
    parts.forEach((p) => {
      const [col, dir] = p.split(/\s+/);
      sortObj[col] = dir?.toUpperCase() === "DESC" ? -1 : 1;
    });
    sort = `.sort(${JSON.stringify(sortObj)})`;
  }

  // LIMIT
  const limitMatch = sql.match(/LIMIT\s+(\d+)/i);
  const limit = limitMatch ? `.limit(${limitMatch[1]})` : "";

  // OFFSET / SKIP
  const offsetMatch = sql.match(/OFFSET\s+(\d+)/i);
  const skip = offsetMatch ? `.skip(${offsetMatch[1]})` : "";

  // COUNT
  if (/SELECT\s+COUNT\s*\(\s*\*?\s*\)/i.test(sql)) {
    return `db.${collection}.countDocuments(${filter})`;
  }

  // DISTINCT
  const distinctMatch = sql.match(/SELECT\s+DISTINCT\s+(\w+)/i);
  if (distinctMatch) {
    return `db.${collection}.distinct("${distinctMatch[1]}", ${filter})`;
  }

  return `db.${collection}.find(${filter}${projection})${sort}${skip}${limit}`;
}

/* ---------- WHERE parser ---------- */

function parseWhere(sql: string): string {
  const whereMatch = sql.match(/WHERE\s+(.+?)(?:\s+ORDER\s+BY|\s+GROUP\s+BY|\s+LIMIT|\s+OFFSET|\s*$)/i);
  if (!whereMatch) return "{}";

  const raw = whereMatch[1].trim();
  return parseConditions(raw);
}

function parseConditions(raw: string): string {
  // Handle OR
  const orParts = splitOutsideParens(raw, /\s+OR\s+/i);
  if (orParts.length > 1) {
    const parts = orParts.map((p) => parseConditions(p.trim()));
    return `{ $or: [${parts.join(", ")}] }`;
  }

  // Handle AND
  const andParts = splitOutsideParens(raw, /\s+AND\s+/i);
  if (andParts.length > 1) {
    const merged: Record<string, unknown> = {};
    andParts.forEach((p) => {
      const parsed = JSON.parse(parseCondition(p.trim()));
      Object.assign(merged, parsed);
    });
    return JSON.stringify(merged);
  }

  return parseCondition(raw);
}

function splitOutsideParens(str: string, sep: RegExp): string[] {
  const results: string[] = [];
  let depth = 0;
  let last = 0;

  for (let i = 0; i < str.length; i++) {
    if (str[i] === "(") depth++;
    if (str[i] === ")") depth--;
    if (depth === 0) {
      const remaining = str.slice(i);
      const m = remaining.match(sep);
      if (m && m.index === 0) {
        results.push(str.slice(last, i));
        last = i + m[0].length;
        i = last - 1;
      }
    }
  }
  results.push(str.slice(last));
  return results;
}

function parseCondition(cond: string): string {
  const c = cond.trim();

  // IS NULL / IS NOT NULL
  const nullMatch = c.match(/^(\w+)\s+IS\s+(NOT\s+)?NULL$/i);
  if (nullMatch) {
    const field = nullMatch[1];
    return nullMatch[2]
      ? `{ "${field}": { $ne: null } }`
      : `{ "${field}": null }`;
  }

  // IN (...)
  const inMatch = c.match(/^(\w+)\s+(NOT\s+)?IN\s*\((.+)\)$/i);
  if (inMatch) {
    const field = inMatch[1];
    const vals = inMatch[3].split(",").map((v) => cleanVal(v.trim()));
    const op = inMatch[2] ? "$nin" : "$in";
    return `{ "${field}": { ${op}: [${vals.join(", ")}] } }`;
  }

  // LIKE
  const likeMatch = c.match(/^(\w+)\s+(NOT\s+)?LIKE\s+'(.+)'$/i);
  if (likeMatch) {
    const field = likeMatch[1];
    let pattern = likeMatch[3].replace(/%/g, ".*").replace(/_/g, ".");
    if (!pattern.startsWith(".*")) pattern = "^" + pattern;
    if (!pattern.endsWith(".*")) pattern = pattern + "$";
    const negate = likeMatch[2] ? "Not" : "";
    return `{ "${field}": { $${negate ? "not" : "regex"}: /${pattern}/i } }`;
  }

  // BETWEEN
  const betweenMatch = c.match(/^(\w+)\s+BETWEEN\s+(.+)\s+AND\s+(.+)$/i);
  if (betweenMatch) {
    const field = betweenMatch[1];
    return `{ "${field}": { $gte: ${cleanVal(betweenMatch[2])}, $lte: ${cleanVal(betweenMatch[3])} } }`;
  }

  // Comparison operators
  const compMatch = c.match(/^(\w+)\s*(!=|<>|>=|<=|>|<|=)\s*(.+)$/);
  if (compMatch) {
    const field = compMatch[1];
    const op = compMatch[2];
    const val = cleanVal(compMatch[3].trim());

    const opMap: Record<string, string> = {
      "=": "",
      "!=": "$ne",
      "<>": "$ne",
      ">": "$gt",
      ">=": "$gte",
      "<": "$lt",
      "<=": "$lte",
    };

    const mongoOp = opMap[op];
    if (mongoOp === "") return `{ "${field}": ${val} }`;
    return `{ "${field}": { ${mongoOp}: ${val} } }`;
  }

  return `{ /* ${c} */ }`;
}

function cleanVal(v: string): string {
  const t = v.trim();
  if ((t.startsWith("'") && t.endsWith("'")) || (t.startsWith('"') && t.endsWith('"'))) {
    return `"${t.slice(1, -1)}"`;
  }
  if (/^-?\d+(\.\d+)?$/.test(t)) return t;
  if (t.toUpperCase() === "TRUE") return "true";
  if (t.toUpperCase() === "FALSE") return "false";
  if (t.toUpperCase() === "NULL") return "null";
  return `"${t}"`;
}

/* ---------- INSERT ---------- */

function convertInsert(sql: string): string {
  const m = sql.match(/INSERT\s+INTO\s+(\w+)\s*\(([^)]+)\)\s*VALUES\s*\(([^)]+)\)/i);
  if (!m) return "// Could not parse INSERT statement";

  const collection = m[1];
  const cols = m[2].split(",").map((c) => c.trim());
  const vals = m[3].split(",").map((v) => cleanVal(v.trim()));

  const doc: Record<string, string> = {};
  cols.forEach((c, i) => {
    doc[c] = vals[i] || "null";
  });

  const docStr = "{\n" + Object.entries(doc).map(([k, v]) => `  ${k}: ${v}`).join(",\n") + "\n}";
  return `db.${collection}.insertOne(${docStr})`;
}

/* ---------- UPDATE ---------- */

function convertUpdate(sql: string): string {
  const tableMatch = sql.match(/UPDATE\s+(\w+)\s+SET/i);
  const collection = tableMatch?.[1] || "collection";

  const setMatch = sql.match(/SET\s+(.+?)(?:\s+WHERE|$)/i);
  if (!setMatch) return "// Could not parse UPDATE statement";

  const setParts = setMatch[1].split(",").map((p) => p.trim());
  const setObj: Record<string, string> = {};
  setParts.forEach((p) => {
    const [col, val] = p.split("=").map((s) => s.trim());
    setObj[col] = cleanVal(val);
  });

  const filter = parseWhere(sql);
  const setStr = "{ " + Object.entries(setObj).map(([k, v]) => `${k}: ${v}`).join(", ") + " }";

  return `db.${collection}.updateMany(${filter}, { $set: ${setStr} })`;
}

/* ---------- DELETE ---------- */

function convertDelete(sql: string): string {
  const tableMatch = sql.match(/DELETE\s+FROM\s+(\w+)/i);
  const collection = tableMatch?.[1] || "collection";
  const filter = parseWhere(sql);

  return `db.${collection}.deleteMany(${filter})`;
}

/* ---------- CREATE TABLE ---------- */

function convertCreateTable(sql: string): string {
  const m = sql.match(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(\w+)\s*\(([\s\S]+)\)/i);
  if (!m) return "// Could not parse CREATE TABLE statement";

  const collection = m[1];
  const body = m[2];

  const lines: string[] = [];
  lines.push(`// MongoDB is schema-less, but you can use validation:`);
  lines.push(`db.createCollection("${collection}", {`);
  lines.push(`  validator: {`);
  lines.push(`    $jsonSchema: {`);
  lines.push(`      bsonType: "object",`);
  lines.push(`      properties: {`);

  const cols = body.split(",").map((c) => c.trim()).filter((c) => !c.match(/^\s*(PRIMARY|UNIQUE|INDEX|KEY|CONSTRAINT|FOREIGN)/i));
  cols.forEach((col) => {
    const parts = col.split(/\s+/);
    const name = parts[0];
    const type = parts[1]?.toUpperCase() || "STRING";
    let bsonType = "string";
    if (type.startsWith("INT") || type.startsWith("BIGINT") || type.startsWith("SMALLINT")) bsonType = "int";
    else if (type.startsWith("FLOAT") || type.startsWith("DOUBLE") || type.startsWith("DECIMAL") || type.startsWith("NUMERIC")) bsonType = "double";
    else if (type.startsWith("BOOL")) bsonType = "bool";
    else if (type.startsWith("DATE") || type.startsWith("TIMESTAMP")) bsonType = "date";
    else if (type.startsWith("TEXT") || type.startsWith("VARCHAR") || type.startsWith("CHAR")) bsonType = "string";

    lines.push(`        ${name}: { bsonType: "${bsonType}" },`);
  });

  lines.push(`      }`);
  lines.push(`    }`);
  lines.push(`  }`);
  lines.push(`})`);

  return lines.join("\n");
}

/* ---------- Presets ---------- */

const PRESETS = [
  {
    label: "SELECT with WHERE",
    value: `SELECT name, email FROM users WHERE age >= 18 AND status = 'active' ORDER BY name ASC LIMIT 10`,
  },
  {
    label: "INSERT",
    value: `INSERT INTO users (name, email, age) VALUES ('John Doe', 'john@example.com', 30)`,
  },
  {
    label: "UPDATE",
    value: `UPDATE users SET status = 'inactive', updated_at = '2024-01-01' WHERE last_login < '2023-01-01'`,
  },
  {
    label: "DELETE",
    value: `DELETE FROM sessions WHERE expires_at < '2024-01-01' AND user_id = 42`,
  },
];

/* ---------- Component ---------- */

export default function SqlToNosqlPage() {
  const [input, setInput] = useState("");

  const output = useMemo(() => {
    if (!input.trim()) return "";
    try {
      return sqlToMongo(input);
    } catch {
      return "// Error parsing SQL. Check your syntax.";
    }
  }, [input]);

  return (
    <ToolLayout
      title="SQL to MongoDB Converter"
      description="Convert SQL queries to MongoDB equivalents. SELECT, INSERT, UPDATE, DELETE to find, insertOne, updateOne, deleteOne."
      slug="sql-to-nosql"
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

      {/* Input */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium">SQL Query</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="SELECT * FROM users WHERE age > 18 ORDER BY name LIMIT 10"
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] p-3 text-sm font-mono"
          rows={5}
          spellCheck={false}
        />
      </div>

      {/* Output */}
      {output && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">MongoDB equivalent</span>
            <CopyButton text={output} />
          </div>
          <pre className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4 text-sm font-mono overflow-x-auto max-h-[500px] whitespace-pre-wrap">
            {output}
          </pre>
        </div>
      )}

      {/* Reference table */}
      <div className="mt-6">
        <h3 className="text-sm font-medium mb-3">Quick Reference</h3>
        <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--muted)]">
                <th className="px-4 py-2 text-left font-medium">SQL</th>
                <th className="px-4 py-2 text-left font-medium">MongoDB</th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs">
              {[
                ["SELECT", "find()"],
                ["SELECT DISTINCT", "distinct()"],
                ["INSERT INTO", "insertOne()"],
                ["UPDATE ... SET", "updateMany() + $set"],
                ["DELETE FROM", "deleteMany()"],
                ["WHERE", "filter document"],
                ["AND", "comma-separated fields"],
                ["OR", "$or: [...]"],
                ["IN (...)", "$in: [...]"],
                ["LIKE '%..%'", "$regex"],
                ["ORDER BY", ".sort()"],
                ["LIMIT", ".limit()"],
                ["OFFSET", ".skip()"],
                ["COUNT(*)", "countDocuments()"],
              ].map(([sql, mongo]) => (
                <tr key={sql} className="border-b border-[var(--border)] last:border-0">
                  <td className="px-4 py-2">{sql}</td>
                  <td className="px-4 py-2 text-[var(--primary)]">{mongo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ToolLayout>
  );
}
