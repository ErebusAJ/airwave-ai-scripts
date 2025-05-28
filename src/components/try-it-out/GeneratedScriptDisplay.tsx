// src/components/try-it-out/GeneratedScriptDisplay.tsx
import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { ScrollArea } from '../ui/scroll-area';
// Changed Mic2 to AudioWaveform in the import
import { FileText, Download, AudioWaveform } from 'lucide-react';

interface GeneratedScriptDisplayProps {
  generatedScript: string;
  onGeneratedScriptChange: (script: string) => void;
  isEditing: boolean;
  onIsEditingChange: (isEditing: boolean) => void;
  onBackToForm: () => void;
  platform: string;
  title: string;
  onStartAIVoiceOver: () => void;
}

const GeneratedScriptDisplay: React.FC<GeneratedScriptDisplayProps> = ({
  generatedScript,
  onGeneratedScriptChange,
  isEditing,
  onIsEditingChange,
  onBackToForm,
  platform,
  title,
  onStartAIVoiceOver,
}) => {
  const handleDownload = () => {
    const blob = new Blob([generatedScript], { type: 'text/markdown;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${title || 'generated-script'}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  return (
    <Card className="bg-[#F5F5F5] text-[#121212] rounded-xl shadow-2xl p-6 sm:p-8 max-w-4xl w-full animate-fade-in z-20
                   min-h-[70vh] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl sm:text-3xl font-semibold">
          <span className="flex items-center gap-2">
            <FileText size={28} />
            Generated Script
          </span>
        </h2>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            onClick={() => onIsEditingChange(!isEditing)}
            className="border-2 border-[#121212] text-[#121212] hover:bg-[#121212] hover:text-[#F5F5F5] text-sm px-3 py-1.5 sm:px-4 sm:py-2"
          >
            {isEditing ? 'View Mode' : 'Edit Mode'}
          </Button>
          <Button
            variant="outline"
            onClick={onBackToForm}
            className="border-2 border-[#121212] text-[#121212] hover:bg-[#121212] hover:text-[#F5F5F5] text-sm px-3 py-1.5 sm:px-4 sm:py-2"
          >
            Create New Script
          </Button>
        </div>
      </div>

      <div className="bg-[#FDF7E9] border border-[#DEC99B] rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-[#DEC99B] bg-[#F5EFD9] py-2 px-4 flex items-center justify-between">
          <div className="font-serif text-[#8A7356]">{platform.charAt(0).toUpperCase() + platform.slice(1)} Script</div>
          <div className="text-xs text-[#8A7356]">Created {new Date().toLocaleDateString()}</div>
        </div>
        <ScrollArea className="h-[60vh] bg-[url('data:image/png;base64,...')]"> {/* Assuming this base64 is intended or placeholder */}
          {isEditing ? (
            <Textarea
              value={generatedScript}
              onChange={(e) => onGeneratedScriptChange(e.target.value)}
              className="w-full h-full p-4 md:p-6 bg-transparent text-[#33302E] font-serif text-base leading-relaxed resize-none focus:outline-none focus:ring-0 border-none min-h-[calc(60vh-2rem)]"
              placeholder="Edit your script here..."
            />
          ) : (
            <div className="p-4 md:p-6 whitespace-pre-wrap font-serif text-[#33302E] text-base leading-relaxed">
              {generatedScript || "No script generated yet."}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Caption for AI Voice-Over feature */}
      <p className="text-center text-sm text-[#8A7356] mt-4">
        New! Add an AI Voice-Over to your script.
      </p>

      {/* Button container: justify-between to move buttons apart, mt-2 to adjust for caption's mt-4 */}
      <div className="mt-2 flex flex-col sm:flex-row justify-between items-center gap-3">
        <Button
          onClick={handleDownload}
          // Inverse styling applied:
          // Original EditMode: border-[#121212] text-[#121212] hover:bg-[#121212] hover:text-[#F5F5F5]
          // Inverse: bg-[#121212] text-[#F5F5F5] border-[#F5F5F5] hover:bg-[#F5F5F5] hover:text-[#121212]
          className="bg-[#121212] text-[#F5F5F5] border-2 border-[#F5F5F5] hover:bg-[#F5F5F5] hover:text-[#121212] px-4 py-2 text-sm font-medium flex items-center justify-center w-full sm:w-auto"
        >
          <Download size={18} className="mr-2" />
          Download
        </Button>
        <Button
          onClick={onStartAIVoiceOver}
          // Inverse styling applied (same as Download button)
          className="bg-[#121212] text-[#F5F5F5] border-2 border-[#F5F5F5] hover:bg-[#F5F5F5] hover:text-[#121212] px-4 py-2 text-sm font-medium flex items-center justify-center w-full sm:w-auto"
        >
          {/* Icon changed to AudioWaveform and colorized for highlight */}
          <AudioWaveform size={18} className="mr-2 text-[#DEC99B]" />
          AI Voice-Over
        </Button>
      </div>
    </Card>
  );
};

export default GeneratedScriptDisplay;