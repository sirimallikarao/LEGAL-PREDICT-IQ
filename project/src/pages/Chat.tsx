import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import VoiceAssistant from '../components/VoiceAssistant';
import { LogOut, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getChatResponse } from '../services/chatService';
import toast from 'react-hot-toast';

const SUGGESTIONS = [
  "A child suffering with harassment and abuse in India and what laws are applicable for it?",
  "Having a fight with your family regarding property division in India what are the laws applicable for it?",
  "An Employee's salary is pending what are the cases that you can file in India on corporate companies?",
  "What are the cases applicable in India on a woman for being beaten by family under domestic violence?"
];

export default function Chat() {
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Failed to logout');
    }
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;
    
    setMessages(prev => [...prev, { text, isUser: true }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getChatResponse(text);
      setMessages(prev => [...prev, { text: response, isUser: false }]);
    } catch (error) {
      toast.error('Failed to get response from assistant');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceTranscript = (transcript: string) => {
    setInput(transcript);
    toast.success('Voice input received!');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white shadow-sm p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">Legal Predict IQ</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="p-2 rounded-full hover:bg-gray-100"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden flex flex-col max-w-7xl w-full mx-auto p-4">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold text-gray-700 mb-8">How can I help you today?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
              {SUGGESTIONS.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSend(suggestion)}
                  className="p-4 text-left rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.isUser
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-800'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 rounded-lg p-4">
                  Thinking...
                </div>
              </div>
            )}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-2">
          <VoiceAssistant onTranscript={handleVoiceTranscript} />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
            placeholder="Type your message or use voice input..."
            className="flex-1 bg-transparent focus:outline-none"
          />
          <button
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isLoading}
            className="p-2 rounded-full bg-indigo-600 text-white disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </main>
    </div>
  );
}