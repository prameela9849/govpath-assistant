const API_URL = "https://govpath-backend-1maa.onrender.com/upload";

export async function uploadDocument(file: File) {
  const formData = new FormData();

  formData.append("document", file);

  const response = await fetch(API_URL, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Upload failed");
  }

  return data;
}