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
  const [voiceOverAudioSrc, setVoiceOverAudioSrc] = useState<string | null>(null);
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

    if (voiceOverAudioSrc && voiceOverAudioSrc.startsWith('blob:')) {
      URL.revokeObjectURL(voiceOverAudioSrc);
      console.log("AUDIO_GEN: Revoked previous audio object URL:", voiceOverAudioSrc);
    }
    setVoiceOverAudioSrc(null); // Clear src to ensure <audio> re-evaluates

    if (activeBlobUrlRef.current) {
      URL.revokeObjectURL(activeBlobUrlRef.current);
      console.log("AUDIO_GEN: Revoked previous activeBlobUrlRef:", activeBlobUrlRef.current);
      activeBlobUrlRef.current = null;
    }
    setVoiceOverAudioSrc(null);

    const requestPayload = {
      text: textToSpeak,
      // !!! CRITICAL: Ensure this payload matches your working Postman request's JSON body !!!
      // If Postman sends 'voice_id', 'model_id', etc., include them here.
      // voice_id: "your_voice_id_from_postman_if_any",
    };
    console.log("AUDIO_GEN: Request payload to Go backend:", JSON.stringify(requestPayload, null, 2));

    try {
      const audioApiResponse = await fetch(TTS_AUDIO_GENERATION_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg, application/json', // Prefer audio, allow JSON for errors
        },
        body: JSON.stringify(requestPayload),
      });

      console.log("AUDIO_GEN: Request payload to Go backend:", JSON.stringify(requestPayload, null, 2));

      if (!audioApiResponse.ok) {
        // ... (Your existing robust error handling for non-OK responses using clone() - this is good)
        let errorDetails = `Audio generation failed: ${audioApiResponse.status}`;
        const errorResponseForJson = audioApiResponse.clone();
        const errorResponseForText = audioApiResponse.clone();
        try { /* ... */ } catch (jsonError) { /* ... */ }
        throw new Error(errorDetails);
      }

      const serverContentType = audioApiResponse.headers.get("content-type")?.toLowerCase();

      if (!serverContentType || (!serverContentType.includes("audio/mpeg") && !serverContentType.includes("audio/mp3") && !serverContentType.includes("audio/mpga"))) {
        const unexpectedBody = await audioApiResponse.text();
        throw new Error(`Server 200 OK, but Content-Type '${serverContentType}' is not expected audio.`);
      }

      const rawAudioBlob = await audioApiResponse.blob();
      // ... (console logs for rawAudioBlob, debug download link as before) ...
      if (rawAudioBlob.size === 0) { /* throw error */ }

      const playerSpecificMimeType = 'audio/mpeg';
      const playerReadyBlob = new Blob([rawAudioBlob], { type: playerSpecificMimeType });

      const newObjectUrl = URL.createObjectURL(playerReadyBlob); // Create the new URL

      activeBlobUrlRef.current = newObjectUrl; // Store it as the currently active one for future cleanup

      console.log("AUDIO_GEN: Created NEW audio object URL:", newObjectUrl);
      setVoiceOverAudioSrc(newObjectUrl); // NOW set the state to trigger re-render and <audio> src update

    } catch (error) {
      console.error("AUDIO_GEN: CATCH BLOCK - Error:", error);
      alert(`Error generating audio: ${error instanceof Error ? error.message : String(error)}`);
      setAiVoiceOverState('error');
      // If an error occurs, ensure any potentially created (but unused) blob URL is also cleaned up
      // though in this flow, newObjectUrl wouldn't be set yet if fetch failed.
      // If activeBlobUrlRef.current was set by a *previous* successful call, it should remain until next success or unmount.
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
  }, [voiceOverAudioSrc]);

  useEffect(() => {
    // This function now ONLY runs when TryItOutSection unmounts
    return () => {
      console.log("AUDIO_CLEANUP: TryItOutSection unmounting. Cleaning up active blob URL.");
      if (activeBlobUrlRef.current) {
        URL.revokeObjectURL(activeBlobUrlRef.current);
        console.log("AUDIO_CLEANUP: Revoked activeBlobUrlRef on unmount:", activeBlobUrlRef.current);
        activeBlobUrlRef.current = null;
      }
      // Also, ensure audio player is properly reset if it exists
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current.removeAttribute('src'); // Remove src to stop any loading/playing
        audioPlayerRef.current.load(); // Resets the media element to its initial state
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
    setVoiceOverAudioSrc(null);
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.removeAttribute('src');
      audioPlayerRef.current.load(); // Reset
      audioPlayerRef.current.currentTime = 0;
    }
    setIsAudioActuallyPlaying(false);
    if (activeBlobUrlRef.current) {
      URL.revokeObjectURL(activeBlobUrlRef.current);
      console.log("AUDIO_CLEANUP: Revoked activeBlobUrlRef in handleBackToForm:", activeBlobUrlRef.current);
      activeBlobUrlRef.current = null;
    }
    setVoiceOverAudioSrc(null);

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
          initialScriptForVO={speakableTextForVO} // Updated
          voiceOverAudioSrc={voiceOverAudioSrc}
          audioPlayerRef={audioPlayerRef}
          isAudioActuallyPlaying={isAudioActuallyPlaying}
          onSetIsAudioActuallyPlaying={setIsAudioActuallyPlaying}
          onToggleAudioPlayback={toggleAudioPlayback}
          onPrepareAudioPlayback={handleGenerateAudioFromSpeakableText} // Updated, now takes edited text
          onSetViewModeToScript={() => {
            setViewMode('script');
            // Optionally reset AI voice-over specific states if desired
            // setAiVoiceOverState('idle');
            // setSpeakableTextForVO("");
            // setVoiceOverAudioSrc(null);
          }}
          onRetryAIVoiceOver={handlePrepareSpeakableTextAndStartVO} // Retry fetching speakable text
        />
      ) : null}
    </section>
  );
};

export default TryItOutSection;