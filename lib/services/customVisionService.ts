/**
 * Backwards-compatible wrapper that previously called Custom Vision.
 * Now uses Azure Computer Vision Analyze API (no publishName required).
 */
import { Buffer } from "buffer";

const cvEndpoint = process.env.AZURE_CV_ENDPOINT;
const cvKey = process.env.AZURE_CV_KEY;

interface Prediction {
  tagName: string;
  probability: string; // formatted like "87.50%"
  probabilityRaw: number;
}

export async function classifyInfrastructureImage(imageBuffer: Buffer) {
  if (!cvEndpoint || !cvKey) {
    throw new Error("Missing AZURE_CV_ENDPOINT or AZURE_CV_KEY");
  }

  const analyzeUrl = `${cvEndpoint.replace(/\/$/, "")}/vision/v3.2/analyze?visualFeatures=Tags,Description`;

  // Node's fetch expects a body type compatible with BodyInit; convert Buffer to ArrayBuffer
  const temp = imageBuffer.buffer.slice(imageBuffer.byteOffset, imageBuffer.byteOffset + imageBuffer.byteLength) as ArrayBuffer;
  const body = temp.slice(0) as ArrayBuffer;

  const res = await fetch(analyzeUrl, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": cvKey,
      "Content-Type": "application/octet-stream",
    },
    body,
  });

  if (!res.ok) {
    const body = (await res.text().catch(() => "")).trim() || res.statusText;
    const err = new Error(body);
    (err as any).status = res.status;
    throw err;
  }

  const data = await res.json();

  const allPredictions: Prediction[] = Array.isArray(data.tags)
    ? data.tags.map((t: any) => ({
        tagName: t.name,
        probability: ((t.confidence ?? 0) * 100).toFixed(2) + "%",
        probabilityRaw: t.confidence ?? 0,
      }))
    : [];

  allPredictions.sort((a, b) => b.probabilityRaw - a.probabilityRaw);

  return {
    topPrediction: allPredictions[0] || null,
    allPredictions,
    captions: data.description?.captions || [],
    raw: data,
  };
}
