import axios from "axios";

const predictionEndpoint = process.env.AZURE_CV_PREDICTION_ENDPOINT!;
const predictionKey = process.env.AZURE_CV_PREDICTION_KEY!;
const projectId = process.env.AZURE_CV_PROJECT_ID!;
const publishName = process.env.AZURE_CV_PUBLISH_NAME!;

interface Prediction {
  tagName: string;
  probability: string;
  probabilityRaw: number;
}

/**
 * Classify an infrastructure photo (jalan rusak/baik, gedung selesai/mangkrak).
 *
 * @param {Buffer} imageBuffer - Image file buffer
 * @returns {Object} Classification predictions
 */
export async function classifyInfrastructureImage(imageBuffer: Buffer) {
  const url = `${predictionEndpoint}/customvision/v3.0/Prediction/${projectId}/classify/iterations/${publishName}/image`;

  const response = await axios.post(url, imageBuffer, {
    headers: {
      "Prediction-Key": predictionKey,
      "Content-Type": "application/octet-stream",
    },
  });

  const predictions: Prediction[] = response.data.predictions.map(
    (p: { tagName: string; probability: number }) => ({
      tagName: p.tagName,
      probability: (p.probability * 100).toFixed(2) + "%",
      probabilityRaw: p.probability,
    }),
  );

  // Sort by highest probability
  predictions.sort((a, b) => b.probabilityRaw - a.probabilityRaw);

  return {
    topPrediction: predictions[0],
    allPredictions: predictions,
  };
}
