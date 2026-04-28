import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants";
import { PhilosophicalTradition, Scores, UserChoice } from "../types";

const apiKey = process.env.GEMINI_API_KEY;

export async function getChoiceAnalysis(dilemmaTitle: string, scenario: string, choiceText: string) {
  if (!apiKey) return "Análise indisponível (chave API não configurada).";

  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Dilema: ${dilemmaTitle}\nCenário: ${scenario}\nEscolha do usuário: ${choiceText}\n\nForneça uma análise breve (3-5 linhas) explicando o que a escolha revela filosoficamente, o pensador associado e uma tensão/paradoxo.`,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.7,
    },
  });

  return response.text || "Erro ao gerar análise.";
}

export async function getFinalProfile(scores: Scores, choices: UserChoice[]) {
  if (!apiKey) return null;

  const ai = new GoogleGenAI({ apiKey });
  
  const scoresText = Object.entries(scores)
    .map(([tradition, score]) => `${tradition}: ${score}`)
    .join(", ");

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Scores finais: ${scoresText}\n\nCom base nesses scores e nas escolhas feitas, gere o perfil moral final seguindo a estrutura:\n1. Nome do perfil e tradição filosófica.\n2. Descrição do modo de pensar (3-4 linhas).\n3. Distribuição percentual entre as quatro tradições.\n4. Resumo de cada escolha e o que ela revelou.\n5. Um filósofo para estudar.\n6. Uma pergunta aberta para reflexão pessoal.`,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.7,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          percentages: {
            type: Type.OBJECT,
            properties: {
              [PhilosophicalTradition.UTILITARIANISM]: { type: Type.NUMBER },
              [PhilosophicalTradition.DEONTOLOGY]: { type: Type.NUMBER },
              [PhilosophicalTradition.CONTRACTUALISM]: { type: Type.NUMBER },
              [PhilosophicalTradition.PLURALISM]: { type: Type.NUMBER },
            }
          },
          summary: { type: Type.STRING },
          philosopher: { type: Type.STRING },
          reflectionQuestion: { type: Type.STRING },
        },
        required: ["title", "description", "percentages", "summary", "philosopher", "reflectionQuestion"]
      }
    },
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Failed to parse profile JSON", e);
    return null;
  }
}

export async function getCustomDilemma(scores: Scores, profileTitle: string) {
  if (!apiKey) return null;

  const ai = new GoogleGenAI({ apiKey });
  const scoresText = Object.entries(scores)
    .map(([tradition, score]) => `${tradition}: ${score}`)
    .join(", ");

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `O usuário tem perfil: "${profileTitle}" com scores: ${scoresText}.
Crie UM dilema moral NOVO e ORIGINAL que desafie especificamente esta perspectiva filosófica.
Retorne APENAS um JSON com:
{
  "title": "string",
  "category": "string",
  "scenario": "string",
  "choiceA": "string",
  "choiceB": "string",
  "tension": "string"
}`,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.8,
      responseMimeType: "application/json",
    },
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Failed to parse custom dilemma JSON", e);
    return null;
  }
}

export async function getPhilosopherInsight(userProfile: any, philosopher: any) {
  if (!apiKey) return null;

  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Compare o perfil moral do usuário com o do filósofo ${philosopher.name}.
Perfil Usuário: ${JSON.stringify(userProfile.percentages)}
Perfil Filósofo: ${JSON.stringify(philosopher.scores)}
Em 2-3 frases, explique onde convergem e divergem.`,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.7,
    },
  });

  return response.text || "Erro ao gerar insight.";
}
