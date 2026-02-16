
import { GoogleGenAI, Type } from "@google/genai";
import { Difficulty, Question, House, SortingResult } from "../types";

export const fetchTriviaQuestions = async (difficulty: Difficulty): Promise<Question[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const difficultyPrompt = {
    [Difficulty.MUGGLE]: "ידע בסיסי על סרטי הארי פוטר בלבד.",
    [Difficulty.WIZARD]: "פרטים מעמיקים מהספרים והסרטים, כולל לחשים ודמויות משניות.",
    [Difficulty.MASTER]: "פרטים נדירים ביותר, היסטוריה עמוקה של עולם הקוסמים ופרטים טכניים מ'חיות הפלא' ו'פוטרמור'."
  }[difficulty];

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `צור 5 שאלות טריוויה מאתגרות על עולם הקוסמים (היקום של הארי פוטר) בעברית.
    רמת הקושי צריכה להיות: ${difficultyPrompt}
    כתוב את השאלות והתשובות בעברית רהוטה.
    החזר בדיוק 5 שאלות במבנה JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING, description: "השאלה בעברית." },
            options: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "ארבע אפשרויות תשובה בעברית."
            },
            correctIndex: { type: Type.NUMBER, description: "האינדקס של התשובה הנכונה (0-3)." },
            explanation: { type: Type.STRING, description: "הסבר קצר וקסום על העובדה בעברית." }
          },
          required: ["question", "options", "correctIndex"]
        }
      }
    }
  });

  try {
    const questions = JSON.parse(response.text || '[]');
    return questions;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("הקסם נכשל. נסה להטיל את הלחש שוב.");
  }
};

export const sortIntoHouse = async (score: number, total: number, difficulty: Difficulty): Promise<SortingResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `פעל כ'מצנפת המיון' מהארי פוטר. תלמיד סיים אתגר טריוויה קסום.
    ציון: ${score} מתוך ${total}
    רמת קושי: ${difficulty}
    
    בהתבסס על הביצועים שלו, בחר אחד מארבעת הבתים: גריפינדור, הפלפאף, רייבנקלו או סלית'רין.
    ספק דיאלוג קצר, מסתורי ומאפיין (2-3 משפטים), אולי בחרוזים, בעברית, לפני הכרזת הבית.
    החזר את התוצאה בפורמט JSON עם שמות הבתים באנגלית כערכי ה-enum (Gryffindor, Hufflepuff, Ravenclaw, Slytherin).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          house: { type: Type.STRING, enum: ["גריפינדור", "הפלפאף", "רייבנקלו", "סלית'רין"] },
          dialogue: { type: Type.STRING, description: "המונולוג של המצנפת בעברית." }
        },
        required: ["house", "dialogue"]
      }
    }
  });

  try {
    const data = JSON.parse(response.text || '{}');
    // Map Hebrew house names from AI back to our internal enum if needed, 
    // though here we'll just ensure it matches the keys.
    const houseMap: Record<string, House> = {
      'גריפינדור': House.GRYFFINDOR,
      'הפלפאף': House.HUFFLEPUFF,
      'רייבנקלו': House.RAVENCLAW,
      'סלית\'רין': House.SLYTHERIN
    };
    return {
      house: houseMap[data.house] || House.GRYFFINDOR,
      dialogue: data.dialogue
    };
  } catch (error) {
    console.error("Sorting failed:", error);
    return { house: House.GRYFFINDOR, dialogue: "אה, קשה מאוד. אני רואה כאן אומץ רב..." };
  }
};
