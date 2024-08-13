import { JSX } from "react";
import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  accessToken: string | undefined;
  redirectPath: string;
  children: JSX.Element;
}

export const ProtectedRoute = ({ accessToken, redirectPath, children }: ProtectedRouteProps) => {
  if (!accessToken) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? children : <Outlet />;
};
