import React from 'react';
import { SUGGESTIONS } from '../constants';

interface SuggestionListProps {
  onSelect: (suggestion: string) => void;
}

export default function SuggestionList({ onSelect }: SuggestionListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
      {SUGGESTIONS.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSelect(suggestion)}
          className="p-4 text-left rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}