
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
      className="py-36 px-6 bg-[#121212] flex items-center justify-center relative z-10"
    >
      <div 
        ref={cardRef}
        className="bg-[#F5F5F5] text-[#121212] rounded-lg shadow-2xl p-12 max-w-3xl w-full fade-in-up card-hover"
      >
        <h2 className="text-3xl font-semibold mb-10 text-center">
          Ready to Create Your First Script?
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Enter your topic or idea here..."
            className="flex-grow px-5 py-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#121212]"
          />
          <button className="bg-[#121212] text-[#F5F5F5] px-6 py-4 rounded-md font-medium transition-all hover:bg-[#F5F5F5] hover:text-[#121212] hover:shadow-md hover:border-[#121212] border-2 border-[#121212]">
            Generate
          </button>
        </div>
        <p className="text-gray-500 mt-6 text-sm text-center">
          No credit card required. Try it out instantly.
        </p>
      </div>
    </section>
  );
};

export default TryItOutSection;
