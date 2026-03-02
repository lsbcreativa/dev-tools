"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import CopyButton from "@/components/tools/CopyButton";

/* ---------- IPv4 helpers ---------- */

function isValidIPv4(ip: string): boolean {
  const parts = ip.split(".");
  if (parts.length !== 4) return false;
  return parts.every((p) => {
    const n = Number(p);
    return /^\d{1,3}$/.test(p) && n >= 0 && n <= 255;
  });
}

function ipToUint32(ip: string): number {
  const parts = ip.split(".").map(Number);
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
}

function uint32ToIp(n: number): string {
  return [
    (n >>> 24) & 255,
    (n >>> 16) & 255,
    (n >>> 8) & 255,
    n & 255,
  ].join(".");
}

function cidrToMask(cidr: number): number {
  if (cidr === 0) return 0;
  return (~0 << (32 - cidr)) >>> 0;
}

function ipToBinary(ip: string): string {
  return ip
    .split(".")
    .map((o) => Number(o).toString(2).padStart(8, "0"))
    .join(".");
}

function getIpClass(firstOctet: number): string {
  if (firstOctet < 128) return "A";
  if (firstOctet < 192) return "B";
  if (firstOctet < 224) return "C";
  if (firstOctet < 240) return "D";
  return "E";
}

interface SubnetResult {
  ipAddress: string;
  networkAddress: string;
  broadcastAddress: string;
  subnetMask: string;
  wildcardMask: string;
  cidrNotation: string;
  firstHost: string;
  lastHost: string;
  totalHosts: number;
  ipClass: string;
  binaryIp: string;
  binaryMask: string;
}

function calculateSubnet(ip: string, cidr: number): SubnetResult | null {
  if (!isValidIPv4(ip)) return null;
  if (cidr < 0 || cidr > 32) return null;

  const ipNum = ipToUint32(ip);
  const mask = cidrToMask(cidr);
  const wildcard = (~mask) >>> 0;
  const network = (ipNum & mask) >>> 0;
  const broadcast = (network | wildcard) >>> 0;

  const totalHosts = cidr >= 31 ? (cidr === 32 ? 1 : 2) : Math.pow(2, 32 - cidr) - 2;

  let firstHost: number;
  let lastHost: number;
  if (cidr === 32) {
    firstHost = network;
    lastHost = network;
  } else if (cidr === 31) {
    firstHost = network;
    lastHost = broadcast;
  } else {
    firstHost = (network + 1) >>> 0;
    lastHost = (broadcast - 1) >>> 0;
  }

  const firstOctet = (ipNum >>> 24) & 255;

  return {
    ipAddress: ip,
    networkAddress: uint32ToIp(network),
    broadcastAddress: uint32ToIp(broadcast),
    subnetMask: uint32ToIp(mask),
    wildcardMask: uint32ToIp(wildcard),
    cidrNotation: `/${cidr}`,
    firstHost: uint32ToIp(firstHost),
    lastHost: uint32ToIp(lastHost),
    totalHosts,
    ipClass: getIpClass(firstOctet),
    binaryIp: ipToBinary(ip),
    binaryMask: ipToBinary(uint32ToIp(mask)),
  };
}

/* ---------- Common subnets ---------- */

const COMMON_SUBNETS = [
  { cidr: 8, label: "/8", mask: "255.0.0.0", hosts: "16,777,214" },
  { cidr: 16, label: "/16", mask: "255.255.0.0", hosts: "65,534" },
  { cidr: 24, label: "/24", mask: "255.255.255.0", hosts: "254" },
  { cidr: 28, label: "/28", mask: "255.255.255.240", hosts: "14" },
  { cidr: 30, label: "/30", mask: "255.255.255.252", hosts: "2" },
  { cidr: 32, label: "/32", mask: "255.255.255.255", hosts: "1" },
];

/* ---------- Result row ---------- */

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg border border-[var(--border)] bg-[var(--muted)] px-4 py-2.5">
      <div>
        <div className="text-xs text-[var(--muted-foreground)]">{label}</div>
        <div className="text-sm font-mono font-medium">{value}</div>
      </div>
      <CopyButton text={value} label="" />
    </div>
  );
}

/* ---------- Component ---------- */

