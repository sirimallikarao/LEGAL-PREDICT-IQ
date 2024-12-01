export interface MessageProps {
  message: string;
  isUser: boolean;
  isPaused?: boolean;
  onPauseToggle?: () => void;
  onStop?: () => void;
}

export interface Message {
  text: string;
  isUser: boolean;
  isPaused?: boolean;
}

export interface ChatResponse {
  text: string;
  isPaused: boolean;
  controller: AbortController;
}

export interface VoiceRecognitionOptions {
  continuous?: boolean;
  interimResults?: boolean;
  lang?: string;
}