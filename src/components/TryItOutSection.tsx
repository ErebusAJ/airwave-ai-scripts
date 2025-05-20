import React, { useEffect, useRef, useState } from 'react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card'; // Removed unused CardHeader, etc. if not directly used
import { Button } from './ui/button';
import {
  FileText,
  Type,
  Clock,
  Check,
  ArrowRight,
  Youtube,
  Instagram,
  Smartphone,
  Twitter,
  Linkedin,
  Facebook,
  Info,
  // Loader2, // No longer used directly in the new loading animation
  CheckCircle2,
} from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { Slider } from './ui/slider';
import ParticleBackground from './ParticleBackground';

// Define script generation steps with their icons and active animations
const scriptGenerationSteps = [
  { id: 1, label: "Analyzing Title...", IconElement: Type, activeAnimation: "animate-pulse" },
  { id: 2, label: "Writing Script...", IconElement: FileText, activeAnimation: "animate-[wiggle_1s_ease-in-out_infinite]" },
  { id: 3, label: "Finalizing...", IconElement: Clock, activeAnimation: "animate-spin" },
];


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
  const [generationStep, setGenerationStep] = useState(0); // Start at 0, actual steps 1, 2, 3

  const [customPrompt, setCustomPrompt] = useState("");
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
    if (cardRef.current && !isGenerating) { // Avoid re-triggering during generation steps
      const cardElement = cardRef.current;
      cardElement.classList.remove('in-view');
      void cardElement.offsetWidth;
      cardElement.classList.add('in-view');
    }
  }, [currentStep, isGenerating]);

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
      const newTag = customTag.trim();
      if (!tags.includes(newTag)) {
        setTags(prev => [...prev, newTag]);
      }
      if (!selectedTags.includes(newTag)) {
        setSelectedTags(prev => [...prev, newTag]);
      }
      setCustomTag("");
      setAddingCustomTag(false);
    }
  };

  const simulateGenerateScript = () => {
    setIsGenerating(true);
    setGenerationStep(1); // Start with the first phase

    let currentPhase = 1;
    // Simulate time for each step
    // The last step will appear to take longer if the actual generation takes time
    const stepDuration = 1500; // ms per step (for first n-1 steps)

    const processNextStep = () => {
      if (currentPhase < scriptGenerationSteps.length) {
        currentPhase++;
        setGenerationStep(currentPhase);
        setTimeout(processNextStep, stepDuration);
      } else {
        // Last step is "active", now wait for actual generation
        // which might take longer or shorter
        generateScriptContent();
      }
    };

    setTimeout(processNextStep, stepDuration);
  };


  const generateScriptContent = async () => {
    let finalPrompt = "";

    if (customPrompt.trim()) {
      finalPrompt = customPrompt.trim();
    } else {
      finalPrompt = "";
    }

    const requestBody = {
      platform: platform,
      title: title,
      duration: duration[0],
      prompt: finalPrompt, // Use the finalPrompt
      age_group: ageGroup,
      tags: selectedTags.join(', '),
    };

    try {
      const response = await fetch('http://localhost:8080/v1/beta/script/gen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to generate script. Server returned an error.' }));
        console.error('API Error:', response.status, errorData);
        alert(`Error: ${errorData.message || `Failed to generate script. Status: ${response.status}`}`);
        setIsGenerating(false);
        setGenerationStep(0);
        return;
      }

      const data = await response.json();
      const scriptFromApi = data.script || (typeof data === 'string' ? data : "# Error: Script not found in API response.");
      setGeneratedScript(scriptFromApi);
      setGenerationStep(scriptGenerationSteps.length + 1);
      setTimeout(() => {
        setShowMarkdown(true);
        setIsGenerating(false);
        setGenerationStep(0);
      }, 700);

    } catch (error) {
      console.error('Failed to fetch or process script:', error);
      alert('An unexpected error occurred. Please try again.');
      setIsGenerating(false);
      setGenerationStep(0);
    }
  };

  const handleBackToForm = () => {
    setShowMarkdown(false);
    setCurrentStep(1);
    setPlatform("");
    setTitle("");
    setSelectedTags([]);
    setAgeGroup("");
    setDuration([5]);
    setCustomPrompt(""); // Reset custom prompt
    setIsEditing(false); // Reset edit mode if user goes back
  };

  const renderCurrentStep = () => {
    if (isGenerating) {
      return (
        <div className="flex flex-col items-center justify-center p-6 sm:p-8 space-y-6 min-h-[350px] w-full">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6 text-center text-[#121212]">
            Generating Your Script...
          </h2>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-2 md:space-x-4 justify-center w-full max-w-2xl">
            {scriptGenerationSteps.map((step) => {
              const isActive = generationStep === step.id;
              const isCompleted = generationStep > step.id;
              // Pending is implied if not active and not completed for these fixed steps

              let IconToRender = step.IconElement;
              let iconAnimation = "";
              let iconColor = "text-neutral-400"; // Tailwind neutral-400 is #a3a3a3
              let textColor = "text-neutral-500"; // Tailwind neutral-500 is #737373
              let bgColor = "bg-neutral-200";    // Tailwind neutral-200 is #e5e5e5
              let phaseCardClasses = "border-neutral-300"; // Tailwind neutral-300 is #d4d4d4

              if (isActive) {
                IconToRender = step.IconElement;
                iconAnimation = step.activeAnimation;
                iconColor = "text-[#121212]";
                textColor = "text-[#121212]";
                bgColor = "bg-white"; // Active step stands out on #F5F5F5 card
                phaseCardClasses = "phase-card-active-highlight border-[#121212] shadow-lg";
              } else if (isCompleted) {
                IconToRender = CheckCircle2; // Show checkmark for completed
                iconColor = "text-neutral-200";
                textColor = "text-neutral-200";
                bgColor = "bg-neutral-700"; // Lighter green for completed
                phaseCardClasses = "border-neutral-300";
              }

              return (
                <div
                  key={step.id}
                  className={`flex flex-col items-center justify-center p-4 rounded-lg 
                              transition-all duration-300 ease-in-out w-full sm:w-1/3 h-36 sm:h-40
                              border ${phaseCardClasses} ${bgColor}`}
                >
                  <div className="relative z-[1] flex flex-col items-center justify-center">
                    <IconToRender
                      size={32}
                      className={`mb-2 transition-colors duration-300 ease-in-out ${iconColor} ${iconAnimation}`}
                    />
                    <span
                      className={`text-sm sm:text-base font-medium text-center transition-colors duration-300 ease-in-out ${textColor}`}
                    >
                      {step.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="w-full max-w-md h-2.5 bg-neutral-300 rounded-full overflow-hidden mt-6 sm:mt-8">
            <div
              className="h-full bg-[#121212] rounded-full transition-all duration-1000 ease-out"
              style={{
                // Progress based on active step, not completed. Full bar when last step is active.
                width: `${(Math.min(generationStep, scriptGenerationSteps.length) / scriptGenerationSteps.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      );
    }

    // ... (rest of the switch cases for currentStep 1, 2, 3, 4 remain the same as in your previous full code)
    switch (currentStep) {
      case 1: // Welcome Card
        return (
          <div className="flex flex-col items-center justify-center p-8 space-y-8">
            <div className="w-24 h-24 bg-[#121212] rounded-full flex items-center justify-center mb-4"> {/* Removed animate-bounce */}
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

      case 2: // Platform Selection Card
        const platforms = [
          { name: "YouTube", icon: Youtube, key: "youtube" },
          { name: "Instagram", icon: Instagram, key: "instagram" },
          { name: "TikTok", icon: Smartphone, key: "tiktok" }, // Using Smartphone for TikTok
          { name: "Twitter / X", icon: Twitter, key: "twitter" },
          { name: "LinkedIn", icon: Linkedin, key: "linkedin" },
          { name: "Facebook", icon: Facebook, key: "facebook" },
        ];
        return (
          <div className="flex flex-col items-center justify-center p-8 space-y-8">
            <h2 className="text-3xl font-semibold mb-10 text-center">
              Which Platform's Script Do You Need?
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full max-w-lg">
              {platforms.map((p) => (
                <button
                  key={p.key}
                  onClick={() => handlePlatformSelect(p.key)}
                  className={`flex flex-col items-center justify-center p-4 rounded-lg transition-all duration-200 ease-in-out aspect-square
                                  ${platform === p.key
                      ? "bg-[#121212] text-[#F5F5F5] shadow-lg scale-105"
                      : "bg-gray-100 text-[#121212] hover:bg-gray-200 hover:shadow-md border border-gray-200"
                    }`}
                >
                  <p.icon size={36} className="mb-2" />
                  <span className="text-sm font-medium">{p.name}</span>
                </button>
              ))}
            </div>
            <Button
              onClick={handleNextStep}
              disabled={!platform}
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

      case 3: // Title and Tags Card
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
                onChange={(e) => setTitle(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#121212] text-lg"
              />
            </div>

            <div className="w-full max-w-md my-4">
              <div className="flex items-center mb-2">
                <h4 className="text-sm font-medium text-gray-700">Add Relevant Tags <span className="text-xs text-gray-500">(Optional)</span></h4>
                <hr className="flex-grow ml-2 border-gray-300" />
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedTags.includes(tag)
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
                      className="h-8 px-2 text-[#121212] hover:bg-gray-200"
                    >
                      <Check size={16} />
                    </Button>
                  </div>
                ) : (
                  <button
                    onClick={() => setAddingCustomTag(true)}
                    className="px-3 py-1.5 rounded-full bg-gray-200 text-[#121212] hover:bg-gray-300 text-xs font-medium"
                  >
                    + Add Tag
                  </button>
                )}
              </div>
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
              A good title helps us generate a better script.
            </p>
          </div>
        );

      case 4: // Audience and Duration Card
        return (
          <div className="flex flex-col items-center justify-center p-8 space-y-8">
            <h2 className="text-3xl font-semibold mb-8 text-center">
              Target Audience & Duration
            </h2>

            <div className="w-full max-w-md space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Age Group</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {["All Ages", "Kids (8-12)", "Teens (13-17)", "Young Adults (18-24)", "Adults (25-45)", "Seniors (45+)"].map((age) => (
                    <button
                      key={age}
                      onClick={() => setAgeGroup(age)}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-all w-full
                                      ${ageGroup === age
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Duration: <span className="font-semibold text-[#121212]">{duration[0]} minute{duration[0] > 1 ? 's' : ''}</span>
                </label>
                <Slider
                  defaultValue={duration}
                  max={15}
                  min={1}
                  step={1}
                  onValueChange={setDuration}
                  className="w-full [&>span:first-child]:h-2 [&>span:first-child>span]:h-2 [&>span:last-child]:h-5 [&>span:last-child]:w-5"
                />
                <p className="text-xs text-gray-500 mt-1">Slider for 1 to 15 minutes.</p>
              </div>
            </div>

            <Button
              onClick={handleNextStep}
              disabled={!ageGroup || isGenerating}
              className="bg-[#121212] text-[#F5F5F5] px-8 py-4 rounded-md font-medium transition-all hover:bg-[#F5F5F5] hover:text-[#121212] hover:shadow-md hover:border-[#121212] border-2 border-[#121212] relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              <span className="relative z-10">Next</span>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.2)] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-in-out"></span>
            </Button>

            <p className="text-gray-500 mt-6 text-sm text-center">
              This helps tailor the script's pacing and complexity.
            </p>
          </div>
        );

      case 5: // Additional Instructions / Custom Prompt Card
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
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="min-h-[150px] p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#121212] text-base"
              />
            </div>
            <Button
              onClick={simulateGenerateScript}
              disabled={isGenerating} // Only disable if currently generating
              className="bg-[#121212] text-[#F5F5F5] px-8 py-4 rounded-md font-medium transition-all hover:bg-[#F5F5F5] hover:text-[#121212] hover:shadow-md hover:border-[#121212] border-2 border-[#121212] relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              <span className="relative z-10">Generate My Script</span>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.2)] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-in-out"></span>
            </Button>
            <p className="text-gray-500 mt-4 text-sm text-center max-w-md">
              Provide any specific details, tone preferences, or key points you want the AI to focus on. If left blank, we'll generate based on previous inputs.
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
      className="py-24 sm:py-32 px-4 sm:px-6 bg-[#121212] flex flex-col items-center justify-center relative z-10 min-h-screen"
    >
      <ParticleBackground />
      <h1 className="text-4xl sm:text-5xl font-bold text-center text-[#F5F5F5] mb-10 sm:mb-12 z-20">
        Try Our Script Generator
      </h1>
      {!showMarkdown ? (
        <Card
          ref={cardRef}
          className="bg-[#F5F5F5] text-[#121212] rounded-xl shadow-2xl p-0 sm:p-0 max-w-3xl w-full fade-in-up z-20 overflow-hidden" // fade-in-up, added overflow-hidden
        >
          {/* Removed padding from Card, now it's on the inner content or steps */}
          {renderCurrentStep()}
        </Card>
      ) : (
        <Card
          className="bg-[#F5F5F5] text-[#121212] rounded-xl shadow-2xl p-6 sm:p-8 max-w-4xl w-full animate-fade-in z-20" // animate-fade-in needs to be defined
        >
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
                onClick={() => setIsEditing(!isEditing)}
                className="border-2 border-[#121212] text-[#121212] hover:bg-[#121212] hover:text-[#F5F5F5] text-sm px-3 py-1.5 sm:px-4 sm:py-2"
              >
                {isEditing ? "View Mode" : "Edit Mode"}
              </Button>
              <Button
                variant="outline"
                onClick={handleBackToForm}
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

            <ScrollArea className="h-[60vh] p-4 md:p-6 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAUVBMVEX///////////////////////////////////////////////////////////////////////////////////////////94o5pzAAAAG3RSTlMAAQIDBAUGBwgJCgsMDQ4PEBESExQVFhcYGRpAX7LzAAABPklEQVRIx9XW2a6DIBSG0W+AARK1zPP7P2lPT9LENgb3vWi8XMtE/gGAlZjUFkuRGsMwN9RxAiCitwJFP9VxAZCzu3e6XftVwe2ZxkXRqLqzPe4ADJ1pXBaNtonoPMBUMYm1vZ8AtmE5AFhKtZPk4wRwnA1cXXlHpTHVDUC9qz7o5wP3OgFYc0fe9U5TTpLlCGDI21IdpZpO2eyA+S2o1fJ+sEdgk9NIvX7O+NkdM0+l253cvzXvHVMmdmGtV8RTLsZHfGVEbNFnRKzWEhHrNUbERk0RsVmHv8Y/GHG6P3NH5l9oyJIaeYyM1MjAiLwYeWRk5sTIZOQ1kLXtOQwel2GMHFnvFA4DE+PoiHX4hMNgSIzcRsJhkPJGvi+6OF0gu+Ya9Yo/9GKQMIL5hLyRVz56A7Oph/3Zr/TiqeonAAAAAElFTkSuQmCC')]">
              {isEditing ? (
                <Textarea
                  value={generatedScript}
                  onChange={(e) => setGeneratedScript(e.target.value)}
                  className="w-full min-h-full p-0 bg-transparent text-[#33302E] font-serif text-lg leading-relaxed resize-none focus:outline-none focus:ring-0 border-none"
                  style={{ minHeight: 'calc(60vh - 3rem)' }}
                />
              ) : (
                <div className="font-serif text-[#33302E] whitespace-pre-wrap px-1 md:px-2 text-lg leading-relaxed markdown-content">
                  {generatedScript.split('\n').map((line, index) => {
                    if (line.startsWith('# ')) {
                      return <h1 key={index} className="text-3xl font-bold mt-4 mb-6 text-[#4A3F35]">{line.substring(2)}</h1>;
                    }
                    else if (line.startsWith('## ')) {
                      return <h2 key={index} className="text-2xl font-semibold mt-3 mb-4 text-[#5A4B3F] border-b border-[#DEC99B] pb-2">{line.substring(3)}</h2>;
                    }
                    else if (line.startsWith('### ')) {
                      return <h3 key={index} className="text-xl font-medium mt-2 mb-3 text-[#6A5B4F]">{line.substring(4)}</h3>;
                    }
                    else if (line.startsWith('- ')) {
                      return <div key={index} className="flex items-start mb-2 ml-4">
                        <span className="mr-2 text-[#8A7356]">•</span>
                        <p className="flex-1">{line.substring(2)}</p>
                      </div>;
                    }
                    else if (line.trim() === "markdown") {
                      return null;
                    }
                    else if (!line.trim()) {
                      return <div key={index} className="h-3"></div>;
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