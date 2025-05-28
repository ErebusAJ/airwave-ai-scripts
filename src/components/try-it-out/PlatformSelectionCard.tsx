// src/components/try-it-out/PlatformSelectionCard.tsx
import React from 'react';
import { Button } from '../ui/button';
import {
  ArrowRight,
  Youtube,
  Instagram,
  Smartphone,
  Twitter,
  Linkedin,
  Facebook,
} from 'lucide-react';

interface PlatformSelectionCardProps {
  selectedPlatform: string;
  onPlatformSelect: (platform: string) => void;
  onNextStep: () => void;
}

const platforms = [
  { name: 'YouTube', icon: Youtube, key: 'youtube' },
  { name: 'Instagram', icon: Instagram, key: 'instagram' },
  { name: 'TikTok', icon: Smartphone, key: 'tiktok' },
  { name: 'Twitter / X', icon: Twitter, key: 'twitter' },
  { name: 'LinkedIn', icon: Linkedin, key: 'linkedin' },
  { name: 'Facebook', icon: Facebook, key: 'facebook' },
];

const PlatformSelectionCard: React.FC<PlatformSelectionCardProps> = ({
  selectedPlatform,
  onPlatformSelect,
  onNextStep,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-8">
      <h2 className="text-3xl font-semibold mb-10 text-center">
        Which Platform's Script Do You Need?
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full max-w-lg">
        {platforms.map((p) => (
          <button
            key={p.key}
            onClick={() => onPlatformSelect(p.key)}
            className={`flex flex-col items-center justify-center p-4 rounded-lg transition-all duration-200 ease-in-out aspect-square
                                ${
                                  selectedPlatform === p.key
                                    ? 'bg-[#121212] text-[#F5F5F5] shadow-lg scale-105'
                                    : 'bg-gray-100 text-[#121212] hover:bg-gray-200 hover:shadow-md border border-gray-200'
                                }`}
          >
            <p.icon size={36} className="mb-2" />
            <span className="text-sm font-medium">{p.name}</span>
          </button>
        ))}
      </div>
      <Button
        onClick={onNextStep}
        disabled={!selectedPlatform}
        className="bg-[#121212] text-[#F5F5F5] px-8 py-4 rounded-md font-medium transition-all hover:bg-[#F5F5F5] hover:text-[#121212] hover:shadow-md hover:border-[#121212] border-2 border-[#121212] relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed mt-6"
      >
        <span className="relative z-10 flex items-center">
          Next
          <ArrowRight className="ml-2" size={18} />
        </span>
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.2)] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-in-out"></span>
      </Button>
      <p className="text-gray-500 mt-6 text-sm text-center">
        Choose one to get platform-optimized tone.
      </p>
    </div>
  );
};

export default PlatformSelectionCard;