import { Box, type BoxProps } from "../ui/box";
import { cn } from "@/utils/cn.util";
import type { FC } from "react";

export const PageWrapper: FC<BoxProps> = ({ className, children }) => {
  return (
    <Box
      className={cn(
        "bg-gray-200/50 rounded-xl border-[7px] border-white p-3 min-h-screen",
        className
      )}
    >
      {children}
    </Box>
  );
};
