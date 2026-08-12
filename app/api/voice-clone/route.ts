import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createVoiceClone } from "@/lib/elevenlabs/voice-cloning";
import { extractElevenLabsErrorMessage } from "@/lib/elevenlabs/errors";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "podcaster") {
    return NextResponse.json(
      { error: "Only podcasters can clone a voice." },
      { status: 403 },
    );
  }

  const formData = await request.formData();
  const consent = formData.get("consent") === "true";
  const files = formData
    .getAll("files")
    .filter((entry): entry is File => entry instanceof File);

  if (!consent) {
    return NextResponse.json(
      { error: "Consent is required to clone a voice." },
      { status: 400 },
    );
  }

  if (files.length === 0) {
    return NextResponse.json(
      { error: "At least one audio sample is required." },
      { status: 400 },
    );
  }

  const { data: podcasterProfile } = await supabase
    .from("podcaster_profiles")
    .select("show_name")
    .eq("id", user.id)
    .single();

  try {
    const clone = await createVoiceClone({
      name: `${podcasterProfile?.show_name ?? "Podcaster"} — ${new Date().toISOString()}`,
      files,
    });

    const { data: voiceProfile, error } = await supabase
      .from("voice_profiles")
      .insert({
        podcaster_id: user.id,
        elevenlabs_voice_id: clone.voiceId,
        status: clone.requiresVerification ? "pending" : "active",
        consent_signed_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (error || !voiceProfile) {
      return NextResponse.json(
        { error: error?.message ?? "Unable to save voice profile." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      voiceId: clone.voiceId,
      requiresVerification: clone.requiresVerification,
      voiceProfileId: voiceProfile.id,
    });
  } catch (error) {
    return NextResponse.json(
      { error: extractElevenLabsErrorMessage(error) },
      { status: 502 },
    );
  }
}
