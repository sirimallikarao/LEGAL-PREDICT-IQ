import React from 'react';
import { Pause, Play, Square } from 'lucide-react';

interface ResponseControlsProps {
  isPaused: boolean;
  onPauseToggle: () => void;
  onStop: () => void;
}

export default function ResponseControls({ isPaused, onPauseToggle, onStop }: ResponseControlsProps) {
  return (
    <div className="flex gap-2">
      <button
        onClick={onPauseToggle}
        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        title={isPaused ? 'Resume' : 'Pause'}
      >
        {isPaused ? <Play size={16} /> : <Pause size={16} />}
      </button>
      <button
        onClick={onStop}
        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        title="Stop"
      >
        <Square size={16} />
      </button>
    </div>
  );
}