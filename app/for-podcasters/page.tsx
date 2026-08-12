import Link from "next/link";

export default function ForPodcastersPage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-6">
        <Link href="/" className="text-lg font-semibold">
          PodGavel
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/login" className="underline">
            Log in
          </Link>
          <Link
            href="/signup?role=podcaster"
            className="rounded bg-black px-3 py-2 text-white"
          >
            Sign up
          </Link>
        </nav>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
        <h1 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
          Tired of not filling all your ad slots?
        </h1>
        <p className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
          Spending too much time and money recording ads?
        </p>
        <p className="mt-6 max-w-xl text-lg text-gray-600">
          With PodGavel, you get your time back and you stop leaving revenue
          on the table.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/signup?role=podcaster"
            className="rounded bg-black px-5 py-3 text-sm font-medium text-white"
          >
            Sign up as a podcaster
          </Link>
          <Link
            href="/demo/podcaster"
            className="rounded border px-5 py-3 text-sm font-medium"
          >
            See a sample profile
          </Link>
        </div>
      </main>

      <footer className="border-t px-4 py-8 text-center text-sm text-gray-500">
        PodGavel
      </footer>
    </div>
  );
}
