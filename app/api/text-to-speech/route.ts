import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateSpeech } from "@/lib/elevenlabs/text-to-speech";
import { extractElevenLabsErrorMessage } from "@/lib/elevenlabs/errors";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const body = await request.json();
  const voiceId = typeof body.voiceId === "string" ? body.voiceId : null;
  const text = typeof body.text === "string" ? body.text : null;

  if (!voiceId || !text?.trim()) {
    return NextResponse.json(
      { error: "voiceId and text are required." },
      { status: 400 },
    );
  }

  // Only allow generating speech with a voice this podcaster actually owns.
  const { data: voiceProfile } = await supabase
    .from("voice_profiles")
    .select("id")
    .eq("elevenlabs_voice_id", voiceId)
    .eq("podcaster_id", user.id)
    .maybeSingle();

  if (!voiceProfile) {
    return NextResponse.json(
      { error: "Voice not found for this account." },
      { status: 403 },
    );
  }

  try {
    const audio = await generateSpeech({ voiceId, text });

    return new NextResponse(new Uint8Array(audio), {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": String(audio.length),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: extractElevenLabsErrorMessage(error) },
      { status: 502 },
    );
  }
}
