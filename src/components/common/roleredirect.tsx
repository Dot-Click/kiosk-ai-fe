import { Navigate } from "react-router";
import { useUser } from "@/providers/user.provider";

interface RoleRedirectProps {
  allowedRoles: string[];
  redirectTo: string;
  children: React.ReactNode;
}

export const RoleRedirect: React.FC<RoleRedirectProps> = ({
  allowedRoles,
  redirectTo,
  children,
}) => {
  const { data } = useUser();
  const userRole = data?.user?.role;

  // If user role is not in allowed roles, redirect
  if (userRole && !allowedRoles.includes(userRole)) {
    return <Navigate to={redirectTo} replace />;
  }

  // If user role is allowed, render children
  return <>{children}</>;
};
