// Standalone isolation test for the ElevenLabs text-to-speech module.
// Usage: npx tsx --env-file=.env.local scripts/test-text-to-speech.ts <voiceId> [output-path]
import { writeFile } from "node:fs/promises";
import { generateSpeech } from "../lib/elevenlabs/text-to-speech";

async function main() {
  const [voiceId, outputPath = "./voice-sample.mp3"] = process.argv.slice(2);

  if (!voiceId) {
    console.error(
      "Usage: npx tsx scripts/test-text-to-speech.ts <voiceId> [output-path]",
    );
    process.exit(1);
  }

  const text =
    "Hey there! This is a test of the podcast ad marketplace voice clone. If you can hear this clearly, the pipeline is working.";

  console.log(`Generating speech with voice ${voiceId}...`);
  const audio = await generateSpeech({ voiceId, text });

  await writeFile(outputPath, audio);
  console.log(`Saved ${audio.length} bytes to ${outputPath}`);
}

main().catch((error) => {
  console.error("Text-to-speech generation failed:");
  console.error(error);
  process.exit(1);
});
