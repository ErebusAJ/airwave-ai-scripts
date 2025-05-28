// src/components/try-it-out/AdditionalInstructionCard.tsx
import React from 'react';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Info, ArrowRight } from 'lucide-react'; // Assuming button is part of this component

interface AdditionalInstructionCardProps {
  customPrompt: string;
  onCustomPromptChange: (prompt: string) => void;
  onGenerateScript: () => void;
  isGenerating: boolean;
}

const AdditionalInstructionCard: React.FC<AdditionalInstructionCardProps> = ({
  customPrompt,
  onCustomPromptChange,
  onGenerateScript,
  isGenerating,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6">
      <div className="w-20 h-20 bg-neutral-200 rounded-full flex items-center justify-center mb-4">
        <Info size={40} className="text-[#121212]" />
      </div>
      <h2 className="text-3xl font-semibold mb-6 text-center">
        Additional Instructions <span className="text-xl text-gray-500">(Optional)</span>
      </h2>
      <div className="w-full max-w-lg">
        <Textarea
          placeholder="e.g., 'Make the tone very enthusiastic and use simple language.' or 'Focus on the historical aspects of the topic.' or 'Include a call to action to visit our website at the end.'"
          value={customPrompt}
          onChange={(e) => onCustomPromptChange(e.target.value)}
          className="min-h-[150px] p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#121212] text-base"
        />
      </div>
      <Button
        onClick={onGenerateScript}
        disabled={isGenerating}
        className="bg-[#121212] text-[#F5F5F5] px-8 py-4 rounded-md font-medium transition-all hover:bg-[#F5F5F5] hover:text-[#121212] hover:shadow-md hover:border-[#121212] border-2 border-[#121212] relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed mt-4"
      >
        <span className="relative z-10 flex items-center">
          Generate My Script
          <ArrowRight className="ml-2" size={18} />
        </span>
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.2)] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-in-out"></span>
      </Button>
      <p className="text-gray-500 mt-4 text-sm text-center max-w-md">
        Provide any specific details, tone preferences, or key points you want the AI to focus on. If left blank, we'll generate based on previous inputs.
      </p>
    </div>
  );
};

export default AdditionalInstructionCard;