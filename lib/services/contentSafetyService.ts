import axios from "axios";

const endpoint = process.env.AZURE_CONTENT_SAFETY_ENDPOINT!;
const key = process.env.AZURE_CONTENT_SAFETY_KEY!;

/**
 * Analyze text content for safety violations (whistleblower portal).
 * Categories: Hate, SelfHarm, Sexual, Violence
 *
 * @param {string} text - Text to analyze
 * @returns {Object} Safety analysis result
 */
export async function analyzeTextSafety(text: string) {
  const url = `${endpoint}/contentsafety/text:analyze?api-version=2024-09-01`;

  const response = await axios.post(
    url,
    {
      text: text,
      categories: ["Hate", "SelfHarm", "Sexual", "Violence"],
      outputType: "FourSeverityLevels",
    },
    {
      headers: {
        "Ocp-Apim-Subscription-Key": key,
        "Content-Type": "application/json",
      },
    },
  );

  const categories: Array<{ category: string; severity: number }> =
    response.data.categoriesAnalysis;
  const isSafe = categories.every((c) => c.severity === 0);

  return {
    isSafe,
    categories: categories.map((c) => ({
      category: c.category,
      severity: c.severity, // 0=safe, 2=low, 4=medium, 6=high
    })),
    recommendation: isSafe
      ? "Konten aman untuk diproses"
      : "Konten mengandung materi sensitif — perlu review manual",
  };
}

/**
 * Analyze image content for safety violations.
 *
 * @param {Buffer} imageBuffer - Image buffer
 * @returns {Object} Safety analysis result
 */
export async function analyzeImageSafety(imageBuffer: Buffer) {
  const url = `${endpoint}/contentsafety/image:analyze?api-version=2024-09-01`;
  const base64Image = imageBuffer.toString("base64");

  const response = await axios.post(
    url,
    {
      image: { content: base64Image },
      categories: ["Hate", "SelfHarm", "Sexual", "Violence"],
    },
    {
      headers: {
        "Ocp-Apim-Subscription-Key": key,
        "Content-Type": "application/json",
      },
    },
  );

  const categories: Array<{ category: string; severity: number }> =
    response.data.categoriesAnalysis;
  const isSafe = categories.every((c) => c.severity === 0);

  return { isSafe, categories };
}
