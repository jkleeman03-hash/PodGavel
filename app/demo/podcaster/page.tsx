import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";
import { VerifiedBadge } from "@/components/verified-badge";
import { formatCents, formatCpm, formatDate } from "@/lib/format";

const podcast = {
  showName: "The Weekly Debrief",
  hosts: ["Maria Chen", "Jordan Ellis"],
  category: "Business",
  avgViewers: 42000,
  viewersVerified: true,
  avgCpmCents: 3200,
};

const closedFills = [
  {
    id: "1",
    episodeTitle: "Episode 115: Q2 Earnings Roundup",
    airDate: "2026-07-15T10:00:00.000Z",
    advertiser: "Nimbus Coffee Co.",
    lengthSeconds: 60,
    priceCents: 48000,
    status: "filled",
  },
  {
    id: "2",
    episodeTitle: "Episode 116: The Four-Day Week",
    airDate: "2026-07-22T10:00:00.000Z",
    advertiser: "Fernway Finance",
    lengthSeconds: 30,
    priceCents: 26000,
    status: "filled",
  },
  {
    id: "3",
    episodeTitle: "Episode 117: Hiring in a Slow Market",
    airDate: "2026-07-29T10:00:00.000Z",
    advertiser: "Brightloop CRM",
    lengthSeconds: 60,
    priceCents: 51000,
    status: "filled",
  },
];

const openSlots = [
  {
    id: "1",
    episodeTitle: "Episode 118: The Return of the Office",
    airDate: "2026-08-12T10:00:00.000Z",
    lengthSeconds: 60,
    priceCents: 45000,
    status: "open",
  },
  {
    id: "2",
    episodeTitle: "Episode 119: AI and the Newsroom",
    airDate: "2026-08-19T10:00:00.000Z",
    lengthSeconds: 30,
    priceCents: 25000,
    status: "open",
  },
  {
    id: "3",
    episodeTitle: "Episode 120: Venture in a Downturn",
    airDate: "2026-08-26T10:00:00.000Z",
    lengthSeconds: 60,
    priceCents: 50000,
    status: "reserved",
  },
];

export default function DemoPodcasterPage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-6">
        <Link href="/" className="text-lg font-semibold">
          PodGavel
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/demo/advertiser" className="underline">
            View advertiser sample
          </Link>
          <Link
            href="/signup?role=podcaster"
            className="rounded bg-black px-3 py-2 text-white"
          >
            Sign up
          </Link>
        </nav>
      </header>

      <div className="mx-auto w-full max-w-3xl px-4">
        <div className="mb-8 rounded border border-dashed px-4 py-3 text-sm text-gray-600">
          This is a sample profile so you can see what PodGavel looks like
          for podcasters.{" "}
          <Link href="/signup?role=podcaster" className="underline">
            Sign up
          </Link>{" "}
          to set up your own.
        </div>

        <div className="mb-8">
          <h1 className="flex items-center gap-2 text-2xl font-semibold">
            {podcast.showName}
            {podcast.viewersVerified && <VerifiedBadge />}
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            {podcast.category} · Hosted by {podcast.hosts.join(" & ")}
          </p>
        </div>

        <section className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded border px-4 py-3">
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-600">Average viewers</p>
              {podcast.viewersVerified && <VerifiedBadge />}
            </div>
            <p className="mt-1 text-2xl font-semibold">
              {podcast.avgViewers.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">per episode</p>
          </div>
          <div className="rounded border px-4 py-3">
            <p className="text-sm text-gray-600">Average ad-slot CPM</p>
            <p className="mt-1 text-2xl font-semibold">
              {formatCpm(podcast.avgCpmCents)}
            </p>
            <p className="text-xs text-gray-500">across filled slots</p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-lg font-semibold">
            Past closed ad-slot fills
          </h2>
          <ul className="flex flex-col gap-3">
            {closedFills.map((fill) => (
              <li
                key={fill.id}
                className="flex items-center justify-between rounded border px-4 py-3"
              >
                <div>
                  <p className="font-medium">
                    {fill.episodeTitle} — {fill.advertiser}
                  </p>
                  <p className="text-sm text-gray-600">
                    Aired {formatDate(fill.airDate)} · {fill.lengthSeconds}s ·{" "}
                    {formatCents(fill.priceCents)}
                  </p>
                </div>
                <StatusBadge status={fill.status} />
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-16">
          <h2 className="mb-3 text-lg font-semibold">Open ad slots</h2>
          <ul className="flex flex-col gap-3">
            {openSlots.map((slot) => (
              <li
                key={slot.id}
                className="flex items-center justify-between rounded border px-4 py-3"
              >
                <div>
                  <p className="font-medium">{slot.episodeTitle}</p>
                  <p className="text-sm text-gray-600">
                    Airs {formatDate(slot.airDate)} · {slot.lengthSeconds}s ·{" "}
                    {formatCents(slot.priceCents)}
                  </p>
                </div>
                <StatusBadge status={slot.status} />
              </li>
            ))}
          </ul>
        </section>
      </div>

      <footer className="border-t px-4 py-8 text-center text-sm text-gray-500">
        PodGavel
      </footer>
    </div>
  );
}
