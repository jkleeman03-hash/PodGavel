import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/status-badge";
import { formatCents, formatDate } from "@/lib/format";

export default async function PodcasterSlotsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: slots } = await supabase
    .from("ad_slots")
    .select("id, episode_title, air_date, slot_length_seconds, price_cents, status")
    .eq("podcaster_id", user!.id)
    .order("air_date", { ascending: true });

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your ad slots</h1>
        <Link
          href="/podcaster/slots/new"
          className="rounded bg-black px-3 py-2 text-sm text-white"
        >
          Create slot
        </Link>
      </div>

      {!slots || slots.length === 0 ? (
        <p className="text-sm text-gray-600">
          No slots yet.{" "}
          <Link href="/podcaster/slots/new" className="underline">
            Create your first slot
          </Link>{" "}
          to start taking submissions.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {slots.map((slot) => (
            <li key={slot.id}>
              <Link
                href={`/podcaster/slots/${slot.id}`}
                className="flex items-center justify-between rounded border px-4 py-3 hover:bg-gray-50"
              >
                <div>
                  <p className="font-medium">
                    {slot.episode_title || "Untitled episode"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Airs {formatDate(slot.air_date)} · {slot.slot_length_seconds}
                    s · {formatCents(slot.price_cents)}
                  </p>
                </div>
                <StatusBadge status={slot.status} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
