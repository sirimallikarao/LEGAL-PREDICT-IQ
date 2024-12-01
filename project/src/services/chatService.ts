import { generateResponse } from '../config/gemini';

const SYSTEM_PROMPT = `You are a legal assistant specializing in Indian law. 
Provide accurate, clear, and concise information about Indian legal matters. 
Focus on practical advice and cite relevant sections of laws when applicable.
Always maintain professional language and remind users to consult with a qualified legal professional for specific cases.`;

export const getChatResponse = async (userMessage: string): Promise<string> => {
  const fullPrompt = `${SYSTEM_PROMPT}\n\nUser: ${userMessage}\nAssistant:`;
  
  try {
    const response = await generateResponse(fullPrompt);
    return response;
  } catch (error) {
    console.error('Chat service error:', error);
    throw new Error('Failed to get response from assistant');
  }
};