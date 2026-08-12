const STATUS_STYLES: Record<string, string> = {
  // ad_slots.status
  open: "bg-green-100 text-green-800",
  reserved: "bg-amber-100 text-amber-800",
  filled: "bg-blue-100 text-blue-800",
  expired: "bg-gray-100 text-gray-600",
  // ad_submissions.status
  submitted: "bg-blue-100 text-blue-800",
  generating: "bg-purple-100 text-purple-800",
  pending_approval: "bg-amber-100 text-amber-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  delivered: "bg-teal-100 text-teal-800",
  below_floor: "bg-orange-100 text-orange-800",
  // podcaster_profiles.downloads_verification_status
  unverified: "bg-gray-100 text-gray-600",
  pending: "bg-amber-100 text-amber-800",
  verified: "bg-green-100 text-green-800",
};

export function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? "bg-gray-100 text-gray-600";

  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium capitalize ${style}`}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}
