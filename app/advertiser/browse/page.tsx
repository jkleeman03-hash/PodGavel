import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatCents, formatDate } from "@/lib/format";
import { VerifiedBadge } from "@/components/verified-badge";

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    airDateFrom?: string;
    airDateTo?: string;
  }>;
}) {
  const { category, minPrice, maxPrice, airDateFrom, airDateTo } =
    await searchParams;

  const supabase = await createClient();

  let query = supabase
    .from("ad_slots")
    .select(
      "id, episode_title, air_date, slot_length_seconds, price_cents, podcaster_profiles!inner(show_name, category, avg_downloads, downloads_verification_status)",
    )
    .eq("status", "open")
    .order("air_date", { ascending: true });

  if (category) {
    query = query.ilike("podcaster_profiles.category", `%${category}%`);
  }
  if (minPrice) {
    query = query.gte("price_cents", Math.round(Number(minPrice) * 100));
  }
  if (maxPrice) {
    query = query.lte("price_cents", Math.round(Number(maxPrice) * 100));
  }
  if (airDateFrom) {
    query = query.gte("air_date", new Date(airDateFrom).toISOString());
  }
  if (airDateTo) {
    query = query.lte("air_date", new Date(airDateTo).toISOString());
  }

  const { data: slots } = await query;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-6 text-2xl font-semibold">Browse open slots</h1>

      <form
        method="GET"
        className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-5 sm:items-end"
      >
        <label className="flex flex-col gap-1 text-sm">
          Category
          <input
            type="text"
            name="category"
            defaultValue={category}
            className="rounded border px-2 py-1"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Min price (USD)
          <input
            type="number"
            name="minPrice"
            defaultValue={minPrice}
            min={0}
            step="0.01"
            className="rounded border px-2 py-1"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Max price (USD)
          <input
            type="number"
            name="maxPrice"
            defaultValue={maxPrice}
            min={0}
            step="0.01"
            className="rounded border px-2 py-1"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Air date from
          <input
            type="date"
            name="airDateFrom"
            defaultValue={airDateFrom}
            className="rounded border px-2 py-1"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Air date to
          <input
            type="date"
            name="airDateTo"
            defaultValue={airDateTo}
            className="rounded border px-2 py-1"
          />
        </label>
        <button
          type="submit"
          className="rounded bg-black px-3 py-2 text-sm text-white sm:col-span-5 sm:w-fit"
        >
          Filter
        </button>
      </form>

      {!slots || slots.length === 0 ? (
        <p className="text-sm text-gray-600">
          No open slots match your filters.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {slots.map((slot) => (
            <li key={slot.id}>
              <Link
                href={`/advertiser/slots/${slot.id}`}
                className="flex items-center justify-between rounded border px-4 py-3 hover:bg-gray-50"
              >
                <div>
                  <p className="flex items-center gap-2 font-medium">
                    {slot.podcaster_profiles?.show_name} —{" "}
                    {slot.episode_title || "Untitled episode"}
                    {slot.podcaster_profiles?.downloads_verification_status ===
                      "verified" && <VerifiedBadge />}
                  </p>
                  <p className="text-sm text-gray-600">
                    {slot.podcaster_profiles?.category && (
                      <>{slot.podcaster_profiles.category} · </>
                    )}
                    {slot.podcaster_profiles?.avg_downloads != null && (
                      <>
                        {slot.podcaster_profiles.avg_downloads.toLocaleString()}{" "}
                        avg downloads/ep ·{" "}
                      </>
                    )}
                    Airs {formatDate(slot.air_date)} · {slot.slot_length_seconds}
                    s
                  </p>
                </div>
                <span className="font-medium">
                  {formatCents(slot.price_cents)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
