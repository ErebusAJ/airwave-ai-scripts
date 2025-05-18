
import React, { useEffect, useRef } from 'react';

interface PricingCardProps {
  plan: string;
  price: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
  delay: number;
}

const PricingCard: React.FC<PricingCardProps> = ({ plan, price, features, highlighted, cta, delay }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.style.transitionDelay = `${delay}ms`;
    }
  }, [delay]);

  return (
    <div 
      ref={cardRef}
      className={`bg-[#F5F5F5] text-[#121212] rounded-lg overflow-hidden fade-in-up card-hover flex flex-col ${highlighted ? 'border-4 border-[#121212]' : 'border border-gray-200'}`}
    >
      <div className="p-8 flex-grow">
        <h3 className="text-2xl font-semibold mb-3">{plan}</h3>
        <div className="mb-8">
          <span className="text-4xl font-bold">{price}</span>
          {price !== 'Custom' && <span className="text-gray-500">/month</span>}
        </div>
        
        <ul className="space-y-4 mb-10">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#121212] mr-3 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-lg">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="p-6 mt-auto">
        <button 
          className="w-full py-4 rounded-md transition-all text-lg bg-[#121212] text-[#F5F5F5] hover:bg-[#121212] hover:text-[#F5F5F5] relative overflow-hidden"
        >
          <span className="relative z-10">{cta}</span>
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.2)] to-transparent -translate-x-full hover:animate-shine"></span>
        </button>
      </div>
    </div>
  );
};

const PricingSection: React.FC = () => {
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
      className="section-padding bg-[#121212]"
    >
      <div className="container mx-auto">
        <h2 className="text-4xl font-semibold mb-16 text-center text-[#F5F5F5]">Pricing Plans</h2>
        
        <div 
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          <PricingCard
            plan="Free"
            price="$0"
            features={[
              "5 scripts per month",
              "3 voice-overs",
              "Basic voices only",
              "Standard support"
            ]}
            cta="Get Started"
            delay={0}
            highlighted={true}
          />
          <PricingCard
            plan="Starter"
            price="$29"
            features={[
              "50 scripts per month",
              "30 voice-overs",
              "10 premium voices",
              "Email support"
            ]}
            cta="Choose Starter"
            delay={200}
          />
          <PricingCard
            plan="Pro"
            price="$79"
            features={[
              "Unlimited scripts",
              "100 voice-overs",
              "All premium voices",
              "Priority support"
            ]}
            cta="Choose Pro"
            delay={400}
          />
          <PricingCard
            plan="Enterprise"
            price="Custom"
            features={[
              "Unlimited everything",
              "Custom voice cloning",
              "API access",
              "Dedicated support"
            ]}
            cta="Contact Sales"
            delay={600}
          />
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
