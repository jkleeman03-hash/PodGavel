"use client";

import { useActionState } from "react";
import { createSlot, type NewSlotState } from "./actions";

const initialState: NewSlotState = null;

export function NewSlotForm() {
  const [state, formAction, pending] = useActionState(
    createSlot,
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Episode title</span>
        <input
          type="text"
          name="episode_title"
          className="rounded border px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Air date</span>
        <input
          type="datetime-local"
          name="air_date"
          required
          className="rounded border px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Slot length (seconds)</span>
        <input
          type="number"
          name="slot_length_seconds"
          required
          min={1}
          className="rounded border px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Starting price (USD)</span>
        <input
          type="number"
          name="price_dollars"
          required
          min={0}
          step="0.01"
          className="rounded border px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">
          Floor price (USD) <span className="font-normal text-gray-500">— optional, hidden from advertisers</span>
        </span>
        <input
          type="number"
          name="floor_dollars"
          min={0}
          step="0.01"
          className="rounded border px-3 py-2"
        />
        <span className="text-xs text-gray-500">
          Bids below this amount are automatically flagged and won&apos;t
          count as a valid submission.
        </span>
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Submission deadline</span>
        <input
          type="datetime-local"
          name="deadline"
          required
          className="rounded border px-3 py-2"
        />
      </label>

      <label className="flex items-center gap-2">
        <input type="checkbox" name="auto_accept_highest_bid" />
        <span className="text-sm font-medium">
          Auto-accept the highest bid when the deadline passes
        </span>
      </label>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded bg-black px-3 py-2 text-white disabled:opacity-50"
      >
        {pending ? "Creating…" : "Create slot"}
      </button>
    </form>
  );
}
