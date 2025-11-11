export default async function handler(req, res) {
  try {
    const tbUrl = req.query.url;
    if (!tbUrl) {
      return res.status(400).json({ ok: false, error: "Missing URL parameter" });
    }

    const API_KEY = process.env.RAPIDAPI_KEY;
    if (!API_KEY) {
      return res.status(500).json({ ok: false, error: "Missing RAPIDAPI_KEY env variable" });
    }

    const HOST = "terabox-downloader-direct-download-link-generator2.p.rapidapi.com";
    const apiUrl = `https://${HOST}/url?url=${encodeURIComponent(tbUrl)}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "x-rapidapi-key": API_KEY,
        "x-rapidapi-host": HOST,
      },
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    if (!response.ok) {
      return res.status(response.status).json({
        ok: false,
        error: data?.description || "API provider error",
        data,
      });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}
