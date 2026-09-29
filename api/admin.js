const crypto = require("crypto");
const { BRANCH, sb } = require("./_lib");

function authorized(req) {
  const expected = process.env.ADMIN_PASSCODE || "";
  const given = String(req.headers["x-admin-passcode"] || "");
  if (!expected || given.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(given), Buffer.from(expected));
}

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (!authorized(req)) return res.status(401).json({ error: "Unauthorized" });
  try {
    if (req.method === "GET") {
      const date = String(req.query.date || "");
      let q = `bookings?select=*&branch=eq.${BRANCH}&order=date.asc,hour.asc,court.asc`;
      if (/^\d{4}-\d{2}-\d{2}$/.test(date)) q += `&date=eq.${date}`;
      const { status, data } = await sb(q);
      if (status !== 200) return res.status(500).json({ error: "Database error" });
      return res.status(200).json({ bookings: data });
    }
    if (req.method === "DELETE") {
      const id = String(req.query.id || "");
      if (!/^\d+$/.test(id)) return res.status(400).json({ error: "Bad id" });
      const { status } = await sb(`bookings?id=eq.${id}`, { method: "DELETE" });
      if (status >= 300) return res.status(500).json({ error: "Could not cancel." });
      return res.status(200).json({ ok: true });
    }
    return res.status(405).json({ error: "Method not allowed" });
  } catch (e) {
    return res.status(500).json({ error: "Server error" });
  }
};
