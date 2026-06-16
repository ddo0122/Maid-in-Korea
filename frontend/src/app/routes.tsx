import { createBrowserRouter, Navigate } from "react-router";
import { MainLayout } from "./layouts/MainLayout";
import { AdminLayout } from "./layouts/AdminLayout";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { CafeDetailPage } from "./pages/CafeDetailPage";
import { CommunityPage } from "./pages/CommunityPage";
import { MaidProfilePage } from "./pages/MaidProfilePage";
import { MaidInvitationsPage } from "./pages/MaidInvitationsPage";
import { MaidFeedPage } from "./pages/MaidFeedPage";
import { MyPage } from "./pages/MyPage";
import { AdminLoginPage } from "./pages/admin/AdminLoginPage";
import { AdminCafeManagementPage } from "./pages/admin/AdminCafeManagementPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ProtectedRoute } from "./routes/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      { path: "login", Component: LoginPage },
      { path: "signup", Component: SignupPage },
      {
        Component: ProtectedRoute,
        children: [
          { index: true, Component: HomePage },
          { path: "cafe/:id", Component: CafeDetailPage },
          { path: "community", Component: CommunityPage },
          { path: "mypage", Component: MyPage },
          { path: "maid/profile", Component: MaidProfilePage },
          { path: "maid/invitations", Component: MaidInvitationsPage },
          { path: "maid/feed/:profileId", Component: MaidFeedPage },
        ],
      },
      { path: "*", Component: NotFoundPage },
    ],
  },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { index: true, Component: AdminLoginPage },
      {
        path: "dashboard",
        element: (
          <Navigate to="/admin/cafe-management?section=info" replace />
        ),
      },
      { path: "cafe-management", Component: AdminCafeManagementPage },
    ],
  },
  {
    path: "*",
    Component: NotFoundPage,
  },
]);
