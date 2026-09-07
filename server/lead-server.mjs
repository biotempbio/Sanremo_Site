import { createServer } from "node:http";
import { appendFile, mkdir } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import nodemailer from "nodemailer";

const port = Number(process.env.LEAD_PORT || 8788);
const dataDir = process.env.LEAD_DATA_DIR || "/var/lib/sanremo-leads";
const limits = new Map();

function json(response, status, body) {
  response.writeHead(status, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
  response.end(JSON.stringify(body));
}

function limited(ip) {
  const now = Date.now(); const recent = (limits.get(ip) || []).filter((time) => now - time < 60_000);
  recent.push(now); limits.set(ip, recent); return recent.length > 5;
}

async function mail(lead) {
  if (!process.env.SMTP_HOST || !process.env.LEAD_TO) return;
  const transport = nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 587), secure: process.env.SMTP_SECURE === "true", auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined });
  await transport.sendMail({ from: process.env.LEAD_FROM || process.env.SMTP_USER, to: process.env.LEAD_TO, subject: `Заявка с сайта · ${lead.form} · ${lead.city || "регион не указан"}`, text: Object.entries(lead).map(([key, value]) => `${key}: ${value}`).join("\n") });
}

createServer(async (request, response) => {
  if (request.method !== "POST" || request.url !== "/api/lead") return json(response, 404, { error: "not_found" });
  const ip = request.headers["x-forwarded-for"]?.toString().split(",")[0].trim() || request.socket.remoteAddress || "unknown";
  if (limited(ip)) return json(response, 429, { error: "rate_limit" });
  try {
    let raw = ""; for await (const chunk of request) { raw += chunk; if (raw.length > 64_000) throw new Error("too_large"); }
    const body = JSON.parse(raw); if (body.website) return json(response, 200, { id: "accepted" });
    if (!["contacts", "service"].includes(body.form) || !body.contact || body.consent !== "yes" || (body.form === "contacts" && !body.name)) return json(response, 400, { error: "invalid_fields" });
    const lead = { id: randomUUID(), receivedAt: new Date().toISOString(), ip, ...body };
    await mkdir(dataDir, { recursive: true }); await appendFile(`${dataDir}/leads.jsonl`, `${JSON.stringify(lead)}\n`, { mode: 0o600 });
    try { await mail(lead); } catch (error) { console.error("SMTP delivery failed; lead is stored", error); }
    return json(response, 201, { id: lead.id });
  } catch (error) { console.error(error); return json(response, 500, { error: "server_error" }); }
}).listen(port, "127.0.0.1", () => console.log(`Sanremo lead service on 127.0.0.1:${port}`));
