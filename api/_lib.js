const COURTS = ["Court 1","Court 2","Court 3","Court 4","Court 5","Court 6","Court 7"];
const RATES = { day: 150, night: 200 };
const BRANCH = "lv";

const clean = s => String(s || "").trim();

async function sb(path, opts = {}) {
  const key = clean(process.env.SUPABASE_SERVICE_KEY);
  let base = clean(process.env.SUPABASE_URL).replace(/\/+$/, "").replace(/\/rest\/v1$/, "");
  if (!key || !base) throw new Error("Missing Supabase settings");
  if (!/^https?:\/\//.test(base)) base = "https://" + base;
  const headers = { apikey: key, "Content-Type": "application/json", ...(opts.headers || {}) };
  // Old style keys are JWTs and need the Authorization header. New sb_secret keys do not.
  if (key.startsWith("eyJ")) headers.Authorization = "Bearer " + key;
  const r = await fetch(base + "/rest/v1/" + path, { ...opts, headers });
  const text = await r.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch (e) {}
  return { status: r.status, data };
}

const manilaDate = () => new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Manila" });
const manilaHour = () =>
  Number(new Date().toLocaleString("en-US", { timeZone: "Asia/Manila", hour: "numeric", hour12: false })) % 24;

module.exports = { COURTS, RATES, BRANCH, sb, manilaDate, manilaHour };
