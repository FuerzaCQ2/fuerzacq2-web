/* ==========================================================
   FUERZA (CQ)² — ig-feed.js
   Auto-feed para Instagram:
   - En local: muestra placeholders
   - En producción con Netlify/Vercel: crea un endpoint serverless que
     devuelva JSON con {items:[{permalink,media_url,caption,timestamp}]}
   ========================================================== */

(async function(){
  const root = document.getElementById("igFeed");
  if (!root) return;

  const placeholder = () => ([
    {
      permalink: "https://www.instagram.com/fuerzaccqq/",
      media_url: "assets/img/ig-1.jpg",
      caption: "Aviso importante — fechas y recordatorios",
      timestamp: new Date().toISOString()
    },
    {
      permalink: "https://www.instagram.com/fuerzaccqq/",
      media_url: "assets/img/ig-2.jpg",
      caption: "Banco de preguntas disponible — revisa historias",
      timestamp: new Date().toISOString()
    },
    {
      permalink: "https://www.instagram.com/fuerzaccqq/",
      media_url: "assets/img/ig-3.jpg",
      caption: "Actividad estudiantil — únete al equipo",
      timestamp: new Date().toISOString()
    },
    {
      permalink: "https://www.instagram.com/fuerzaccqq/",
      media_url: "assets/img/ig-4.jpg",
      caption: "Tips rápidos para el parcial",
      timestamp: new Date().toISOString()
    },
    {
      permalink: "https://www.instagram.com/fuerzaccqq/",
      media_url: "assets/img/ig-5.jpg",
      caption: "Calendario de evaluaciones (actualizado)",
      timestamp: new Date().toISOString()
    },
    {
      permalink: "https://www.instagram.com/fuerzaccqq/",
      media_url: "assets/img/ig-6.jpg",
      caption: "Recursos gratuitos: guías, resúmenes y más",
      timestamp: new Date().toISOString()
    }
  ]);

  function render(items){
    root.innerHTML = "";
    items.slice(0,6).forEach(it=>{
      const date = new Date(it.timestamp);
      const nice = isNaN(date.getTime()) ? "" : date.toLocaleDateString("es-EC", { year:"numeric", month:"short", day:"2-digit" });
      const a = document.createElement("a");
      a.className = "ig-card";
      a.href = it.permalink;
      a.target = "_blank";
      a.rel = "noopener";

      const img = document.createElement("img");
      img.className = "ig-thumb";
      img.loading = "lazy";
      img.alt = (it.caption || "Instagram post").slice(0,70);
      img.src = it.media_url;

      const meta = document.createElement("div");
      meta.className = "ig-meta";
      meta.innerHTML = `
        <div class="title">${escapeHtml((it.caption || "").slice(0,72))}${(it.caption||"").length>72 ? "…" : ""}</div>
        <div class="date">${nice}</div>
      `;

      a.appendChild(img);
      a.appendChild(meta);
      root.appendChild(a);
    });
  }

  function escapeHtml(s){
    return String(s).replace(/[&<>"']/g, (c)=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
  }

  // Try to fetch from serverless endpoint
  const endpoints = [
    "/.netlify/functions/instagram",
    "/api/instagram"
  ];

  for (const url of endpoints){
    try{
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      if (data && Array.isArray(data.items) && data.items.length){
        render(data.items);
        return;
      }
    }catch(e){
      // ignore and try next endpoint
    }
  }

  // Fallback
  render(placeholder());
})();
