// src/components/try-it-out/ScriptGenerationLoading.tsx
import React from 'react';
import { FileText, Type, Clock, CheckCircle2 } from 'lucide-react';

interface ScriptGenerationLoadingProps {
  generationStep: number;
}

const scriptGenerationSteps = [
  { id: 1, label: "Analyzing Title...", IconElement: Type, activeAnimation: "animate-pulse" },
  { id: 2, label: "Writing Script...", IconElement: FileText, activeAnimation: "animate-[wiggle_1s_ease-in-out_infinite]" },
  { id: 3, label: "Finalizing...", IconElement: Clock, activeAnimation: "animate-spin" },
];

const ScriptGenerationLoading: React.FC<ScriptGenerationLoadingProps> = ({
  generationStep,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 sm:p-8 space-y-6 min-h-[350px] w-full">
      <h2 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6 text-center text-[#121212]">
        Generating Your Script...
      </h2>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-2 md:space-x-4 justify-center w-full max-w-2xl">
        {scriptGenerationSteps.map((step) => {
          const isActive = generationStep === step.id;
          const isCompleted = generationStep > step.id;

          let IconToRender = step.IconElement;
          let iconAnimation = "";
          let iconColor = "text-neutral-400";
          let textColor = "text-neutral-500";
          let bgColor = "bg-neutral-200";
          let phaseCardClasses = "border-neutral-300";

          if (isActive) {
            IconToRender = step.IconElement;
            iconAnimation = step.activeAnimation;
            iconColor = "text-[#121212]";
            textColor = "text-[#121212]";
            bgColor = "bg-white";
            phaseCardClasses = "phase-card-active-highlight border-[#121212] shadow-lg";
          } else if (isCompleted) {
            IconToRender = CheckCircle2;
            iconColor = "text-neutral-200";
            textColor = "text-neutral-200";
            bgColor = "bg-neutral-700";
            phaseCardClasses = "border-neutral-300";
          }

          return (
            <div
              key={step.id}
              className={`flex flex-col items-center justify-center p-4 rounded-lg 
                          transition-all duration-300 ease-in-out w-full sm:w-1/3 h-36 sm:h-40
                          border ${phaseCardClasses} ${bgColor}`}
            >
              <div className="relative z-[1] flex flex-col items-center justify-center">
                <IconToRender
                  size={32}
                  className={`mb-2 transition-colors duration-300 ease-in-out ${iconColor} ${iconAnimation}`}
                />
                <span
                  className={`text-sm sm:text-base font-medium text-center transition-colors duration-300 ease-in-out ${textColor}`}
                >
                  {step.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="w-full max-w-md h-2.5 bg-neutral-300 rounded-full overflow-hidden mt-6 sm:mt-8">
        <div
          className="h-full bg-[#121212] rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${(Math.min(generationStep, scriptGenerationSteps.length) / scriptGenerationSteps.length) * 100}%`,
          }}
        ></div>
      </div>
    </div>
  );
};

export default ScriptGenerationLoading;