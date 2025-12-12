import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Flex, type FlexProps } from "../ui/flex";
import { cn } from "@/utils/cn.util";
import { Stack } from "../ui/stack";
import { forwardRef } from "react";

export interface UserProfileProps extends FlexProps {
  hideMetaInSmallScreens?: boolean;
  descriptionClassName?: string;
  avatarClassName?: string;
  labelClassName?: string;
  description?: string;
  label?: string;
  src?: string;
}

export const UserProfile = forwardRef<HTMLSpanElement, UserProfileProps>(
  (
    {
      hideMetaInSmallScreens = true,
      descriptionClassName,
      avatarClassName,
      labelClassName,
      description,
      label,
      src,
      ...props
    },
    ref
  ) => {
    return (
      <Flex {...props}>
        <Avatar ref={ref} className={avatarClassName}>
          <AvatarImage
            className="object-cover"
            src={src}
            alt={label || "Profile"}
            key={src} // Force re-render when src changes
          />
          <AvatarFallback className="uppercase">
            {label?.substring(0, 2)}
          </AvatarFallback>
        </Avatar>

        <Stack
          className={cn(
            "gap-0",
            hideMetaInSmallScreens && "max-[950px]:hidden"
          )}
        >
          <p className={cn("font-medium capitalize", labelClassName)}>
            {label}
          </p>
          <p className={cn("text-sm capitalize", descriptionClassName)}>
            {/* This Regex adds a space before capital letters */}
            {description?.replace(/([a-z])([A-Z])/g, "$1 $2")}
          </p>{" "}
        </Stack>
      </Flex>
    );
  }
);
