import { NewSlotForm } from "./new-slot-form";

export default function NewSlotPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <h1 className="mb-6 text-2xl font-semibold">Create ad slot</h1>
      <NewSlotForm />
    </div>
  );
}
