import type { Readable } from "node:stream";
import { getElevenLabsClient } from "./client";

export type CreateVoiceCloneInput = {
  name: string;
  files: (File | Blob | Readable)[];
  description?: string;
  labels?: Record<string, string>;
  removeBackgroundNoise?: boolean;
};

export type CreateVoiceCloneResult = {
  voiceId: string;
  requiresVerification: boolean;
};

export async function createVoiceClone(
  input: CreateVoiceCloneInput,
): Promise<CreateVoiceCloneResult> {
  const client = getElevenLabsClient();

  const response = await client.voices.ivc.create({
    name: input.name,
    files: input.files,
    description: input.description,
    labels: input.labels,
    removeBackgroundNoise: input.removeBackgroundNoise,
  });

  return {
    voiceId: response.voiceId,
    requiresVerification: response.requiresVerification,
  };
}
