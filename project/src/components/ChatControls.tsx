import React from 'react';
import { Sun, Moon, Trash2, Copy, ThumbsUp } from 'lucide-react';

interface ChatControlsProps {
  isDarkMode: boolean;
  onThemeToggle: () => void;
  onClearChat: () => void;
  onCopyChat: () => void;
  onLikeChat: () => void;
}

export default function ChatControls({
  isDarkMode,
  onThemeToggle,
  onClearChat,
  onCopyChat,
  onLikeChat
}: ChatControlsProps) {
  return (
    <div className="fixed top-4 right-4 flex gap-2">
      <button
        onClick={onThemeToggle}
        className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>
      <button
        onClick={onClearChat}
        className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        title="Clear Chat History"
      >
        <Trash2 className="w-5 h-5" />
      </button>
      <button
        onClick={onCopyChat}
        className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        title="Copy Chat History"
      >
        <Copy className="w-5 h-5" />
      </button>
      <button
        onClick={onLikeChat}
        className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        title="Like Chat"
      >
        <ThumbsUp className="w-5 h-5" />
      </button>
    </div>
  );
}