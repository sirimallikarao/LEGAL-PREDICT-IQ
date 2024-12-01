import React from 'react';
import { Scale } from 'lucide-react';
import { MessageProps } from '../types';
import ResponseControls from './ResponseControls';

export default function ChatMessage({ 
  message, 
  isUser, 
  isPaused, 
  onPauseToggle,
  onStop 
}: MessageProps) {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[80%] rounded-lg p-4 ${
        isUser ? 'bg-indigo-600 text-white' : 'bg-white text-gray-800'
      }`}>
        <div className="flex items-center gap-3">
          {!isUser && <Scale className="w-6 h-6" />}
          <p className="whitespace-pre-wrap">{message}</p>
          {!isUser && onPauseToggle && onStop && (
            <ResponseControls
              isPaused={isPaused || false}
              onPauseToggle={onPauseToggle}
              onStop={onStop}
            />
          )}
        </div>
      </div>
    </div>
  );
}