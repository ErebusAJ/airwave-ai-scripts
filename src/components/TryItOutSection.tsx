
import React, { useEffect, useRef, useState } from 'react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { FileText, Type, Clock, Check, ArrowRight, Youtube, Instagram, Tiktok } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { Slider } from './ui/slider';
import ParticleBackground from './ParticleBackground';

const TryItOutSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [platform, setPlatform] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState<string[]>(["Travel", "Tech", "Lifestyle", "Gaming", "Education"]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");
  const [addingCustomTag, setAddingCustomTag] = useState(false);
  const [ageGroup, setAgeGroup] = useState("");
  const [duration, setDuration] = useState([5]);
  const [showMarkdown, setShowMarkdown] = useState(false);
  const [generatedScript, setGeneratedScript] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(1);

  // Intersection observer for initial animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && cardRef.current) {
          cardRef.current.classList.add('in-view');
        }
      },
      { threshold: 0.1 }
    );

    const currentSectionRef = sectionRef.current;
    if (currentSectionRef) {
      observer.observe(currentSectionRef);
    }

    return () => {
      if (currentSectionRef) {
        observer.unobserve(currentSectionRef);
      }
    };
  }, []);

  // Card transition effect
  useEffect(() => {
    if (cardRef.current) {
      const cardElement = cardRef.current;
      cardElement.classList.remove('in-view');
      void cardElement.offsetWidth;
      cardElement.classList.add('in-view');
    }
  }, [currentStep]);

  const handleNextStep = () => {
    setCurrentStep(prevStep => prevStep + 1);
  };

  const handlePlatformSelect = (selectedPlatform: string) => {
    setPlatform(selectedPlatform);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  const handleAddCustomTag = () => {
    if (customTag.trim()) {
      setTags(prev => [...prev, customTag.trim()]);
      setSelectedTags(prev => [...prev, customTag.trim()]);
      setCustomTag("");
      setAddingCustomTag(false);
    }
  };

  const simulateGenerateScript = () => {
    setIsGenerating(true);
    setGenerationStep(1);
    
    // Simulate API call with sequential steps
    setTimeout(() => {
      setGenerationStep(2);
      setTimeout(() => {
        setGenerationStep(3);
        setTimeout(() => {
          generateScript();
        }, 1000);
      }, 800);
    }, 800);
  };

  const generateScript = () => {
    // Use the existing script generation logic
    const sampleScript = `# ${platform.charAt(0).toUpperCase() + platform.slice(1)} Script
    
markdown\n# Reviewing New Apple CarPlay in Aston Martin\n\n## Introduction\n\nWelcome back to our channel! Today, we're diving into the world of luxury and technology as we review the new Apple CarPlay integration in the latest Aston Martin.\n\n[Show the Aston Martin logo]\n\n## Aston Martin: A Legend in Luxury\n\nAston Martin, a name synonymous with elegance and power, has always been at the forefront of automotive innovation. Today, we're focusing on their latest collaboration with Apple.\n\n[Show a brief history of Aston Martin]\n\n## Apple CarPlay: A Game Changer\n\nApple CarPlay is a revolutionary system that seamlessly integrates your iPhone with your car's infotainment system. But in the Aston Martin, it's more than just a feature—it's an experience.\n\n[Show the Apple CarPlay logo]\n\n## New Features\n\n### Wireless Connectivity\n\nSay goodbye to cables! With the new wireless CarPlay, connecting your iPhone is as simple as placing it on the wireless charging pad.\n\n[Show the wireless charging pad]\n\n### Siri with a British Accent\n\nNow, Siri speaks with a British accent, fitting perfectly with the Aston Martin's luxurious ambiance.\n\n[Show Siri interface with British accent]\n\n### Dashboard Integration\n\nThe CarPlay interface is beautifully integrated into the Aston Martin's dashboard, providing a sleek and intuitive user experience.\n\n[Show the CarPlay interface on the dashboard]\n\n## Design\n\nThe design of the CarPlay interface complements the Aston Martin's aesthetic, with a minimalist layout and elegant typography.\n\n[Show close-up of the CarPlay interface]\n\n## Conclusion\n\nThe new Apple CarPlay integration in the Aston Martin is a testament to the power of collaboration between tech giants and luxury automakers. It's a game-changer for in-car technology, offering a seamless and luxurious user experience.\n\n[Show the Aston Martin driving on a scenic road]\n\n## Call to Action\n\nDon't forget to like, share, and subscribe for more tech reviews! 

${selectedTags.length > 0 ? `\n## Tags\n${selectedTags.map(tag => `#${tag.trim()}`).join(' ')}` : ''}
`;
    setGeneratedScript(sampleScript);
    setShowMarkdown(true);
    setIsGenerating(false);
  };

  const handleBackToForm = () => {
    setShowMarkdown(false);
    setCurrentStep(1);
  };

  const renderCurrentStep = () => {
    if (isGenerating) {
      return (
        <div className="flex flex-col items-center justify-center p-8 space-y-8">
          <div className="text-2xl font-semibold mb-6 text-center">
            {generationStep === 1 && (
              <div className="flex flex-col items-center space-y-3">
                <div className="w-16 h-16 bg-[#121212] rounded-full flex items-center justify-center mb-2">
                  <Type size={32} className="text-[#F5F5F5]" />
                </div>
                <span>Analyzing Your Title...</span>
              </div>
            )}
            {generationStep === 2 && (
              <div className="flex flex-col items-center space-y-3">
                <div className="w-16 h-16 bg-[#121212] rounded-full flex items-center justify-center mb-2">
                  <FileText size={32} className="text-[#F5F5F5]" />
                </div>
                <span>Writing Your Script...</span>
              </div>
            )}
            {generationStep === 3 && (
              <div className="flex flex-col items-center space-y-3">
                <div className="w-16 h-16 bg-[#121212] rounded-full flex items-center justify-center mb-2">
                  <Clock size={32} className="text-[#F5F5F5]" />
                </div>
                <span>Proofreading & Finalizing...</span>
              </div>
            )}
          </div>
          <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#121212] rounded-full animate-pulse"
              style={{
                width: `${(generationStep / 3) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      );
    }
    
    switch (currentStep) {
      case 1: // Welcome Card
        return (
          <div className="flex flex-col items-center justify-center p-8 space-y-8">
            <div className="w-24 h-24 bg-[#121212] rounded-full flex items-center justify-center mb-4 animate-bounce">
              <FileText size={48} className="text-[#F5F5F5]" />
            </div>
            <h2 className="text-3xl font-semibold mb-10 text-center">
              Ready to Create Your First Script?
            </h2>
            <Button 
              onClick={handleNextStep}
              className="bg-[#121212] text-[#F5F5F5] px-8 py-4 rounded-md font-medium transition-all hover:bg-[#F5F5F5] hover:text-[#121212] hover:shadow-md hover:border-[#121212] border-2 border-[#121212] relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center">
                Next
                <ArrowRight className="ml-2" size={18} />
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.2)] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-in-out"></span>
            </Button>
            <p className="text-gray-500 mt-6 text-sm text-center">
              No credit card required. Try it out instantly.
            </p>
          </div>
        );
        
      case 2: // Platform Selection Card
        return (
          <div className="flex flex-col items-center justify-center p-8 space-y-8">
            <h2 className="text-3xl font-semibold mb-10 text-center">
              Which Platform's Script Do You Need?
            </h2>
            
            <div className="grid grid-cols-3 gap-6 w-full max-w-md">
              <button
                onClick={() => handlePlatformSelect("youtube")}
                className={`flex flex-col items-center justify-center p-4 rounded-lg transition-all ${platform === "youtube" 
                  ? "bg-[#121212] text-[#F5F5F5]" 
                  : "bg-[#F5F5F5] text-[#121212] hover:bg-gray-100"}`}
              >
                <Youtube size={36} className="mb-2" />
                <span>YouTube</span>
              </button>
              
              <button
                onClick={() => handlePlatformSelect("instagram")}
                className={`flex flex-col items-center justify-center p-4 rounded-lg transition-all ${platform === "instagram" 
                  ? "bg-[#121212] text-[#F5F5F5]" 
                  : "bg-[#F5F5F5] text-[#121212] hover:bg-gray-100"}`}
              >
                <Instagram size={36} className="mb-2" />
                <span>Instagram</span>
              </button>
              
              <button
                onClick={() => handlePlatformSelect("tiktok")}
                className={`flex flex-col items-center justify-center p-4 rounded-lg transition-all ${platform === "tiktok" 
                  ? "bg-[#121212] text-[#F5F5F5]" 
                  : "bg-[#F5F5F5] text-[#121212] hover:bg-gray-100"}`}
              >
                <Tiktok size={36} className="mb-2" />
                <span>TikTok</span>
              </button>
            </div>
            
            <Button 
              onClick={handleNextStep}
              disabled={!platform}
              className="bg-[#121212] text-[#F5F5F5] px-8 py-4 rounded-md font-medium transition-all hover:bg-[#F5F5F5] hover:text-[#121212] hover:shadow-md hover:border-[#121212] border-2 border-[#121212] relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
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
        
      case 3: // Title and Tags Card
        return (
          <div className="flex flex-col items-center justify-center p-8 space-y-6">
            <h2 className="text-3xl font-semibold mb-8 text-center">
              Give Your Script a Catchy Title
            </h2>
            
            <div className="w-full max-w-md mb-6">
              <Input
                placeholder="Enter your video/podcast title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#121212] text-lg"
              />
            </div>
            
            <div className="flex flex-wrap gap-2 w-full max-w-md mb-4">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1 rounded-full text-sm transition-all ${
                    selectedTags.includes(tag)
                      ? "bg-[#121212] text-[#F5F5F5]"
                      : "bg-gray-200 text-[#121212] hover:bg-gray-300"
                  }`}
                >
                  {tag}
                </button>
              ))}
              
              {addingCustomTag ? (
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="New tag..."
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                    className="w-32 h-8 px-2 py-1 text-sm"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddCustomTag();
                    }}
                  />
                  <Button 
                    size="sm"
                    variant="ghost" 
                    onClick={handleAddCustomTag}
                    className="h-8 px-2"
                  >
                    <Check size={16} />
                  </Button>
                </div>
              ) : (
                <button
                  onClick={() => setAddingCustomTag(true)}
                  className="px-3 py-1 rounded-full bg-gray-200 text-[#121212] hover:bg-gray-300 text-sm"
                >
                  + Add Tag
                </button>
              )}
            </div>
            
            <Button 
              onClick={handleNextStep}
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
              Tags help us tailor examples—optional.
            </p>
          </div>
        );
        
      case 4: // Audience and Duration Card
        return (
          <div className="flex flex-col items-center justify-center p-8 space-y-8">
            <h2 className="text-3xl font-semibold mb-8 text-center">
              Who's Your Audience & How Long?
            </h2>
            
            <div className="w-full max-w-md space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Age Group</label>
                <div className="flex flex-wrap gap-2">
                  {["All Ages", "Kids (8-12)", "Teens (13-17)", "Young Adults (18-24)", "Adults (25-45)", "Seniors (45+)"].map((age) => (
                    <button
                      key={age}
                      onClick={() => setAgeGroup(age)}
                      className={`px-3 py-2 rounded-md text-sm transition-all ${
                        ageGroup === age
                          ? "bg-[#121212] text-[#F5F5F5]"
                          : "bg-gray-200 text-[#121212] hover:bg-gray-300"
                      }`}
                    >
                      {age}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Duration: {duration[0]} minutes</label>
                <Slider
                  defaultValue={duration}
                  max={10}
                  min={1}
                  step={1}
                  onValueChange={setDuration}
                  className="w-full"
                />
              </div>
            </div>
            
            <Button 
              onClick={simulateGenerateScript}
              disabled={!ageGroup}
              className="bg-[#121212] text-[#F5F5F5] px-8 py-4 rounded-md font-medium transition-all hover:bg-[#F5F5F5] hover:text-[#121212] hover:shadow-md hover:border-[#121212] border-2 border-[#121212] relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              <span className="relative z-10">Generate My Script</span>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.2)] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-in-out"></span>
            </Button>
            
            <p className="text-gray-500 mt-6 text-sm text-center">
              Estimate is fine—our AI will optimize.
            </p>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <section
      id="try-it-out"
      ref={sectionRef}
      className="py-48 px-6 bg-[#121212] flex items-center justify-center relative z-10 min-h-screen"
    >
      <ParticleBackground />
      {!showMarkdown ? (
        <Card
          ref={cardRef}
          className="bg-[#F5F5F5] text-[#121212] rounded-lg shadow-2xl p-8 max-w-4xl w-full fade-in-up"
        >
          {renderCurrentStep()}
        </Card>
      ) : (
        <Card
          className="bg-[#F5F5F5] text-[#121212] rounded-lg shadow-2xl p-8 max-w-4xl w-full animate-fade-in"
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
                onClick={handleBackToForm}
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

            <ScrollArea className="h-[60vh] p-4 md:p-8 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAUVBMVEX///////////////////////////////////////////////////////////////////////////////////////////94o5pzAAAAG3RSTlMAAQIDBAUGBwgJCgsMDQ4PEBESExQVFhcYGRpAX7LzAAABPklEQVRIx9XW2a6DIBSG0W+AARK1zPP7P2lPT9LENgb3vWi8XMtE/gGAlZjUFkuRGsMwN9RxAiCitwJFP9VxAZCzu3e6XftVwe2ZxkXRqLqzPe4ADJ1pXBaNtonoPMBUMYm1vZ8AtmE5AFhKtZPk4wRwnA1cXXlHpTHVDUC9qz7o5wP3OgFYc0fe9U5TTpLlCGDI21IdpZpO2eyA+S2o1fJ+sEdgk9NIvX7O+NkdM0+l253cvzXvHVMmdmGtV8RTLsZHfGVEbNFnRKzWEhHrNUbERk0RsVmHv8Y/GHG6P3NH5l9oyJIaeYyM1MjAiLwYeWRk5sTIZOQ1kLXtOQwel2GMHFnvFA4DE+PoiHX4hMNgSIzcRsJhkPJGvi+6OF0gu+Ya9Yo/9GKQMIL5hLyRVz56A7Oph/3Zr/TiqeonAAAAAElFTkSuQmCC')]">
              {isEditing ? (
                <Textarea
                  value={generatedScript}
                  onChange={(e) => setGeneratedScript(e.target.value)}
                  className="w-full min-h-full p-0 bg-transparent text-[#33302E] font-serif text-lg leading-relaxed resize-none focus:outline-none focus:ring-0 border-none"
                  style={{ minHeight: 'calc(60vh - 4rem)' }}
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
        </Card>
      )}
    </section>
  );
};

export default TryItOutSection;
