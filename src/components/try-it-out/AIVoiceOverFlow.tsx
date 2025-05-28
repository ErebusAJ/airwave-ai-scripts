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
    voiceOverAudioSrc: string | null;
    audioPlayerRef: React.RefObject<HTMLAudioElement>;
    isAudioActuallyPlaying: boolean;
    onToggleAudioPlayback: () => void;
    onPrepareAudioPlayback: () => void;
    onSetViewModeToScript: () => void;
    onRetryAIVoiceOver: () => void;
    onSetIsAudioActuallyPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}

// SoundWaveVisualizer Component
interface SoundWaveVisualizerProps {
    isPlaying: boolean;
    barColor?: string;
    barCount?: number;
    maxHeight?: string;
    barWidth?: string;
    gap?: string;
}

const SoundWaveVisualizer: React.FC<SoundWaveVisualizerProps> = ({
    isPlaying,
    barColor = "bg-[#121212]", // Dark bars, assuming light background for visualizer container
    barCount = 60,
    maxHeight = "h-16",
    barWidth = "w-px",
    gap = "space-x-px",
}) => {
    return (
        <div className={`flex items-center justify-center h-full w-full`}>
            <div className={`flex items-end justify-center ${maxHeight} ${gap}`}>
                {[...Array(barCount)].map((_, i) => (
                    <div
                        key={i} // Simplified key
                        className={`${barWidth} rounded-t-sm ${barColor} ${isPlaying ? 'h-full soundwave-bar-animate' : 'h-1'}`}
                        style={
                            isPlaying
                                ? {
                                    animationDelay: `${Math.random() * 0.7}s`,
                                    animationDuration: `${0.7 + Math.random() * 0.8}s`,
                                }
                                : {}
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
    voiceOverAudioSrc,
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

    useEffect(() => {
        setAnalyzedScriptForVO(initialScriptForVO);
    }, [initialScriptForVO]);

    return (
        <Card className="bg-[#F5F5F5] text-[#121212] rounded-xl shadow-2xl p-6 sm:p-8 max-w-4xl w-full animate-fade-in z-20
                       min-h-[70vh] flex flex-col" > {/* Base card styling */}

            {/* State 1: Loading Analysis */}
            {aiVoiceOverState === 'loadingAnalysis' && (
                <div className="flex flex-col items-center justify-center flex-grow space-y-4"> {/* flex-grow for centering */}
                    <Loader2 size={48} className="text-[#121212] animate-spin" />
                    <p className="text-xl font-semibold text-[#121212]">Analyzing text for AI voiceover...</p>
                    <p className="text-sm text-gray-600">Please wait, this may take a few moments.</p>
                </div>
            )}

            {/* State 2: AI Voice-Over Ready */}
            {aiVoiceOverState === 'ready' && (
                <div className="flex flex-col flex-grow"> {/* Main container for 'ready' state, allows children to flex-grow */}
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

                    {/* Script View/Edit Box - takes up available space */}
                    <div className="bg-neutral-100 border border-neutral-300 rounded-lg shadow-inner overflow-hidden p-4 mb-6 flex flex-col flex-grow min-h-[250px]"> {/* flex-grow, added min-h */}
                        {isVoiceOverEditing ? (
                            <Textarea
                                value={analyzedScriptForVO}
                                onChange={(e) => setAnalyzedScriptForVO(e.target.value)}
                                className="w-full bg-transparent text-[#33302E] font-sans text-base leading-relaxed resize-none focus:outline-none focus:ring-0 border-none flex-grow p-0" // flex-grow, p-0 as padding is on parent
                                placeholder="Script text for voice-over. You can edit it here before generating the audio."
                            />
                        ) : (
                            <ScrollArea className="flex-grow"> {/* flex-grow to use available space */}
                                <p className="font-sans text-[#33302E] whitespace-pre-wrap text-base leading-relaxed">
                                    {analyzedScriptForVO || 'No script text available.'}
                                </p>
                            </ScrollArea>
                        )}
                    </div>

                    {/* "Prepare Audio" Button Section - pushed to bottom */}
                    <div className="flex flex-col items-center justify-center mt-auto pt-4"> {/* mt-auto pushes to bottom */}
                        <Button
                            onClick={onPrepareAudioPlayback}
                            className="group bg-transparent hover:bg-[#121212] p-3 rounded-full border-2 border-[#121212] shadow-md hover:shadow-lg transition-colors duration-200 ease-in-out"
                            aria-label="Generate and Play Voice Over"
                            title="Generate Audio & Open Player"
                        >
                            <AudioWaveform size={32} className="text-[#121212] group-hover:text-[#F5F5F5] transition-colors duration-200 ease-in-out" />
                        </Button>
                        <p className="text-center text-sm text-gray-600 mt-3">
                            Click to prepare audio player
                        </p>
                    </div>
                </div>
            )}

            {/* State 3: Sound Wave Player (Loading Audio / Player Ready) */}
            {(aiVoiceOverState === 'loadingAudio' || aiVoiceOverState === 'playerReady') && voiceOverAudioSrc && (
                <div className="flex flex-col items-center justify-center flex-grow space-y-6"> {/* flex-grow for centering */}
                    <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-2">
                        <span className="flex items-center justify-center gap-2">
                            <AudioWaveform size={28} className="text-[#121212]" />
                            Voice Playback
                        </span>
                    </h2>
                    {/* Container for SoundWaveVisualizer / Loading state */}
                    <div className="w-full max-w-md h-24 bg-[#F5F5F5] rounded-lg flex items-center justify-center border border-neutral-300"> {/* Light background */}
                        {aiVoiceOverState === 'loadingAudio' ? (
                            <div className="flex flex-col items-center text-sm text-neutral-600"> {/* Dark text for light bg */}
                                <Loader2 size={24} className="text-[#121212] animate-spin mb-1" /> {/* Dark loader for light bg */}
                                Loading audio...
                            </div>
                        ) : (
                            <SoundWaveVisualizer // Uses dark bars by default, suitable for light bg
                                isPlaying={isAudioActuallyPlaying}
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
                        src={voiceOverAudioSrc}
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
                                audioPlayerRef.current.currentTime = 0;
                            }
                            onSetIsAudioActuallyPlaying(false);
                        }}
                        className="border-2 border-[#121212] text-[#121212] hover:bg-[#121212] hover:text-[#F5F5F5] text-sm px-4 py-2 mt-4"
                    >
                        Back to Options
                    </Button>
                </div>
            )}

            {/* State 4: Error State */}
            {aiVoiceOverState === 'error' && (
                <div className="flex flex-col items-center justify-center flex-grow space-y-4 text-red-600"> {/* flex-grow for centering */}
                    <Info size={48} />
                    <p className="text-xl font-medium">Voice-Over Generation Failed</p>
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
                            Try Again
                        </Button>
                    </div>
                </div>
            )}
        </Card>
    );
};

export default AIVoiceOverFlow;