"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function acceptSubmission(slotId: string, submissionId: string) {
  const supabase = await createClient();

  const { error } = await supabase.rpc("accept_submission", {
    target_submission_id: submissionId,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/podcaster/slots/${slotId}`);
}
