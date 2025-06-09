
import React, { useEffect, useRef } from 'react';
import { Card } from './ui/card';

interface BenefitCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const BenefitCard: React.FC<BenefitCardProps> = ({ icon, title, description, delay }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.style.transitionDelay = `${delay}ms`;
    }
  }, [delay]);

  return (
    <Card 
      ref={cardRef}
      className="bg-gradient-to-br from-white to-[#F8F8F8] text-[#121212] rounded-2xl p-6 text-left fade-in-up shadow-xl border-2 border-gray-100 hover:shadow-2xl transition-all duration-500 group overflow-hidden relative transform hover:-rotate-1 hover:scale-105"
    >
      {/* Animated background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
      
      <div className="relative z-10">
        <div className="text-gray-700 mb-4 flex justify-start transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
          <div className="p-3 rounded-full bg-gradient-to-br from-[#F5F5F5] to-gray-100 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
            {icon}
          </div>
        </div>
        
        <h3 className="text-xl font-bold mb-3 relative group-hover:text-indigo-700 transition-colors duration-300">
          {title}
        </h3>
        
        <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
          {description}
        </p>
      </div>
      
      {/* Corner decoration */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-yellow-200 to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500 rounded-bl-full"></div>
    </Card>
  );
};

const CoreBenefits: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (titleRef.current) {
            titleRef.current.classList.add('in-view');
          }
          
          if (cardsRef.current) {
            const cards = cardsRef.current.querySelectorAll('.fade-in-up');
            cards.forEach(card => {
              card.classList.add('in-view');
            });
          }
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Create particle wave effect
  useEffect(() => {
    if (!sectionRef.current) return;
    
    const section = sectionRef.current;
    const particleCount = 20;
    
    // Clean up any existing particles first
    const existingParticles = section.querySelectorAll('.wave-particle');
    existingParticles.forEach(p => p.remove());
    
    // Create new particles
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.classList.add('wave-particle');
      
      // Random position
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      
      // Random size
      const size = 3 + Math.random() * 5;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Random animation delay
      particle.style.animationDelay = `${Math.random() * 5}s`;
      
      section.appendChild(particle);
    }
    
    return () => {
      const particles = section.querySelectorAll('.wave-particle');
      particles.forEach(p => p.remove());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-padding bg-gradient-to-b from-[#F0F0F0] to-[#E5E5E5] text-[#121212] min-h-screen flex flex-col justify-center relative overflow-hidden"
      id="core-benefits"
    >
      {/* Background decoration elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-[#F0F0F0] to-transparent rounded-full -translate-y-1/2 -translate-x-1/2 opacity-50"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-[#F0F0F0] to-transparent rounded-full translate-y-1/2 translate-x-1/2 opacity-50"></div>
      
      <div className="container mx-auto relative z-10">
        <h2 
          ref={titleRef}
          className="text-6xl font-semibold mb-8 text-center fade-in-up" 
          data-scroll="fade-up"
        >
          Core Benefits
        </h2>
        
        <p className="text-xl text-center max-w-2xl mx-auto mb-20 text-gray-600 fade-in-up" data-scroll="fade-up" style={{ transitionDelay: '100ms' }}>
          Experience the power of AI voice technology that delivers studio-quality results in seconds
        </p>
        
        <div 
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          data-scroll="fade-up"
        >
          <BenefitCard 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            } 
            title="Scripts in <10s" 
            description="Generate professional scripts in less than 10 seconds with our advanced AI technology."
            delay={0} 
          />
          <BenefitCard 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            } 
            title="Studio-grade Voice" 
            description="Enjoy crystal-clear, natural-sounding voices that rival professional studio recordings."
            delay={200} 
          />
          <BenefitCard 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            } 
            title="Tweak Tone & Pace" 
            description="Customize every aspect of your voice-over with intuitive controls for tone, pace, and emphasis."
            delay={400} 
          />
          <BenefitCard 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
              </svg>
            } 
            title="Unlimited Usage" 
            description="Create as many projects as you need with our flexible plans designed for creators of all sizes."
            delay={600} 
          />
        </div>
      </div>
    </section>
  );
};

export default CoreBenefits;
