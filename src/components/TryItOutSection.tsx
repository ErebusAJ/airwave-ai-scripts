
import React, { useEffect, useRef, useState } from 'react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { FileText } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

const TryItOutSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [platform, setPlatform] = useState("youtube");
  const [tags, setTags] = useState("");
  const [showMarkdown, setShowMarkdown] = useState(false);
  const [generatedScript, setGeneratedScript] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && cardRef.current) {
          cardRef.current.classList.add('in-view');
        }
      },
      { threshold: 0.1 }
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

  const handleGenerateScript = () => {
    setShowMarkdown(true);
    // Generate sample script based on platform
    const sampleScript = `# ${platform.charAt(0).toUpperCase() + platform.slice(1)} Script
    
## Introduction
Welcome to this amazing ${platform} content!

## Main Points
- Point 1: Engage your audience immediately
- Point 2: Share valuable information
- Point 3: Create a call to action

## Conclusion
Thanks for watching! Don't forget to like and subscribe.

${tags ? `\n## Tags\n${tags.split(',').map(tag => `#${tag.trim()}`).join(' ')}` : ''}
`;
    setGeneratedScript(sampleScript);
  };

  return (
    <section 
      ref={sectionRef}
      className="py-48 px-6 bg-[#121212] flex items-center justify-center relative z-10"
    >
      {!showMarkdown ? (
        <Card 
          ref={cardRef}
          className="bg-[#F5F5F5] text-[#121212] rounded-lg shadow-2xl p-8 max-w-4xl w-full fade-in-up card-hover"
        >
          <h2 className="text-3xl font-semibold mb-10 text-center">
            Ready to Create Your First Script?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Platform</label>
                <select 
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#121212]"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                >
                  <option value="youtube">YouTube</option>
                  <option value="instagram">Instagram Reel</option>
                  <option value="tiktok">TikTok</option>
                  <option value="facebook">Facebook</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <Input 
                  placeholder="Enter video title..." 
                  className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#121212]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Duration</label>
                <select 
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#121212]"
                >
                  <option value="15">15 seconds</option>
                  <option value="30">30 seconds</option>
                  <option value="60">1 minute</option>
                  <option value="120">2 minutes</option>
                  <option value="300">5 minutes</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Age Group</label>
                <select 
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#121212]"
                >
                  <option value="all">All Ages</option>
                  <option value="kids">Kids (8-12)</option>
                  <option value="teens">Teens (13-17)</option>
                  <option value="young-adults">Young Adults (18-24)</option>
                  <option value="adults">Adults (25-45)</option>
                  <option value="seniors">Seniors (45+)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Tags</label>
                <Input 
                  placeholder="Enter tags separated by commas..." 
                  className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#121212]"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Topic</label>
                <Input 
                  type="text" 
                  placeholder="Enter your topic or idea here..." 
                  className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#121212]"
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Additional Information</label>
            <Textarea 
              placeholder="Add any specific requirements or details for your script..." 
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#121212]"
              rows={4}
            />
          </div>
          
          <div className="flex justify-center">
            <button 
              className="bg-[#121212] text-[#F5F5F5] px-8 py-4 rounded-md font-medium transition-all hover:bg-[#F5F5F5] hover:text-[#121212] hover:shadow-md hover:border-[#121212] border-2 border-[#121212] relative overflow-hidden"
              onClick={handleGenerateScript}
            >
              <span className="relative z-10">Generate Script</span>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.2)] to-transparent -translate-x-full hover:animate-shine"></span>
            </button>
          </div>
          
          <p className="text-gray-500 mt-6 text-sm text-center">
            No credit card required. Try it out instantly.
          </p>
        </Card>
      ) : (
        <Card 
          className="bg-[#F5F5F5] text-[#121212] rounded-lg shadow-2xl p-8 max-w-4xl w-full fade-in-up card-hover animate-fade-in"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-semibold">
              <span className="flex items-center gap-2">
                <FileText size={28} />
                Generated Script
              </span>
            </h2>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(!isEditing)}
                className="border-2 border-[#121212] hover:bg-[#121212] hover:text-[#F5F5F5]"
              >
                {isEditing ? "View Mode" : "Edit Mode"}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowMarkdown(false)}
                className="border-2 border-[#121212] hover:bg-[#121212] hover:text-[#F5F5F5]"
              >
                Back to Form
              </Button>
            </div>
          </div>
          
          <div className="bg-[#FDF7E9] border border-[#DEC99B] rounded-lg shadow-md overflow-hidden">
            <div className="border-b border-[#DEC99B] bg-[#F5EFD9] py-2 px-4 flex items-center justify-between">
              <div className="font-serif text-[#8A7356]">{platform.charAt(0).toUpperCase() + platform.slice(1)} Script</div>
              <div className="text-xs text-[#8A7356]">Created {new Date().toLocaleDateString()}</div>
            </div>
            
            <ScrollArea className="h-[60vh] p-8 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAUVBMVEX///////////////////////////////////////////////////////////////////////////////////////////94o5pzAAAAG3RSTlMAAQIDBAUGBwgJCgsMDQ4PEBESExQVFhcYGRpAX7LzAAABPklEQVRIx9XW2a6DIBSG0W+AARK1zPP7P2lPT9LENgb3vWi8XMtE/gGAlZjUFkuRGsMwN9RxAiCitwJFP9VxAZCzu3e6XftVwe2ZxkXRqLqzPe4ADJ1pXBaNtonoPMBUMYm1vZ8AtmE5AFhKtZPk4wRwnA1cXXlHpTHVDUC9qz7o5wP3OgFYc0fe9U5TTpLlCGDI21IdpZpO2eyA+S2o1fJ+sEdgk9NIvX7O+NkdM0+l253cvzXvHVMmdmGtV8RTLsZHfGVEbNFnRKzWEhHrNUbERk0RsVmHv8Y/GHG6P3NH5l9oyJIaeYyM1MjAiLwYeWRk5sTIZOQ1kLXtOQwel2GMHFnvFA4DE+PoiHX4hMNgSIzcRsJhkPJGvi+6OF0gu+Ya9Yo/9GKQMIL5hLyRVz56A7Oph/3Zr/TiqeonAAAAAElFTkSuQmCC')]">
              {isEditing ? (
                <Textarea
                  value={generatedScript}
                  onChange={(e) => setGeneratedScript(e.target.value)}
                  className="w-full min-h-full p-0 bg-transparent text-[#33302E] font-serif text-lg leading-relaxed resize-none focus:outline-none focus:ring-0 border-none"
                />
              ) : (
                <div className="font-serif text-[#33302E] whitespace-pre-wrap px-4 text-lg leading-relaxed markdown-content">
                  {generatedScript.split('\n').map((line, index) => {
                    // Heading 1
                    if (line.startsWith('# ')) {
                      return <h1 key={index} className="text-3xl font-bold mb-6 text-[#4A3F35]">{line.substring(2)}</h1>;
                    }
                    // Heading 2
                    else if (line.startsWith('## ')) {
                      return <h2 key={index} className="text-2xl font-semibold mb-4 text-[#5A4B3F] border-b border-[#DEC99B] pb-2">{line.substring(3)}</h2>;
                    }
                    // Heading 3
                    else if (line.startsWith('### ')) {
                      return <h3 key={index} className="text-xl font-medium mb-3 text-[#6A5B4F]">{line.substring(4)}</h3>;
                    }
                    // List items
                    else if (line.startsWith('- ')) {
                      return <div key={index} className="flex items-start mb-2 ml-4">
                        <span className="mr-2 text-[#8A7356]">•</span>
                        <p>{line.substring(2)}</p>
                      </div>;
                    }
                    // Empty line
                    else if (!line.trim()) {
                      return <div key={index} className="h-4"></div>;
                    }
                    // Regular paragraph
                    else {
                      return <p key={index} className="mb-4">{line}</p>;
                    }
                  })}
                </div>
              )}
            </ScrollArea>
          </div>
          
          <div className="flex justify-between mt-6">
            <Button 
              variant="outline" 
              className="border-2 border-[#121212] hover:bg-[#121212] hover:text-[#F5F5F5]"
            >
              Download Script
            </Button>
            <Button 
              className="bg-[#121212] text-[#F5F5F5] hover:bg-[#2a2a2a]"
              onClick={() => {
                navigator.clipboard.writeText(generatedScript);
              }}
            >
              Copy to Clipboard
            </Button>
          </div>
        </Card>
      )}
    </section>
  );
};

export default TryItOutSection;
