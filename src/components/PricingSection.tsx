import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils'; // Assuming cn utility is correctly set up

interface PricingCardProps {
  plan: string;
  price: string;
  features: string[];
  highlighted?: boolean; // For cards like "Free" that might have a special border
  popular?: boolean;     // For the "Most Popular" card (e.g., Pro plan)
  cta: string;
  delay: number;
}

const PricingCard: React.FC<PricingCardProps> = ({
  plan,
  price,
  features,
  highlighted,
  popular,
  cta,
  delay
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.style.transitionDelay = `${delay}ms`;
    }
  }, [delay]);

  return (
    <div
      ref={cardRef}
      className={cn(
        // Base classes for all cards
        "bg-[#F5F5F5] text-[#121212] rounded-lg overflow-hidden fade-in-up flex flex-col relative",
        "transition-all duration-300 ease-in-out", // For hover effects (scale, shadow)

        // Styling for different card types:
        {
          'scale-105 shadow-[0_0_40px_rgba(245,245,245,0.8)] z-13 hover:scale-[1.07] hover:shadow-[0_0_35px_#F5F5F5]': popular,

          'border-4 border-[#121212] hover:scale-105 hover:shadow-xl': highlighted && !popular,

          'border border-[#121212] hover:scale-105 hover:shadow-xl': !popular && !highlighted,
        }
      )}
      data-scroll="fade-up"
    >
      {popular && (
        <div className="absolute top-0 left-0 right-0 bg-[#121212] text-[#F5F5F5] py-1.5 text-center text-xs sm:text-sm font-semibold tracking-wider ">
          {/* Card's rounded-lg and overflow-hidden will curve the top corners of this banner. */}
          {/* We explicitly round the bottom corners with rounded-b-lg. */}
          Most Popular
        </div>
      )}

      {/* Adjust top padding for content if popular banner is shown */}
      <div className={cn("p-8 flex-grow", popular ? "pt-12" : "pt-8")}>
        <h3 className="text-2xl font-semibold mb-3">{plan}</h3>
        <div className="mb-8">
          <span className="text-4xl font-bold">{price}</span>
          {/* 1. Changed text-gray-500 to text-[#121212] with opacity */}
          {price !== 'Custom' && <span className="text-[#121212]/70">/month</span>}
        </div>

        <ul className="space-y-4 mb-10">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              {/* 1. Changed icon color from indigo to #121212 (black) */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#121212] mr-3 flex-shrink-0 mt-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-base md:text-lg">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-6 mt-auto"> {/* Ensure button is at the bottom */}
        <button
          className={cn(
            "w-full py-3 px-5 rounded-md text-lg font-semibold",
            "relative overflow-hidden group transition-colors duration-300", // Base for button and shine
            popular
              // 1. Changed popular button from indigo to black/white theme
              ? "bg-[#121212] text-[#F5F5F5] hover:bg-[#000000] hover:shadow-md" // Darker black on hover
              : "bg-[#121212] text-[#F5F5F5] hover:bg-[#2a2a2a]" // Default black button
          )}
        >
          <span className="relative z-10">{cta}</span>
          <span
            className="absolute top-0 left-[-150%] w-[120%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent
                       transform -skew-x-12
                       group-hover:left-[150%] transition-all duration-700 ease-in-out
                       opacity-0 group-hover:opacity-100"
          ></span>
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
      className="section-padding bg-[#121212] py-20 md:py-28"
      id="pricing"
    >
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-semibold mb-16 md:mb-20 text-center text-[#F5F5F5]" data-scroll="fade-up">
          Pricing Plans
        </h2>

        <div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 items-stretch"
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
            delay={150}
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
            delay={300}
            popular={true}
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
            delay={450}
          />
        </div>
      </div>
    </section>
  );
};

export default PricingSection;