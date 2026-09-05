/*
 * figma-export — capture every route as a self-contained, mock-populated HTML
 * snapshot (+ full-page screenshot) for editing in Figma.
 *
 *   node scripts/figma-export.mjs            (uses .env.local, file: DB, port 3872)
 *   node scripts/figma-export.mjs --routes <comma list>   (subset, e.g. --routes /chapters,/dashboard)
 *
 * Requires: playwright-core (resolved from the QA temp dir) + @libsql/client (project dep).
 * Uses Edge via channel msedge. No prod database is touched: a throwaway file: DB is used.
 */
import { createRequire } from "node:module";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const require = createRequire(import.meta.url);
const SEED_PASSWORD = "password123";
const PORT = 3872;
const BASE = `http://127.0.0.1:${PORT}`;
const ROOT = path.resolve(import.meta.dirname, "..");
const CAP_DIR = path.join(ROOT, "figma-export");
const DB_FILE = path.join(ROOT, ".figma-capture", "data.db").replace(/\\/g, "/");
const PW = "C:/Users/ADAMRA~1/AppData/Local/Temp/opencode/qa/node_modules/playwright-core/index.js";
const { chromium } = require(PW);

const args = process.argv.slice(2);
let routesFilter = null;
const ii = args.indexOf("--routes");
if (ii !== -1 && args[ii + 1]) routesFilter = new Set(args[ii + 1].split(",").map((s) => s.trim()));

const log = (...m) => process.stdout.write(`[figma] ${m.join(" ")}\n`);

// ── demo / mock catalog ──────────────────────────────────────────────────────
const CAT = {
  campaigns: [
    ["Free Education Now", "Scrap the fees. Fund the future. A national push to end tuition hikes and open universities to every Malaysian.", "LigaMY"],
    ["Stop the Fee Hike", "Administration raised fees again — we say no. Campus organising paid off last round; this time we go national.", "LigaMY"],
    ["Tenancy, Not Eviction", "Students are tenants too. Demanding fair tenancy rights and an end to off-campus evictions.", "LigaUM"],
    ["Public Transport for Students", "Cheap, safe, accessible. Lobbying for student passes on every line in the Klang Valley.", "LigaUM"],
    ["Workers' Rights on Campus", "Casual staff and students are the same fight. Solidarity with campus workers.", "LigaUTM"],
    ["Climate Justice is a Campus Issue", "Net-zero pledges mean nothing without accountability. Pushing divestment and green audits.", "LigaUTM"],
  ],
  events: [
    ["National Assembly 2026", "All chapters convene to set the mandate and elect the national secretariat.", "Dewan Tunku Canselor, UM", "Forum"],
    ["Kopi & Komuniti", "Open floor talk over coffee. Bring a friend, bring a complaint, bring an idea.", "Laman Kreatif, UTM", "Dialogue"],
    ["Forum: Fees Under Fire", "Panel with economists, student reps and policymakers on the real cost of higher education.", "Dewan Kuliah Utama, USM", "Forum"],
    ["Solidarity Dialogue", "Joint session with campus workers and labor activists ahead of the minimum-wage review.", "Kafe Siswa, UM", "Dialogue"],
    ["Media Literacy Workshop", "Know your news: spotting spin, tracing sources, running a community zine.", "Studio Media, UniSZA", "Assembly"],
    ["Amanat Parlimen", "Public reading and discussion of the students' memorandum ahead of the sitting.", "Dataran Merdeka", "Assembly"],
  ],
  products: [
    ["Liga Tee", "RM45", "Heavyweight cotton tee. Red chest print, cut for movement.", "LigaUTM"],
    ["Zine No.1", "RM15", "The founding issue: writings, posters and tape transcripts.", "LigaUM"],
    ["Tote Bag", "RM25", "Canvas tote. Holds all the handouts. Built to last.", "LigaMY"],
    ["Hoodie", "RM89", "Fleece hoodie, screenprinted in-house. Unisex fit.", "LigaUSM"],
    ["Button Pack", "RM12", "Five enamel buttons. Pin them on every bag you own.", "LigaUniSZA"],
    ["Patch Pack", "RM6", "Sew-on patches: fists, fists, fists.", "LigaUTM"],
    ["Cap", "RM39", "Six-panel cap with embroidered mark.", "LigaMY"],
    ["Sticker Pack", "RM9", "Weatherproof stickers for laptops, lockers and lamp posts.", "LigaUniSZA"],
  ],
  media: [
    ["Social", "Instagram", "Statement on the minimum wage review — read the thread.", "social"],
    ["Article", "Malaysiakini", "Students march again: tenancy demands reach Parliament.", "article"],
    ["Video", "YouTube", "Assembly 2025 — full plenary, 3 hours.", "video"],
    ["Article", "The Star", "University fee freeze: what the numbers really say.", "article"],
    ["Social", "X", "Thread: how campus evictions actually work.", "social"],
    ["Podcast", "Spotify", "Episode 04 — Organising 101 with the SPARC crew.", "audio"],
  ],
  users: [["Aina Syazwani", "aina@example.com", "member"], ["Daniel Tan", "daniel@example.com", "member"], ["Nurul Izzah", "nurul@example.com", "member"], ["Haris Rahman", "haris@example.com", "member"]],
  universities: [["Universiti Teknologi MARA", "UiTM Shah Alam", "active"], ["Universiti Utara Malaysia", "Sintok, Kedah", "pending"], ["Universiti Malaysia Sabah", "Kota Kinabalu", "pending"]],
  stats: [124, 86, 42, 12],
};

