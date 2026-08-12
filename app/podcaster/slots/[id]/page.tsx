import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/status-badge";
import { formatCents, formatDate } from "@/lib/format";
import { acceptSubmission } from "./actions";

export default async function PodcasterSlotDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: slot } = await supabase
    .from("ad_slots")
    .select(
      "id, episode_title, air_date, slot_length_seconds, price_cents, status, deadline, auto_accept_highest_bid",
    )
    .eq("id", id)
    .eq("podcaster_id", user!.id)
    .single();

  if (!slot) notFound();

  const [{ data: submissions }, { data: floor }] = await Promise.all([
    supabase
      .from("ad_submissions")
      .select(
        "id, script_text, bid_amount_cents, status, rejection_reason, created_at, advertiser_profiles(company_name)",
      )
      .eq("slot_id", slot.id)
      .order("bid_amount_cents", { ascending: false }),
    supabase
      .from("ad_slot_floors")
      .select("floor_price_cents")
      .eq("slot_id", slot.id)
      .maybeSingle(),
  ]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          {slot.episode_title || "Untitled episode"}
        </h1>
        <StatusBadge status={slot.status} />
      </div>

      <dl className="mb-10 grid grid-cols-2 gap-4 text-sm">
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
          <dt className="text-gray-500">Deadline</dt>
          <dd>{formatDate(slot.deadline)}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Floor price (hidden from advertisers)</dt>
          <dd>{floor ? formatCents(floor.floor_price_cents) : "Not set"}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Auto-accept at deadline</dt>
          <dd>{slot.auto_accept_highest_bid ? "On" : "Off"}</dd>
        </div>
      </dl>

      <h2 className="mb-4 text-lg font-semibold">Submissions</h2>

      {!submissions || submissions.length === 0 ? (
        <p className="text-sm text-gray-600">No submissions yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {submissions.map((submission) => (
            <li key={submission.id} className="rounded border px-4 py-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="font-medium">
                  {submission.advertiser_profiles?.company_name ??
                    "Unknown advertiser"}{" "}
                  <span className="font-normal text-gray-600">
                    bid {formatCents(submission.bid_amount_cents)}
                  </span>
                </p>
                <StatusBadge status={submission.status} />
              </div>
              <p className="text-sm text-gray-700">{submission.script_text}</p>
              {submission.rejection_reason && (
                <p className="mt-2 text-sm text-red-600">
                  Rejected: {submission.rejection_reason}
                </p>
              )}
              {slot.status === "open" &&
                (submission.status === "submitted" ||
                  submission.status === "pending_approval") && (
                  <form
                    action={acceptSubmission.bind(null, slot.id, submission.id)}
                    className="mt-3"
                  >
                    <button
                      type="submit"
                      className="rounded bg-black px-3 py-1.5 text-sm text-white"
                    >
                      Accept
                    </button>
                  </form>
                )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
