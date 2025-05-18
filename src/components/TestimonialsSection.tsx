
import React from 'react';

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
}

const TestimonialsSection: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      quote: "This tool has completely transformed our video production workflow. We've reduced script creation time by 90%.",
      name: "Sarah J.",
      role: "Content Director",
      company: "MediaCorp"
    },
    {
      quote: "The voice quality is indistinguishable from professional voice actors. Our clients are always impressed.",
      name: "Michael T.",
      role: "Creative Lead",
      company: "Studio X"
    },
    {
      quote: "We've integrated the API into our editing software. Now our editors can generate voice-overs on the fly.",
      name: "Alex W.",
      role: "CTO",
      company: "EditPro"
    },
    {
      quote: "As a solo creator, this tool has saved me thousands on voice-over costs while improving quality.",
      name: "Jamie L.",
      role: "YouTuber",
      company: "TechReviews"
    },
    {
      quote: "The multi-language support allowed us to expand to international markets without hiring translators.",
      name: "Elena R.",
      role: "Marketing VP",
      company: "GrowthCo"
    }
  ];

  // Duplicate testimonials to create an infinite loop effect
  const allTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="py-32 bg-[#121212] overflow-hidden">
      <h2 className="text-4xl font-semibold mb-16 text-center text-[#F5F5F5]">What Our Users Say</h2>
      
      <div className="marquee fade-edges">
        <div className="marquee-content py-6">
          <div className="flex space-x-8">
            {allTestimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-[#F5F5F5] text-[#121212] rounded-lg p-8 shadow-lg min-w-[320px] max-w-[380px] flex-shrink-0 h-[220px] flex flex-col justify-between"
              >
                <p className="mb-6 text-gray-800 text-base line-clamp-4">&ldquo;{testimonial.quote}&rdquo;</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-gray-600 text-sm">{testimonial.role}, {testimonial.company}</p>
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
