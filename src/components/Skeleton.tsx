import { HTMLAttributes } from "react";
import { cn } from "../utils/cn";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-surface-700/40 shadow-inner",
        className,
      )}
      {...props}
    />
  );
}
