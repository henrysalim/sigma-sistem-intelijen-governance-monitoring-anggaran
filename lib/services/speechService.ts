import * as sdk from "microsoft-cognitiveservices-speech-sdk";

const speechKey = process.env.AZURE_SPEECH_KEY;
const speechRegion = process.env.AZURE_SPEECH_REGION;

/**
 * Convert text to speech audio (for narasi, accessibility).
 *
 * @param {string} text - Text to convert to speech
 * @param {string} lang - Language code (default: 'id-ID')
 * @returns {Promise<Buffer>} WAV audio buffer
 */
export function textToSpeech(text: string, lang = "id-ID"): Promise<Buffer> {
  if (!speechKey || !speechRegion) {
    throw new Error(
      "AZURE_SPEECH_KEY or AZURE_SPEECH_REGION is missing from environment variables.",
    );
  }
  return new Promise((resolve, reject) => {
    const speechConfig = sdk.SpeechConfig.fromSubscription(
      speechKey,
      speechRegion,
    );
    speechConfig.speechSynthesisLanguage = lang;

    // Use Indonesian voice
    speechConfig.speechSynthesisVoiceName = "id-ID-ArdiNeural";

    // Output to buffer instead of speaker
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig, null as unknown as sdk.AudioConfig);

    synthesizer.speakTextAsync(
      text,
      (result: sdk.SpeechSynthesisResult) => {
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          const audioBuffer = Buffer.from(result.audioData);
          resolve(audioBuffer);
        } else {
          reject(new Error(`Speech synthesis failed: ${result.errorDetails}`));
        }
        synthesizer.close();
      },
      (error: string) => {
        synthesizer.close();
        reject(new Error(error));
      },
    );
  });
}
