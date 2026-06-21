import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <Skeleton className="h-10 w-48 rounded-xl" />
      <Skeleton className="h-96 rounded-3xl" />
    </div>
  );
}
