
import React, { useEffect, useRef } from 'react';

const HeroSection: React.FC = () => {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Add the "active" class to trigger the underline animation after a slight delay
    const timer = setTimeout(() => {
      if (headlineRef.current) {
        headlineRef.current.classList.add('active');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas to full screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight * 1.6; // Extend beyond hero section to Try It Out section
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Particle settings
    const particlesArray: Particle[] = [];
    const numberOfParticles = 100;
    
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
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.2 + 0.1;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Bounce off edges
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.fillStyle = `rgba(245, 245, 245, ${this.opacity})`;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Create particles
    const init = () => {
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    };

    // Connect particles with lines
    const connect = () => {
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x;
          const dy = particlesArray[a].y - particlesArray[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            const opacity = 0.1 - (distance / 1000);
            ctx.strokeStyle = `rgba(245, 245, 245, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      
      connect();
      requestAnimationFrame(animate);
    };

    init();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 bg-[#121212] overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none"
      />
      <div className="max-w-4xl mx-auto relative z-10">
        <h1 
          ref={headlineRef} 
          className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 animate-underline text-[#F5F5F5]"
        >
          From Idea to Airwaves in One Click.
        </h1>
        <p className="text-gray-400 text-lg md:text-xl mb-10">
          Generate pro video scripts and instant AI voice-overs.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="bg-[#F5F5F5] text-[#121212] px-8 py-3 rounded-md font-medium transition-all hover:bg-[#121212] hover:text-[#F5F5F5] hover:border-[#F5F5F5] border-2 border-[#F5F5F5]">
            Try It Free
          </button>
          <button className="border-2 border-[#F5F5F5] text-[#F5F5F5] px-8 py-3 rounded-md font-medium transition-all hover:bg-[#F5F5F5] hover:text-[#121212]">
            See Demo
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
