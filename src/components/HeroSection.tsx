
import React, { useEffect, useRef } from 'react';

const HeroSection: React.FC = () => {
  const headlineRef = useRef<HTMLHeadingElement>(null);

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
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6">
      <div className="max-w-4xl mx-auto">
        <h1 
          ref={headlineRef} 
          className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 animate-underline"
        >
          From Idea to Airwaves in One Click.
        </h1>
        <p className="text-gray-400 text-lg md:text-xl mb-10">
          Generate pro video scripts and instant AI voice-overs.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="bg-white text-black px-8 py-3 rounded-md font-medium transition-all hover:bg-black hover:text-white hover:border-white border-2 border-white">
            Try It Free
          </button>
          <button className="border-2 border-white text-white px-8 py-3 rounded-md font-medium transition-all hover:bg-white hover:text-black">
            See Demo
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
