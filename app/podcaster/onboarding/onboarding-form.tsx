"use client";

import { useActionState } from "react";
import { StatusBadge } from "@/components/status-badge";
import { updateOnboarding, type OnboardingState } from "./actions";

const initialState: OnboardingState = null;

type Initial = {
  show_name: string;
  rss_feed_url: string | null;
  category: string | null;
  ad_categories_blocked: string[] | null;
  avg_downloads: number | null;
  downloads_verification_status: string;
} | null;

export function OnboardingForm({
  initial,
  screenshotPreviewUrl,
}: {
  initial: Initial;
  screenshotPreviewUrl: string | null;
}) {
  const [state, formAction, pending] = useActionState(
    updateOnboarding,
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Show name</span>
        <input
          type="text"
          name="show_name"
          required
          defaultValue={initial?.show_name ?? ""}
          className="rounded border px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">RSS feed URL</span>
        <input
          type="url"
          name="rss_feed_url"
          defaultValue={initial?.rss_feed_url ?? ""}
          className="rounded border px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Average downloads per episode</span>
        <input
          type="number"
          name="avg_downloads"
          min={0}
          step={1}
          defaultValue={initial?.avg_downloads ?? ""}
          className="rounded border px-3 py-2"
        />
      </label>

      <div className="flex flex-col gap-2 rounded border px-3 py-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Downloads verification</span>
          <StatusBadge
            status={initial?.downloads_verification_status ?? "unverified"}
          />
        </div>
        <p className="text-xs text-gray-500">
          Upload a screenshot of your podcast host&apos;s analytics dashboard
          showing average downloads/episode. We manually review it and mark
          your profile Verified — advertisers see the badge, never the
          screenshot itself.
        </p>
        {screenshotPreviewUrl && (
          <a
            href={screenshotPreviewUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-blue-700 underline"
          >
            View current screenshot
          </a>
        )}
        <input
          type="file"
          name="downloads_screenshot"
          accept="image/png,image/jpeg,image/webp"
          className="text-sm"
        />
        <p className="text-xs text-gray-500">
          Uploading a new screenshot resets your status to Pending review.
        </p>
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Category</span>
        <input
          type="text"
          name="category"
          defaultValue={initial?.category ?? ""}
          placeholder="e.g. Technology"
          className="rounded border px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Blocked ad categories</span>
        <input
          type="text"
          name="ad_categories_blocked"
          defaultValue={initial?.ad_categories_blocked?.join(", ") ?? ""}
          placeholder="Comma-separated, e.g. Gambling, Alcohol"
          className="rounded border px-3 py-2"
        />
      </label>

      {state && "error" in state && (
        <p className="text-sm text-red-600">{state.error}</p>
      )}
      {state && "success" in state && (
        <p className="text-sm text-green-700">Saved.</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded bg-black px-3 py-2 text-white disabled:opacity-50"
      >
        {pending ? "Saving…" : "Save"}
      </button>
    </form>
  );
}
