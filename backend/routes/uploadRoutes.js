const express = require("express");
const multer = require("multer");
const Tesseract = require("tesseract.js");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
});

function detectDocumentType(text) {
  const lowerText = text.toLowerCase();

  if (
    lowerText.includes("aadhaar") ||
    lowerText.includes("uidai") ||
    lowerText.includes("unique identification authority")
  ) {
    return "Aadhaar Card";
  }

  if (
    lowerText.includes("income tax department") ||
    lowerText.includes("permanent account number") ||
    lowerText.includes("pan")
  ) {
    return "PAN Card";
  }

  if (
    lowerText.includes("passport") ||
    lowerText.includes("republic of india")
  ) {
    return "Passport";
  }

  if (
    lowerText.includes("driving licence") ||
    lowerText.includes("driving license") ||
    lowerText.includes("transport department")
  ) {
    return "Driving Licence";
  }

  if (
    lowerText.includes("election commission") ||
    lowerText.includes("voter") ||
    lowerText.includes("elector")
  ) {
    return "Voter ID";
  }

  if (
    lowerText.includes("birth certificate") ||
    lowerText.includes("date of birth")
  ) {
    return "Birth Certificate";
  }

  if (
    lowerText.includes("income certificate") ||
    lowerText.includes("annual income")
  ) {
    return "Income Certificate";
  }

  if (
    lowerText.includes("caste certificate") ||
    lowerText.includes("community certificate")
  ) {
    return "Caste Certificate";
  }

  return "Unknown Document";
}

router.post("/", upload.single("document"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    console.log("=================================");
    console.log("File Uploaded Successfully");
    console.log(req.file);
    console.log("=================================");

    console.log("Starting OCR...");

    const result = await Tesseract.recognize(req.file.path, "eng");

    console.log("OCR Completed");

    const extractedText = result.data.text;

    const cleanText = extractedText
      .replace(/\n\s*\n/g, "\n")
      .trim();

    const documentType = detectDocumentType(cleanText);

    console.log("Extracted Text:");
    console.log(cleanText);

    // ==========================================
// Extract Important Fields from OCR
// ==========================================

let name = "";
let dob = "";
let gender = "";
let aadhaarNumber = "";
let address = "";

const lines = cleanText
  .split("\n")
  .map(line => line.trim())
  .filter(line => line.length > 0);

// ----------------------
// Aadhaar Number
// ----------------------

const aadhaarMatch = cleanText.match(/\d{4}\s\d{4}\s\d{4}/);

if (aadhaarMatch) {
  aadhaarNumber = aadhaarMatch[0];
}

// ----------------------
// DOB
// ----------------------

const dobMatch = cleanText.match(/\d{2}\/\d{2}\/\d{4}|\d{8}/);

if (dobMatch) {
  dob = dobMatch[0];
}

// ----------------------
// Gender
// ----------------------

if (cleanText.toLowerCase().includes("female")) {
  gender = "Female";
}
else if (cleanText.toLowerCase().includes("male")) {
  gender = "Male";
}

// ----------------------
// Name
// ----------------------

for (const line of lines) {

  if (
    line.length > 3 &&
    !line.toLowerCase().includes("address") &&
    !line.toLowerCase().includes("dob") &&
    !line.match(/\d{4}\s\d{4}\s\d{4}/) &&
    !line.toLowerCase().includes("male") &&
    !line.toLowerCase().includes("female")
  ) {

    name = line;

    break;
  }
}

// ----------------------
// Address
// ----------------------

const addressIndex = lines.findIndex(line =>
  line.toLowerCase().includes("address")
);

if (addressIndex !== -1) {

  address = lines
    .slice(addressIndex + 1)
    .join(" ");
}

// Debug Output

console.log("Extracted Fields");
console.log({
  name,
  dob,
  gender,
  aadhaarNumber,
  address,
});

    console.log("Detected Document Type:");
    console.log(documentType);

    return res.json({
      success: true,
      filename: req.file.filename,
      extractedText: cleanText,
      documentType,
    });
  } catch (error) {
    console.error("OCR Error:", error);

    return res.status(500).json({
      success: false,
      message: "OCR failed",
    });
  }
});

module.exports = router;