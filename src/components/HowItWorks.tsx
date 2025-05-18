import React, { useEffect, useRef, useState } from 'react';
import ParticleBackground from './ParticleBackground'; // Assuming ParticleBackground.tsx is in the same directory

// --- Placeholder Icons ---
const SearchIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);
const CogIcon = ({ className = "w-6 h-6" }: { className?: string }) => ( 
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const DocumentTextIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);
const MicrophoneIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
  </svg>
);
// --- End Icons ---


const stepsConfig = [
  { id: 1, icon: <SearchIcon />, title: "Input Topic", description: "Start by telling us what your video is about. The more specific, the better for AI!" },
  { id: 2, icon: <CogIcon />, title: "Choose Style", description: "Select the tone, mood, and target audience to tailor the script perfectly." },
  { id: 3, icon: <DocumentTextIcon />, title: "Generate Script", description: "Our AI crafts a compelling, professional-grade script based on your inputs in seconds." },
  { id: 4, icon: <MicrophoneIcon />, title: "Add Voice", description: "Pick from a variety of natural-sounding AI voices and customize pace and emotion." },
];

// --- Color & Style Constants ---
const highlightSectionTextColorClass = "text-neutral-500"; 
const iconBgHighlightClass = "bg-[#F0F0F0]";           
const iconColorHighlightClass = "text-neutral-700";      
const iconColorDefaultClass = "text-white";              
const iconBgDefaultClass = "bg-neutral-700";            
const lineBgHighlightClass = "bg-[#F0F0F0]";            
const lineBgDefaultClass = "bg-neutral-700";             

interface StepItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isIconHighlighted: boolean;
  lineBelowFillPercent: 0 | 100;
  lineBelowIsUnfilling: boolean;
  isLast: boolean;
  isVisible: boolean;     
  lineHeightClass?: string;
  noTransitionOverride?: boolean;
}

// StepItem no longer contains particle logic
const StepItem: React.FC<StepItemProps> = ({ 
  icon, title, description, isIconHighlighted, lineBelowFillPercent, lineBelowIsUnfilling, 
  isLast, isVisible, 
  lineHeightClass = "h-16 sm:h-20",
  noTransitionOverride = false 
}) => {
  const currentIconBg = isIconHighlighted ? iconBgHighlightClass : iconBgDefaultClass;
  const currentIconColor = isIconHighlighted ? iconColorHighlightClass : iconColorDefaultClass;

  const lineActualHeight = lineBelowIsUnfilling ? '100%' : `${lineBelowFillPercent}%`;
  const lineTransform = lineBelowIsUnfilling ? 'translateY(100%)' : 'translateY(0%)';
  const lineTransitionClasses = noTransitionOverride ? '' : 'transition-all duration-500 ease-in-out';

  return (
    <li 
      className={`flex items-start space-x-4 sm:space-x-6 transition-all duration-700 ease-in-out ${isVisible ? 'opacity-100 transform-none' : 'opacity-0 translate-y-5'}`}
    >
      <div className="flex flex-col items-center relative">
        <div 
          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center ${currentIconBg} transition-colors duration-300 flex-shrink-0`}
        >
          {React.cloneElement(icon as React.ReactElement, { 
            className: `w-6 h-6 sm:w-7 sm:h-7 ${currentIconColor} transition-colors duration-300` 
          })}
        </div>
        {!isLast && (
          <div 
            className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0.5 sm:w-1 ${lineHeightClass} mt-1 ${lineBgDefaultClass} overflow-hidden`}
          >
            <div 
              className={`w-full ${lineBgHighlightClass} ${lineTransitionClasses}`} 
              style={{ height: lineActualHeight, transform: lineTransform }}
            ></div>
          </div>
        )}
      </div>
      <div className="flex-1 pt-1 sm:pt-2">
        <h3 className="text-lg sm:text-xl font-semibold text-[#F5F5F5] mb-1">{title}</h3>
        <p className="text-sm sm:text-base text-gray-400">{description}</p>
      </div>
    </li>
  );
};

