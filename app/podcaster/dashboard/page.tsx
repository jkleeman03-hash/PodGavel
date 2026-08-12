import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/status-badge";
import { logout } from "@/app/actions";

export default async function PodcasterDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user!.id)
    .single();

  const { data: podcasterProfile } = await supabase
    .from("podcaster_profiles")
    .select("show_name, downloads_verification_status")
    .eq("id", user!.id)
    .single();

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Podcaster Dashboard</h1>
        <form action={logout}>
          <button type="submit" className="text-sm underline">
            Log out
          </button>
        </form>
      </div>

      <p className="mb-4">
        Welcome, {profile?.display_name} — {podcasterProfile?.show_name}
      </p>

      <p className="mb-8 flex items-center gap-2 text-sm text-gray-600">
        Downloads verification:
        <StatusBadge
          status={podcasterProfile?.downloads_verification_status ?? "unverified"}
        />
      </p>

      <nav className="flex gap-4 text-sm">
        <Link href="/podcaster/onboarding" className="underline">
          Edit profile
        </Link>
        <Link href="/podcaster/slots" className="underline">
          Your ad slots
        </Link>
      </nav>
    </div>
  );
}
