"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type NewSlotState = { error: string } | null;

export async function createSlot(
  _prevState: NewSlotState,
  formData: FormData,
): Promise<NewSlotState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not signed in." };
  }

  const episodeTitle = (formData.get("episode_title") as string) || null;
  const airDate = formData.get("air_date") as string;
  const slotLengthSeconds = Number(formData.get("slot_length_seconds"));
  const priceDollars = Number(formData.get("price_dollars"));
  const deadline = formData.get("deadline") as string;
  const floorDollarsRaw = formData.get("floor_dollars") as string;
  const floorDollars = floorDollarsRaw ? Number(floorDollarsRaw) : null;
  const autoAcceptHighestBid = formData.get("auto_accept_highest_bid") === "on";

  const { data: slot, error } = await supabase
    .from("ad_slots")
    .insert({
      podcaster_id: user.id,
      episode_title: episodeTitle,
      air_date: new Date(airDate).toISOString(),
      slot_length_seconds: slotLengthSeconds,
      price_cents: Math.round(priceDollars * 100),
      deadline: new Date(deadline).toISOString(),
      auto_accept_highest_bid: autoAcceptHighestBid,
    })
    .select("id")
    .single();

  if (error || !slot) {
    return { error: error?.message ?? "Unable to create slot." };
  }

  if (floorDollars !== null) {
    const { error: floorError } = await supabase.from("ad_slot_floors").insert({
      slot_id: slot.id,
      floor_price_cents: Math.round(floorDollars * 100),
    });

    if (floorError) {
      return { error: floorError.message };
    }
  }

  redirect(`/podcaster/slots/${slot.id}`);
}
