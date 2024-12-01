import toast from 'react-hot-toast';

class VoiceRecognitionService {
  private recognition: SpeechRecognition | null = null;
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return true;

    try {
      // Check for browser support
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        toast.error('Speech recognition is not supported in this browser');
        return false;
      }

      // Request microphone permission
      const permission = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!permission) {
        toast.error('Microphone permission is required for voice input');
        return false;
      }

      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
      
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Voice recognition initialization error:', error);
      toast.error('Failed to initialize voice recognition');
      return false;
    }
  }

  setupListeners(
    onTranscript: (text: string) => void,
    onError: () => void,
    onEnd: () => void
  ) {
    if (!this.recognition) return;

    this.recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join(' ');

      if (event.results[0].isFinal) {
        onTranscript(transcript);
      }
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      onError();
    };

    this.recognition.onend = onEnd;
  }

  start() {
    if (!this.recognition) return;
    this.recognition.start();
  }

  stop() {
    if (!this.recognition) return;
    this.recognition.stop();
  }
}

export const voiceRecognitionService = new VoiceRecognitionService();