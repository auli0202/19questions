import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface AIExplanation {
  explanation: string;
  examInsights?: string;
  relatedWords?: {
    en: string;
    bn: string;
  }[];
  examples: {
    en: string;
    bn: string;
  }[];
}

export async function explainWord(word: string, context?: { answer?: string, category?: string }): Promise<AIExplanation> {
  const contextStr = context ? `\nContext Information:
  - Provided Meaning/Answer: ${context.answer || 'N/A'}
  - Category: ${context.category || 'N/A'}` : '';

  const prompt = `Explain the word or phrase "${word}" in Bengali specifically for an NTRCA (Non-Government Teachers' Registration and Certification Authority) or similar competitive exam candidate.
  ${contextStr}
  
  Requirements:
  1. Provide a clear, simple, and academic explanation in Bengali (Bangla) that helps in understanding the core meaning and usage.
  2. Provide "Exam Insights" in Bengali: Mention important grammatical rules, synonyms/antonyms, or common traps related to this word that are frequently seen in competitive exams.
  3. Provide 3-5 "Related Important Words": English words/phrases related to this topic with their Bengali translations.
  4. Provide exactly 3 example sentences in English that are directly relevant to the question/word's context.
  5. Ensure the example sentences reflect how this word/phrase might appear in an academic, professional, or competitive exam setting.
  6. Provide the Bengali translation for each English example sentence.
  7. Format the output as a clean JSON object.
  
  Example structure:
  {
    "explanation": "Bengali text here...",
    "examInsights": "Bengali text here...",
    "relatedWords": [
      { "en": "synonym1", "bn": "সমার্থক শব্দ ১" },
      { "en": "antonym1", "bn": "বিপরীত শব্দ ১" }
    ],
    "examples": [
      { "en": "Example 1", "bn": "অনুবাদ ১" },
      ...
    ]
  }`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            explanation: { type: Type.STRING },
            examInsights: { type: Type.STRING },
            relatedWords: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  en: { type: Type.STRING },
                  bn: { type: Type.STRING }
                },
                required: ["en", "bn"]
              }
            },
            examples: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  en: { type: Type.STRING },
                  bn: { type: Type.STRING }
                },
                required: ["en", "bn"]
              }
            }
          },
          required: ["explanation", "examInsights", "relatedWords", "examples"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text);
  } catch (error) {
    console.error("AI Explanation Error:", error);
    throw error;
  }
}
