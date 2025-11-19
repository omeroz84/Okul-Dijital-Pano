import { GoogleGenAI, Type } from "@google/genai";
import { AiContent } from '../types';

// Helper to get API key from storage or env safely
const getApiKey = (): string => {
  // 1. Try Local Storage (Admin Panel setting - Primary for this app)
  const localKey = localStorage.getItem('GEMINI_API_KEY');
  if (localKey) return localKey;

  // 2. Try Vite Environment Variable
  try {
    // @ts-ignore
    if (import.meta.env && import.meta.env.VITE_API_KEY) {
      // @ts-ignore
      return import.meta.env.VITE_API_KEY;
    }
  } catch (e) {
    // Ignore
  }

  return '';
};

export const generateDailyContent = async (topic: string): Promise<AiContent> => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    return {
      title: 'Anahtar Eksik',
      content: 'Lütfen Admin Panel > Ayarlar kısmından Gemini API Anahtarınızı giriniz.',
      type: 'info'
    };
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const model = 'gemini-2.5-flash';
    const prompt = `Sen bir okul asistanısın. Okul panosu için "${topic}" hakkında kısa, ilgi çekici, motive edici veya bilgilendirici bir içerik oluştur.
    İçerik Türkçe olmalı. Çok uzun olmamalı (maksimum 30 kelime).
    JSON formatında yanıt ver.`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Kısa ve dikkat çekici bir başlık" },
            content: { type: Type.STRING, description: "İçerik metni" },
            type: { type: Type.STRING, enum: ['quote', 'fact', 'info'] }
          },
          required: ["title", "content", "type"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response");
    
    return JSON.parse(text) as AiContent;

  } catch (error) {
    console.error("Gemini generation error:", error);
    return {
      title: 'Gemini Hatası',
      content: 'İçerik oluşturulurken bir sorun oluştu. API anahtarınızı kontrol edin.',
      type: 'info'
    };
  }
};

export const suggestAnnouncement = async (keywords: string): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) return "Lütfen Ayarlardan API Anahtarı giriniz.";

  const ai = new GoogleGenAI({ apiKey });

  try {
     const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Aşağıdaki anahtar kelimeleri kullanarak okul duyurusu için resmi ama samimi bir metin yaz: ${keywords}. Maksimum 2 cümle olsun.`,
    });
    return response.text || "";
  } catch (e) {
    return "Duyuru oluşturulamadı. API Anahtarını kontrol ediniz.";
  }
}