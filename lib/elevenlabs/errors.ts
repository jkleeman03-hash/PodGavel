import { ElevenLabsError } from "@elevenlabs/elevenlabs-js";

export function extractElevenLabsErrorMessage(error: unknown): string {
  if (error instanceof ElevenLabsError) {
    const body = error.body as { detail?: { message?: string } } | undefined;
    return body?.detail?.message ?? error.message;
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong.";
}
