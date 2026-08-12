import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";
import { formatCents, formatDate } from "@/lib/format";

const advertiser = {
  companyName: "Nimbus Coffee Co.",
};

const preloadedReads = [
  {
    name: "Fall Launch — 30s",
    lengthSeconds: 30,
    script:
      "Nothing beats a warm cup of Nimbus on a crisp fall morning. Order today and get 20% off your first bag.",
  },
  {
    name: "Subscription Push — 60s",
    lengthSeconds: 60,
    script:
      "Skip the line, not the coffee. Nimbus delivers freshly roasted beans to your door every two weeks, so you never run out.",
  },
];

const pastReads = [
  {
    id: "1",
    showName: "The Weekly Debrief",
    episodeTitle: "Episode 104: Q2 Wrap-up",
    airDate: "2026-05-20T10:00:00.000Z",
    costCents: 40000,
    status: "delivered",
  },
  {
    id: "2",
    showName: "Founders Hour",
    episodeTitle: "Episode 61: Bootstrapping to $1M",
    airDate: "2026-06-17T10:00:00.000Z",
    costCents: 32000,
    status: "delivered",
  },
];

const suggestedSlots = [
  {
    id: "1",
    showName: "Founders Hour",
    category: "Business",
    episodeTitle: "Episode 62: Raising a Seed Round",
    airDate: "2026-08-14T10:00:00.000Z",
    priceCents: 35000,
  },
  {
    id: "2",
    showName: "Daily Health Byte",
    category: "Health",
    episodeTitle: "Episode 210: Sleep Science",
    airDate: "2026-08-16T10:00:00.000Z",
    priceCents: 20000,
  },
];

export default function DemoAdvertiserPage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-6">
        <Link href="/" className="text-lg font-semibold">
          PodGavel
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/demo/podcaster" className="underline">
            View podcaster sample
          </Link>
          <Link
            href="/signup?role=advertiser"
            className="rounded bg-black px-3 py-2 text-white"
          >
            Sign up
          </Link>
        </nav>
      </header>

      <div className="mx-auto w-full max-w-3xl px-4">
        <div className="mb-8 rounded border border-dashed px-4 py-3 text-sm text-gray-600">
          This is a sample profile so you can see what PodGavel looks like
          for advertisers.{" "}
          <Link href="/signup?role=advertiser" className="underline">
            Sign up
          </Link>{" "}
          to set up your own.
        </div>

        <div className="mb-10">
          <h1 className="text-2xl font-semibold">{advertiser.companyName}</h1>
        </div>

        <section className="mb-10">
          <h2 className="mb-3 text-lg font-semibold">
            Pre-loaded advertisement reads
          </h2>
          <ul className="flex flex-col gap-3">
            {preloadedReads.map((read) => (
              <li key={read.name} className="rounded border px-4 py-3">
                <div className="mb-1 flex items-center justify-between">
                  <p className="font-medium">{read.name}</p>
                  <span className="text-sm text-gray-600">
                    {read.lengthSeconds}s
                  </span>
                </div>
                <p className="text-sm text-gray-700">{read.script}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-lg font-semibold">
            Past ad reads &amp; costs paid
          </h2>
          <ul className="flex flex-col gap-3">
            {pastReads.map((read) => (
              <li
                key={read.id}
                className="flex items-center justify-between rounded border px-4 py-3"
              >
                <div>
                  <p className="font-medium">
                    {read.showName} — {read.episodeTitle}
                  </p>
                  <p className="text-sm text-gray-600">
                    Aired {formatDate(read.airDate)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium">
                    {formatCents(read.costCents)}
                  </span>
                  <StatusBadge status={read.status} />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-16">
          <h2 className="mb-3 text-lg font-semibold">
            Suggested ad slots to bid on
          </h2>
          <ul className="flex flex-col gap-3">
            {suggestedSlots.map((slot) => (
              <li
                key={slot.id}
                className="flex items-center justify-between rounded border px-4 py-3"
              >
                <div>
                  <p className="font-medium">
                    {slot.showName} — {slot.episodeTitle}
                  </p>
                  <p className="text-sm text-gray-600">
                    {slot.category} · Airs {formatDate(slot.airDate)}
                  </p>
                </div>
                <span className="font-medium">
                  {formatCents(slot.priceCents)}
                </span>
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
