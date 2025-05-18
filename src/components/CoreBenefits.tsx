
import React, { useEffect, useRef } from 'react';

interface BenefitCardProps {
  icon: React.ReactNode;
  title: string;
  delay: number;
}

const BenefitCard: React.FC<BenefitCardProps> = ({ icon, title, delay }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.style.transitionDelay = `${delay}ms`;
    }
  }, [delay]);

  return (
    <div 
      ref={cardRef}
      className="bg-[#F5F5F5] text-[#121212] rounded-lg p-8 text-center fade-in-up card-hover"
    >
      <div className="text-gray-600 mb-6 flex justify-center">
        {icon}
      </div>
      <h3 className="text-2xl font-medium">{title}</h3>
    </div>
  );
};

const CoreBenefits: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && cardsRef.current) {
          const cards = cardsRef.current.querySelectorAll('.fade-in-up');
          cards.forEach(card => {
            card.classList.add('in-view');
          });
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

  return (
    <section
      ref={sectionRef}
      className="section-padding bg-[#F5F5F5] text-[#121212]"
    >
      <div className="container mx-auto">
        <h2 className="text-4xl font-semibold mb-16 text-center">Core Benefits</h2>
        
        <div 
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          <BenefitCard 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            } 
            title="Scripts in <10s" 
            delay={0} 
          />
          <BenefitCard 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            } 
            title="Studio-grade voice" 
            delay={200} 
          />
          <BenefitCard 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            } 
            title="Tweak tone & pace" 
            delay={400} 
          />
          <BenefitCard 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
              </svg>
            } 
            title="Unlimited usage" 
            delay={600} 
          />
        </div>
      </div>
    </section>
  );
};

export default CoreBenefits;
