import React, { useEffect } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { voiceRecognitionService } from '../services/voiceRecognition';
import toast from 'react-hot-toast';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  isListening: boolean;
  setIsListening: (isListening: boolean) => void;
}

export default function VoiceInput({ onTranscript, isListening, setIsListening }: VoiceInputProps) {
  useEffect(() => {
    const initializeVoiceRecognition = async () => {
      const isInitialized = await voiceRecognitionService.initialize();
      if (isInitialized) {
        voiceRecognitionService.setupListeners(
          onTranscript,
          () => {
            toast.error('Voice recognition error. Please try again.');
            setIsListening(false);
          },
          () => {
            if (isListening) {
              voiceRecognitionService.start();
            }
          }
        );
      }
    };

    initializeVoiceRecognition();

    return () => {
      if (isListening) {
        voiceRecognitionService.stop();
        setIsListening(false);
      }
    };
  }, [onTranscript, isListening]);

  const toggleListening = async () => {
    const isInitialized = await voiceRecognitionService.initialize();
    if (!isInitialized) return;

    if (isListening) {
      voiceRecognitionService.stop();
      setIsListening(false);
    } else {
      voiceRecognitionService.start();
      setIsListening(true);
    }
  };

  return (
    <button
      type="button"
      onClick={toggleListening}
      className={`p-3 rounded-full transition-colors ${
        isListening 
          ? 'bg-red-500 text-white hover:bg-red-600' 
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
      }`}
      title={isListening ? 'Stop recording' : 'Start recording'}
    >
      {isListening ? (
        <div className="relative">
          <MicOff className="w-5 h-5" />
          <Loader2 className="w-8 h-8 absolute -top-1.5 -left-1.5 animate-spin opacity-50" />
        </div>
      ) : (
        <Mic className="w-5 h-5" />
      )}
    </button>
  );
}