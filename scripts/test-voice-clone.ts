// Standalone isolation test for the ElevenLabs voice-cloning module.
// Usage: npx tsx --env-file=.env.local scripts/test-voice-clone.ts <audio-file-path> [more-file-paths...]
import { createReadStream } from "node:fs";
import { createVoiceClone } from "../lib/elevenlabs/voice-cloning";

async function main() {
  const filePaths = process.argv.slice(2);

  if (filePaths.length === 0) {
    console.error("Usage: npx tsx scripts/test-voice-clone.ts <audio-file-path> [more-file-paths...]");
    process.exit(1);
  }

  console.log("Creating voice clone from:", filePaths);

  const result = await createVoiceClone({
    name: `Test Clone ${new Date().toISOString()}`,
    files: filePaths.map((path) => createReadStream(path)),
  });

  console.log("Voice clone created:");
  console.log(result);
}

main().catch((error) => {
  console.error("Voice clone creation failed:");
  console.error(error);
  process.exit(1);
});
