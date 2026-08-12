// One-off generator for the public homepage voice-cloning demo.
// Clones a voice from the three founder sample files, generates an ad read
// from the provided copy, and writes everything to public/voice-demo/ as
// static assets (so the homepage never calls ElevenLabs live).
// Usage: npx tsx --env-file=.env.local scripts/generate-voice-demo.ts
import { createReadStream, copyFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { createVoiceClone } from "../lib/elevenlabs/voice-cloning";
import { generateSpeech } from "../lib/elevenlabs/text-to-speech";

const SAMPLE_PATHS = [
  "/Users/joeykleeman/Desktop/Founder Files 1.m4a",
  "/Users/joeykleeman/Desktop/Founder Files 2.m4a",
  "/Users/joeykleeman/Desktop/Founder Files 3.m4a",
];

const AD_COPY = `If you are anything like me, your morning routine is anything but routine. The only routine I have is that every morning is busy! Whether its taking care of the kids, getting a workout in, putting in extra hours on my side-hustle, I am always finding myself short on time before the day truly kicks off. The hectic mornings make eating breakfast unrealistic, which is fine, except I know I am lacking on my macros when I don't put nutrition in my body to begin the day. I've tried having a protein shake, my coffee and water, but I can't help but find myself needing to use the restroom before I can get through half of these beverages! But a couple weeks ago, I learned about a company called Good Morning BevCo. Good Morning BevCo makes functional beverages to support the crazy busy lifestyle us young professionals have. Not only are these beverages functional & nutritious, they are also DELICIOUS. Every morning, I have started my day out with one of their Fuld Coffees. I alternate between the cold brew & the vanilla lattee, and boy do I notice the difference. The combination of protein, caffeine and less than a gram of sugar allows me to start my day focused, avoiding a mid-morning crash, with sustained energy until lunchtime. Give our friends at Good Morning BevCo a shot and use the code "Founder" for an extra 25% off your first order. Everyday should start with a Good Morning!`;

const OUT_DIR = path.join(__dirname, "..", "public", "voice-demo");

async function main() {
  console.log("Cloning voice from:", SAMPLE_PATHS);

  const clone = await createVoiceClone({
    name: `Homepage Demo ${new Date().toISOString()}`,
    files: SAMPLE_PATHS.map((p) => createReadStream(p)),
  });

  console.log("Voice cloned:", clone);

  console.log("Generating ad read...");
  const audio = await generateSpeech({
    voiceId: clone.voiceId,
    text: AD_COPY,
  });

  writeFileSync(path.join(OUT_DIR, "ad-read.mp3"), audio);
  console.log(`Wrote ad-read.mp3 (${audio.length} bytes)`);

  SAMPLE_PATHS.forEach((samplePath, index) => {
    const dest = path.join(OUT_DIR, `sample-${index + 1}.m4a`);
    copyFileSync(samplePath, dest);
    console.log(`Copied sample ${index + 1} -> ${dest}`);
  });

  writeFileSync(
    path.join(OUT_DIR, "meta.json"),
    JSON.stringify({ voiceId: clone.voiceId, generatedAt: new Date().toISOString() }, null, 2),
  );

  console.log("Done.");
}

main().catch((error) => {
  console.error("Voice demo generation failed:");
  console.error(error);
  process.exit(1);
});
