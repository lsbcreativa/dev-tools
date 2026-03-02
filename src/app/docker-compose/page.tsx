"use client";

import { useState } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";

interface ParsedDockerRun {
  image: string;
  name?: string;
  ports: string[];
  volumes: string[];
  envVars: string[];
  detached: boolean;
  restart?: string;
  network?: string;
  memory?: string;
  extraFlags: string[];
}

function tokenize(command: string): string[] {
  const tokens: string[] = [];
  let current = "";
  let inSingle = false;
  let inDouble = false;
  let escape = false;

  for (const ch of command) {
    if (escape) {
      current += ch;
      escape = false;
      continue;
    }
    if (ch === "\\") {
      escape = true;
      continue;
    }
    if (ch === "'" && !inDouble) {
      inSingle = !inSingle;
      continue;
    }
    if (ch === '"' && !inSingle) {
      inDouble = !inDouble;
      continue;
    }
    if ((ch === " " || ch === "\t") && !inSingle && !inDouble) {
      if (current.length > 0) {
        tokens.push(current);
        current = "";
      }
      continue;
    }
    current += ch;
  }
  if (current.length > 0) tokens.push(current);
  return tokens;
}

function parseDockerRun(command: string): ParsedDockerRun {
  const cleaned = command
    .replace(/\\\n/g, " ")
    .replace(/\n/g, " ")
    .trim();

  const tokens = tokenize(cleaned);

  // Find "docker run" start
  let startIdx = -1;
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] === "docker" && tokens[i + 1] === "run") {
      startIdx = i + 2;
      break;
    }
    if (tokens[i] === "run" && i === 0) {
      startIdx = i + 1;
      break;
    }
  }

  if (startIdx === -1) {
    throw new Error(
      'Invalid command: must start with "docker run". Example: docker run -d -p 80:80 nginx'
    );
  }

  const result: ParsedDockerRun = {
    image: "",
    ports: [],
    volumes: [],
    envVars: [],
    detached: false,
    extraFlags: [],
  };

  let i = startIdx;
  while (i < tokens.length) {
    const token = tokens[i];

    if (token === "-p" || token === "--publish") {
      i++;
      if (i < tokens.length) result.ports.push(tokens[i]);
    } else if (token.startsWith("-p=")) {
      result.ports.push(token.slice(3));
    } else if (token === "-v" || token === "--volume") {
      i++;
      if (i < tokens.length) result.volumes.push(tokens[i]);
    } else if (token.startsWith("-v=")) {
      result.volumes.push(token.slice(3));
    } else if (token === "-e" || token === "--env") {
      i++;
      if (i < tokens.length) result.envVars.push(tokens[i]);
    } else if (token.startsWith("-e=")) {
      result.envVars.push(token.slice(3));
    } else if (token.startsWith("--env=")) {
      result.envVars.push(token.slice(6));
    } else if (token === "--name") {
      i++;
      if (i < tokens.length) result.name = tokens[i];
    } else if (token.startsWith("--name=")) {
      result.name = token.slice(7);
    } else if (token === "-d" || token === "--detach") {
      result.detached = true;
    } else if (token === "--restart") {
      i++;
      if (i < tokens.length) result.restart = tokens[i];
    } else if (token.startsWith("--restart=")) {
      result.restart = token.slice(10);
    } else if (token === "--network" || token === "--net") {
      i++;
      if (i < tokens.length) result.network = tokens[i];
    } else if (token.startsWith("--network=")) {
      result.network = token.slice(10);
    } else if (token.startsWith("--net=")) {
      result.network = token.slice(6);
    } else if (token === "--memory" || token === "-m") {
      i++;
      if (i < tokens.length) result.memory = tokens[i];
    } else if (token.startsWith("--memory=")) {
      result.memory = token.slice(9);
    } else if (token.startsWith("-m=")) {
      result.memory = token.slice(3);
    } else if (token.startsWith("-") && !token.startsWith("--")) {
      // Handle combined short flags like -dit
      const flags = token.slice(1);
      for (const f of flags) {
        if (f === "d") {
          result.detached = true;
        } else if (f === "p") {
          i++;
          if (i < tokens.length) result.ports.push(tokens[i]);
        } else if (f === "v") {
          i++;
          if (i < tokens.length) result.volumes.push(tokens[i]);
        } else if (f === "e") {
          i++;
          if (i < tokens.length) result.envVars.push(tokens[i]);
        } else if (f === "m") {
          i++;
          if (i < tokens.length) result.memory = tokens[i];
        }
      }
    } else if (token.startsWith("--")) {
      // Unknown long flag; skip its value if next token does not look like a flag
      result.extraFlags.push(token);
      if (i + 1 < tokens.length && !tokens[i + 1].startsWith("-")) {
        i++;
      }
    } else {
      // This should be the image (possibly with tag)
      result.image = token;
      // Everything after the image is the command
      break;
    }
    i++;
  }

  if (!result.image) {
    throw new Error(
      "Could not identify a Docker image in the command. Make sure your command includes an image name (e.g. nginx, postgres:15)."
    );
  }

  return result;
}

