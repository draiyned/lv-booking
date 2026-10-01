const { COURTS, RATES, BRANCH, sb, manilaDate, manilaHour } = require("./_lib");

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  try {
    if (req.method === "GET") {
      const date = String(req.query.date || "");
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return res.status(400).json({ error: "Bad date" });
      const { status, data } = await sb(`bookings?select=court,hour&branch=eq.${BRANCH}&date=eq.${date}`);
      if (status !== 200) return res.status(500).json({ error: "Database error" });
      return res.status(200).json({ booked: data });
    }

    if (req.method === "POST") {
      const { date, name, phone, gcashRef, slots } = req.body || {};
      const today = manilaDate();
      if (!/^\d{4}-\d{2}-\d{2}$/.test(String(date)) || date < today)
        return res.status(400).json({ error: "Pick a valid date." });
      const cleanName = String(name || "").trim().slice(0, 80);
      const cleanPhone = String(phone || "").trim().slice(0, 30);
      const cleanRef = String(gcashRef || "").trim().slice(0, 40);
      if (!cleanName || cleanPhone.length < 5) return res.status(400).json({ error: "Enter your name and number." });
      if (!cleanRef) return res.status(400).json({ error: "Enter your GCash reference number." });
      if (!Array.isArray(slots) || slots.length < 1 || slots.length > 40)
        return res.status(400).json({ error: "Select at least one slot." });

      const seen = new Set();
      const rows = [];
      for (const s of slots) {
        const hour = Number(s && s.hour);
        const court = s && s.court;
        if (!COURTS.includes(court) || !Number.isInteger(hour) || hour < 5 || hour > 22)
          return res.status(400).json({ error: "Bad slot." });
        if (date === today && hour < manilaHour())
          return res.status(400).json({ error: "That time has passed." });
        const key = court + "|" + hour;
        if (seen.has(key)) continue;
        seen.add(key);
        rows.push({
          branch: BRANCH, date, court, hour,
          name: cleanName, phone: cleanPhone, gcash_ref: cleanRef,
          amount: hour >= 16 ? RATES.night : RATES.day,
        });
      }

      const { status, data: saveData } = await sb("bookings", {
        method: "POST",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify(rows),
      });
      if (status === 409) return res.status(409).json({ error: "taken" });
      if (status >= 300) {
        const why = String((saveData && (saveData.message || saveData.error)) || "no details").slice(0, 100);
        return res.status(500).json({ error: "Could not save (" + status + ": " + why + ")" });
      }
      return res.status(201).json({ ok: true, count: rows.length, total: rows.reduce((a, r) => a + r.amount, 0) });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (e) {
    return res.status(500).json({ error: "Server error (" + String((e && e.message) || "unknown").slice(0, 80) + ")" });
  }
};
