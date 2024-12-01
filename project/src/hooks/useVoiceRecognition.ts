import { useState, useEffect, useCallback, useRef } from 'react';

interface UseVoiceRecognitionProps {
  onTranscript: (text: string) => void;
  onError?: (error: string) => void;
  continuous?: boolean;
  interimResults?: boolean;
}

export const useVoiceRecognition = ({
  onTranscript,
  onError,
  continuous = true,
  interimResults = true
}: UseVoiceRecognitionProps) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [isSupported] = useState(() => 
    'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
  );

  useEffect(() => {
    if (isSupported && !recognitionRef.current) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const instance = new SpeechRecognition();
      
      instance.continuous = continuous;
      instance.interimResults = interimResults;
      instance.lang = 'en-IN';
      
      instance.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join(' ');
        
        if (event.results[0].isFinal) {
          onTranscript(transcript);
        }
      };

      instance.onerror = (event) => {
        onError?.(event.error);
        setIsListening(false);
      };

      instance.onend = () => {
        if (isListening) {
          instance.start();
        }
      };

      recognitionRef.current = instance;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isSupported, onTranscript, onError, continuous, interimResults, isListening]);

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
    setIsListening(!isListening);
  }, [isListening]);

  return {
    isListening,
    toggleListening,
    isSupported
  };
};