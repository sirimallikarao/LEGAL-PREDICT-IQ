import { Mic, MicOff } from 'lucide-react';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import toast from 'react-hot-toast';

interface VoiceAssistantProps {
  onTranscript: (text: string) => void;
}

export default function VoiceAssistant({ onTranscript }: VoiceAssistantProps) {
  const { isListening, toggleListening, isSupported } = useVoiceRecognition({
    onTranscript,
    onError: (error) => toast.error(`Voice recognition error: ${error}`)
  });

  if (!isSupported) {
    return null;
  }

  return (
    <button
      onClick={toggleListening}
      className={`p-2 rounded-full transition-colors ${
        isListening ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'
      }`}
      title={isListening ? 'Stop listening' : 'Start listening'}
    >
      {isListening ? <MicOff size={24} /> : <Mic size={24} />}
    </button>
  );
}