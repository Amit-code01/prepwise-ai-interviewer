
import groq from "../utils/groq.js";
import { safeParse } from "../utils/groq.js";

export const generateDetailedReport = async (req, res) => {
  try {
    const { feedback, scores, overallScore } = req.body;

    const reportPrompt = `
      You are a Senior Technical Career Coach. Review this interview performance:
      Overall Score: ${overallScore}
      Individual Scores: ${JSON.stringify(scores)}
      Feedback: ${JSON.stringify(feedback)}

      Return a JSON object with this structure:
      {
        "executiveSummary": "string",
        "missedKeywords": ["string"],
        "detailedGaps": [
          {
            "question": "string",
            "evaluation": {
              "concepts": "string",
              "strengths": "string",
              "weaknesses": "string",
              "focusTopics": "string"
            }
          }
        ]
      }
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: reportPrompt }],
      model: "llama-3.1-70b-versatile",
      response_format: { type: "json_object" },
    });

    const reportData = safeParse(chatCompletion.choices[0].message.content);
    res.json(reportData);
  } catch (error) {
    console.error("Report Generation Error:", error);
    res.status(500).json({ error: "Failed to generate detailed report" });
  }
};