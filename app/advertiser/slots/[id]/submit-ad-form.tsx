"use client";

import { useActionState } from "react";
import { submitAd, type SubmitAdState } from "./actions";

const initialState: SubmitAdState = null;

export function SubmitAdForm({
  slotId,
  startingPriceDollars,
}: {
  slotId: string;
  startingPriceDollars: number;
}) {
  const submitAdForSlot = submitAd.bind(null, slotId);
  const [state, formAction, pending] = useActionState(
    submitAdForSlot,
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Ad script</span>
        <textarea
          name="script_text"
          required
          rows={6}
          className="rounded border px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Your bid (USD)</span>
        <input
          type="number"
          name="bid_dollars"
          required
          min={0}
          step="0.01"
          defaultValue={startingPriceDollars}
          className="rounded border px-3 py-2"
        />
        <span className="text-xs text-gray-500">
          You can bid above or below the starting price.
        </span>
      </label>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded bg-black px-3 py-2 text-white disabled:opacity-50"
      >
        {pending ? "Submitting…" : "Submit bid"}
      </button>
    </form>
  );
}
