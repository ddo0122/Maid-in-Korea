import { Navigate, Outlet, useLocation } from "react-router";
import { getAuthToken, getTokenPayload } from "../api/authApi";

export function ProtectedRoute() {
  const location = useLocation();
  const accessToken = getAuthToken();
  const userRole = getTokenPayload()?.role;
  const isMaidRoute = location.pathname.startsWith("/maid");
  const canAccessMaidRoute = userRole === "ROLE_MAID" || userRole === "MAID";

  if (!accessToken) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (isMaidRoute && !canAccessMaidRoute) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
