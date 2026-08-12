import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/status-badge";
import { VerifiedBadge } from "@/components/verified-badge";
import { formatCents, formatDate } from "@/lib/format";
import { SubmitAdForm } from "./submit-ad-form";

export default async function AdvertiserSlotDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: slot } = await supabase
    .from("ad_slots")
    .select(
      "id, episode_title, air_date, slot_length_seconds, price_cents, status, deadline, podcaster_profiles(show_name, category, avg_downloads, downloads_verification_status)",
    )
    .eq("id", id)
    .single();

  if (!slot) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-2xl font-semibold">
          {slot.podcaster_profiles?.show_name} —{" "}
          {slot.episode_title || "Untitled episode"}
          {slot.podcaster_profiles?.downloads_verification_status ===
            "verified" && <VerifiedBadge />}
        </h1>
        <StatusBadge status={slot.status} />
      </div>

      <dl className="mb-10 grid grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="text-gray-500">Category</dt>
          <dd>{slot.podcaster_profiles?.category || "—"}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Avg downloads/episode</dt>
          <dd>
            {slot.podcaster_profiles?.avg_downloads != null
              ? slot.podcaster_profiles.avg_downloads.toLocaleString()
              : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-gray-500">Air date</dt>
          <dd>{formatDate(slot.air_date)}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Slot length</dt>
          <dd>{slot.slot_length_seconds}s</dd>
        </div>
        <div>
          <dt className="text-gray-500">Starting price</dt>
          <dd>{formatCents(slot.price_cents)}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Submission deadline</dt>
          <dd>{formatDate(slot.deadline)}</dd>
        </div>
      </dl>

      {slot.status === "open" ? (
        <SubmitAdForm
          slotId={slot.id}
          startingPriceDollars={slot.price_cents / 100}
        />
      ) : (
        <p className="text-sm text-gray-600">
          This slot is no longer accepting submissions.
        </p>
      )}
    </div>
  );
}