// ── env: .env.capture from .env.local, TURSO → local file DB ─────────────────
function captureEnv() {
  const src = fs.readFileSync(path.join(ROOT, ".env.local"), "utf8");
  const out = { TURSO_DATABASE_URL: `file:${DB_FILE}`, TURSO_AUTH_TOKEN: "", MIGRATE_SECRET: "figmamigrate", SEED_SECRET: "figmaseed", PORT: String(PORT) };
  for (const line of src.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)=(.*)$/);
    if (m && !m[2].trim().startsWith("#")) {
      let v = m[2].trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
      if (!(m[1] === "TURSO_DATABASE_URL" || m[1] === "TURSO_AUTH_TOKEN" || m[1] === "MIGRATE_SECRET" || m[1] === "SEED_SECRET")) out[m[1]] = v;
    }
  }
  out.NEXT_PUBLIC_SITE_URL = BASE;
  return out;
}

// ── server lifecycle ─────────────────────────────────────────────────────────
let server = null;
async function pushSchema() {
  const bin = path.join(ROOT, "node_modules", "drizzle-kit", "bin.cjs");
  const migs = path.join(ROOT, ".figma-capture", "migrations");
  await new Promise((resolve, reject) => {
    const p = spawn(process.execPath, [bin, "generate", `--schema=src/lib/schema.ts`, "--dialect=turso", `--out=${migs}`], {
      cwd: ROOT,
      stdio: ["ignore", "ignore", "pipe"],
    });
    let err = "";
    p.stderr.on("data", (d) => (err += d));
    p.on("close", (code) => (code === 0 ? resolve() : reject(new Error("drizzle generate failed: " + err.slice(0, 300)))));
  });
  const { createClient } = await import("@libsql/client");
  const { drizzle } = await import("drizzle-orm/libsql");
  const { migrate } = await import("drizzle-orm/libsql/migrator");
  const client = createClient({ url: `file:${DB_FILE}` });
  try {
    await migrate(drizzle(client), { migrationsFolder: migs });
  } finally {
    await client.close();
  }
  log("schema applied to file DB");
}
async function startServer(env) {
  fs.rmSync(path.join(ROOT, ".figma-capture"), { recursive: true, force: true });
  fs.mkdirSync(path.join(ROOT, ".figma-capture"), { recursive: true });
  await pushSchema();
  const nextBin = path.join(ROOT, "node_modules", "next", "dist", "bin", "next");
  server = spawn(process.execPath, [nextBin, "dev", "-p", String(PORT)], {
    cwd: ROOT,
    env: { ...process.env, ...env },
    stdio: ["ignore", "pipe", "pipe"],
  });
  server.stdout.on("data", () => {});
  server.stderr.on("data", () => {});
  const start = Date.now();
  for (;;) {
    try {
      const res = await fetch(`${BASE}/`, { signal: AbortSignal.timeout(3000) });
      if (res.ok || res.status < 500) break;
    } catch {}
    if (Date.now() - start > 120000) throw new Error("server did not come up");
    await new Promise((r) => setTimeout(r, 1000));
  }
  log("server up");
}
function stopServer() {
  if (server) {
    try { server.kill(); } catch {}
    server = null;
  }
}

