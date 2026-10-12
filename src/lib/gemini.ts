import { GoogleGenerativeAI } from "@google/generative-ai";

export const getGeminiAPIKey = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('gemini_api_key');
  }
  return null;
};

export const setGeminiAPIKey = (key: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('gemini_api_key', key);
  }
};

export const generateTextWithGemini = async (prompt: string, apiKey: string) => {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-3.8-flash" });

  try {
    const result = await model.generateContent(prompt);
    const resultResponse = await result.response;
    return resultResponse.text();
  } catch (e: any) {
    throw e;
  }
};
