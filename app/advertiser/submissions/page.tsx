import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/status-badge";
import { formatCents, formatDate } from "@/lib/format";

export default async function AdvertiserSubmissionsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: submissions } = await supabase
    .from("ad_submissions")
    .select(
      "id, status, bid_amount_cents, rejection_reason, created_at, ad_slots(id, episode_title, air_date, podcaster_profiles(show_name))",
    )
    .eq("advertiser_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 text-2xl font-semibold">Your submissions</h1>

      {!submissions || submissions.length === 0 ? (
        <p className="text-sm text-gray-600">
          You haven&apos;t submitted to any slots yet.{" "}
          <Link href="/advertiser/browse" className="underline">
            Browse open slots
          </Link>
          .
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {submissions.map((submission) => (
            <li key={submission.id} className="rounded border px-4 py-3">
              <Link
                href={`/advertiser/slots/${submission.ad_slots?.id}`}
                className="flex items-center justify-between hover:underline"
              >
                <div>
                  <p className="font-medium">
                    {submission.ad_slots?.podcaster_profiles?.show_name} —{" "}
                    {submission.ad_slots?.episode_title || "Untitled episode"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Airs{" "}
                    {submission.ad_slots?.air_date
                      ? formatDate(submission.ad_slots.air_date)
                      : "—"}{" "}
                    · Bid {formatCents(submission.bid_amount_cents)}
                  </p>
                </div>
                <StatusBadge status={submission.status} />
              </Link>
              {submission.rejection_reason && (
                <p className="mt-2 text-sm text-red-600">
                  {submission.rejection_reason}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
