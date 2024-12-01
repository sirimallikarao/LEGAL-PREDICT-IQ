import React from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Message } from '../types';

interface ChatHistoryProps {
  messages: Message[];
  onSelectChat: (index: number) => void;
  onClose: () => void;
}

export default function ChatHistory({ messages, onSelectChat, onClose }: ChatHistoryProps) {
  const uniqueChats = messages.filter(msg => msg.isUser).map((msg, index) => ({
    id: index,
    preview: msg.text.slice(0, 60) + (msg.text.length > 60 ? '...' : '')
  }));

  return (
    <div className="fixed left-0 top-0 w-64 h-screen bg-gray-800 text-white p-4 overflow-y-auto z-50">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Chat History
        </h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-700 rounded-full transition-colors lg:hidden"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="space-y-2">
        {uniqueChats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className="w-full text-left p-3 rounded-lg hover:bg-gray-700 transition-colors text-sm"
          >
            {chat.preview}
          </button>
        ))}
        {uniqueChats.length === 0 && (
          <p className="text-gray-400 text-sm text-center">No chat history yet</p>
        )}
      </div>
    </div>
  );
}