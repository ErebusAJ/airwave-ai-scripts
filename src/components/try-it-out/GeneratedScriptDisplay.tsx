// src/components/try-it-out/GeneratedScriptDisplay.tsx
import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { ScrollArea } from '../ui/scroll-area';
import { FileText, Download, AudioWaveform } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // For GitHub Flavored Markdown (tables, strikethrough, etc. - good to have)

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

  // Define custom renderers for Markdown elements
  const markdownComponents = {
    h1: ({ node, ...props }: any) => <h1 className="text-2xl font-semibold mt-4 mb-2 text-[#33302E]" {...props} />,
    h2: ({ node, ...props }: any) => <h2 className="text-xl font-semibold mt-3 mb-1.5 text-[#33302E]" {...props} />, // Matched image style for "Visit to Taj Hotel"
    h3: ({ node, ...props }: any) => <h3 className="text-lg font-semibold mt-2 mb-1 text-[#33302E]" {...props} />, // Matched image style for "Arrival", "Lobby"
    p: ({ node, ...props }: any) => <p className="mb-2 leading-relaxed text-[#33302E]" {...props} />, // For script-like line spacing
    strong: ({ node, ...props }: any) => <strong className="font-semibold text-[#33302E]" {...props} />, // To ensure bold is consistent
    em: ({ node, ...props }: any) => <em className="italic text-[#33302E]" {...props} />,
    // You can add more custom renderers for ul, ol, li, blockquote, etc. if needed
  };

  // A simple pre-processor to enhance script-like text for Markdown
  // This is a basic example. More sophisticated parsing might be needed for complex cases.
  const preprocessScriptText = (text: string): string => {
    return text
      .split('\n')
      .map(line => {
        // Example: If a line is short, not starting with [ or ", and followed by a line with " or [, treat it as a heading
        // This is very heuristic and might need refinement.
        // For simplicity, let's assume your API can provide ## or ### for headings.
        // If you absolutely need to infer headings from plain text, this part needs more complex logic.

        // Make lines like "Narrator (Voiceover):" bold if not already
        if (line.match(/^[A-Za-z0-9\s]+(\s\(.*\))?:/) && !line.startsWith('**')) {
            return `**${line.trim()}**`;
        }
        return line;
      })
      .join('\n');
  };

  const processedScript = preprocessScriptText(generatedScript);

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

      <div className="bg-[#FDF7E9] border border-[#DEC99B] rounded-lg shadow-md overflow-hidden flex-grow flex flex-col">
        <div className="border-b border-[#DEC99B] bg-[#F5EFD9] py-2 px-4 flex items-center justify-between">
          <div className="font-serif text-[#8A7356]">{platform.charAt(0).toUpperCase() + platform.slice(1)} Script</div>
          <div className="text-xs text-[#8A7356]">Created {new Date().toLocaleDateString()}</div>
        </div>
        <ScrollArea className="h-0 flex-grow bg-[url('data:image/png;base64,...')]"> {/* Ensure this background URL is correct or remove if not needed */}
          {isEditing ? (
            <Textarea
              value={generatedScript} // Edit the raw script
              onChange={(e) => onGeneratedScriptChange(e.target.value)}
              className="w-full h-full p-4 md:p-6 bg-transparent text-[#33302E] font-serif text-base leading-relaxed resize-none focus:outline-none focus:ring-0 border-none"
              placeholder="Edit your script here..."
            />
          ) : (
            <div className="p-4 md:p-6 prose prose-sm sm:prose-base max-w-none 
                            prose-headings:font-serif prose-headings:text-[#33302E] prose-strong:text-[#33302E] prose-em:text-[#33302E] prose-p:text-[#33302E] prose-p:leading-relaxed prose-p:mb-2">
              <ReactMarkdown
                components={markdownComponents}
                remarkPlugins={[remarkGfm]}
              >
                {/* It's better if API provides proper Markdown.
                    If not, the processedScript might help, but true Markdown is more robust.
                    For now, let's assume generatedScript contains the Markdown.
                    If your API truly sends plain text that needs to look like Markdown,
                    the 'preprocessScriptText' function needs to be much more robust
                    at converting plain text patterns into Markdown syntax.
                */}
                {generatedScript || "No script generated yet. Ensure the API returns valid Markdown for best results."}
              </ReactMarkdown>
            </div>
          )}
        </ScrollArea>
      </div>

      <p className="text-center text-sm text-[#8A7356] mt-4">
        New! Add an AI Voice-Over to your script.
      </p>

      <div className="mt-2 flex flex-col sm:flex-row justify-between items-center gap-3">
        <Button
          onClick={handleDownload}
          className="bg-[#121212] text-[#F5F5F5] border-2 border-[#F5F5F5] hover:bg-[#F5F5F5] hover:text-[#121212] px-4 py-2 text-sm font-medium flex items-center justify-center w-full sm:w-auto"
        >
          <Download size={18} className="mr-2" />
          Download
        </Button>
        <Button
          onClick={onStartAIVoiceOver}
          className="bg-[#121212] text-[#F5F5F5] border-2 border-[#F5F5F5] hover:bg-[#F5F5F5] hover:text-[#121212] px-4 py-2 text-sm font-medium flex items-center justify-center w-full sm:w-auto"
        >
          <AudioWaveform size={18} className="mr-2 text-[#DEC99B]" />
          AI Voice-Over
        </Button>
      </div>
    </Card>
  );
};

export default GeneratedScriptDisplay;