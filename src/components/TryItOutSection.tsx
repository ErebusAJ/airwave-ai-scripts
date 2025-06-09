// src/components/TryItOutSection.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Card } from './ui/card'; // Assuming 'ui' is a direct child of 'components'
import ParticleBackground from './ParticleBackground'; // Assuming ParticleBackground is in the same 'components' folder

// Corrected import paths assuming 'try-it-out' is a subdirectory of 'components'
import WelcomeCard from './try-it-out/WelcomeCard';
import PlatformSelectionCard from './try-it-out/PlatformSelectionCard';
import ContentDetailsCard from './try-it-out/ContentDetailsCard';
import AudienceDurationCard from './try-it-out/AudienceDurationCard';
import AdditionalInstructionCard from './try-it-out/AdditionalInstructionCard';
import ScriptGenerationLoading from './try-it-out/ScriptGenerationLoading';
import GeneratedScriptDisplay from './try-it-out/GeneratedScriptDisplay';
import AIVoiceOverFlow from './try-it-out/AIVoiceOverFlow';

const scriptGenerationStepsLength = 3;

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
  const [generatedScript, setGeneratedScript] = useState(''); // Original Markdown script
  const [isEditing, setIsEditing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [customPrompt, setCustomPrompt] = useState('');

  // TTS states
  const [viewMode, setViewMode] = useState<'script' | 'aiVoiceOver'>('script');
  const [aiVoiceOverState, setAiVoiceOverState] = useState<'idle' | 'loadingAnalysis' | 'ready' | 'loadingAudio' | 'playerReady' | 'error'>('idle');
  const [speakableTextForVO, setSpeakableTextForVO] = useState<string>(""); // State for speakable text
  const [voiceOverAudioBlob, setVoiceOverAudioBlob] = useState<Blob | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement>(null);
  const [isAudioActuallyPlaying, setIsAudioActuallyPlaying] = useState(false);

  const activeBlobUrlRef = useRef<string | null>(null);

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
    if (cardRef.current && !isGenerating && !showMarkdown) { // Only apply card transition for form steps
      const cardElement = cardRef.current;
      cardElement.classList.remove('in-view');
      void cardElement.offsetWidth;
      cardElement.classList.add('in-view');
    }
  }, [currentStep, isGenerating, showMarkdown]);

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
      if (currentPhase < scriptGenerationStepsLength) {
        currentPhase++;
        setGenerationStep(currentPhase);
        setTimeout(processNextStep, stepDuration);
      } else {
        generateScriptContent();
      }
    };
    setTimeout(processNextStep, stepDuration);
  };

  const generateScriptContent = async () => {
    const finalPrompt = customPrompt.trim() ? customPrompt.trim() : "";
    const requestBody = {
      platform, title, duration: duration[0], prompt: finalPrompt, age_group: ageGroup, tags: selectedTags.join(', '),
    };
    try {
      const response = await fetch('http://localhost:8080/v1/beta/script/gen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setGeneratedScript(data.script || "Error: Script not found in API response.");
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
      alert(`Error generating script: ${errorMessage}`);
    }
  };

  // Fetches speakable text format for TTS
  const handlePrepareSpeakableTextAndStartVO = async () => {
    setViewMode('aiVoiceOver');
    setAiVoiceOverState('loadingAnalysis');
    setSpeakableTextForVO(""); // Clear previous

    if (!generatedScript) {
      console.error("Cannot prepare speakable text: generatedScript is empty.");
      setSpeakableTextForVO("Error: Original script is missing. Please generate a script first.");
      setAiVoiceOverState('ready'); // Or 'error'
      return;
    }
    console.log("Requesting speakable text for AI Voice Over from original script:", generatedScript.substring(0, 100) + "...");

    try {
      const response = await fetch('http://localhost:8080/v1/beta/script/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script: generatedScript }), // Send the markdown script
      });

      const responseForJson = response.clone(); // Clone for safe JSON parsing
      const responseForText = response.clone(); // Clone for safe text parsing

      if (!response.ok) {
        let errorDetails = `Failed to prepare text for TTS. Status: ${response.status}`;
        try {
          const errorData = await responseForJson.json();
          errorDetails += ` - ${errorData.message || JSON.stringify(errorData)}`;
        } catch (jsonError) {
          console.warn("Failed to parse 'prepare speakable text' error as JSON:", jsonError);
          try {
            const errorText = await responseForText.text();
            errorDetails += ` - ${errorText}`;
          } catch (textError) {
            errorDetails += ` - Could not read error body.`;
          }
        }
        throw new Error(errorDetails);
      }

      const data = await response.json(); // Use original response since it's OK
      if (data.script) {
        console.log("Speakable text received:", data.script.substring(0, 100) + "...");
        setSpeakableTextForVO(data.script);
        setAiVoiceOverState('ready'); // Transition to ready state in AIVoiceOverFlow
      } else {
        throw new Error("Speakable text not found in API response for /script/text.");
      }
    } catch (error) {
      console.error("Prepare Speakable Text API Error:", error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during speakable text preparation';
      setSpeakableTextForVO(`Error loading speakable text: ${errorMessage}`);
      setAiVoiceOverState('ready'); // Display error in AIVoiceOverFlow's textarea
    }
  };

  // Generates audio from the (edited) speakable text
  // In TryItOutSection.tsx
  const TTS_AUDIO_GENERATION_ENDPOINT = 'http://localhost:8080/v1/beta/tts/trial/9BWtsMINqrJLrRacOk9x'; // Ensure this is correct

  const handleGenerateAudioFromSpeakableText = async (textToSpeak: string) => {
    if (!textToSpeak.trim()) {
      alert("No text available to generate audio.");
      setAiVoiceOverState('ready');
      return;
    }
    console.log("AUDIO_GEN: Initiating. Text snippet:", textToSpeak.substring(0, 70) + "...");
    setAiVoiceOverState('loadingAudio');
    setIsAudioActuallyPlaying(false);
    setVoiceOverAudioBlob(null); // Clear any previous blob

    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }

    const requestPayload = {
      text: textToSpeak,
    };
    console.log("AUDIO_GEN: Request payload to Go backend:", JSON.stringify(requestPayload, null, 2));

    try {
      const audioApiResponse = await fetch(TTS_AUDIO_GENERATION_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg, application/json',
        },
        body: JSON.stringify(requestPayload),
      });

      if (!audioApiResponse.ok) {
        let errorDetails = `Audio generation failed: ${audioApiResponse.status}`;
        const errorResponseForJson = audioApiResponse.clone();
        const errorResponseForText = audioApiResponse.clone();
        try {
          const errorData = await errorResponseForJson.json();
          errorDetails += ` - ${errorData.message || JSON.stringify(errorData)}`;
        } catch (jsonError) {
          console.warn("Failed to parse audio gen error as JSON:", jsonError);
          try {
            const errorText = await errorResponseForText.text();
            errorDetails += ` - ${errorText}`;
          } catch (textError) {
            console.warn("Failed to read audio gen error body as text:", textError);
            errorDetails += ` - Could not read error body.`;
          }
        }
        throw new Error(errorDetails);
      }

      const serverContentType = audioApiResponse.headers.get("content-type")?.toLowerCase() || '';
      console.log("AUDIO_GEN: Server responded with Content-Type:", serverContentType);

      const rawAudioBlob = await audioApiResponse.blob();
      console.log("AUDIO_GEN: Received raw audio blob. Size:", rawAudioBlob.size, "Type:", rawAudioBlob.type);

      if (rawAudioBlob.size === 0) {
        throw new Error("Audio generation resulted in an empty file.");
      }

      const mimeType = 'audio/mpeg'; // Standardize to audio/mpeg for broad compatibility
      const playerReadyBlob = new Blob([rawAudioBlob], { type: mimeType });

      console.log("AUDIO_GEN: Created playerReadyBlob, passing to AIVoiceOverFlow. Size:", playerReadyBlob.size, "Type:", playerReadyBlob.type);
      setVoiceOverAudioBlob(playerReadyBlob); // Set the Blob object directly in state.

    } catch (error) {
      console.error("AUDIO_GEN: CATCH BLOCK - Error:", error);
      alert(`Error generating audio: ${error instanceof Error ? error.message : String(error)}`);
      setAiVoiceOverState('error');
      setVoiceOverAudioBlob(null);
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

  useEffect(() => {
    return () => {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current.src = ''; // Clear src to stop loading/playing on unmount
      }
      setIsAudioActuallyPlaying(false);
    };
  }, [voiceOverAudioBlob]);

  useEffect(() => {
    // This function now ONLY runs when TryItOutSection unmounts
    return () => {
      console.log("AUDIO_CLEANUP: TryItOutSection unmounting.");
      // All blob URL cleanup is now handled in AIVoiceOverFlow
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current.removeAttribute('src');
        audioPlayerRef.current.load();
      }
    };
  }, []);

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
    setSpeakableTextForVO("");
    setVoiceOverAudioBlob(null); // Clear the blob
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.removeAttribute('src');
      audioPlayerRef.current.load();
      audioPlayerRef.current.currentTime = 0;
    }
    setIsAudioActuallyPlaying(false);
  };

  const renderContent = () => {
    if (isGenerating) {
      return <ScriptGenerationLoading generationStep={generationStep} />;
    }
    switch (currentStep) {
      case 1: return <WelcomeCard onNextStep={handleNextStep} />;
      case 2: return <PlatformSelectionCard selectedPlatform={platform} onPlatformSelect={setPlatform} onNextStep={handleNextStep} />;
      case 3: return <ContentDetailsCard title={title} onTitleChange={setTitle} availableTags={tags} selectedTags={selectedTags} onTagToggle={handleTagToggle} customTag={customTag} onCustomTagChange={setCustomTag} isAddingCustomTag={addingCustomTag} onSetIsAddingCustomTag={setAddingCustomTag} onAddCustomTag={handleAddCustomTag} onNextStep={handleNextStep} />;
      case 4: return <AudienceDurationCard ageGroup={ageGroup} onAgeGroupChange={setAgeGroup} duration={duration} onDurationChange={setDuration} onNextStep={handleNextStep} isGenerating={isGenerating} />;
      case 5: return <AdditionalInstructionCard customPrompt={customPrompt} onCustomPromptChange={setCustomPrompt} onGenerateScript={simulateGenerateScript} isGenerating={isGenerating} />;
      default: return null;
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
          className="bg-[#F5F5F5] text-[#121212] rounded-xl shadow-2xl p-0 sm:p-0 max-w-3xl w-full fade-in-up z-20 overflow-hidden min-h-[550px] flex flex-col justify-center"
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
          onStartAIVoiceOver={handlePrepareSpeakableTextAndStartVO} // Updated
        />
      ) : viewMode === 'aiVoiceOver' ? (
        <AIVoiceOverFlow
          aiVoiceOverState={aiVoiceOverState}
          setAiVoiceOverState={setAiVoiceOverState}
          initialScriptForVO={speakableTextForVO}
          voiceOverAudioBlob={voiceOverAudioBlob}
          audioPlayerRef={audioPlayerRef}
          isAudioActuallyPlaying={isAudioActuallyPlaying}
          onSetIsAudioActuallyPlaying={setIsAudioActuallyPlaying}
          onToggleAudioPlayback={toggleAudioPlayback}
          onPrepareAudioPlayback={handleGenerateAudioFromSpeakableText}
          onSetViewModeToScript={() => {
            setViewMode('script');
          }}
          onRetryAIVoiceOver={handlePrepareSpeakableTextAndStartVO} // Retry fetching speakable text
        />
      ) : null}
    </section>
  );
};

export default TryItOutSection;