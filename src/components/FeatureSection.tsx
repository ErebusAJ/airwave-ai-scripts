
import React, { useEffect, useRef } from 'react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.style.transitionDelay = `${index * 100}ms`;
    }
  }, [index]);
  
  return (
    <div 
      ref={cardRef}
      className="bg-[#F5F5F5] text-[#121212] border-2 border-transparent rounded-lg p-8 transition-all duration-300 hover:border-[#121212] fade-in-up"
      data-scroll="fade-up"
    >
      <div className="text-gray-500 mb-6">
        {icon}
      </div>
      <h3 className="text-2xl font-medium mb-4">{title}</h3>
      <p className="text-gray-600 text-lg">{description}</p>
    </div>
  );
};

const FeatureSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const features = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      ),
      title: "Voice Cloning",
      description: "Clone your voice or choose from 50+ professional voice actors across multiple languages."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: "Visual Sync",
      description: "Automatically sync your voice-over with videos and animations for perfect timing."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
      ),
      title: "Multi-language",
      description: "Generate scripts and voice-overs in 30+ languages with native-sounding pronunciation."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      title: "API Access",
      description: "Integrate script generation and voice synthesis directly into your applications."
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className="section-padding bg-[#121212] text-[#F5F5F5] min-h-screen flex items-center"
      id="features"
    >
      <div className="container mx-auto">
        <h2 className="text-5xl font-semibold mb-20 text-center" data-scroll="fade-up">Features Deep-Dive</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" data-stagger>
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
