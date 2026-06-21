import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="space-y-4 p-4">
      {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-40 rounded-3xl" />)}
    </div>
  );
}
