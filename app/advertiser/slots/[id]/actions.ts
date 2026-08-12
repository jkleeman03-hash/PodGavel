"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type SubmitAdState = { error: string } | null;

export async function submitAd(
  slotId: string,
  _prevState: SubmitAdState,
  formData: FormData,
): Promise<SubmitAdState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not signed in." };
  }

  const scriptText = formData.get("script_text") as string;
  const bidDollars = Number(formData.get("bid_dollars"));

  const { error } = await supabase.from("ad_submissions").insert({
    slot_id: slotId,
    advertiser_id: user.id,
    script_text: scriptText,
    bid_amount_cents: Math.round(bidDollars * 100),
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/advertiser/submissions");
}
