"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { TablesUpdate } from "@/lib/database.types";

export type OnboardingState = { error: string } | { success: true } | null;

const MAX_SCREENSHOT_BYTES = 8 * 1024 * 1024;
const SCREENSHOT_EXTENSIONS: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};

export async function updateOnboarding(
  _prevState: OnboardingState,
  formData: FormData,
): Promise<OnboardingState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not signed in." };
  }

  const showName = formData.get("show_name") as string;
  const rssFeedUrl = (formData.get("rss_feed_url") as string) || null;
  const category = (formData.get("category") as string) || null;
  const blockedRaw = formData.get("ad_categories_blocked") as string;
  const adCategoriesBlocked = blockedRaw
    ? blockedRaw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const avgDownloadsRaw = formData.get("avg_downloads") as string;
  const avgDownloads = avgDownloadsRaw ? parseInt(avgDownloadsRaw, 10) : null;
  if (avgDownloadsRaw && (Number.isNaN(avgDownloads) || avgDownloads! < 0)) {
    return { error: "Average downloads must be a non-negative number." };
  }

  const update: TablesUpdate<"podcaster_profiles"> = {
    show_name: showName,
    rss_feed_url: rssFeedUrl,
    category,
    ad_categories_blocked: adCategoriesBlocked,
    avg_downloads: avgDownloads,
  };

  const screenshot = formData.get("downloads_screenshot") as File | null;
  if (screenshot && screenshot.size > 0) {
    const ext = SCREENSHOT_EXTENSIONS[screenshot.type];
    if (!ext) {
      return { error: "Screenshot must be a PNG, JPEG, or WebP image." };
    }
    if (screenshot.size > MAX_SCREENSHOT_BYTES) {
      return { error: "Screenshot must be smaller than 8MB." };
    }

    const path = `${user.id}/screenshot.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("download-verification")
      .upload(path, screenshot, { upsert: true, contentType: screenshot.type });

    if (uploadError) {
      return { error: uploadError.message };
    }

    update.downloads_screenshot_path = path;
    update.downloads_verification_status = "pending";
  } else {
    // No new screenshot: if the claimed number changed since the last
    // verification, the badge no longer vouches for it, so drop back to
    // pending rather than silently keeping "Verified" on a new number.
    const { data: current } = await supabase
      .from("podcaster_profiles")
      .select("downloads_verification_status, downloads_verified_value")
      .eq("id", user.id)
      .single();

    if (
      current?.downloads_verification_status === "verified" &&
      current.downloads_verified_value !== avgDownloads
    ) {
      update.downloads_verification_status = "pending";
    }
  }

  const { error } = await supabase
    .from("podcaster_profiles")
    .update(update)
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/podcaster/onboarding");
  return { success: true };
}