function generateCompose(parsed: ParsedDockerRun): string {
  const serviceName = parsed.name || parsed.image.split(":")[0].split("/").pop() || "app";
  const lines: string[] = [];

  lines.push("version: '3.8'");
  lines.push("");
  lines.push("services:");
  lines.push(`  ${serviceName}:`);
  lines.push(`    image: ${parsed.image}`);

  if (parsed.name) {
    lines.push(`    container_name: ${parsed.name}`);
  }

  if (parsed.restart) {
    lines.push(`    restart: ${parsed.restart}`);
  }

  if (parsed.ports.length > 0) {
    lines.push("    ports:");
    for (const p of parsed.ports) {
      lines.push(`      - "${p}"`);
    }
  }

  if (parsed.volumes.length > 0) {
    lines.push("    volumes:");
    for (const v of parsed.volumes) {
      lines.push(`      - ${v}`);
    }
  }

  if (parsed.envVars.length > 0) {
    lines.push("    environment:");
    for (const e of parsed.envVars) {
      lines.push(`      - ${e}`);
    }
  }

  if (parsed.network) {
    lines.push("    networks:");
    lines.push(`      - ${parsed.network}`);
  }

  if (parsed.memory) {
    lines.push("    deploy:");
    lines.push("      resources:");
    lines.push("        limits:");
    lines.push(`          memory: ${parsed.memory}`);
  }

  if (parsed.network) {
    lines.push("");
    lines.push("networks:");
    lines.push(`  ${parsed.network}:`);
    lines.push("    external: true");
  }

  return lines.join("\n");
}

const presets = [
  {
    label: "Nginx",
    command:
      "docker run -d --name my-nginx -p 8080:80 -v ./html:/usr/share/nginx/html:ro --restart unless-stopped nginx:latest",
  },
  {
    label: "PostgreSQL",
    command:
      'docker run -d --name my-postgres -p 5432:5432 -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=secret -e POSTGRES_DB=mydb -v pgdata:/var/lib/postgresql/data --restart unless-stopped postgres:15',
  },
  {
    label: "Redis",
    command:
      "docker run -d --name my-redis -p 6379:6379 -v redis-data:/data --restart unless-stopped redis:7-alpine",
  },
  {
    label: "MySQL",
    command:
      "docker run -d --name my-mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=rootpass -e MYSQL_DATABASE=mydb -e MYSQL_USER=user -e MYSQL_PASSWORD=pass -v mysql-data:/var/lib/mysql --restart unless-stopped mysql:8",
  },
];

export default function DockerRunToCompose() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const convert = (cmd?: string) => {
    const command = cmd ?? input;
    if (!command.trim()) {
      setError("Please enter a docker run command.");
      setOutput("");
      return;
    }
    try {
      const parsed = parseDockerRun(command);
      const yaml = generateCompose(parsed);
      setOutput(yaml);
      setError("");
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  };

  const applyPreset = (command: string) => {
    setInput(command);
    setError("");
    try {
      const parsed = parseDockerRun(command);
      const yaml = generateCompose(parsed);
      setOutput(yaml);
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  };

  return (
    <ToolLayout
      title="Docker Run to Compose"
      description="Convert docker run commands into docker-compose.yml format. Paste your command and get a ready-to-use compose file."
      slug="docker-compose"
    >
      <div>
        <label className="mb-1 block text-sm font-medium">
          Docker Run Command
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="docker run -d -p 80:80 --name my-app nginx:latest"
          className="w-full rounded-lg border border-[var(--border)] p-3 text-sm font-mono"
          rows={5}
          spellCheck={false}
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          onClick={() => convert()}
          className="rounded-lg bg-[var(--primary)] px-5 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] btn-press"
        >
          Convert
        </button>
      </div>

      <div className="mt-4">
        <label className="mb-2 block text-sm font-medium">
          Preset Commands
        </label>
        <div className="flex flex-wrap gap-2">
          {presets.map((p) => (
            <button
              key={p.label}
              onClick={() => applyPreset(p.command)}
              className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-medium hover:bg-[var(--muted)] btn-press"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mt-3 rounded-lg border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 p-3 text-sm text-[var(--destructive)]">
          {error}
        </div>
      )}

      {output && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">docker-compose.yml</span>
            <CopyButton text={output} />
          </div>
          <pre className="rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4 text-sm font-mono overflow-x-auto whitespace-pre">
            {output}
          </pre>
        </div>
      )}
    </ToolLayout>
  );
}