// ── demo data ────────────────────────────────────────────────────────────────
async function seedDemo() {
  const { createClient } = await import("@libsql/client");
  const cl = createClient({ url: `file:${DB_FILE}` });
  const q = async (sql) => (await cl.execute({ sql })).rows;
  try {
    await q("insert or ignore into university (university_id, slug, name, status) values ('uni-demo-1','uitm','Universiti Teknologi MARA','active')");
    await q("insert or ignore into university (university_id, slug, name, status) values ('uni-demo-2','uum','Universiti Utara Malaysia','pending')");
    await q("insert or ignore into university (university_id, slug, name, status) values ('uni-demo-3','ums','Universiti Malaysia Sabah','pending')");
    const chs = {}; for (const r of await q("select chapter_id, slug from chapter")) chs[r.slug] = r.chapter_id;
    let i = 0;
    for (const [name, summary, short] of CAT.campaigns) {
      const slug = `demo-campaign-${++i}`;
      const ca = { type: "doc", content: [{ type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: name }] }, { type: "paragraph", content: [{ type: "text", text: summary }] }, { type: "paragraph", content: [{ type: "text", text: "Join the steering committee, circulate the flyer, and show up — this is how change gets built." }] }] };
      const chapterId = chs[short === "LigaMY" ? "ligamy" : short === "LigaUM" ? "ligaum" : short === "LigaUTM" ? "ligautm" : "ligausm"];
      await q(`insert into campaign (campaign_id, chapter_id, slug, name, summary, description, demands, memorandum, created_by) values ('demo-camp-${i}',${qstr(chapterId)},'${slug}',${qstr(name)},${qstr(summary)},${qstr(JSON.stringify(ca))},${qstr(JSON.stringify(["Stop the hikes.","Fund student welfare.","Publish the budget."]))},'https://docs.google.com/document/d/demo','seed_admin')`);
    }
    i = 0;
    for (const [name, desc, location, type] of CAT.events) {
      const slug = `demo-event-${++i}`;
      const dt = { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: desc }] }] };
      const chapterId = chs[i % 2 === 0 ? "ligaum" : "ligautm"];
      await q(`insert into event (event_id, chapter_id, slug, name, description, location, date, time, type, created_by) values ('demo-ev-${i}',${qstr(chapterId)},'${slug}',${qstr(name)},${qstr(JSON.stringify(dt))},${qstr(location)},'2026-${String(10 + (i % 3)).padStart(2, "0")}-${String(5 + i).padStart(2, "0")}','14:30','${type}','seed_admin')`);
    }
    i = 0;
    for (const [name, price, blurb, short] of CAT.products) {
      const slug = `demo-product-${++i}`;
      const chapterId = chs[short === "LigaUTM" ? "ligautm" : short === "LigaUM" ? "ligaum" : short === "LigaMY" ? "ligamy" : "ligausm"];
      await q(`insert into product (product_id, chapter_id, slug, name, price, quantity, type, availability) values ('demo-prod-${i}',${qstr(chapterId)},'${slug}',${qstr(name)},${qstr(price)},25,'merch','available')`);
      await q(`insert into productimage (image_id, product_id, url, alt, sort_order) values ('demo-pimg-${i}','demo-prod-${i}','https://picsum.photos/seed/prod${i}/800/800','${name}',0)`);
    }
    i = 0;
    for (const [kicker, outlet, title, type] of CAT.media) {
      const slug = `demo-media-${++i}`;
      await q(`insert into media (media_id, slug, name, link, image, description, chapter_id, author, date, type) values ('demo-media-${i}','${slug}',${qstr(title)},'https://example.com/${slug}','https://picsum.photos/seed/media${i}/1200/630',${qstr(title)},${qstr(chs.ligamy)},${qstr(outlet)},'2026-05-${String(10 + i).padStart(2, "0")}','${type}')`);
    }
    for (let k = 0; k < 3; k++) {
      const st = k === 0 ? "paid" : k === 1 ? "shipped" : "completed";
      const shortOrders = ["ORDER-2026-0114", "ORDER-2026-0126", "ORDER-2026-0143"];
      await q(`insert into "order" (order_id, user_id, email, phone, address, total, method, status, tracking_url, tracking_code) values ('demo-order-${k}','seed_member','member@liga.my','+60123456789','Block A-12-3, Jalan Siswa, 50603 Kuala Lumpur','${["45.00", "25.00", "89.00"][k]}','toyyibpay','${st}','https://track.demo','MYPOS${3000 + k}')`);
      await q(`insert into orderitem (orderitem_id, order_id, product_id, quantity, unit_price) values ('demo-oi-${k}','demo-order-${k}','demo-prod-${k + 1}',1,'${["45.00", "25.00", "89.00"][k]}')`);
      void shortOrders;
    }
    i = 0;
    for (const [name, status] of [["Aiman Danish", "pending"], ["Priya Nathan", "reviewing"], ["Lee Jia Wen", "confirmed"]]) {
      const slug = `demo-nom-${++i}`;
      const just = `President: ${name}. A platform for affordable housing, transparent budgeting and a stronger student union.`;
      await q(`insert into nomination (nomination_id, name, phone, email, chapter_id, justification, status) values ('demo-nomination-${i}',${qstr(name)},'+6011123456','demo-nom-${i}@example.com',${qstr(chs.ligaum)},${qstr(just)},'${status}')`);
    }
    await q(`insert into nominationnote (note_id, nomination_id, user_id, contact_status, verdict, comment) values ('demo-nnote-1','demo-nomination-2','seed_admin','contacted','forward','Contacted — wants to join the steering call.')`);
    await q(`insert or ignore into member (member_id, user_id, amount_paid, paid_at, expires_at) values ('demo-mem-1','seed_member',20,${Math.floor(Date.now() / 1000) - 86400},${Math.floor(Date.now() / 1000) + 86400 * 340})`);
    await q(`insert into auditlog (log_id, user_id, action, target_type, target_id, details, ip, created_at) values ('demo-log-1','seed_admin','university.approve','university','uni-demo-1','{"status":"active"}','127.0.0.1',${Math.floor(Date.now() / 1000) - 3600})`);
    for (let k = 0; k < 8; k++) {
      await q(`insert into auditlog (log_id, user_id, action, target_type, target_id, details, ip, created_at) values ('demo-log-${k + 2}','seed_admin','${["user.register","nomination.view","order.update","member.promote","config.edit","nomination.note","order.create","university.approve"][k]}','${["user","nomination","order","member","config","nomination","order","university"][k]}','demo-${k}','{"note":"demo"}','127.0.0.1',${Math.floor(Date.now() / 1000) - (k + 1) * 3600})`);
    }
    await q(`insert into contact (contact_id, name, email, subject, message) values ('demo-contact-1','Aina Syazwani','aina@example.com','Collaboration','Hi — we run a campus radio and want to cover the assembly.')`);
    log("demo rows inserted");
  } catch (e) {
    log("seedDemo error:", e.message);
    throw e;
  } finally {
    await cl.close();
  }
}
const qstr = (s) => `'${String(s).replace(/'/g, "''")}'`;

