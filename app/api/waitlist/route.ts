import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { showOrCompanyName, email, role } = body as {
      showOrCompanyName?: string;
      email?: string;
      role?: string;
    };

    // Basic validation
    if (!showOrCompanyName || !email || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Enter a valid email address" },
        { status: 400 }
      );
    }

    if (role !== "podcaster" && role !== "advertiser") {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const supabase = await createClient();

    const { error } = await supabase.from("waitlist_signups").insert({
      show_or_company_name: showOrCompanyName.trim(),
      email: email.trim().toLowerCase(),
      role,
    });

    if (error) {
      console.error("Waitlist insert failed:", error);
      return NextResponse.json(
        { error: "Could not save your signup. Try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Waitlist route error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
