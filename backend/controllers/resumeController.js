import { createRequire } from "module";
import groq from "../utils/groq.js";
import { safeParse } from "../utils/parseJSON.js";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

export const uploadResume = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const data = await pdfParse(file.buffer);
    const text = data.text;

    if (!text || text.trim().length < 50) {
      return res.status(400).json({
        message: "PDF text extraction failed"
      });
    }

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "Extract structured profile from resume"
        },
        {
          role: "user",
          content: `
Resume:
${text}

Return ONLY JSON:
{
  "skills": [],
  "experience": "",
  "projects": []
}`
        }
      ],
      response_format: { type: "json_object" }
    });

    const parsed = safeParse(response.choices[0].message.content);

    if (!parsed) {
      return res.status(500).json({
        message: "Invalid AI response",
        raw: response.choices[0].message.content
      });
    }

    res.json({
      rawText: text,
      profile: parsed   // ✅ IMPORTANT FIX
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Resume processing failed",
      error: error.message
    });
  }
};