async function seedBase() {
  const res = await fetch(`${BASE}/api/seed`, { method: "POST", headers: { "x-seed-secret": "figmaseed" } });
  const body = await res.text();
  log("api/seed ->", res.status, body.slice(0, 120).replace(/\s+/g, " "));
}

// ── Playwright helpers ───────────────────────────────────────────────────────
async function login(page, email) {
  await page.goto(`${BASE}/login`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(800);
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', SEED_PASSWORD);
  await page.evaluate(() => {
    const f = document.querySelector('form');
    if (f && f.querySelector('button[type="submit"]')) f.querySelector('button[type="submit"]').click();
  });
  await page.waitForURL("**/dashboard**", { timeout: 25000 }).catch(() => {});
  await page.waitForTimeout(600);
  log("logged in:", email);
}
async function pollForHydration(page) {
  const t = Date.now();
  while (Date.now() - t < 20000) {
    const ok = await page
      .evaluate(() => {
        const b = document.querySelector('body');
        return b && b.innerText.length > 60 && !/Struggling to connect|SYSTEM ERROR/.test(b.innerText);
      })
      .catch(() => false);
    if (ok) break;
    await page.waitForTimeout(500);
  }
}

// ── mock pass (in-page) ──────────────────────────────────────────────────────
const MOCK_JS = `
() => {
  const CAT = ${JSON.stringify(CAT)};
  const flat = (s) => (s || "").replace(/\\s+/g, " ").trim();
  let statIdx = 0;
  const zeroNumbers = () => {
    for (const el of document.querySelectorAll('[class*="display"]')) {
      if (/^0{1,2}$/.test(flat(el.textContent))) {
        const sec = el.closest("section");
        if (sec && sec.querySelectorAll('[class*="display"]').length >= 2) {
          el.textContent = String(CAT.stats[statIdx++ % CAT.stats.length]).padStart(2, "0");
        }
      }
    }
  };
  const emptyish = [
    /^No (active )?(campaigns|events|members|universities|nominations|orders|products|media|statements|zines|podcasts|sessions|results catatan|listings)/i,
    /^Nothing scheduled yet/i,
    /^No one (has joined|here|registered)/i,
    /^Coming soon/i,
    /^No results/i,
    /^Empty state/i,
    /^No data/i,
    /^Nothing here yet/i,
    /^Belum ada/i,
  ];
  const cardRoot = () => {
    const any = document.querySelector('a[class*="border"]:not([href="#"])');
    return any && any.className.includes("bg-cream") ? document.createElement("div").outerHTML : "";
  };
  const mkCard = (kicker, title, body) => {
    const d = document.createElement("div");
    d.className = "border border-line bg-cream p-6 hover:border-brand transition-colors";
    d.innerHTML = '<p class="mono text-[11px] uppercase tracking-[0.14em] text-ink/50" style="margin-bottom:8px">' + kicker + "</p>"
      + '<h3 class="display text-xl" style="margin-bottom:6px">' + title + "</h3>"
      + '<p class="text-[14px] text-ink/70 line-clamp-3" style="color:rgba(23,23,23,0.7)">' + body + "</p>";
    return d;
  };
  const fillGrids = () => {
    const empties = [...document.querySelectorAll("p")].filter((p) => emptyish.some((re) => re.test(flat(p.textContent))));
    for (const p of empties) {
      const grid = p.parentElement;
      if (!grid || !/^(grid|flex)/.test(getComputedStyle(grid).display)) continue;
      const kind = flat(p.textContent).match(/campaigns|events|members|universities|nominations|orders|products|media|statements|zines|podcasts|sessions|news/)||["g"];
      const k = kind[0];
      const pool = k.includes("campaign") ? CAT.campaigns : k.includes("event") ? CAT.events : k.includes("product") ? CAT.products : k.includes("media") ? CAT.media : k.includes("universit") ? CAT.universities : k.includes("nomination") ? [["Alia Rahman","Pending","UA 2026 — candidate for president"]] : k.includes("order") ? [["ORDER-2026-0114","45.00","shipped"]] : k.includes("member") ? CAT.users : k.includes("podcast") ? [["Podcast","Episode 04 — Organising 101","SPARC UTeM"]] : CAT.campaigns;
      const target = k.includes("univ") ? 2 : k.includes("member") ? 4 : 3;
      let n = 0;
      while (n < Math.min(target, pool.length)) {
        const row = pool[n % pool.length];
        const c = mkCard(row[0], row[1], row[2] || "");
        grid.appendChild(c);
        n++;
      }
      p.remove();
    }
  };
  const fillTables = () => {
    for (const table of document.querySelectorAll("table")) {
      const tb = table.querySelector("tbody");
      if (!tb) continue;
      if (tb.querySelector("tr")) continue;
      const heads = [...(table.querySelectorAll("thead th") || [])].map((th) => flat(th.textContent));
      if (!heads.length) heads.push("Field");
      const rows = CAT.campaigns.slice(0, 4);
      for (let r = 0; r < rows.length; r++) {
        const tr = document.createElement("tr");
        tr.className = "border-b border-line";
        for (let c = 0; c < heads.length; c++) {
          const td = document.createElement("td");
          td.className = "px-4 py-3 text-[13px] text-ink/70";
          td.textContent = rows[r][c % rows[r].length] || "\u2013";
          tr.appendChild(td);
        }
        tb.appendChild(tr);
      }
    }
  };
  const fillRequired = () => {
    for (const el of document.querySelectorAll("[required]")) {
      if (!el.value) el.value = el.type === "email" ? "aina@example.com" : el.type === "tel" ? "+60123456789" : el.type === "number" ? "1" : el.tagName === "TEXTAREA" ? "A platform for affordable housing, transparent budgeting and a stronger student union." : "Demo User";
      if (el.tagName === "SELECT") { const opts = el.querySelectorAll("option"); if (opts.length > 1) el.selectedIndex = 1; }
    }
  };
  zeroNumbers();
  fillTables();
  fillGrids();
  fillRequired();
  return { statFilled: statIdx, grids: document.querySelectorAll("a[class*='bg-cream'],div[class*='bg-cream']").length };
}
`;

// ── serialize (in-page) ──────────────────────────────────────────────────────
const SERIALIZE_JS = `
() => {
  const STYLE_PROPS = ["display","position","width","min-width","max-width","height","min-height","margin-top","margin-right","margin-bottom","margin-left","padding-top","padding-right","padding-bottom","padding-left","gap","flex-direction","flex-wrap","align-items","align-content","justify-content","align-self","justify-self","order","grid-template-columns","grid-template-rows","grid-column-gap","grid-row-gap","top","left","right","bottom","font-family","font-size","font-weight","font-style","font-variant","letter-spacing","line-height","text-align","text-transform","text-decoration","color","background-color","background-image","background-size","background-position","background-repeat","border-top-width","border-top-style","border-top-color","border-right-width","border-right-style","border-right-color","border-bottom-width","border-bottom-style","border-bottom-color","border-left-width","border-left-style","border-left-color","border-radius","box-shadow","opacity","z-index","white-space","overflow","overflow-wrap","object-fit","vertical-align","mix-blend-mode"];
  const skip = (el) => { if (!el || el.nodeType !== 1) return true; const t = el.tagName; return t === "SCRIPT" || t === "STYLE" || t === "LINK" || t === "IFRAME" || t === "SVG" || t === "INPUT" || t === "SELECT" || t === "TEXTAREA" || t === "BR" || t === "CANVAS" || t === "AUDIO" || t === "VIDEO" || el.classList.contains("hidden") || el.getAttribute("aria-hidden") === "true" || !!el.closest("dialog"); };
  const snapshotStyle = (el) => {
    const cs = getComputedStyle(el);
    const props = ["box-sizing:border-box"];
    for (const p of STYLE_PROPS) { const v = cs.getPropertyValue(p); if (v) props.push(p + ":" + v); }
    return props.join(";");
  };
  const live = Array.from(document.querySelectorAll("body *"));
  const clone = document.documentElement.cloneNode(true);
  const cloned = Array.from(clone.querySelectorAll("body *"));
  for (let i = 0; i < live.length; i++) {
    if (skip(live[i])) continue;
    const tgt = cloned[i];
    if (!tgt) continue;
    try { tgt.style.cssText = snapshotStyle(live[i]); } catch {}
  }
  clone.querySelectorAll("script,noscript,template,style,link,iframe,svg,canvas,audio,video").forEach((n) => n.remove());
  try { document.querySelectorAll("dialog").forEach((d) => d.remove()); } catch {}
  return "<!DOCTYPE html>\\n" + clone.outerHTML;
}
`;

// ── capture one page ─────────────────────────────────────────────────────────
async function capture(page, urlPath, name) {
  const out = path.join(CAP_DIR, name);
  if (routesFilter && !routesFilter.has(urlPath) && !routesFilter.has(name)) return;
  fs.mkdirSync(out, { recursive: true });
  let docStatus = 0;
  const onResponse = (r) => {
    if (r.request().resourceType() !== "document") return;
    try { const h = new URL(r.url()).host; if (h === new URL(BASE).host) docStatus = r.status(); } catch {}
  };
  page.on("response", onResponse);
  try {
    await page.goto(`${BASE}${urlPath}`, { waitUntil: "load", timeout: 45000 });
    await pollForHydration(page);
    await page.waitForTimeout(1500);
    const status = await page.evaluate(() => ({ title: document.title, has404: document.body.innerText.includes("404") }));
    page.off("response", onResponse);
    if (docStatus === 404 || (docStatus === 0 && status.has404)) { log("skip (404):", urlPath, `[status=${docStatus}]`); return; }
    await page.evaluate(`(${MOCK_JS})()`).catch((e) => log("mock warn", urlPath, e.message));
    await page.waitForTimeout(300);
    await page.evaluate(() => document.fonts && document.fonts.ready).catch(() => {});
    await page.waitForTimeout(400);
    const html = await page.evaluate(`(${SERIALIZE_JS})()`);
    fs.writeFileSync(path.join(out, "index.html"), html, "utf8");
    await page.screenshot({ path: path.join(out, "screenshot.png"), fullPage: true });
    log("captured", `${name}  (html ${(html.length / 1024).toFixed(0)} KB)`, "|", status.title.slice(0, 40));
  } catch (e) {
    log("FAIL", `${urlPath} :: ${e.message.split("\\n")[0]}`);
    await page.screenshot({ path: path.join(out, "error.png"), fullPage: true }).catch(() => {});
  }
}

// ── route plan ───────────────────────────────────────────────────────────────
async function discoverLinks(page, path, re, max) {
  try {
    await page.goto(`${BASE}${path}`, { waitUntil: "load", timeout: 30000 });
    await pollForHydration(page);
    return await page.evaluate(([re, max]) => {
      const r = new RegExp(re);
      return [...new Set([...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href")).filter((h) => h && r.test(h)).map((h) => h.split("?")[0].split("#")[0]))].slice(0, max);
    }, [re, max]);
  } catch {
    return [];
  }
}

async function main() {
  fs.rmSync(CAP_DIR, { recursive: true, force: true });
  fs.mkdirSync(CAP_DIR, { recursive: true });
  const env = captureEnv();
  await startServer(env);
  try {
    await seedBase();
    await seedDemo();

    const browser = await chromium.launch({ channel: "msedge", headless: true });
    const pub = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const pubPage = await pub.newPage();
    const member = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const memberPage = await member.newPage();
    const admin = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const adminPage = await admin.newPage();
    await login(memberPage, "member@liga.my");
    await login(adminPage, "admin@liga.my");

    try {
      // public static
      const publicPages = [
        ["/", "index"], ["/campaigns", "campaigns"], ["/events", "events"], ["/election", "election"],
        ["/shop", "shop"], ["/media", "media"], ["/contact", "contact"], ["/terms", "terms"],
        ["/privacy", "privacy"], ["/register", "register"], ["/login", "login"],
        ["/forgot-password", "forgot-password"], ["/reset-password", "reset-password"],
        ["/verify-email", "verify-email"], ["/chapters", "chapters"],
        ["/university/submit", "university-submit"], ["/university/submit/success", "university-submit-success"],
      ];
      for (const [p, n] of publicPages) await capture(pubPage, p, n);

      // chapters (discover or seeded slugs)
      const chapterLinks = await discoverLinks(pubPage, "/chapters", "(/chapters/[a-z0-9-]+)$", 12);
      const slugs = (chapterLinks.length ? chapterLinks : ["ligamy", "ligaum", "ligautm", "ligausm", "ligaunisza", "sparcutem", "ligaalumni"].map((s) => `/chapters/${s}`)).map((l) => l.replace("/chapters/", ""));
      for (const s of slugs) await capture(pubPage, `/chapters/${s}`, `chapter-${s}`);
      const ch1 = slugs[0] || "ligautm";
      const sub = await discoverLinks(pubPage, `/chapters/${ch1}/campaigns`, "(/chapters/[a-z0-9-]+/campaigns/[a-z0-9-]+)$", 4);
      await capture(pubPage, `/chapters/${ch1}/campaigns`, `chapter-${ch1}-campaigns`);
      for (const l of sub.slice(0, 2)) await capture(pubPage, l, `chapter-${ch1}-campaign-detail`);
      const fundL = sub.length ? sub[0] + "/fundraise" : "";
      if (fundL) await capture(pubPage, fundL, `chapter-${ch1}-campaign-fundraise`);
      const subs = await discoverLinks(pubPage, `/chapters/${ch1}/events`, "(/chapters/[a-z0-9-]+/events/[a-z0-9-]+)$", 4);
      await capture(pubPage, `/chapters/${ch1}/events`, `chapter-${ch1}-events`);
      for (const l of subs.slice(0, 2)) await capture(pubPage, l, `chapter-${ch1}-event-detail`);
      const fundE = subs.length ? subs[0] + "/fundraise" : "";
      if (fundE) await capture(pubPage, fundE, `chapter-${ch1}-event-fundraise`);

      // detail samples
      const campaigns = await discoverLinks(pubPage, "/campaigns", "(/campaigns/[a-z0-9-]+)$", 4);
      for (const l of campaigns.slice(0, 3)) await capture(pubPage, l, `campaign-${l.split("/").pop()}`);
      const events = await discoverLinks(pubPage, "/events", "(/events/[a-z0-9-]+)$", 4);
      for (const l of events.slice(0, 3)) await capture(pubPage, l, `event-${l.split("/").pop()}`);
      const products = await discoverLinks(pubPage, "/shop", "(/shop/[a-z0-9-]+)$", 4);
      for (const l of products.slice(0, 3)) await capture(pubPage, l, `shop-${l.split("/").pop()}`);
      await capture(pubPage, "/shop/checkout", "shop-checkout");
      await capture(pubPage, "/shop/payment-success", "shop-payment-success");

      // member
      const memberPages = [["/dashboard", "dashboard"], ["/dashboard/settings", "dashboard-settings"], ["/dashboard/committee", "dashboard-committee"], ["/dashboard/card", "dashboard-card"], ["/dashboard/orders", "dashboard-orders"], ["/member/member", "member-profile"]];
      for (const [p, n] of memberPages) await capture(memberPage, p, n);
      const orders = await discoverLinks(memberPage, "/dashboard/orders", "(/dashboard/orders/[a-z0-9-]+)", 4);
      for (const l of orders.slice(0, 1)) await capture(memberPage, l, `order-tracking-${l.split("/").filter(Boolean).pop()}`);

      // admin
      const adminPages = [["/admin", "admin"], ["/admin/users", "admin-users"], ["/admin/universities", "admin-universities"], ["/admin/nominations", "admin-nominations"], ["/admin/orders", "admin-orders"], ["/admin/orders/ship", "admin-orders-ship"], ["/admin/settings", "admin-settings"], ["/admin/audit", "admin-audit"], ["/admin/media", "admin-media"]];
      for (const [p, n] of adminPages) await capture(adminPage, p, n);
      const noms = await discoverLinks(adminPage, "/admin/nominations", "(/admin/nominations/[a-z0-9-]+)$", 4);
      for (const l of noms.slice(0, 1)) await capture(adminPage, l, `admin-nomination-${l.split("/").filter(Boolean).pop()}`);

      await browser.close();
    } catch (e) {
      log("pipeline error:", e.message);
      await browser.close().catch(() => {});
    }
  } finally {
    stopServer();
  }
  const dirs = fs.existsSync(CAP_DIR) ? fs.readdirSync(CAP_DIR, { withFileTypes: true }).filter((d) => d.isDirectory()) : [];
  log("DONE —", dirs.length, "pages exported to", CAP_DIR);
}

main().catch((e) => {
  log("fatal:", e.message);
  stopServer();
  process.exit(1);
});