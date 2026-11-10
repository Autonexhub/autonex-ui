import { Card } from '../ui/card';
import { Skeleton } from '../ui/skeleton';

export function BacklogPageSkeleton() {
  return (
    <div className="p-6 space-y-6">
      {/* Active sprint skeleton */}
      <Card className="p-4 space-y-4">
        <div className="flex justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-9 w-32" />
        </div>
        <Skeleton className="h-2 w-full" />
        <div className="grid grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ))}
        </div>
      </Card>

      {/* Backlog skeleton */}
      <Card className="p-4 space-y-3">
        <div className="flex justify-between">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-9 w-full" />
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </Card>
    </div>
  );
}