const HowItWorks: React.FC = () => {
  const [visibleSteps, setVisibleSteps] = useState<boolean[]>(() => Array(stepsConfig.length).fill(false));
  const [activeIndex, setActiveIndex] = useState<number>(-1); 
  const [animationPhase, setAnimationPhase] = useState<'pending' | 'initial-revealing' | 'looping'>('pending');
  const [loopAnimationStage, setLoopAnimationStage] = useState<'stable' | 'filling' | 'unfilling'>('stable');

  const sectionRef = useRef<HTMLDivElement>(null);
  const initialRevealTimeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const DURATION_PER_INITIAL_STEP = 600; 
  const ICON_STABLE_DURATION = 1000; 
  const LINE_ANIMATION_DURATION = 500; 

  useEffect(() => {
    const currentSectionRef = sectionRef.current;
    if (!currentSectionRef) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && animationPhase === 'pending') {
          setAnimationPhase('initial-revealing');
          observer.unobserve(currentSectionRef); 
        }
      },
      { threshold: 0.2 } 
    );
    if (animationPhase === 'pending') observer.observe(currentSectionRef);
    return () => observer.disconnect();
  }, [animationPhase]);

  useEffect(() => {
    if (animationPhase === 'initial-revealing') {
      initialRevealTimeoutsRef.current.forEach(clearTimeout); 
      initialRevealTimeoutsRef.current = [];
      if (stepsConfig.length === 0) {
        setAnimationPhase('looping');
        return;
      }
      stepsConfig.forEach((_, index) => {
        const timeoutId = setTimeout(() => {
          setVisibleSteps(prev => {
            const newVisibleSteps = [...prev];
            newVisibleSteps[index] = true;
            return newVisibleSteps;
          });
          setActiveIndex(index); 
          if (index === stepsConfig.length - 1) {
            const transitionToLoopTimeout = setTimeout(() => {
              setLoopAnimationStage('stable'); 
              setAnimationPhase('looping');
            }, DURATION_PER_INITIAL_STEP);
            initialRevealTimeoutsRef.current.push(transitionToLoopTimeout);
          }
        }, index * DURATION_PER_INITIAL_STEP);
        initialRevealTimeoutsRef.current.push(timeoutId);
      });
    }
    return () => initialRevealTimeoutsRef.current.forEach(clearTimeout);
  }, [animationPhase, stepsConfig.length]);

  useEffect(() => {
    if (animationPhase !== 'looping' || stepsConfig.length === 0) {
      if (animationPhase === 'looping' && activeIndex === -1 && stepsConfig.length > 0) {
         setActiveIndex(0); 
         setLoopAnimationStage('stable');
      }
      return;
    }
  
    let stableTimer: NodeJS.Timeout;
    let fillingTimer: NodeJS.Timeout;
    let unfillingTimer: NodeJS.Timeout;
  
    if (loopAnimationStage === 'stable') {
      stableTimer = setTimeout(() => {
        if (animationPhase === 'looping') setLoopAnimationStage('filling');
      }, ICON_STABLE_DURATION);
    } else if (loopAnimationStage === 'filling') {
      fillingTimer = setTimeout(() => {
        if (animationPhase === 'looping') setLoopAnimationStage('unfilling');
      }, LINE_ANIMATION_DURATION);
    } else if (loopAnimationStage === 'unfilling') {
      unfillingTimer = setTimeout(() => {
        if (animationPhase === 'looping') {
          setActiveIndex(prev => (prev + 1) % stepsConfig.length);
          setLoopAnimationStage('stable'); 
        }
      }, LINE_ANIMATION_DURATION);
    }
  
    return () => {
      clearTimeout(stableTimer);
      clearTimeout(fillingTimer);
      clearTimeout(unfillingTimer);
    };
  }, [animationPhase, activeIndex, loopAnimationStage, stepsConfig.length]);

  return (
    <section 
      ref={sectionRef}
      className="bg-[#121212] text-[#F5F5F5] min-h-screen flex flex-col items-center justify-center py-16 sm:py-24 px-4 relative overflow-hidden" // Added relative and overflow-hidden
      id="how-it-works"
    >
      <ParticleBackground /> {/* Render the particle background here */}
      
      {/* Content container, ensure it's on top of particles */}
      <div className="container mx-auto max-w-4xl relative z-10"> 
        <h2 
          className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-12 sm:mb-16 text-center"
        >
          Simple Steps to <span className={highlightSectionTextColorClass}>Get Started</span>
        </h2>
        <ul className="max-w-md sm:max-w-lg md:max-w-xl mx-auto space-y-10 sm:space-y-12">
          {stepsConfig.map((step, itemOwnIndex) => {
            let isIconHighlightedForThisItem = false;
            let lineBelowFillPercentForThisItem: 0 | 100 = 0;
            let lineBelowIsUnfillingForThisItem = false;
            let noTransitionOverrideForThisItem = false;

            if (animationPhase === 'initial-revealing') {
              if (itemOwnIndex === activeIndex) {
                isIconHighlightedForThisItem = true;
              }
            } else if (animationPhase === 'looping' && activeIndex !== -1 && stepsConfig.length > 0) {
              if (loopAnimationStage === 'stable') {
                const indexOfLineThatJustUnfilled = (activeIndex - 1 + stepsConfig.length) % stepsConfig.length;
                if (itemOwnIndex === indexOfLineThatJustUnfilled) {
                  noTransitionOverrideForThisItem = true;
                }
              }

              if (loopAnimationStage === 'stable' && itemOwnIndex === activeIndex) {
                isIconHighlightedForThisItem = true;
              } else if (loopAnimationStage === 'unfilling') {
                const nextItemToHighlight = (activeIndex + 1) % stepsConfig.length;
                if (itemOwnIndex === nextItemToHighlight) {
                  isIconHighlightedForThisItem = true;
                }
              }
              
              if (itemOwnIndex === activeIndex) {
                if (loopAnimationStage === 'filling') {
                  lineBelowFillPercentForThisItem = 100;
                } else if (loopAnimationStage === 'unfilling') {
                  lineBelowFillPercentForThisItem = 100; 
                  lineBelowIsUnfillingForThisItem = true; 
                }
              }
            }
            
            return (
              <StepItem
                key={step.id}
                icon={step.icon}
                title={step.title}
                description={step.description}
                isIconHighlighted={isIconHighlightedForThisItem}
                lineBelowFillPercent={lineBelowFillPercentForThisItem}
                lineBelowIsUnfilling={lineBelowIsUnfillingForThisItem}
                isLast={itemOwnIndex === stepsConfig.length - 1}
                isVisible={visibleSteps[itemOwnIndex]}
                noTransitionOverride={noTransitionOverrideForThisItem}
              />
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default HowItWorks;