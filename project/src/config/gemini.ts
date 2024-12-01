import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = 'AIzaSyAKcofagCtqWI4NAdoid-QOII-lQZyMZFg';

export const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
export const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

export const generateResponse = async (prompt: string, signal?: AbortSignal): Promise<string> => {
  try {
    const result = await model.generateContent(prompt, { signal });
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
};