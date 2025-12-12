import { FC, PropsWithChildren, ReactNode } from "react";
import { useUser } from "@/providers/user.provider";

interface OfflineProps extends PropsWithChildren {
  fallback?: ReactNode;
  online?:
    | ReactNode
    | ((
        user: NonNullable<ReturnType<typeof useUser>["data"]>["user"]
      ) => ReactNode);
}

/**
 * Offline component renders its children if the user is offline (not authenticated).
 * If the user is online (authenticated), it renders the 'online' prop, which can be either:
 *   - a ReactNode, or
 *   - a function that receives the user (always available) and returns a ReactNode.
 * The 'online' prop is only called when the user is online.
 * While loading, the 'fallback' prop is shown.
 *
 * @example
 *   <Offline online={<div>Welcome back!</div>}>
 *     <div>Please sign in.</div>
 *   </Offline>
 *
 * @example
 *   <Offline online={(user) => <div>Hello, {user.name}!</div>}>
 *     <div>Please sign in.</div>
 *   </Offline>
 *
 * @example
 *   <Offline online={(user) => <div>Hello, {user.name}!</div>}>
 *     <div>Please sign in.</div>
 *   </Offline>
 *
 * @param fallback - Element to display while loading user state (default: 'loading...')
 * @param children - Content to render when user is offline
 * @param online - ReactNode or function to render when user is online (user always available)
 */
export const Offline: FC<OfflineProps> = ({
  fallback = "loading...",
  children,
  online,
}) => {
  const { isLoading, data } = useUser();
  const user = data?.user;

  if (isLoading && !user) return <>{fallback}</>;
  else if (!isLoading && user)
    return typeof online === "function" ? online(user) : online;
  else return <>{children}</>;
};
