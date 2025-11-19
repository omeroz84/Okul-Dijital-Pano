import { GoogleGenAI, Type } from "@google/genai";
import { AiContent } from '../types';

// Helper to get API key from storage or env safely
const getApiKey = (): string => {
  // 1. Try Local Storage (Admin Panel setting - Primary for this app)
  const localKey = localStorage.getItem('GEMINI_API_KEY');
  if (localKey) return localKey.trim();

  // 2. Try Vite Environment Variable
  try {
    // @ts-ignore
    if (import.meta.env && import.meta.env.VITE_API_KEY) {
      // @ts-ignore
      return import.meta.env.VITE_API_KEY.trim();
    }
  } catch (e) {
    // Ignore
  }

  return '';
};

export const generateDailyContent = async (topic: string): Promise<AiContent> => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    throw new Error("API Anahtarı eksik. Lütfen Ayarlar sekmesinden anahtarınızı giriniz.");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const model = 'gemini-2.5-flash';
    const prompt = `Sen bir okul asistanısın. Okul panosu için "${topic}" hakkında kısa, ilgi çekici, motive edici veya bilgilendirici bir içerik oluştur.
    
    Kurallar:
    1. İçerik Türkçe olmalı.
    2. Maksimum 30 kelime olmalı.
    3. Sadece saf JSON formatında yanıt ver. Markdown (backticks) kullanma.
    
    Beklenen JSON Formatı:
    {
      "title": "Başlık",
      "content": "İçerik metni",
      "type": "quote" | "fact" | "info"
    }`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Kısa başlık" },
            content: { type: Type.STRING, description: "İçerik" },
            type: { type: Type.STRING, enum: ['quote', 'fact', 'info'] }
          },
          required: ["title", "content", "type"]
        }
      }
    });

    let text = response.text;
    if (!text) throw new Error("Boş yanıt alındı.");
    
    // Sanitize: Remove markdown code blocks if present
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    return JSON.parse(text) as AiContent;

  } catch (error: any) {
    console.error("Gemini generation error:", error);
    // Return a friendly error object or rethrow specific message
    if (error.message && error.message.includes("API key")) {
        throw new Error("API Anahtarı geçersiz veya süresi dolmuş.");
    }
    throw new Error("İçerik oluşturulamadı. Lütfen tekrar deneyin.");
  }
};

export const suggestAnnouncement = async (keywords: string): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) return "Hata: API Anahtarı Ayarlardan girilmelidir.";

  const ai = new GoogleGenAI({ apiKey });

  try {
     const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Aşağıdaki anahtar kelimeleri kullanarak okul duyurusu için resmi ama samimi bir metin yaz: ${keywords}. Maksimum 2 cümle olsun.`,
    });
    return response.text || "İçerik oluşturulamadı.";
  } catch (e) {
    console.error(e);
    return "Duyuru oluşturulamadı. Lütfen anahtarınızı kontrol edin.";
  }
}