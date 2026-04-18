import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function analyzeProductivity(tasks: any[], habits: any[]) {
  const prompt = `
    Analise a produtividade baseada nestas tarefas e hábitos:
    Tarefas: ${JSON.stringify(tasks)}
    Hábitos: ${JSON.stringify(habits)}
    
    Forneça um resumo curto e 3 sugestões práticas para melhorar.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            productivityScore: { type: Type.NUMBER }
          },
          required: ["summary", "suggestions", "productivityScore"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Erro na análise por IA:", error);
    return null;
  }
}
