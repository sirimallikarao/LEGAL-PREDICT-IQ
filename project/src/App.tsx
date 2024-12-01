import React, { useState, useEffect, useCallback } from 'react';
import { Toaster } from 'react-hot-toast';
import { Send, Scale, Menu, X } from 'lucide-react';
import ChatMessage from './components/ChatMessage';
import VoiceInput from './components/VoiceInput';
import ChatHistory from './components/ChatHistory';
import SuggestionList from './components/SuggestionList';
import ChatControls from './components/ChatControls';
import { generateResponse } from './config/gemini';
import { Message } from './types';
import { SYSTEM_PROMPT } from './constants';
import { useResponseControl } from './hooks/useResponseControl';
import { useTheme } from './hooks/useTheme';
import toast from 'react-hot-toast';

export default function App() {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('chat-messages');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  
  const { 
    currentResponse, 
    startResponse, 
    stopResponse, 
    togglePause 
  } = useResponseControl();

  useEffect(() => {
    localStorage.setItem('chat-messages', JSON.stringify(messages));
  }, [messages]);

  const handleSend = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const newMessage = { text, isUser: true };
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const controller = new AbortController();
      const prompt = `${SYSTEM_PROMPT}\n\nUser: ${text}\nAssistant:`;
      
      startResponse(controller);

      const response = await generateResponse(prompt, controller.signal);
      
      setMessages(prev => [...prev, { text: response, isUser: false }]);
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Chat error:', error);
        toast.error('Failed to get response');
      }
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, startResponse]);

  const handleClearChat = useCallback(() => {
    if (window.confirm('Are you sure you want to clear all chat history?')) {
      setMessages([]);
      localStorage.removeItem('chat-messages');
      toast.success('Chat history cleared');
    }
  }, []);

  const handleCopyChat = useCallback(() => {
    const chatText = messages
      .map(msg => `${msg.isUser ? 'You' : 'Assistant'}: ${msg.text}`)
      .join('\n\n');
    navigator.clipboard.writeText(chatText);
    toast.success('Chat copied to clipboard');
  }, [messages]);

  const handleLikeChat = useCallback(() => {
    toast.success('Thanks for your feedback!');
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  }, [input, handleSend]);

  const handleVoiceTranscript = useCallback((text: string) => {
    setInput(prev => prev + ' ' + text);
    setIsListening(false);
  }, []);

  const handleSelectChat = useCallback((index: number) => {
    const selectedMessage = messages[index * 2];
    setInput(selectedMessage.text);
    setShowSidebar(false);
  }, [messages]);

  const toggleSidebar = useCallback(() => {
    setShowSidebar(prev => !prev);
  }, []);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
        {/* Sidebar Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          {showSidebar ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Sidebar with overlay */}
        {showSidebar && (
          <>
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
              onClick={toggleSidebar}
            />
            <ChatHistory 
              messages={messages} 
              onSelectChat={handleSelectChat}
              onClose={toggleSidebar}
            />
          </>
        )}
        
        <div className="flex-1 flex flex-col">
          <header className="bg-white dark:bg-gray-800 shadow-sm p-4">
            <div className="max-w-7xl mx-auto flex items-center gap-2">
              <Scale className="w-8 h-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Legal Predict IQ</h1>
            </div>
          </header>

          <ChatControls
            isDarkMode={isDarkMode}
            onThemeToggle={toggleTheme}
            onClearChat={handleClearChat}
            onCopyChat={handleCopyChat}
            onLikeChat={handleLikeChat}
          />

          <main className="max-w-7xl mx-auto p-4 flex-1">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-8">
                  How can I help you today?
                </h2>
                <SuggestionList onSelect={handleSend} />
              </div>
            ) : (
              <div className="space-y-4 mb-24">
                {messages.map((msg, index) => (
                  <ChatMessage 
                    key={index} 
                    message={msg.text} 
                    isUser={msg.isUser}
                    isPaused={!msg.isUser && currentResponse?.isPaused}
                    onPauseToggle={!msg.isUser && currentResponse ? togglePause : undefined}
                    onStop={!msg.isUser && currentResponse ? stopResponse : undefined}
                  />
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg p-4">
                      Thinking...
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>

          <form
            onSubmit={handleSubmit}
            className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t dark:border-gray-700 p-4"
          >
            <div className="max-w-7xl mx-auto flex items-center gap-2">
              <VoiceInput 
                onTranscript={handleVoiceTranscript}
                isListening={isListening}
                setIsListening={setIsListening}
              />
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your legal question or use voice input..."
                className="flex-1 p-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50 hover:bg-indigo-700"
              >
                <Send size={24} />
              </button>
            </div>
          </form>
        </div>
        <Toaster position="top-center" />
      </div>
    </div>
  );
}