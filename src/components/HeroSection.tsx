
import React, { useEffect, useRef } from 'react';
import ParticleBackground from './ParticleBackground';

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


  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 bg-[#121212] overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none"
      />
      <ParticleBackground />
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
