/* ==========================================================
   FUERZA (CQ)² — main.js
   - Animación de contadores
   - Año dinámico
   - Formulario (demo)
   ========================================================== */

(function(){
  // Preloader
  const pre = document.getElementById('preloader');
  window.addEventListener('load', () => {
    document.body.classList.remove('is-loading');
    if (pre){
      pre.classList.add('hide');
      setTimeout(()=>pre.remove(), 250);
    }
  });

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Simple counter animation
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  function animateCount(el, to){
    const from = 0;
    const duration = 900;
    const start = performance.now();

    function frame(now){
      const t = Math.min(1, (now - start) / duration);
      const val = Math.round(from + (to - from) * easeOut(t));
      el.textContent = val.toLocaleString("es-EC");
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  const counterEls = [...document.querySelectorAll("[data-count]")];
  const io = new IntersectionObserver((entries)=>{
    for (const e of entries){
      if (e.isIntersecting){
        const target = Number(e.target.getAttribute("data-count") || "0");
        animateCount(e.target, target);
        io.unobserve(e.target);
      }
    }
  }, { threshold: 0.25 });

  counterEls.forEach(el => io.observe(el));

  // Contact form demo
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  if (form && status){
    form.addEventListener("submit", (ev)=>{
      ev.preventDefault();
      status.className = "small";
      status.textContent = "✅ Listo. (Demo) Configura el envío real en README.md";
      form.reset();
    });
  }
})();
