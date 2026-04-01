// Vercel / Next.js /api/instagram (Node 18+)
// Coloca este archivo como: /api/instagram.js
// Requisitos: env vars IG_ACCESS_TOKEN, IG_USER_ID

export default async function handler(req, res) {
  try {
    const token = process.env.IG_ACCESS_TOKEN;
    const userId = process.env.IG_USER_ID;

    if (!token || !userId) {
      return res.status(200).json({ items: [] });
    }

    const fields = "id,caption,media_url,permalink,timestamp,media_type,thumbnail_url";
    const url = `https://graph.facebook.com/v19.0/${userId}/media?fields=${encodeURIComponent(fields)}&access_token=${encodeURIComponent(token)}`;
    const r = await fetch(url);
    if (!r.ok) throw new Error("Graph error: " + r.status);
    const j = await r.json();

    const items = (j.data || []).map(x => ({
      permalink: x.permalink,
      media_url: x.media_type === "VIDEO" ? (x.thumbnail_url || x.media_url) : x.media_url,
      caption: x.caption || "",
      timestamp: x.timestamp
    }));

    res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
    return res.status(200).json({ items });
  } catch (err) {
    return res.status(200).json({ items: [], error: String(err?.message || err) });
  }
}
