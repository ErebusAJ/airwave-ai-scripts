// src/components/try-it-out/ContentDetailsCard.tsx
import React from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Check, ArrowRight } from 'lucide-react';

interface ContentDetailsCardProps {
  title: string;
  onTitleChange: (title: string) => void;
  availableTags: string[]; // Renamed from tags for clarity in props
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  customTag: string;
  onCustomTagChange: (tag: string) => void;
  isAddingCustomTag: boolean;
  onSetIsAddingCustomTag: (isAdding: boolean) => void; // Renamed for clarity
  onAddCustomTag: () => void;
  onNextStep: () => void;
}

const ContentDetailsCard: React.FC<ContentDetailsCardProps> = ({
  title,
  onTitleChange,
  availableTags,
  selectedTags,
  onTagToggle,
  customTag,
  onCustomTagChange,
  isAddingCustomTag,
  onSetIsAddingCustomTag,
  onAddCustomTag,
  onNextStep,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-8">
      <h2 className="text-3xl font-semibold mb-8 text-center">
        Describe Your Content
      </h2>

      <div className="w-full max-w-md mb-4">
        <label htmlFor="videoTitle" className="block text-sm font-medium text-gray-700 mb-1">
          Video/Podcast Title
        </label>
        <Input
          id="videoTitle"
          placeholder="e.g., My Trip to Japan"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#121212] text-lg"
        />
      </div>

      <div className="w-full max-w-md my-4">
        <div className="flex items-center mb-2">
          <h4 className="text-sm font-medium text-gray-700">Add Relevant Tags <span className="text-xs text-gray-500">(Optional)</span></h4>
          <hr className="flex-grow ml-2 border-gray-300" />
        </div>
        <div className="flex flex-wrap gap-2">
          {availableTags.map((tag) => (
            <button
              key={tag}
              onClick={() => onTagToggle(tag)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedTags.includes(tag)
                ? 'bg-[#121212] text-[#F5F5F5]'
                : 'bg-gray-200 text-[#121212] hover:bg-gray-300'
                }`}
            >
              {tag}
            </button>
          ))}

          {isAddingCustomTag ? (
            <div className="flex items-center gap-2">
              <Input
                placeholder="New tag..."
                value={customTag}
                onChange={(e) => onCustomTagChange(e.target.value)}
                className="w-32 h-8 px-2 py-1 text-sm"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onAddCustomTag();
                }}
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={onAddCustomTag}
                className="h-8 px-2 text-[#121212] hover:bg-gray-200"
              >
                <Check size={16} />
              </Button>
            </div>
          ) : (
            <button
              onClick={() => onSetIsAddingCustomTag(true)}
              className="px-3 py-1.5 rounded-full bg-gray-200 text-[#121212] hover:bg-gray-300 text-xs font-medium"
            >
              + Add Tag
            </button>
          )}
        </div>
      </div>

      <Button
        onClick={onNextStep}
        disabled={!title.trim()}
        className="bg-[#121212] text-[#F5F5F5] px-8 py-4 rounded-md font-medium transition-all hover:bg-[#F5F5F5] hover:text-[#121212] hover:shadow-md hover:border-[#121212] border-2 border-[#121212] relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed mt-4"
      >
        <span className="relative z-10 flex items-center">
          Next
          <ArrowRight className="ml-2" size={18} />
        </span>
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.2)] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-in-out"></span>
      </Button>
      <p className="text-gray-500 mt-6 text-sm text-center">
        A good title helps us generate a better script.
      </p>
    </div>
  );
};

export default ContentDetailsCard;