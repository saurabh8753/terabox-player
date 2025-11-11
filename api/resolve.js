// api/resolve.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  // Basic CORS (optional — helpful if you open from file or other origins)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const tbUrl = req.query.url;
  if (!tbUrl) return res.status(400).json({ ok: false, error: "Missing url" });

  try {
    const API_KEY = process.env.RAPIDAPI_KEY;
    const HOST = "terabox-downloader-direct-download-link-generator2.p.rapidapi.com";
    const endpoint = `https://${HOST}/url?url=${encodeURIComponent(tbUrl)}`;

    const r = await fetch(endpoint, {
      method: "GET",
      headers: {
        "x-rapidapi-key": API_KEY,
        "x-rapidapi-host": HOST
      }
    });

    const text = await r.text();
    // try to parse JSON safely
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }

    if (!r.ok) {
      return res.status(r.status).json({ ok: false, error: data?.description || "Provider error", data });
    }
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}
