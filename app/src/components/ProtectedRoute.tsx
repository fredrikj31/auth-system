import { JSX } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../providers/auth";

interface ProtectedRouteProps {
  redirectPath: string;
  children: JSX.Element;
}

export const ProtectedRoute = ({ redirectPath, children }: ProtectedRouteProps) => {
  const auth = useAuth();

  if (!auth.isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? children : <Outlet />;
};
