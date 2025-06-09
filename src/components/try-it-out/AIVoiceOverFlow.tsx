// src/components/try-it-out/AIVoiceOverFlow.tsx
import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { ScrollArea } from '../ui/scroll-area';
import {
    Loader2,
    Mic2,
    Info,
    AudioWaveform,
    Play,
    Pause,
} from 'lucide-react';

type AIVoiceOverStateType = 'idle' | 'loadingAnalysis' | 'ready' | 'loadingAudio' | 'playerReady' | 'error';

interface AIVoiceOverFlowProps {
    aiVoiceOverState: AIVoiceOverStateType;
    setAiVoiceOverState: React.Dispatch<React.SetStateAction<AIVoiceOverStateType>>;
    initialScriptForVO: string;
    voiceOverAudioBlob: Blob | null;
    audioPlayerRef: React.RefObject<HTMLAudioElement>;
    isAudioActuallyPlaying: boolean;
    onToggleAudioPlayback: () => void;
    onPrepareAudioPlayback: (text: string) => void;
    onSetViewModeToScript: () => void;
    onRetryAIVoiceOver: () => void;
    onSetIsAudioActuallyPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}

// SoundWaveVisualizer Component (assuming this is correct as provided)
interface SoundWaveVisualizerProps {
    isPlaying: boolean;
    barColor?: string;
    barCount?: number;
    containerHeight?: string; // Renamed from maxHeight for clarity, this is for the container
    barWidth?: string;
    gap?: string; // Tailwind class for gap between bars
}

const SoundWaveVisualizer: React.FC<SoundWaveVisualizerProps> = ({
    isPlaying,
    barColor = "bg-[#121212]", // Black bars
    barCount = 50, // Adjusted for the image's density
    containerHeight = "h-16", // e.g., h-16, h-20, h-24
    barWidth = "w-0.5", // Thinner bars, e.g., w-px, w-0.5 (2px), w-1 (4px)
    gap = "gap-px", // Using Tailwind's gap utility for spacing
}) => {
    return (
        <div className={`flex items-center justify-center w-full ${containerHeight}`}>
            <div className={`flex items-end justify-center h-full ${gap}`}>
                {[...Array(barCount)].map((_, i) => (
                    <div
                        key={i}
                        className={`soundwave-bar ${barWidth} ${barColor} rounded-t-sm ${isPlaying ? 'playing' : ''}`}
                        style={
                            isPlaying
                                ? {
                                    animationDelay: `${i * 0.03}s`, // Staggered delay for a wave effect
                                    animationDuration: `${0.8 + Math.random() * 0.7}s`, // Randomize duration slightly
                                    // Set initial transform scale to a low value when not playing
                                    transform: 'scaleY(0.1)',
                                }
                                : {
                                    transform: 'scaleY(0.1)', // Keep bars minimal when paused
                                }
                        }
                    />
                ))}
            </div>
        </div>
    );
};

