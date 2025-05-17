
import React, { useEffect, useRef, useState } from 'react';

interface StepProps {
  number: number;
  title: string;
  isVisible: boolean;
}

const Step: React.FC<StepProps> = ({ number, title, isVisible }) => {
  return (
    <div className={`flex flex-col items-center ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
      <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center text-xl font-bold mb-2">
        {number}
      </div>
      <p className="font-medium">{title}</p>
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
      className="py-20 px-6 bg-white text-black"
    >
      <div className="container mx-auto">
        <h2 className="text-3xl font-semibold mb-12 text-center">How It Works</h2>
        
        <div 
          ref={timelineRef}
          className="relative max-w-3xl mx-auto mb-16"
        >
          {/* Timeline line */}
          <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-300"></div>
          
          {/* Steps */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Step number={1} title="Input topic" isVisible={visibleSteps[0]} />
            <Step number={2} title="Choose style" isVisible={visibleSteps[1]} />
            <Step number={3} title="Generate script" isVisible={visibleSteps[2]} />
            <Step number={4} title="Add voice" isVisible={visibleSteps[3]} />
          </div>
        </div>
        
        {/* Code snippet section */}
        <div 
          ref={codeRef}
          className={`bg-gray-100 rounded-lg p-6 max-w-2xl mx-auto font-mono text-sm overflow-x-auto transition-all duration-700 ${codeVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'}`}
        >
          <div className="mb-4">
            <span className="text-gray-500">// Generate a new script</span>
            <pre className="mt-1"><code>POST /script-gen</code></pre>
            <pre><code>{`{
  "topic": "Product launch",
  "style": "enthusiastic",
  "length": "60s"
}`}</code></pre>
          </div>
          
          <div>
            <span className="text-gray-500">// Convert to speech</span>
            <pre className="mt-1"><code>POST /tts</code></pre>
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
