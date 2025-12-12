import { useUser } from "@/providers/user.provider";
import { FC, ReactNode } from "react";

interface OnlineProps {
  fallback?: ReactNode;
  offline?: ReactNode | (() => ReactNode);
  children:
    | ((
        user: NonNullable<ReturnType<typeof useUser>["data"]>["user"]
      ) => ReactNode)
    | ReactNode;
}

/**
 * Online component renders its children if the user is online (authenticated).
 * The 'children' prop can be either:
 *   - a ReactNode, or
 *   - a function (render prop) that receives the user (always available) and returns a ReactNode.
 * The render prop is only called when the user is online.
 * If the user is offline, the 'offline' prop is rendered (can be a ReactNode or a function with no arguments).
 * While loading, the 'fallback' prop is shown.
 *
 * Example usage with render prop:
 *
 *   <Online>
 *     {user => <div>Hello, {user.name}!</div>}
 *   </Online>
 *
 * @example
 *   <Online>
 *     {(user) => <div>Hello, {user.name}!</div>}
 *   </Online>
 *
 * @param fallback - Element to display while loading user state (default: 'loading...')
 * @param children - ReactNode or function to render when user is online (user always available)
 * @param offline - ReactNode or function to render when user is offline
 */
export const Online: FC<OnlineProps> = ({
  fallback = "loading...",
  children,
  offline,
}) => {
  const { isLoading, data } = useUser();
  const user = data?.user;

  if (isLoading && !user) return <>{fallback}</>;
  else if (!isLoading && !user)
    return typeof offline === "function" ? offline() : offline;
  else
    return typeof children === "function" && user ? (
      <>{children(user)}</>
    ) : (
      <>{children as ReactNode}</>
    );
};
