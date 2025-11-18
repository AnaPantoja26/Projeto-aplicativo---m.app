(function(){
  const mesh = document.querySelector('.mesh');
  const logo = document.getElementById('logo');

  function handleMove(e){
    const x = (e.touches ? e.touches[0].clientX : e.clientX);
    const y = (e.touches ? e.touches[0].clientY : e.clientY);
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (x - cx) / cx;
    const dy = (y - cy) / cy;
    const mx = dx * 12;
    const my = dy * 10;

    mesh.style.transform = `translate3d(${mx}px, ${my}px, 0) rotate(${dx * 2}deg)`;
    logo.style.transform = `translate3d(${dx * 8}px, ${dy * 6}px, 0)`;
  }

  window.addEventListener('mousemove', handleMove);
  window.addEventListener('touchmove', handleMove, { passive: true });

  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    mesh.style.animation = 'none';
  }
})();
