// Netlify Function: /.netlify/functions/instagram
// Devuelve las últimas publicaciones (Graph API) como JSON.
// Requisitos:
// - Netlify env vars: IG_ACCESS_TOKEN (long-lived), IG_USER_ID
// - El token debe tener permisos para leer media.
// Docs: README.md

export async function handler() {
  try {
    const token = process.env.IG_ACCESS_TOKEN;
    const userId = process.env.IG_USER_ID;

    if (!token || !userId) {
      return {
        statusCode: 200,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ items: [] })
      };
    }

    const fields = "id,caption,media_url,permalink,timestamp,media_type,thumbnail_url";
    const url = `https://graph.facebook.com/v19.0/${userId}/media?fields=${encodeURIComponent(fields)}&access_token=${encodeURIComponent(token)}`;

    const r = await fetch(url);
    if (!r.ok) throw new Error("Graph error: " + r.status);
    const j = await r.json();

    const items = (j.data || [])
      .filter(x => x.media_type !== "VIDEO" || x.thumbnail_url || x.media_url)
      .map(x => ({
        permalink: x.permalink,
        media_url: x.media_type === "VIDEO" ? (x.thumbnail_url || x.media_url) : x.media_url,
        caption: x.caption || "",
        timestamp: x.timestamp
      }));

    return {
      statusCode: 200,
      headers: {
        "content-type": "application/json",
        "cache-control": "public, max-age=300"
      },
      body: JSON.stringify({ items })
    };
  } catch (err) {
    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ items: [], error: String(err?.message || err) })
    };
  }
}
