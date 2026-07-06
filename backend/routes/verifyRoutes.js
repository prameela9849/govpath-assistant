const express = require("express");
const router = express.Router();

const model = require("../config/gemini");

router.post("/detect", async (req, res) => {
  try {
    const { ocrText } = req.body;

    if (!ocrText) {
      return res.status(400).json({
        success: false,
        message: "OCR text is required",
      });
    }

    const prompt = `
You are a document classification assistant.

Read the OCR text below and identify the document type.

OCR Text:
${ocrText}

Possible document types:
- Aadhaar Card
- PAN Card
- Passport
- Voter ID
- Driving Licence
- Birth Certificate
- Income Certificate
- Caste Certificate
- Unknown

Return ONLY valid JSON in this format:

{
  "documentType": "Aadhaar Card",
  "confidence": "High"
}
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const cleaned = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    return res.json({
      success: true,
      documentType: parsed.documentType,
      confidence: parsed.confidence,
    });
  } catch (error) {
    console.error("Detect Document Error:", error);

    return res.status(500).json({
      success: false,
      message: "Document detection failed",
    });
  }
});

module.exports = router;