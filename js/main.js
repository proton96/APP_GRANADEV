let current = 1; 
const total = document.querySelectorAll('.slide').length; 
const dotsContainer = document.getElementById('dots'); 
const counter = document.getElementById('counter');

for (let i = 1; i <= total; i++){ 
  const dot = document.createElement('div'); 
  dot.className = 'dot' + (i === 1 ? ' active' : ''); 
  dot.onclick = () => goToSlide(i); 
  dotsContainer.appendChild(dot);
} 

function goToSlide(n){ 
  const prev = document.querySelector('.slide.active'); 
  const next = document.querySelector(`.slide[data-slide="${n}"]`); 
  if(prev) prev.classList.remove('active'); 
  if(next){ 
    next.classList.add('active'); 
    animateSlide(next);
  } 
  current = n; 
  updateNav(); 
}

function changeSlide(dir){ 
  let next = current + dir; 
  if(next < 1) next = total; 
  if(next > total) next = 1; 
  goToSlide(next);
} 

function updateNav(){ 
  document.querySelectorAll('.dot').forEach((d,i) => d.classList.toggle('active', i+1 === current)); 
  counter.textContent = current + ' / ' + total; 
}

document.addEventListener('keydown', (e) => { 
  if(e.key === 'ArrowRight' || e.key === ' '){ e.preventDefault(); changeSlide(1);} 
  if(e.key === 'ArrowLeft'){ e.preventDefault(); changeSlide(-1);} 
});

let touchStartX = 0; 
document.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }); 
document.addEventListener('touchend', (e) => { 
  const diff = touchStartX - e.changedTouches[0].clientX; 
  if(Math.abs(diff) > 50) changeSlide(diff > 0 ? 1 : -1); 
});

function animateSlide(slide){ 
  slide.querySelectorAll('.reveal').forEach((el,i) => { 
    el.style.transition = 'none'; 
    el.style.opacity = '0'; 
    el.style.transform = 'translateY(20px)'; 
    el.offsetHeight; 
    const delay = i * 0.08; 
    el.style.transition = `opacity .35s ease ${delay}s, transform .35s ease ${delay}s`; 
    el.style.opacity = '1'; 
    el.style.transform = 'translateY(0px)'; 
  }); 
}

document.addEventListener('mousemove', (e) => { 
  const spotlight = document.querySelector('.mouse-spotlight'); 
  if(spotlight){ 
    spotlight.style.background = `radial-gradient(560px circle at ${e.clientX}px ${e.clientY}px, rgba(15,108,189,.06), transparent 42%)`; 
  }
});

window.initParticles = function(canvas, options){ 
  if(!canvas) return; 
  const ctx = canvas.getContext('2d'); 
  canvas.width = canvas.offsetWidth; 
  canvas.height = canvas.offsetHeight; 
  const interactive = options.interactive !== false; 
  const count = options.count || 36; 
  let mx = -1000, my = -1000; 
  
  const particles = Array.from({length: count}, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - .5) * .3,
    vy: (Math.random() - .5) * .3,
    size: Math.random() * 2.4 + .8,
    alpha: Math.random() * .26 + .08
  })); 
  
  if(interactive){ 
    canvas.addEventListener('mousemove', (e) => { 
      const r = canvas.getBoundingClientRect(); 
      mx = e.clientX - r.left; 
      my = e.clientY - r.top; 
    }); 
    canvas.addEventListener('mouseleave', () => { mx = -1000; my = -1000; }); 
  } 
  
  (function animate(){ 
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    particles.forEach(p => { 
      if(interactive){ 
        const dx = p.x - mx, dy = p.y - my, dist = Math.sqrt(dx*dx + dy*dy); 
        if(dist < 120 && dist > 0){ 
          const force = (120 - dist) / 120 * 1.6; 
          p.vx += (dx/dist) * force * .08; 
          p.vy += (dy/dist) * force * .08; 
        }
      } 
      p.vx *= .985; p.vy *= .985; 
      p.x += p.vx; p.y += p.vy; 
      if(p.x < 0) p.x = canvas.width; 
      if(p.x > canvas.width) p.x = 0; 
      if(p.y < 0) p.y = canvas.height; 
      if(p.y > canvas.height) p.y = 0; 
      
      ctx.beginPath(); 
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); 
      ctx.fillStyle = `rgba(15,108,189,${p.alpha})`; 
      ctx.fill(); 
    }); 
    requestAnimationFrame(animate); 
  })(); 
};

// Initialize everything when the DOM is ready (or defer the script)
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.particle-canvas').forEach(c => window.initParticles(c, {interactive:true, count:38})); 
  document.querySelectorAll('.particle-canvas-ambient').forEach(c => window.initParticles(c, {interactive:false, count:18})); 
  animateSlide(document.querySelector('.slide.active'));
});
