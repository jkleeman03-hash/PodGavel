"use client";

import { useActionState, useState } from "react";
import { signup, type SignupState } from "./actions";
import type { Role } from "@/lib/roles";

const initialState: SignupState = null;

type SignupRole = Extract<Role, "podcaster" | "advertiser">;

export function SignupForm({
  initialRole = "podcaster",
}: {
  initialRole?: SignupRole;
}) {
  const [state, formAction, pending] = useActionState(signup, initialState);
  const [role, setRole] = useState<SignupRole>(initialRole);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 text-sm font-medium">I am a…</legend>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="role"
              value="podcaster"
              checked={role === "podcaster"}
              onChange={() => setRole("podcaster")}
            />
            Podcaster
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="role"
              value="advertiser"
              checked={role === "advertiser"}
              onChange={() => setRole("advertiser")}
            />
            Advertiser
          </label>
        </div>
      </fieldset>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Display name</span>
        <input
          type="text"
          name="display_name"
          required
          className="rounded border px-3 py-2"
        />
      </label>

      {role === "podcaster" ? (
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Show name</span>
          <input
            type="text"
            name="show_name"
            required
            className="rounded border px-3 py-2"
          />
        </label>
      ) : (
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Company name</span>
          <input
            type="text"
            name="company_name"
            required
            className="rounded border px-3 py-2"
          />
        </label>
      )}

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Email</span>
        <input
          type="email"
          name="email"
          required
          className="rounded border px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Password</span>
        <input
          type="password"
          name="password"
          required
          minLength={6}
          className="rounded border px-3 py-2"
        />
      </label>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded bg-black px-3 py-2 text-white disabled:opacity-50"
      >
        {pending ? "Creating account…" : "Sign up"}
      </button>
    </form>
  );
}
