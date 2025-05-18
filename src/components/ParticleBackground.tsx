// ParticleBackground.tsx
import React, { useEffect, useRef } from 'react';

const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
      } else {
        // Fallback if parentElement is somehow not available initially
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); // Initial size

    const particlesArray: Particle[] = [];
    const numberOfParticles = 100; // Adjusted for potentially larger area, tune as needed
    
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3; // Slower speed
        this.speedY = (Math.random() - 0.5) * 0.3; // Slower speed
        this.opacity = Math.random() * 0.3 + 0.1; // Slightly more visible particles
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x + this.size < 0 || this.x - this.size > canvas.width) this.speedX *= -1;
        if (this.y + this.size < 0 || this.y - this.size > canvas.height) this.speedY *= -1;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.fillStyle = `rgba(240, 240, 240, ${this.opacity})`; // Slightly brighter base color
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      particlesArray.length = 0; // Clear existing particles on resize/re-init
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    };

    const connect = () => {
      if (!ctx) return;
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x;
          const dy = particlesArray[a].y - particlesArray[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 120) { // Increased connection distance slightly
            const lineOpacity = Math.max(0, 0.5 - (distance / 200)); // Dynamic opacity for lines
            ctx.strokeStyle = `rgba(240, 240, 240, ${lineOpacity})`;
            ctx.lineWidth = 0.3; // Thinner lines
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      
      connect();
      animationFrameId = requestAnimationFrame(animate);
    };

    // Re-initialize particles when canvas is resized significantly
    const debouncedInit = debounce(() => {
        resizeCanvas();
        init();
    }, 250);
    window.addEventListener('resize', debouncedInit);
    
    init();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('resize', debouncedInit);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Debounce utility
  function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<F>): Promise<ReturnType<F>> =>
      new Promise(resolve => {
        if (timeout) {
          clearTimeout(timeout);
        }
        timeout = setTimeout(() => resolve(func(...args)), waitFor);
      });
  }

  return (
    <canvas 
      ref={canvasRef} 
      style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        zIndex: 0  // Behind other content which should have z-index > 0 or be positioned
      }}
    />
  );
};

export default ParticleBackground;