const API_URL = "http://localhost:5000/chat";

export async function sendMessage(
  message: string,
  ocrText: string,
  documentType: string
) {
  const response = await fetch(API_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      message,
      ocrText,
      documentType,
    }),
  });

  console.log("HTTP Status:", response.status);

  const data = await response.json();

  console.log("Backend Response:", data);

  if (!response.ok) {
    throw new Error(data.message || "Backend Error");
  }

  return data;
}