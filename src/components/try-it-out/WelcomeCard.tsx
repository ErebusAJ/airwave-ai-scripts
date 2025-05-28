// src/components/try-it-out/WelcomeCard.tsx
import React from 'react';
import { Button } from '../ui/button';
import { FileText, ArrowRight } from 'lucide-react';

interface WelcomeCardProps {
  onNextStep: () => void;
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({ onNextStep }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-8">
      <div className="w-24 h-24 bg-[#121212] rounded-full flex items-center justify-center mb-4">
        <FileText size={48} className="text-[#F5F5F5]" />
      </div>
      <h2 className="text-3xl font-semibold mb-10 text-center">
        Ready to Create Your First Script?
      </h2>
      <Button
        onClick={onNextStep}
        className="bg-[#121212] text-[#F5F5F5] px-8 py-4 rounded-md font-medium transition-all hover:bg-[#F5F5F5] hover:text-[#121212] hover:shadow-md hover:border-[#121212] border-2 border-[#121212] relative overflow-hidden group"
      >
        <span className="relative z-10 flex items-center">
          Let's Start
          <ArrowRight className="ml-2" size={18} />
        </span>
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.2)] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-in-out"></span>
      </Button>
      <p className="text-gray-500 mt-6 text-sm text-center">
        No credit card required. Try it out instantly.
      </p>
    </div>
  );
};

export default WelcomeCard;