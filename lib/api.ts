/* ─── Document Intelligence ──────────────────────── */

export async function analyzeApbd(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/document/analyze", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Gagal menganalisis dokumen");
  }
  return res.json();
}

/* ─── Language Service ───────────────────────────── */

export async function analyzeLanguage(
  type: "entities" | "keyphrases" | "sentiment",
  texts: string[],
) {
  const res = await fetch(`/api/language/${type}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ texts }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Analisis bahasa gagal");
  }
  return res.json();
}

/* ─── Vision / Custom Vision ─────────────────────── */

export async function classifyImage(file: File) {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch("/api/vision/classify", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    // Try to extract a concise error message from the response
    const text = await res.text().catch(() => "");
    let message = "Klasifikasi gambar gagal";
    if (text) {
      try {
        const body = JSON.parse(text);
        if (typeof body === "string") message = body;
        else if (body.error && typeof body.error === "string") message = body.error;
        else if (body.message && typeof body.message === "string") message = body.message;
        else {
          // Fallback: prefer a short serialization or status text
          const keys = Object.keys(body);
          if (keys.length === 1 && typeof body[keys[0]] === "string") message = body[keys[0]];
          else message = res.statusText || message;
        }
      } catch {
        // Not JSON, use raw text
        message = text.length > 0 ? text : res.statusText || message;
      }
    } else {
      message = res.statusText || message;
    }

    throw new Error(message);
  }
  return res.json();
}

/* ─── Content Safety ─────────────────────────────── */

export async function checkTextSafety(text: string) {
  const res = await fetch("/api/safety/text", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Safety check gagal");
  }
  return res.json();
}

export async function checkImageSafety(file: File) {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch("/api/safety/image", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Safety check gambar gagal");
  }
  return res.json();
}

/* ─── Speech ─────────────────────────────────────── */

export async function synthesizeSpeech(
  text: string,
  language = "id-ID",
): Promise<Blob> {
  const res = await fetch("/api/speech/synthesize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, language }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Sintesis suara gagal");
  }
  return res.blob();
}

/* ─── Cosmos DB — Anomalies ──────────────────────── */

export async function fetchAnomalies(regionId?: string) {
  const params = regionId ? `?regionId=${encodeURIComponent(regionId)}` : "";
  const res = await fetch(`/api/data/anomalies${params}`);

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Gagal memuat anomali");
  }
  return res.json();
}

export async function saveAnomalyData(data: {
  type: string;
  description: string;
  regionId?: string;
  severity?: string;
  module?: string;
  metadata?: Record<string, unknown>;
}) {
  const res = await fetch("/api/data/anomalies", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Gagal menyimpan anomali");
  }
  return res.json();
}

/* ─── Cosmos DB — Citizen Reports ────────────────── */

export async function fetchCitizenReports(regionId?: string) {
  const params = regionId ? `?regionId=${encodeURIComponent(regionId)}` : "";
  const res = await fetch(`/api/data/citizen-reports${params}`);

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Gagal memuat laporan warga");
  }
  return res.json();
}

export async function submitCitizenReport(data: {
  description: string;
  regionId?: string;
  location?: string;
  category?: string;
  photos?: string[];
  classification?: Record<string, unknown>;
}) {
  const res = await fetch("/api/data/citizen-reports", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Gagal mengirim laporan");
  }
  return res.json();
}
