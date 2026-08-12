import { getElevenLabsClient } from "./client";

export type GenerateSpeechInput = {
  voiceId: string;
  text: string;
  modelId?: string;
  voiceSettings?: {
    stability?: number;
    similarityBoost?: number;
    style?: number;
    useSpeakerBoost?: boolean;
    speed?: number;
  };
};

// Lower stability + a bit of style exaggeration reads as more conversational
// and less flatly-narrated than the API's own defaults (stability ~0.5-1,
// style 0), at the cost of slightly more take-to-take variation.
const DEFAULT_VOICE_SETTINGS = {
  stability: 0.4,
  similarityBoost: 0.75,
  style: 0.35,
  useSpeakerBoost: true,
};

export async function generateSpeech(
  input: GenerateSpeechInput,
): Promise<Buffer> {
  const client = getElevenLabsClient();

  const stream = await client.textToSpeech.convert(input.voiceId, {
    text: input.text,
    modelId: input.modelId ?? "eleven_multilingual_v2",
    voiceSettings: { ...DEFAULT_VOICE_SETTINGS, ...input.voiceSettings },
  });

  return readableStreamToBuffer(stream);
}

async function readableStreamToBuffer(
  stream: ReadableStream<Uint8Array>,
): Promise<Buffer> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }

  return Buffer.concat(chunks);
}
