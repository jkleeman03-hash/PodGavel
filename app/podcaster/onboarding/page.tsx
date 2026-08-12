import { createClient } from "@/lib/supabase/server";
import { OnboardingForm } from "./onboarding-form";

export default async function PodcasterOnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("podcaster_profiles")
    .select(
      "show_name, rss_feed_url, category, ad_categories_blocked, avg_downloads, downloads_verification_status, downloads_screenshot_path",
    )
    .eq("id", user!.id)
    .single();

  let screenshotPreviewUrl: string | null = null;
  if (profile?.downloads_screenshot_path) {
    const { data: signed } = await supabase.storage
      .from("download-verification")
      .createSignedUrl(profile.downloads_screenshot_path, 60 * 5);
    screenshotPreviewUrl = signed?.signedUrl ?? null;
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <h1 className="mb-6 text-2xl font-semibold">Podcaster profile</h1>
      <OnboardingForm initial={profile} screenshotPreviewUrl={screenshotPreviewUrl} />
    </div>
  );
}
