const express = require("express");
const router = express.Router();

const model = require("../config/gemini");
const supabase = require("../config/supabase");

router.post("/", async (req, res) => {
  console.log("=================================");
  console.log("CHAT REQUEST RECEIVED");
  console.log("Request Body:", req.body);
  console.log("=================================");

  try {
    const { message, ocrText, documentType } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // Fetch services from Supabase
    const { data: services, error } = await supabase
      .from("services")
      .select("*");

    if (error) {
      console.log("Supabase Error:", error);

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    console.log("Services fetched:", services.length);

    // -----------------------------
    // Match service from user query
    // -----------------------------
    let matchedService = null;

    const lowerMessage = message.toLowerCase();

    matchedService = services.find((service) => {
      const serviceName = service.name.toLowerCase();

      return (
        lowerMessage.includes(serviceName) ||
        serviceName.includes(lowerMessage) ||
        lowerMessage.includes(serviceName.split(" ")[0])
      );
    });

    console.log("Matched Service:", matchedService);

    // -----------------------------
    // Gemini Prompt
    // -----------------------------
    const prompt = `
You are GovAssist AI, an AI Government Service Assistant.

Use ONLY the government service information provided below.

Government Services:
${JSON.stringify(services, null, 2)}

User Question:
${message}

Uploaded Document Type:
${documentType || "None"}

OCR Extracted Text:
${ocrText || "No document uploaded"}

Instructions:

1. If the service exists:
   - Explain the service.
   - Mention eligibility.
   - Mention required documents.
   - Mention fees.
   - Mention processing time.
   - Mention official website.
   - Answer step-by-step.

2. If the user uploaded a document:
   - Use the OCR text to answer.
   - Tell whether the uploaded document appears suitable.
   - Mention if any required information is missing.

3. If the service does not exist:
   - Politely say it is unavailable.

4. Never invent information.
`;

    let result;

    try {
      console.log("Sending prompt to Gemini...");
      result = await model.generateContent(prompt);
    } catch (error) {
      if (error.status === 503) {
        console.log("Gemini Busy. Waiting 2 seconds...");

        await new Promise((resolve) => setTimeout(resolve, 2000));

        console.log("Retrying Gemini...");

        result = await model.generateContent(prompt);
      } else {
        throw error;
      }
    }

    const response = result.response.text();

    console.log("Gemini Response Generated");

    return res.json({
      success: true,
      reply: response,
      serviceId: matchedService ? matchedService.id : null,
      serviceName: matchedService ? matchedService.name : null,
    });

  } catch (error) {
    console.error("Chat Route Error:");
    console.error(error);

    if (error.status === 503) {
      return res.json({
        success: true,
        reply:
          "The AI service is temporarily busy. Please try again after a few seconds.",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
});

module.exports = router;