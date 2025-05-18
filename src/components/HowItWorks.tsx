
import React, { useEffect, useRef, useState } from 'react';

interface StepProps {
  number: number;
  title: string;
  isVisible: boolean;
}

const Step: React.FC<StepProps> = ({ number, title, isVisible }) => {
  return (
    <div className={`flex flex-col items-center ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
      <div className="w-16 h-16 rounded-full bg-[#121212] text-[#F5F5F5] flex items-center justify-center text-2xl font-bold mb-4">
        {number}
      </div>
      <p className="font-medium text-lg">{title}</p>
    </div>
  );
};

const HowItWorks: React.FC = () => {
  const [visibleSteps, setVisibleSteps] = useState<boolean[]>([false, false, false, false]);
  const [codeVisible, setCodeVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Sequentially show steps
          for (let i = 0; i < 4; i++) {
            setTimeout(() => {
              setVisibleSteps(prev => {
                const newState = [...prev];
                newState[i] = true;
                return newState;
              });
            }, i * 300);
          }
          
          // Show code block after steps
          setTimeout(() => {
            setCodeVisible(true);
          }, 1200);
        }
      },
      { threshold: 0.3 }
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
      className="section-padding bg-[#F5F5F5] text-[#121212] min-h-screen flex items-center"
      id="how-it-works"
    >
      <div className="container mx-auto">
        <h2 className="text-5xl font-semibold mb-20 text-center" data-scroll="fade-up">How It Works</h2>
        
        <div 
          ref={timelineRef}
          className="relative max-w-4xl mx-auto mb-20"
          data-scroll="fade-up"
        >
          {/* Timeline line */}
          <div className="absolute top-8 left-0 right-0 h-1 bg-gray-300"></div>
          
          {/* Steps */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Step number={1} title="Input topic" isVisible={visibleSteps[0]} />
            <Step number={2} title="Choose style" isVisible={visibleSteps[1]} />
            <Step number={3} title="Generate script" isVisible={visibleSteps[2]} />
            <Step number={4} title="Add voice" isVisible={visibleSteps[3]} />
          </div>
        </div>
        
        {/* Code snippet section */}
        <div 
          ref={codeRef}
          className={`bg-gray-100 rounded-lg p-8 max-w-3xl mx-auto font-mono text-base overflow-x-auto transition-all duration-700 ${codeVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'}`}
          data-scroll="fade-up"
        >
          <div className="mb-6">
            <span className="text-gray-500">// Generate a new script</span>
            <pre className="mt-2"><code>POST /script-gen</code></pre>
            <pre><code>{`{
  "topic": "Product launch",
  "style": "enthusiastic",
  "length": "60s"
}`}</code></pre>
          </div>
          
          <div>
            <span className="text-gray-500">// Convert to speech</span>
            <pre className="mt-2"><code>POST /tts</code></pre>
            <pre><code>{`{
  "text": "Generated script content...",
  "voice": "emma",
  "pace": "normal"
}`}</code></pre>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
