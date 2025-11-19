(function () {
  const mesh = document.querySelector('.mesh');
  const logo = document.getElementById('logo');

  function handleMove(e) {
    const pos = e.touches ? e.touches[0] : e;
    const dx = (pos.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
    const dy = (pos.clientY - window.innerHeight / 2) / (window.innerHeight / 2);

    mesh.style.transform = `translate3d(${dx * 12}px, ${dy * 10}px, 0) rotate(${dx * 2}deg)`;
    logo.style.transform = `translate3d(${dx * 8}px, ${dy * 6}px, 0)`;
  }

  window.addEventListener('mousemove', handleMove);
  window.addEventListener('touchmove', handleMove, { passive: true });
})();

/* ===== TROCA DE TELAS COM FADE ===== */

setTimeout(() => {
  const tela1 = document.getElementById("tela1");
  const tela2 = document.getElementById("tela2");

  tela1.classList.add("hidden");
  tela2.classList.remove("hidden");
}, 5000);
