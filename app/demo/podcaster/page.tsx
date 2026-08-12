import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";
import { VerifiedBadge } from "@/components/verified-badge";
import { formatCents, formatDate } from "@/lib/format";

const podcast = {
  showName: "The Weekly Debrief",
  category: "Business",
  avgDownloads: 42000,
  downloadsVerified: true,
};

const voiceLicense = {
  status: "Active",
  signedAt: "2026-05-12T00:00:00.000Z",
};

const episodes = [
  { title: "Episode 118: The Return of the Office", airDate: "2026-08-12T10:00:00.000Z" },
  { title: "Episode 119: AI and the Newsroom", airDate: "2026-08-19T10:00:00.000Z" },
  { title: "Episode 120: Venture in a Downturn", airDate: "2026-08-26T10:00:00.000Z" },
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

        <div className="mb-10">
          <h1 className="flex items-center gap-2 text-2xl font-semibold">
            {podcast.showName}
            {podcast.downloadsVerified && <VerifiedBadge />}
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            {podcast.category} · {podcast.avgDownloads.toLocaleString()} avg.
            downloads per episode
          </p>
        </div>

        <section className="mb-10">
          <h2 className="mb-3 text-lg font-semibold">
            Voice cloning licensing agreement
          </h2>
          <div className="flex items-center justify-between rounded border px-4 py-3">
            <p className="text-sm text-gray-700">
              Your cloned voice is licensed only for ad reads you personally
              approve, and access can be revoked at any time.
            </p>
            <span className="ml-4 shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
              {voiceLicense.status}
            </span>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Signed {formatDate(voiceLicense.signedAt)}
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-lg font-semibold">Upcoming episode air dates</h2>
          <ul className="flex flex-col gap-2">
            {episodes.map((episode) => (
              <li
                key={episode.title}
                className="flex items-center justify-between rounded border px-4 py-3 text-sm"
              >
                <span>{episode.title}</span>
                <span className="text-gray-600">{formatDate(episode.airDate)}</span>
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
