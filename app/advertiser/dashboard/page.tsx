import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/actions";

export default async function AdvertiserDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user!.id)
    .single();

  const { data: advertiserProfile } = await supabase
    .from("advertiser_profiles")
    .select("company_name")
    .eq("id", user!.id)
    .single();

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Advertiser Dashboard</h1>
        <form action={logout}>
          <button type="submit" className="text-sm underline">
            Log out
          </button>
        </form>
      </div>

      <p className="mb-8">
        Welcome, {profile?.display_name} — {advertiserProfile?.company_name}
      </p>

      <nav className="flex gap-4 text-sm">
        <Link href="/advertiser/browse" className="underline">
          Browse open slots
        </Link>
        <Link href="/advertiser/submissions" className="underline">
          Your submissions
        </Link>
      </nav>
    </div>
  );
}
