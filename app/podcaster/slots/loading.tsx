import { ListSkeleton } from "@/components/list-skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
        <div className="h-9 w-28 animate-pulse rounded bg-gray-200" />
      </div>
      <ListSkeleton />
    </div>
  );
}
