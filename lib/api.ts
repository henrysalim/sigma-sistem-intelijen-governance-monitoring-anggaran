// Remove API_BASE entirely. Use relative URLs.

export async function analyzeDocument(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`/api/document/analyze`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to analyze document");
  return res.json();
}

// ... update all other fetch calls to use `/api/...` instead of `${API_BASE}/api/...`