export default function SubnetCalculatorPage() {
  const [ip, setIp] = useState("192.168.1.100");
  const [cidr, setCidr] = useState(24);
  const [inputMode, setInputMode] = useState<"cidr" | "mask">("cidr");
  const [maskInput, setMaskInput] = useState("255.255.255.0");

  // Convert mask input to CIDR
  const effectiveCidr = useMemo(() => {
    if (inputMode === "cidr") return cidr;
    if (!isValidIPv4(maskInput)) return cidr;
    const maskNum = ipToUint32(maskInput);
    // Count leading 1s
    let bits = 0;
    for (let i = 31; i >= 0; i--) {
      if (maskNum & (1 << i)) bits++;
      else break;
    }
    return bits;
  }, [inputMode, cidr, maskInput]);

  const result = useMemo(
    () => calculateSubnet(ip, effectiveCidr),
    [ip, effectiveCidr]
  );

  const ipError = ip.length > 0 && !isValidIPv4(ip);

  return (
    <ToolLayout
      title="IP Subnet Calculator"
      description="Calculate IPv4 subnet details including network address, broadcast address, host range, and CIDR notation."
      slug="subnet-calculator"
    >
      {/* Input mode toggle */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setInputMode("cidr")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors btn-press ${
            inputMode === "cidr"
              ? "bg-[var(--primary)] text-white"
              : "border border-[var(--border)] hover:bg-[var(--muted)]"
          }`}
        >
          CIDR Prefix
        </button>
        <button
          onClick={() => setInputMode("mask")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors btn-press ${
            inputMode === "mask"
              ? "bg-[var(--primary)] text-white"
              : "border border-[var(--border)] hover:bg-[var(--muted)]"
          }`}
        >
          Subnet Mask
        </button>
      </div>

      {/* IP + CIDR / Mask inputs */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">IP Address</label>
          <input
            type="text"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            placeholder="192.168.1.100"
            className={`w-full rounded-md border px-3 py-2 text-sm font-mono ${
              ipError
                ? "border-[var(--destructive)]"
                : "border-[var(--border)]"
            }`}
          />
          {ipError && (
            <p className="mt-1 text-xs text-[var(--destructive)]">
              Enter a valid IPv4 address (e.g. 192.168.1.100)
            </p>
          )}
        </div>

        {inputMode === "cidr" ? (
          <div>
            <label className="mb-1 block text-sm font-medium">
              CIDR Prefix Length
            </label>
            <select
              value={cidr}
              onChange={(e) => setCidr(Number(e.target.value))}
              className="w-full rounded-md border border-[var(--border)] px-3 py-2 text-sm font-mono"
            >
              {Array.from({ length: 33 }, (_, i) => (
                <option key={i} value={i}>
                  /{i} &mdash; {uint32ToIp(cidrToMask(i))}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div>
            <label className="mb-1 block text-sm font-medium">
              Subnet Mask
            </label>
            <input
              type="text"
              value={maskInput}
              onChange={(e) => setMaskInput(e.target.value)}
              placeholder="255.255.255.0"
              className="w-full rounded-md border border-[var(--border)] px-3 py-2 text-sm font-mono"
            />
          </div>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className="mt-6">
          <h3 className="mb-3 text-sm font-semibold">Subnet Details</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            <ResultRow label="IP Address" value={result.ipAddress} />
            <ResultRow label="Network Address" value={result.networkAddress} />
            <ResultRow label="Broadcast Address" value={result.broadcastAddress} />
            <ResultRow label="Subnet Mask" value={result.subnetMask} />
            <ResultRow label="Wildcard Mask" value={result.wildcardMask} />
            <ResultRow label="CIDR Notation" value={result.cidrNotation} />
            <ResultRow label="First Usable Host" value={result.firstHost} />
            <ResultRow label="Last Usable Host" value={result.lastHost} />
            <ResultRow
              label="Total Usable Hosts"
              value={result.totalHosts.toLocaleString()}
            />
            <ResultRow label="IP Class" value={`Class ${result.ipClass}`} />
            <ResultRow label="IP (Binary)" value={result.binaryIp} />
            <ResultRow label="Mask (Binary)" value={result.binaryMask} />
          </div>
        </div>
      )}

      {/* Quick reference */}
      <div className="mt-6 rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4">
        <h3 className="mb-3 text-sm font-medium">Common Subnets</h3>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="py-2 pr-4 text-left text-xs font-medium text-[var(--muted-foreground)]">
                  CIDR
                </th>
                <th className="py-2 pr-4 text-left text-xs font-medium text-[var(--muted-foreground)]">
                  Subnet Mask
                </th>
                <th className="py-2 text-left text-xs font-medium text-[var(--muted-foreground)]">
                  Usable Hosts
                </th>
                <th className="py-2 text-left text-xs font-medium text-[var(--muted-foreground)]"></th>
              </tr>
            </thead>
            <tbody>
              {COMMON_SUBNETS.map((s) => (
                <tr
                  key={s.cidr}
                  className="border-b border-[var(--border)] last:border-b-0"
                >
                  <td className="py-2 pr-4 font-mono text-xs font-medium">
                    {s.label}
                  </td>
                  <td className="py-2 pr-4 font-mono text-xs">{s.mask}</td>
                  <td className="py-2 font-mono text-xs">{s.hosts}</td>
                  <td className="py-2 text-right">
                    <button
                      onClick={() => {
                        setCidr(s.cidr);
                        setInputMode("cidr");
                      }}
                      className="text-xs text-[var(--primary)] hover:underline"
                    >
                      Use
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ToolLayout>
  );
}
