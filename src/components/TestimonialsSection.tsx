import React, { useEffect, useRef } from 'react';

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
}

const TestimonialsSection: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      quote: "This tool has completely transformed our video production workflow. We've reduced script creation time by 90% and the quality has only gotten better with each update.",
      name: "Sarah J.",
      role: "Content Director",
      company: "MediaCorp"
    },
    {
      quote: "The voice quality is indistinguishable from professional voice actors. Our clients are always impressed with the results, and we save thousands each month.",
      name: "Michael T.",
      role: "Creative Lead",
      company: "Studio X"
    },
    {
      quote: "We've integrated the API into our editing software. Now our editors can generate voice-overs on the fly without leaving their workflow. Game-changer for our production timelines.",
      name: "Alex W.",
      role: "CTO",
      company: "EditPro"
    },
    {
      quote: "As a solo creator, this tool has saved me thousands on voice-over costs while improving quality. I can't imagine going back to my old process now.",
      name: "Jamie L.",
      role: "YouTuber",
      company: "TechReviews"
    },
    {
      quote: "The multi-language support allowed us to expand to international markets without hiring translators. Our content now reaches audiences in 12 different countries.",
      name: "Elena R.",
      role: "Marketing VP",
      company: "GrowthCo"
    }
  ];

  const sectionRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const marqueeElement = marqueeRef.current;
    
    // Slow down the marquee animation
    if (marqueeElement) {
      const contentElements = marqueeElement.querySelectorAll('.marquee-content');
      contentElements.forEach(element => {
        (element as HTMLElement).style.animation = 'marquee 30s linear infinite';
      });
    }
  }, []);

  // Duplicate testimonials to create an infinite loop effect
  const allTestimonials = [...testimonials, ...testimonials];

  return (
    <section 
      ref={sectionRef} 
      className="py-40 bg-[#121212] overflow-hidden"
      id="testimonials"
    >
      <h2 className="text-4xl font-semibold mb-16 text-center text-[#F5F5F5]" data-scroll="fade-up">What Our Users Say</h2>
      
      <div className="marquee fade-edges" ref={marqueeRef}>
        <div className="marquee-content py-6">
          <div className="flex space-x-10">
            {allTestimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-[#F5F5F5] text-[#121212] rounded-lg p-6 shadow-lg min-w-[380px] max-w-[380px] flex-shrink-0 h-[300px] flex flex-col justify-between border border-gray-200"
                data-scroll="fade-up"
                style={{ transition: `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s` }}
              >
                <div className="flex-1 overflow-hidden">
                  <p className="text-gray-800 text-[15px] leading-7 whitespace-pre-wrap break-words">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="font-semibold text-[15px]">{testimonial.name}</p>
                  <p className="text-gray-600 text-sm mt-1">{testimonial.role}, {testimonial.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
