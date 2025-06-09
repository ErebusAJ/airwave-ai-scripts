
import React, { useEffect, useRef } from 'react';
import ParticleBackground from './ParticleBackground';

const HeroSection: React.FC = () => {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Add the "active" class to trigger the underline animation after a slight delay
    const timer = setTimeout(() => {
      if (headlineRef.current) {
        headlineRef.current.classList.add('active');
      }
      // Add description animation with delay
      if (descriptionRef.current) {
        setTimeout(() => {
          descriptionRef.current?.classList.add('in-view');
        }, 800);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
        
        <p 
          ref={descriptionRef}
          className="text-[#F5F5F5] text-lg md:text-xl mb-10 max-w-3xl mx-auto leading-relaxed fade-in-up opacity-0"
        >
          Transform your creative ideas into professional scripts tailored for YouTube, TikTok, Instagram, and more. 
          Our AI understands platform-specific formats and audience preferences, then brings your content to life 
          with studio-quality voice synthesis. Create engaging content that resonates with your audience in minutes, 
          not hours.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button 
            onClick={() => scrollToSection('try-it-out')}
            className="bg-[#F5F5F5] text-[#121212] px-8 py-3 rounded-md font-medium transition-all hover:bg-[#121212] hover:text-[#F5F5F5] hover:border-[#F5F5F5] border-2 border-[#F5F5F5]"
          >
            Try It Free
          </button>
          <button 
            onClick={() => scrollToSection('sign-up')}
            className="border-2 border-[#F5F5F5] text-[#F5F5F5] px-8 py-3 rounded-md font-medium transition-all hover:bg-[#F5F5F5] hover:text-[#121212]"
          >
            Beta Signup
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
