
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
      className={`bg-white text-black rounded-lg overflow-hidden fade-in-up card-hover ${highlighted ? 'border-4 border-black' : 'border border-gray-200'}`}
    >
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{plan}</h3>
        <div className="mb-6">
          <span className="text-3xl font-bold">{price}</span>
          {price !== 'Custom' && <span className="text-gray-500">/month</span>}
        </div>
        
        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black mr-2 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        
        <button 
          className={`w-full py-3 rounded-md transition-all ${
            highlighted 
              ? 'bg-black text-white hover:bg-white hover:text-black border-2 border-black' 
              : 'bg-gray-100 text-black hover:bg-black hover:text-white'
          }`}
        >
          {cta}
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
      className="py-20 px-6 bg-black"
    >
      <div className="container mx-auto">
        <h2 className="text-3xl font-semibold mb-12 text-center text-white">Pricing Plans</h2>
        
        <div 
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
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
            highlighted
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
