import { ListSkeleton } from "@/components/list-skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-6 h-8 w-56 animate-pulse rounded bg-gray-200" />
      <div className="mb-8 h-24 animate-pulse rounded bg-gray-100" />
      <ListSkeleton />
    </div>
  );
}
