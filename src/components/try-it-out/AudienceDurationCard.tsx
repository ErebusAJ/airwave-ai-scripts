// src/components/try-it-out/AudienceDurationCard.tsx
import React from 'react';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { ArrowRight } from 'lucide-react'; // Assuming button is part of this component

interface AudienceDurationCardProps {
  ageGroup: string;
  onAgeGroupChange: (ageGroup: string) => void;
  duration: number[];
  onDurationChange: (duration: number[]) => void;
  onNextStep: () => void;
  isGenerating?: boolean; // Optional, if needed for disabling button
}

const ageGroups = ["All Ages", "Kids (8-12)", "Teens (13-17)", "Young Adults (18-24)", "Adults (25-45)", "Seniors (45+)"];

const AudienceDurationCard: React.FC<AudienceDurationCardProps> = ({
  ageGroup,
  onAgeGroupChange,
  duration,
  onDurationChange,
  onNextStep,
  isGenerating,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-8">
      <h2 className="text-3xl font-semibold mb-8 text-center">
        Target Audience & Duration
      </h2>

      <div className="w-full max-w-md space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Target Age Group</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {ageGroups.map((age) => (
              <button
                key={age}
                onClick={() => onAgeGroupChange(age)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all w-full
                                    ${
                                      ageGroup === age
                                        ? 'bg-[#121212] text-[#F5F5F5]'
                                        : 'bg-gray-200 text-[#121212] hover:bg-gray-300'
                                    }`}
              >
                {age}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estimated Duration: <span className="font-semibold text-[#121212]">{duration[0]} minute{duration[0] > 1 ? 's' : ''}</span>
          </label>
          <Slider
            defaultValue={duration}
            max={15}
            min={1}
            step={1}
            onValueChange={onDurationChange}
            className="w-full [&>span:first-child]:h-2 [&>span:first-child>span]:h-2 [&>span:last-child]:h-5 [&>span:last-child]:w-5"
          />
          <p className="text-xs text-gray-500 mt-1">Slider for 1 to 15 minutes.</p>
        </div>
      </div>

      <Button
        onClick={onNextStep}
        disabled={!ageGroup || isGenerating}
        className="bg-[#121212] text-[#F5F5F5] px-8 py-4 rounded-md font-medium transition-all hover:bg-[#F5F5F5] hover:text-[#121212] hover:shadow-md hover:border-[#121212] border-2 border-[#121212] relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed mt-4"
      >
        <span className="relative z-10 flex items-center">
          Next
          <ArrowRight className="ml-2" size={18} />
        </span>
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.2)] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-in-out"></span>
      </Button>

      <p className="text-gray-500 mt-6 text-sm text-center">
        This helps tailor the script's pacing and complexity.
      </p>
    </div>
  );
};

export default AudienceDurationCard;