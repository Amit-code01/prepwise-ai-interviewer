import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ✅ ADD 'export' BEFORE const safeParse
export const safeParse = (text) => {
  try {
    // This cleans up potential markdown code blocks from the AI
    const cleanJSON = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJSON);
  } catch (err) {
    console.error("JSON Parse Error:", text);
    return null;
  }
};

export default groq;