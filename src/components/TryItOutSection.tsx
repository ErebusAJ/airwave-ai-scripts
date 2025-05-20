import React, { useEffect, useRef, useState } from 'react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card } // CardContent removed as it's not used
  from './ui/card';
import { Button } from './ui/button';
import { FileText } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import ParticleBackground from './ParticleBackground'; // Assuming this is correctly implemented

const TryItOutSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const formCardRef = useRef<HTMLDivElement>(null); // Renamed cardRef to formCardRef for clarity
  const [platform, setPlatform] = useState("youtube");
  const [tags, setTags] = useState("");
  const [showMarkdown, setShowMarkdown] = useState(false);
  const [generatedScript, setGeneratedScript] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // This useEffect is for the INITIAL scroll-triggered animation of the form card.
  // It adds 'in-view' when the section first comes into view.
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Check if the section is intersecting AND the form card currently exists
        if (entry.isIntersecting && formCardRef.current) {
          formCardRef.current.classList.add('in-view');
          // Optionally, unobserve after the first time if you only want it to animate once on scroll
          // if (sectionRef.current) {
          //   observer.unobserve(sectionRef.current);
          // }
        }
      },
      { threshold: 0.1 }
    );

    const currentSectionRef = sectionRef.current; // Capture for cleanup
    if (currentSectionRef) {
      observer.observe(currentSectionRef);
    }

    return () => {
      if (currentSectionRef) {
        observer.unobserve(currentSectionRef);
      }
    };
  }, []);

  useEffect(() => {
    if (!showMarkdown && formCardRef.current) {
      // The form card is being shown (either initially or after toggling back)
      const cardElement = formCardRef.current;

      // To ensure CSS transitions replay, remove the 'active' class, force reflow, then re-add.
      cardElement.classList.remove('in-view');
      // Reading an offset property forces the browser to reflow/recalculate layout.
      void cardElement.offsetWidth;
      cardElement.classList.add('in-view');
    }
    // No 'else' branch needed here for 'showMarkdown === true' because:
    // 1. The form card unmounts, so its classes are gone.
    // 2. The markdown card uses 'animate-fade-in', which should play on its mount.
  }, [showMarkdown]); // Runs every time showMarkdown changes.

  const handleGenerateScript = () => {
    setShowMarkdown(true);
    setIsEditing(false);
    const sampleScript = `# ${platform.charAt(0).toUpperCase() + platform.slice(1)} Script
    
markdown\n# Reviewing New Apple CarPlay in Aston Martin\n\n## Introduction\n\nWelcome back to our channel! Today, we're diving into the world of luxury and technology as we review the new Apple CarPlay integration in the latest Aston Martin.\n\n[Show the Aston Martin logo]\n\n## Aston Martin: A Legend in Luxury\n\nAston Martin, a name synonymous with elegance and power, has always been at the forefront of automotive innovation. Today, we're focusing on their latest collaboration with Apple.\n\n[Show a brief history of Aston Martin]\n\n## Apple CarPlay: A Game Changer\n\nApple CarPlay is a revolutionary system that seamlessly integrates your iPhone with your car's infotainment system. But in the Aston Martin, it's more than just a feature—it's an experience.\n\n[Show the Apple CarPlay logo]\n\n## New Features\n\n### Wireless Connectivity\n\nSay goodbye to cables! With the new wireless CarPlay, connecting your iPhone is as simple as placing it on the wireless charging pad.\n\n[Show the wireless charging pad]\n\n### Siri with a British Accent\n\nNow, Siri speaks with a British accent, fitting perfectly with the Aston Martin's luxurious ambiance.\n\n[Show Siri interface with British accent]\n\n### Dashboard Integration\n\nThe CarPlay interface is beautifully integrated into the Aston Martin's dashboard, providing a sleek and intuitive user experience.\n\n[Show the CarPlay interface on the dashboard]\n\n## Design\n\nThe design of the CarPlay interface complements the Aston Martin's aesthetic, with a minimalist layout and elegant typography.\n\n[Show close-up of the CarPlay interface]\n\n## Conclusion\n\nThe new Apple CarPlay integration in the Aston Martin is a testament to the power of collaboration between tech giants and luxury automakers. It's a game-changer for in-car technology, offering a seamless and luxurious user experience.\n\n[Show the Aston Martin driving on a scenic road]\n\n## Call to Action\n\nDon't forget to like, share, and subscribe for more tech reviews! 

${tags ? `\n## Tags\n${tags.split(',').map(tag => `#${tag.trim()}`).join(' ')}` : ''}
`;
    setGeneratedScript(sampleScript);
  };

  const handleBackToForm = () => {
    setShowMarkdown(false);
  };

  return (
    <section
      id="try-it-out"
      ref={sectionRef}
      className="py-48 px-6 bg-[#121212] flex items-center justify-center relative z-10 min-h-screen" // Added min-h-screen for better centering if content is short
    >
      <ParticleBackground />
      {!showMarkdown ? (
        <Card
          ref={formCardRef} // Assign ref to the form card
          className="bg-[#F5F5F5] text-[#121212] rounded-lg shadow-2xl p-8 max-w-4xl w-full"
        >
          <h2 className="text-3xl font-semibold mb-10 text-center">
            Ready to Create Your First Script?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="platform-select" className="block text-sm font-medium mb-1">Platform</label>
                <select
                  id="platform-select"
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
                <label htmlFor="title-input" className="block text-sm font-medium mb-1">Title</label>
                <Input
                  id="title-input"
                  placeholder="Enter video title..."
                  className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#121212]"
                />
              </div>

              <div>
                <label htmlFor="duration-select" className="block text-sm font-medium mb-1">Duration</label>
                <select
                  id="duration-select"
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
                <label htmlFor="age-group-select" className="block text-sm font-medium mb-1">Age Group</label>
                <select
                  id="age-group-select"
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
                <label htmlFor="tags-input" className="block text-sm font-medium mb-1">Tags</label>
                <Input
                  id="tags-input"
                  placeholder="Enter tags separated by commas..."
                  className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#121212]"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="topic-input" className="block text-sm font-medium mb-1">Topic</label>
                <Input
                  id="topic-input"
                  type="text"
                  placeholder="Enter your topic or idea here..."
                  className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#121212]"
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="additional-info-textarea" className="block text-sm font-medium mb-1">Additional Information</label>
            <Textarea
              id="additional-info-textarea"
              placeholder="Add any specific requirements or details for your script..."
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#121212]"
              rows={4}
            />
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              className="bg-[#121212] text-[#F5F5F5] px-8 py-4 rounded-md font-medium transition-all hover:bg-[#F5F5F5] hover:text-[#121212] hover:shadow-md hover:border-[#121212] border-2 border-[#121212] relative overflow-hidden group"
              onClick={handleGenerateScript}
            >
              <span className="relative z-10">Generate Script</span>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.2)] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-in-out"></span>
            </button>
          </div>

          <p className="text-gray-500 mt-6 text-sm text-center">
            No credit card required. Try it out instantly.
          </p>
        </Card>
      ) : (
        <Card
          className="bg-[#F5F5F5] text-[#121212] rounded-lg shadow-2xl p-8 max-w-4xl w-full"
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
              {/* <Button 
                variant="outline" 
                onClick={handleBackToForm}
                className="border-2 border-[#121212] hover:bg-[#121212] hover:text-[#F5F5F5]"
              >
                Back to Form
              </Button> */}
            </div>
          </div>

          <div className="bg-[#FDF7E9] border border-[#DEC99B] rounded-lg shadow-md overflow-hidden">
            <div className="border-b border-[#DEC99B] bg-[#F5EFD9] py-2 px-4 flex items-center justify-between">
              <div className="font-serif text-[#8A7356]">{platform.charAt(0).toUpperCase() + platform.slice(1)} Script</div>
              <div className="text-xs text-[#8A7356]">Created {new Date().toLocaleDateString()}</div>
            </div>

            <ScrollArea className="h-[60vh] p-4 md:p-8 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAUVBMVEX///////////////////////////////////////////////////////////////////////////////////////////94o5pzAAAAG3RSTlMAAQIDBAUGBwgJCgsMDQ4PEBESExQVFhcYGRpAX7LzAAABPklEQVRIx9XW2a6DIBSG0W+AARK1zPP7P2lPT9LENgb3vWi8XMtE/gGAlZjUFkuRGsMwN9RxAiCitwJFP9VxAZCzu3e6XftVwe2ZxkXRqLqzPe4ADJ1pXBaNtonoPMBUMYm1vZ8AtmE5AFhKtZPk4wRwnA1cXXlHpTHVDUC9qz7o5wP3OgFYc0fe9U5TTpLlCGDI21IdpZpO2eyA+S2o1fJ+sEdgk9NIvX7O+NkdM0+l253cvzXvHVMmdmGtV8RTLsZHfGVEbNFnRKzWEhHrNUbERk0RsVmHv8Y/GHG6P3NH5l9oyJIaeYyM1MjAiLwYeWRk5sTIZOQ1kLXtOQwel2GMHFnvFA4DE+PoiHX4hMNgSIzcRsJhkPJGvi+6OF0gu+Ya9Yo/9GKQMIL5hLyRVz56A7Oph/3Zr/TiqeonAAAAAElFTkSuQmCC')]">
              {isEditing ? (
                <Textarea
                  value={generatedScript}
                  onChange={(e) => setGeneratedScript(e.target.value)}
                  className="w-full min-h-full p-0 bg-transparent text-[#33302E] font-serif text-lg leading-relaxed resize-none focus:outline-none focus:ring-0 border-none"
                  style={{ minHeight: 'calc(60vh - 4rem)' }} // Adjust based on ScrollArea padding
                />
              ) : (
                <div className="font-serif text-[#33302E] whitespace-pre-wrap px-2 md:px-4 text-lg leading-relaxed markdown-content">
                  {generatedScript.split('\n').map((line, index) => {
                    if (line.startsWith('# ')) {
                      return <h1 key={index} className="text-3xl font-bold mt-2 mb-6 text-[#4A3F35]">{line.substring(2)}</h1>;
                    }
                    else if (line.startsWith('## ')) {
                      return <h2 key={index} className="text-2xl font-semibold mt-2 mb-4 text-[#5A4B3F] border-b border-[#DEC99B] pb-2">{line.substring(3)}</h2>;
                    }
                    else if (line.startsWith('### ')) {
                      return <h3 key={index} className="text-xl font-medium mt-1 mb-3 text-[#6A5B4F]">{line.substring(4)}</h3>;
                    }
                    else if (line.startsWith('- ')) {
                      return <div key={index} className="flex items-start mb-2 ml-4">
                        <span className="mr-2 text-[#8A7356]">•</span>
                        <p className="flex-1">{line.substring(2)}</p>
                      </div>;
                    }
                    else if (!line.trim()) {
                      return <div key={index} className="h-2"></div>;
                    }
                    else {
                      return <p key={index} className="mb-4">{line}</p>;
                    }
                  })}
                </div>
              )}
            </ScrollArea>
          </div>


          {/* Download button is disabled for now */}
          {/* <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-3">
            <Button 
              variant="outline" 
              className="w-full sm:w-auto border-2 border-[#121212] hover:bg-[#121212] hover:text-[#F5F5F5]"
              onClick={() => {
                const blob = new Blob([generatedScript], { type: 'text/markdown;charset=utf-8' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `${platform}_script.md`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(link.href);
              }}
            >
              Download Script
            </Button>
            <Button 
              className="w-full sm:w-auto bg-[#121212] text-[#F5F5F5] hover:bg-[#2a2a2a]"
              onClick={() => {
                navigator.clipboard.writeText(generatedScript)
                  .then(() => alert('Script copied to clipboard!'))
                  .catch(err => console.error('Failed to copy script: ', err));
              }}
            >
              Copy to Clipboard
            </Button>
          </div> */}
        </Card>
      )}
    </section>
  );
};

export default TryItOutSection;