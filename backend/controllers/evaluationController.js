import groq from "../utils/groq.js";
import { safeParse } from "../utils/groq.js"; // Ensure this matches your export in groq.js

export const analyzeInterview = async (req, res) => {
  try {
    const { questions, answers } = req.body;

    if (!questions || !answers || questions.length !== answers.length) {
      return res.status(400).json({ message: "Invalid input: questions and answers must match." });
    }

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a senior technical recruiter. Evaluate the candidate's answers deeply."
        },
        {
          role: "user",
          content: `
Questions: ${JSON.stringify(questions)}
Answers: ${JSON.stringify(answers)}

Return STRICT JSON structure:
{
  "overallScore": number,
  "scores": {
    "technical": number,
    "communication": number,
    "confidence": number,
    "problemSolving": number,
    "architecture": number,
    "tradeoff": number
  },
  "missedKeywords": ["string"],
  "feedback": [
    {
      "question": "string",
      "userAnswer": "string",
      "idealAnswer": "string",
      "evaluation": {
        "concepts": "string",
        "strengths": "string",
        "weaknesses": "string",
        "focusArea": "string"
      }
    }
  ]
}
`
        }
      ],
      response_format: { type: "json_object" }
    });

    const parsed = safeParse(response.choices[0].message.content);

    if (!parsed) {
      return res.status(500).json({ message: "AI parsing failed" });
    }

    // Map and ensure every field exists so frontend doesn't crash
    const result = {
      overallScore: parsed.overallScore || 0,
      scores: parsed.scores || { technical: 0, communication: 0, confidence: 0, problemSolving: 0, architecture: 0, tradeoff: 0 },
      missedKeywords: parsed.missedKeywords || [],
      feedback: (parsed.feedback || []).map((f, i) => ({
        question: f.question || questions[i],
        userAnswer: f.userAnswer || answers[i],
        idealAnswer: f.idealAnswer || "N/A",
        evaluation: f.evaluation || {
          concepts: "N/A",
          strengths: "N/A",
          weaknesses: "N/A",
          focusArea: "N/A"
        }
      }))
    };

    res.json(result);

  } catch (error) {
    console.error("Evaluation Error:", error);
    res.status(500).json({ message: "Evaluation failed", error: error.message });
  }
};