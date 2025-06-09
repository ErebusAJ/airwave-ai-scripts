import React, { useEffect, useRef, useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Play, Pause, Volume2, Edit, RotateCcw, ArrowLeft } from 'lucide-react';

interface AIVoiceOverFlowProps {
  aiVoiceOverState: 'idle' | 'loadingAnalysis' | 'ready' | 'loadingAudio' | 'playerReady' | 'error';
  setAiVoiceOverState: (state: 'idle' | 'loadingAnalysis' | 'ready' | 'loadingAudio' | 'playerReady' | 'error') => void;
  initialScriptForVO: string;
  voiceOverAudioBlob: Blob | null;
  audioPlayerRef: React.RefObject<HTMLAudioElement>;
  isAudioActuallyPlaying: boolean;
  onSetIsAudioActuallyPlaying: (playing: boolean) => void;
  onToggleAudioPlayback: () => void;
  onPrepareAudioPlayback: (text: string) => Promise<void>;
  onSetViewModeToScript: () => void;
  onRetryAIVoiceOver: () => void;
}

const SoundWaveBars: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  return (
    <div className="flex items-center justify-center space-x-1 h-8">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className={`bg-blue-500 rounded-full transition-all duration-200 ${
            isPlaying ? 'soundwave-bar playing' : 'soundwave-bar'
          }`}
          style={{
            width: '3px',
            height: isPlaying ? '8px' : '4px',
            animationDelay: `${i * 0.1}s`,
            animationDuration: `${0.5 + Math.random() * 0.5}s`,
          }}
        />
      ))}
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
  onSetIsAudioActuallyPlaying,
  onToggleAudioPlayback,
  onPrepareAudioPlayback,
  onSetViewModeToScript,
  onRetryAIVoiceOver,
}) => {
  const [editedScript, setEditedScript] = useState(initialScriptForVO);
  const [isEditing, setIsEditing] = useState(false);
  const activeBlobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    setEditedScript(initialScriptForVO);
  }, [initialScriptForVO]);

  useEffect(() => {
    if (voiceOverAudioBlob) {
      // Revoke the old blob URL if it exists
      if (activeBlobUrlRef.current) {
        URL.revokeObjectURL(activeBlobUrlRef.current);
      }

      // Create a new object URL for the new blob
      const url = URL.createObjectURL(voiceOverAudioBlob);
      activeBlobUrlRef.current = url;

      // Set the audio source to the new object URL
      if (audioPlayerRef.current) {
        audioPlayerRef.current.src = url;
        audioPlayerRef.current.load(); // Load the new source
        setAiVoiceOverState('playerReady');
      }
    }
  }, [voiceOverAudioBlob, audioPlayerRef, setAiVoiceOverState]);

  useEffect(() => {
    const audioElement = audioPlayerRef.current;
    if (!audioElement) return;

    const handlePlay = () => onSetIsAudioActuallyPlaying(true);
    const handlePause = () => onSetIsAudioActuallyPlaying(false);
    const handleEnded = () => onSetIsAudioActuallyPlaying(false);

    audioElement.addEventListener('play', handlePlay);
    audioElement.addEventListener('pause', handlePause);
    audioElement.addEventListener('ended', handleEnded);

    return () => {
      audioElement.removeEventListener('play', handlePlay);
      audioElement.removeEventListener('pause', handlePause);
      audioElement.removeEventListener('ended', handleEnded);
    };
  }, [audioPlayerRef, onSetIsAudioActuallyPlaying]);

  useEffect(() => {
    return () => {
      console.log("AUDIO_CLEANUP: AIVoiceOverFlow unmounting.");
      // Revoke the blob URL to free up resources
      if (activeBlobUrlRef.current) {
        URL.revokeObjectURL(activeBlobUrlRef.current);
        activeBlobUrlRef.current = null;
      }
    };
  }, []);

  const handleGenerateAudio = async () => {
    if (!editedScript.trim()) {
      alert("Please enter some text to generate audio.");
      return;
    }
    await onPrepareAudioPlayback(editedScript);
  };

  const renderContent = () => {
    switch (aiVoiceOverState) {
      case 'loadingAnalysis':
        return (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold mb-2">Analyzing Script</h3>
            <p className="text-gray-600">Preparing your script for voice synthesis...</p>
          </div>
        );

      case 'ready':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold">AI Voice Over</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="text-blue-600 hover:text-blue-800"
              >
                <Edit className="w-4 h-4 mr-2" />
                {isEditing ? 'Done' : 'Edit'}
              </Button>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-lg p-4 min-h-[200px]">
              {isEditing ? (
                <textarea
                  value={editedScript}
                  onChange={(e) => setEditedScript(e.target.value)}
                  className="w-full h-full min-h-[180px] resize-none border-none outline-none text-gray-800 leading-relaxed"
                  placeholder="Edit your script here..."
                />
              ) : (
                <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                  {editedScript || "No script content available."}
                </div>
              )}
            </div>

            <Button
              onClick={handleGenerateAudio}
              disabled={!editedScript.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
            >
              <Volume2 className="w-5 h-5 mr-2" />
              Generate Voice Over
            </Button>
          </div>
        );

      case 'loadingAudio':
        return (
          <div className="text-center py-12">
            <SoundWaveBars isPlaying={true} />
            <h3 className="text-xl font-semibold mb-2 mt-4">Generating Audio</h3>
            <p className="text-gray-600">Creating your voice over...</p>
          </div>
        );

      case 'playerReady':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-center">Your Voice Over is Ready!</h3>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 text-center">
              <SoundWaveBars isPlaying={isAudioActuallyPlaying} />
              
              <div className="flex justify-center mt-6 space-x-4">
                <Button
                  onClick={onToggleAudioPlayback}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                >
                  {isAudioActuallyPlaying ? (
                    <>
                      <Pause className="w-5 h-5 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      Play
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(true);
                    setAiVoiceOverState('ready');
                  }}
                  className="px-6 py-3"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Script
                </Button>
              </div>
            </div>

            {voiceOverAudioBlob && (
              <audio
                ref={audioPlayerRef}
                className="hidden"
                onPlay={() => onSetIsAudioActuallyPlaying(true)}
                onPause={() => onSetIsAudioActuallyPlaying(false)}
                onEnded={() => onSetIsAudioActuallyPlaying(false)}
              />
            )}
          </div>
        );

      case 'error':
        return (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Something went wrong</h3>
            <p className="text-gray-600 mb-4">We couldn't generate your voice over. Please try again.</p>
            <Button
              onClick={onRetryAIVoiceOver}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <p className="text-gray-600">Initializing AI Voice Over...</p>
          </div>
        );
    }
  };

  return (
    <Card className="bg-[#F5F5F5] text-[#121212] rounded-xl shadow-2xl p-8 max-w-4xl w-full z-20 min-h-[500px]">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          onClick={onSetViewModeToScript}
          className="text-gray-600 hover:text-gray-800 p-2"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Script
        </Button>
      </div>

      {renderContent()}
    </Card>
  );
};

export default AIVoiceOverFlow;
