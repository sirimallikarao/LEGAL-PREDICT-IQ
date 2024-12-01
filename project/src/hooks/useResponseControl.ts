import { useState, useCallback } from 'react';
import { ChatResponse } from '../types';

export const useResponseControl = () => {
  const [currentResponse, setCurrentResponse] = useState<ChatResponse | null>(null);

  const startResponse = useCallback((controller: AbortController | null) => {
    if (controller) {
      setCurrentResponse({
        text: '',
        isPaused: false,
        controller
      });
    } else {
      setCurrentResponse(null);
    }
  }, []);

  const stopResponse = useCallback(() => {
    if (currentResponse?.controller) {
      currentResponse.controller.abort();
      setCurrentResponse(null);
    }
  }, [currentResponse]);

  const togglePause = useCallback(() => {
    setCurrentResponse(prev => {
      if (!prev?.controller) return null;
      
      if (prev.isPaused) {
        return { ...prev, isPaused: false };
      } else {
        prev.controller.abort();
        return { ...prev, isPaused: true };
      }
    });
  }, []);

  return {
    currentResponse,
    startResponse,
    stopResponse,
    togglePause
  };
};