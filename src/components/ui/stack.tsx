import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/utils/cn.util";

export type StackProps = ComponentPropsWithoutRef<"div">;

const Stack = forwardRef<HTMLDivElement, StackProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-2", className)}
        {...props}
      />
    );
  }
);

export { Stack };
