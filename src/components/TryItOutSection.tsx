// src/components/try-it-out/TryItOutSection.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Card } from './ui/card';
import ParticleBackground from './ParticleBackground';

// Import new components
import WelcomeCard from './try-it-out/WelcomeCard';
import PlatformSelectionCard from './try-it-out/PlatformSelectionCard';
import ContentDetailsCard from './try-it-out/ContentDetailsCard';
import AudienceDurationCard from './try-it-out/AudienceDurationCard';
import AdditionalInstructionCard from './try-it-out/AdditionalInstructionCard';
import ScriptGenerationLoading from './try-it-out/ScriptGenerationLoading';
import GeneratedScriptDisplay from './try-it-out/GeneratedScriptDisplay';
import AIVoiceOverFlow from './try-it-out/AIVoiceOverFlow';

// scriptGenerationSteps definition moved to ScriptGenerationLoading.tsx,
// but needed here for length check in generateScriptContent
const scriptGenerationStepsLength = 3; // Manually set or import if needed elsewhere

const TryItOutSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [platform, setPlatform] = useState('');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState<string[]>(['Travel', 'Tech', 'Lifestyle', 'Gaming', 'Education']);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState('');
  const [addingCustomTag, setAddingCustomTag] = useState(false);
  const [ageGroup, setAgeGroup] = useState('');
  const [duration, setDuration] = useState([5]);
  const [showMarkdown, setShowMarkdown] = useState(false);
  const [generatedScript, setGeneratedScript] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [customPrompt, setCustomPrompt] = useState('');

  // TTS states
  const [viewMode, setViewMode] = useState<'script' | 'aiVoiceOver'>('script');
  const [aiVoiceOverState, setAiVoiceOverState] = useState<'idle' | 'loadingAnalysis' | 'ready' | 'loadingAudio' | 'playerReady' | 'error'>('idle');
  const [voiceOverAudioSrc, setVoiceOverAudioSrc] = useState<string | null>(null);
  // isVoiceOverEditing and analyzedScriptForVO are now internal to AIVoiceOverFlow
  const audioPlayerRef = useRef<HTMLAudioElement>(null);
  const [isAudioActuallyPlaying, setIsAudioActuallyPlaying] = useState(false);

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
    if (currentSectionRef) observer.observe(currentSectionRef);
    return () => {
      if (currentSectionRef) observer.unobserve(currentSectionRef);
    };
  }, []);

  useEffect(() => {
    if (cardRef.current && !isGenerating) {
      const cardElement = cardRef.current;
      cardElement.classList.remove('in-view');
      void cardElement.offsetWidth;
      cardElement.classList.add('in-view');
    }
  }, [currentStep, isGenerating]);

  const handleNextStep = () => setCurrentStep((prev) => prev + 1);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleAddCustomTag = () => {
    if (customTag.trim()) {
      const newTag = customTag.trim();
      if (!tags.includes(newTag)) setTags((prev) => [...prev, newTag]);
      if (!selectedTags.includes(newTag)) setSelectedTags((prev) => [...prev, newTag]);
      setCustomTag('');
      setAddingCustomTag(false);
    }
  };

  const simulateGenerateScript = () => {
    setIsGenerating(true);
    setGenerationStep(1);
    let currentPhase = 1;
    const stepDuration = 1500;

    const processNextStep = () => {
      if (currentPhase < scriptGenerationStepsLength) { // Use length
        currentPhase++;
        setGenerationStep(currentPhase);
        setTimeout(processNextStep, stepDuration);
      } else {
        generateScriptContent();
      }
    };
    setTimeout(processNextStep, stepDuration);
  };

  // Generate script content using the API
  const generateScriptContent = async () => {
    const finalPrompt = customPrompt.trim() ? customPrompt.trim() : "";
    const requestBody = {
      platform, 
      title, 
      duration: duration[0], 
      prompt: finalPrompt, 
      age_group: ageGroup, 
      tags: selectedTags.join(', '),
    };

    try {
      const response = await fetch('http://localhost:8080/v1/beta/script/gen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setGeneratedScript(data.script);
      setGenerationStep(scriptGenerationStepsLength + 1);
      
      setTimeout(() => {
        setShowMarkdown(true);
        setIsGenerating(false);
        setGenerationStep(0);
      }, 700);

    } catch (error) {
      console.error('Failed to fetch script:', error);
      setIsGenerating(false);
      setGenerationStep(0);
      
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      alert(errorMessage);
    }
  };

  const handleStartAIVoiceOver = async () => {
    setViewMode('aiVoiceOver');
    setAiVoiceOverState('loadingAnalysis');
    // analyzedScriptForVO is now managed internally by AIVoiceOverFlow, initialized with generatedScript
    console.log("Requesting AI Voice Over for script...");
    try {
      // MOCK API CALL
      await new Promise(resolve => setTimeout(resolve, 2500));
      const mockAudioUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
      setVoiceOverAudioSrc(mockAudioUrl);
      setAiVoiceOverState('ready');
    } catch (error) {
      console.error("AI Voice Over API Error:", error);
      alert(`Error generating AI voice over: ${error instanceof Error ? error.message : String(error)}`);
      setAiVoiceOverState('error');
    }
  };

  const handlePrepareAudioPlayback = () => {
    if (voiceOverAudioSrc) {
      setAiVoiceOverState('loadingAudio');
    } else {
      console.error("No audio source available.");
      setAiVoiceOverState('error');
    }
  };

  const toggleAudioPlayback = () => {
    if (audioPlayerRef.current) {
      if (audioPlayerRef.current.paused || audioPlayerRef.current.ended) {
        audioPlayerRef.current.play().catch(e => {
          console.error("Error playing audio:", e);
          setAiVoiceOverState('error');
        });
      } else {
        audioPlayerRef.current.pause();
      }
    }
  };

  useEffect(() => { // Reset audio playing state
    return () => {
      if (audioPlayerRef.current) audioPlayerRef.current.pause();
      setIsAudioActuallyPlaying(false);
    };
  }, [voiceOverAudioSrc]);

  const handleBackToForm = () => {
    setShowMarkdown(false);
    setCurrentStep(1);
    setPlatform('');
    setTitle('');
    setSelectedTags([]);
    setAgeGroup('');
    setDuration([5]);
    setCustomPrompt('');
    setIsEditing(false);
    setViewMode('script');
    setAiVoiceOverState('idle');
    setVoiceOverAudioSrc(null);
    // analyzedScriptForVO reset is handled by AIVoiceOverFlow via initialScriptForVO prop change
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.currentTime = 0;
    }
    setIsAudioActuallyPlaying(false);
  };

  const renderContent = () => {
    if (isGenerating) {
      return <ScriptGenerationLoading generationStep={generationStep} />;
    }

    switch (currentStep) {
      case 1:
        return <WelcomeCard onNextStep={handleNextStep} />;
      case 2:
        return (
          <PlatformSelectionCard
            selectedPlatform={platform}
            onPlatformSelect={setPlatform}
            onNextStep={handleNextStep}
          />
        );
      case 3:
        return (
          <ContentDetailsCard
            title={title}
            onTitleChange={setTitle}
            availableTags={tags}
            selectedTags={selectedTags}
            onTagToggle={handleTagToggle}
            customTag={customTag}
            onCustomTagChange={setCustomTag}
            isAddingCustomTag={addingCustomTag}
            onSetIsAddingCustomTag={setAddingCustomTag}
            onAddCustomTag={handleAddCustomTag}
            onNextStep={handleNextStep}
          />
        );
      case 4:
        return (
          <AudienceDurationCard
            ageGroup={ageGroup}
            onAgeGroupChange={setAgeGroup}
            duration={duration}
            onDurationChange={setDuration}
            onNextStep={handleNextStep}
            isGenerating={isGenerating}
          />
        );
      case 5:
        return (
          <AdditionalInstructionCard
            customPrompt={customPrompt}
            onCustomPromptChange={setCustomPrompt}
            onGenerateScript={simulateGenerateScript}
            isGenerating={isGenerating}
          />
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
          className="bg-[#F5F5F5] text-[#121212] rounded-xl shadow-2xl p-0 sm:p-0 max-w-3xl w-full fade-in-up z-20 overflow-hidden
                     min-h-[550px] flex flex-col justify-center"
        >
          {renderContent()}
        </Card>
      ) : viewMode === 'script' ? (
        <GeneratedScriptDisplay
          generatedScript={generatedScript}
          onGeneratedScriptChange={setGeneratedScript}
          isEditing={isEditing}
          onIsEditingChange={setIsEditing}
          onBackToForm={handleBackToForm}
          platform={platform}
          title={title}
          onStartAIVoiceOver={handleStartAIVoiceOver}
        />
      ) : viewMode === 'aiVoiceOver' ? (
        <AIVoiceOverFlow
          aiVoiceOverState={aiVoiceOverState}
          setAiVoiceOverState={setAiVoiceOverState}
          initialScriptForVO={generatedScript} // Pass the current generated script
          voiceOverAudioSrc={voiceOverAudioSrc}
          audioPlayerRef={audioPlayerRef}
          isAudioActuallyPlaying={isAudioActuallyPlaying}
          onSetIsAudioActuallyPlaying={setIsAudioActuallyPlaying}
          onToggleAudioPlayback={toggleAudioPlayback}
          onPrepareAudioPlayback={handlePrepareAudioPlayback}
          onSetViewModeToScript={() => setViewMode('script')}
          onRetryAIVoiceOver={handleStartAIVoiceOver} // Retry uses the same logic
        />
      ) : null}
    </section>
  );
};

export default TryItOutSection;