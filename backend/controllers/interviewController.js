import groq from "../utils/groq.js";
import { safeParse } from "../utils/parseJSON.js";

export const generateQuestions = async (req, res) => {
  try {
    const { profile } = req.body;

    if (!profile) {
      return res.status(400).json({ message: "Profile required" });
    }

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a senior interviewer"
        },
        {
          role: "user",
          content: `
Profile:
${JSON.stringify(profile)}

Generate 5 high-quality interview questions:

Rules:
- Mix easy → medium → hard
- Ask about projects
- Ask real-world scenarios
- Ask 1 system design / scaling question

Return JSON:
{
  "questions": [
    {
      "question": string,
      "difficulty": "easy|medium|hard"
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
      return res.status(500).json({ message: "Invalid AI response" });
    }

    res.json(parsed);

  } catch (error) {
    res.status(500).json({ message: "Question generation failed" });
  }
};