const AIVoiceOverFlow: React.FC<AIVoiceOverFlowProps> = ({
    aiVoiceOverState,
    setAiVoiceOverState,
    initialScriptForVO,
    voiceOverAudioBlob,
    audioPlayerRef,
    isAudioActuallyPlaying,
    onToggleAudioPlayback,
    onPrepareAudioPlayback,
    onSetViewModeToScript,
    onRetryAIVoiceOver,
    onSetIsAudioActuallyPlaying,
}) => {
    const [isVoiceOverEditing, setIsVoiceOverEditing] = useState(false);
    const [analyzedScriptForVO, setAnalyzedScriptForVO] = useState(initialScriptForVO);
    const [audioSrc, setAudioSrc] = useState<string>('');

    useEffect(() => {
        setAnalyzedScriptForVO(initialScriptForVO);
    }, [initialScriptForVO]);

    // This hook manages the blob URL lifecycle.
    // It creates a URL when a new blob is received and revokes it on cleanup.
    useEffect(() => {
        if (voiceOverAudioBlob) {
            const newUrl = URL.createObjectURL(voiceOverAudioBlob);
            console.log("AIVO_FLOW: useEffect[voiceOverAudioBlob] - Created new blob URL:", newUrl);
            setAudioSrc(newUrl);

            // The cleanup function is critical. It runs when the component
            // unmounts, or before the effect runs again for a new blob.
            return () => {
                console.log("AIVO_FLOW: useEffect[voiceOverAudioBlob] cleanup - Revoking URL:", newUrl);
                URL.revokeObjectURL(newUrl);
            };
        }
        // If the blob is null, no URL is needed. The old one is revoked by the cleanup function.
        setAudioSrc('');
    }, [voiceOverAudioBlob]);

    return (
        <Card className="bg-[#F5F5F5] text-[#121212] rounded-xl shadow-2xl p-6 sm:p-8 max-w-4xl w-full animate-fade-in z-20
                       min-h-[70vh] flex flex-col" >

            {/* State 1: Loading Analysis */}
            {aiVoiceOverState === 'loadingAnalysis' && (
                <div className="flex flex-col items-center justify-center flex-grow space-y-4">
                    <Loader2 size={48} className="text-[#121212] animate-spin" />
                    <p className="text-xl font-semibold text-[#121212]">Preparing text for AI voiceover...</p>
                    <p className="text-sm text-gray-600">Please wait, this may take a few moments.</p>
                </div>
            )}

            {/* State 2: AI Voice-Over Ready */}
            {aiVoiceOverState === 'ready' && (
                <div className="flex flex-col flex-grow">
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <h2 className="text-2xl sm:text-3xl font-semibold">
                            <span className="flex items-center gap-2">
                                <Mic2 size={28} className="text-[#121212]" />
                                AI Voice-Over
                            </span>
                        </h2>
                        <div className="flex gap-2 flex-wrap">
                            <Button
                                variant="outline"
                                onClick={() => setIsVoiceOverEditing(!isVoiceOverEditing)}
                                className="border-2 border-[#121212] text-[#121212] hover:bg-[#121212] hover:text-[#F5F5F5] text-sm px-3 py-1.5 sm:px-4 sm:py-2"
                            >
                                {isVoiceOverEditing ? 'View Text' : 'Edit Text'}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={onSetViewModeToScript}
                                className="border-2 border-[#121212] text-[#121212] hover:bg-[#121212] hover:text-[#F5F5F5] text-sm px-3 py-1.5 sm:px-4 sm:py-2"
                            >
                                Back to Script
                            </Button>
                        </div>
                    </div>

                    {/* Script View/Edit Box */}
                    <div className="bg-neutral-100 border border-neutral-300 rounded-lg shadow-inner overflow-hidden p-4 mb-6 flex flex-col flex-grow min-h-[250px]">
                        {isVoiceOverEditing ? (
                            <Textarea
                                value={analyzedScriptForVO}
                                onChange={(e) => setAnalyzedScriptForVO(e.target.value)}
                                className="w-full bg-transparent text-[#33302E] font-sans text-base leading-relaxed resize-none focus:outline-none focus:ring-0 border-none flex-grow p-0"
                                placeholder="Script text for voice-over. You can edit it here before generating the audio."
                            />
                        ) : (
                            <ScrollArea className="flex-grow">
                                <p className="font-sans text-[#33302E] whitespace-pre-wrap text-base leading-relaxed">
                                    {analyzedScriptForVO || 'No script text available. Please try generating the script again or check the API.'}
                                </p>
                            </ScrollArea>
                        )}
                    </div>

                    {/* "Generate Audio" Button */}
                    <div className="flex flex-col items-center justify-center mt-auto pt-4">
                        <Button
                            onClick={() => onPrepareAudioPlayback(analyzedScriptForVO)}
                            className="group bg-transparent hover:bg-[#121212] p-3 rounded-full border-2 border-[#121212] shadow-md hover:shadow-lg transition-colors duration-200 ease-in-out"
                            aria-label="Generate Audio"
                            title="Generate Audio"
                            disabled={!analyzedScriptForVO.trim()}
                        >
                            <AudioWaveform size={32} className="text-[#121212] group-hover:text-[#F5F5F5] transition-colors duration-200 ease-in-out" />
                        </Button>
                        <p className="text-center text-sm text-gray-600 mt-3">
                            Click to generate audio
                        </p>
                    </div>
                </div>
            )}

            {/* State 3: Sound Wave Player (Loading Audio / Player Ready) */}
            {(aiVoiceOverState === 'loadingAudio' || aiVoiceOverState === 'playerReady') && audioSrc && (
                <div className="flex flex-col items-center justify-center flex-grow space-y-6">
                    <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-2">
                        <span className="flex items-center justify-center gap-2">
                            <AudioWaveform size={28} className="text-[#121212]" />
                            Voice Playback
                        </span>
                    </h2>
                    {/* Visualizer Container - Ensure it has a defined height for the bars to scale within */}
                    <div className="w-full max-w-md h-24 bg-transparent rounded-lg flex items-center justify-center"> {/* Removed border and bg for a cleaner look if desired, or keep bg-[#F5F5F5] */}
                        {aiVoiceOverState === 'loadingAudio' ? (
                            <div className="flex flex-col items-center text-sm text-neutral-600">
                                <Loader2 size={24} className="text-[#121212] animate-spin mb-1" />
                                Loading audio...
                            </div>
                        ) : (
                            <SoundWaveVisualizer
                                isPlaying={isAudioActuallyPlaying}
                                barCount={50} // Example adjustment
                                containerHeight="h-20" // Match this height for bars to scale correctly
                                barWidth="w-0.5" // Thinner bars
                                gap="gap-px" // Minimal gap
                                barColor="bg-black" // Black bars as per image
                            />
                        )}
                    </div>
                    <Button
                        onClick={onToggleAudioPlayback}
                        disabled={aiVoiceOverState === 'loadingAudio'}
                        className={`px-6 py-3 rounded-md font-medium transition-all flex items-center justify-center w-36
                                      bg-[#121212] text-[#F5F5F5] hover:bg-[#333333]
                                      disabled:bg-neutral-400 disabled:text-neutral-700 disabled:cursor-not-allowed`}
                    >
                        {aiVoiceOverState === 'loadingAudio' ? (
                            <Loader2 size={20} className="animate-spin" />
                        ) : isAudioActuallyPlaying ? (
                            <Pause size={20} className="mr-2" />
                        ) : (
                            <Play size={20} className="mr-2" />
                        )}
                        {aiVoiceOverState === 'loadingAudio' ? 'Loading' : (isAudioActuallyPlaying ? 'Pause' : 'Play')}
                    </Button>
                    <audio
                        ref={audioPlayerRef}
                        src={audioSrc}
                        onPlay={() => onSetIsAudioActuallyPlaying(true)}
                        onPause={() => onSetIsAudioActuallyPlaying(false)}
                        onEnded={() => onSetIsAudioActuallyPlaying(false)}
                        onLoadedData={() => {
                            if (aiVoiceOverState === 'loadingAudio') {
                                setAiVoiceOverState('playerReady');
                            }
                        }}
                        onError={(e) => {
                            console.error("Audio player error:", e);
                            setAiVoiceOverState('error');
                            alert("Error loading audio. The file might be unsupported or the URL is invalid.");
                        }}
                        className="hidden"
                    />
                    <Button
                        variant="outline"
                        onClick={() => {
                            setAiVoiceOverState('ready');
                            if (audioPlayerRef.current) {
                                audioPlayerRef.current.pause();
                                // audioPlayerRef.current.currentTime = 0; // Keep current time to resume if user comes back quickly
                            }
                            onSetIsAudioActuallyPlaying(false);
                        }}
                        className="border-2 border-[#121212] text-[#121212] hover:bg-[#121212] hover:text-[#F5F5F5] text-sm px-4 py-2 mt-4"
                    >
                        Back to Text Options
                    </Button>
                </div>
            )}

            {/* State 4: Error State */}
            {aiVoiceOverState === 'error' && (
                <div className="flex flex-col items-center justify-center flex-grow space-y-4 text-red-600">
                    <Info size={48} />
                    <p className="text-xl font-medium">Voice-Over Process Failed</p>
                    <p className="text-sm text-center">An error occurred. Please try again or go back to the script.</p>
                    <div className="flex gap-3 mt-4">
                        <Button
                            variant="outline"
                            onClick={onSetViewModeToScript}
                            className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white text-sm px-4 py-2"
                        >
                            Back to Script
                        </Button>
                        <Button
                            onClick={onRetryAIVoiceOver}
                            className="bg-red-500 text-white hover:bg-red-600 text-sm px-4 py-2"
                        >
                            Try Preparing Text Again
                        </Button>
                    </div>
                </div>
            )}
        </Card>
    );
};

export default AIVoiceOverFlow;