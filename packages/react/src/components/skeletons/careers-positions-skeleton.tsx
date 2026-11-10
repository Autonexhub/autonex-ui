import { Skeleton } from "../ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

interface CareersPositionsSkeletonProps {
  rows?: number;
}

/**
 * Skeleton for the Careers Positions table.
 * Matches the exact column layout: Title, Department, Status, Applications, Published, Actions
 */
export function CareersPositionsSkeleton({
  rows = 5,
}: CareersPositionsSkeletonProps) {
  return (
    <div className="rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <div className="flex items-center gap-1">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-3 w-3" />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-3" />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-1">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-3 w-3" />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-3" />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-3" />
              </div>
            </TableHead>
            <TableHead className="text-right w-[120px]">
              <Skeleton className="h-3 w-16 ml-auto" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, i) => (
            <TableRow key={i} className="animate-pulse">
              {/* Title */}
              <TableCell>
                <Skeleton
                  className="h-4"
                  style={{ width: `${50 + Math.random() * 40}%` }}
                />
              </TableCell>
              {/* Department */}
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>
              {/* Status badge */}
              <TableCell>
                <Skeleton className="h-5 w-16 rounded-full" />
              </TableCell>
              {/* Applications count */}
              <TableCell>
                <Skeleton className="h-4 w-6" />
              </TableCell>
              {/* Published date */}
              <TableCell>
                <Skeleton className="h-3 w-20" />
              </TableCell>
              {/* Action buttons */}
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Skeleton className="h-8 w-8 rounded-sm" />
                  <Skeleton className="h-8 w-8 rounded-sm" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
