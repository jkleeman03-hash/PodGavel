"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { dashboardPathForRole } from "@/lib/roles";

export type SignupState = { error: string } | null;

export async function signup(
  _prevState: SignupState,
  formData: FormData,
): Promise<SignupState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const displayName = formData.get("display_name") as string;
  const role = formData.get("role") as string;
  const showName = formData.get("show_name") as string;
  const companyName = formData.get("company_name") as string;

  if (role !== "podcaster" && role !== "advertiser") {
    return { error: "Select a role." };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role,
        display_name: displayName,
        ...(role === "podcaster"
          ? { show_name: showName }
          : { company_name: companyName }),
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (!data.session) {
    redirect("/login?confirm=1");
  }

  redirect(dashboardPathForRole(role));
}
