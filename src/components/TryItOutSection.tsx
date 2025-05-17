
import React, { useEffect, useRef } from 'react';

const TryItOutSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && cardRef.current) {
          cardRef.current.classList.add('in-view');
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
      className="py-20 px-6 bg-black flex items-center justify-center"
    >
      <div 
        ref={cardRef}
        className="bg-white text-black rounded-lg shadow-2xl p-8 max-w-2xl w-full fade-in-up card-hover"
      >
        <h2 className="text-3xl font-semibold mb-6 text-center">
          Ready to Create Your First Script?
        </h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Enter your topic or idea here..."
            className="flex-grow px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
          <button className="bg-black text-white px-6 py-3 rounded-md font-medium transition-all hover:bg-white hover:text-black hover:shadow-md hover:border-black border-2 border-black">
            Generate
          </button>
        </div>
        <p className="text-gray-500 mt-4 text-sm text-center">
          No credit card required. Try it out instantly.
        </p>
      </div>
    </section>
  );
};

export default TryItOutSection;
