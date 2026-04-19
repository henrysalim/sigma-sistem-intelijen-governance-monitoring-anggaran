import { TextAnalysisClient } from "@azure/ai-language-text";
import { AzureKeyCredential } from "@azure/core-auth";

const endpoint = process.env.AZURE_LANGUAGE_ENDPOINT;
const key = process.env.AZURE_LANGUAGE_KEY;
let client: TextAnalysisClient | null = null;

function getClient() {
  if (!endpoint || !key) {
    throw new Error(
      "AZURE_LANGUAGE_ENDPOINT or AZURE_LANGUAGE_KEY is missing from environment variables.",
    );
  }
  if (!client) {
    client = new TextAnalysisClient(endpoint, new AzureKeyCredential(key));
  }
  return client;
}

/**
 * Extract key phrases from text (e.g., extracted APBD data).
 */
export async function extractKeyPhrases(texts: string[]) {
  const results = await getClient().analyze("KeyPhraseExtraction", texts);
  return results.map((doc) => ({
    id: doc.id,
    keyPhrases: doc.error ? [] : doc.keyPhrases,
    error: doc.error ?? null,
  }));
}

/**
 * Perform Named Entity Recognition on text.
 * Useful for detecting organization names, amounts, dates, locations, etc.
 */
export async function recognizeEntities(texts: string[]) {
  const results = await getClient().analyze("EntityRecognition", texts);
  return results.map((doc) => ({
    id: doc.id,
    entities: doc.error
      ? []
      : doc.entities.map((e) => ({
          text: e.text,
          category: e.category,
          subCategory: e.subCategory,
          confidenceScore: e.confidenceScore,
        })),
    error: doc.error ?? null,
  }));
}

/**
 * Analyze sentiment of texts (useful for whistleblower reports).
 */
export async function analyzeSentiment(texts: string[]) {
  const results = await getClient().analyze("SentimentAnalysis", texts);
  return results.map((doc) => ({
    id: doc.id,
    sentiment: doc.error ? null : doc.sentiment,
    confidenceScores: doc.error ? null : doc.confidenceScores,
    error: doc.error ?? null,
  }));
}

/**
 * Detect language of input text.
 */
export async function detectLanguage(texts: string[]) {
  const results = await getClient().analyze("LanguageDetection", texts);
  return results.map((doc) => ({
    id: doc.id,
    language: doc.error ? null : doc.primaryLanguage,
    error: doc.error ?? null,
  }));
}
