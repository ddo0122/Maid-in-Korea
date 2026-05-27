import { useEffect, useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { Home, Users, User } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  getAuthToken,
  getMe,
  getTokenPayload,
  removeAuthToken,
} from "../api/authApi";

export function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";
  const isLoggedIn = Boolean(getAuthToken());
  const userRole = getTokenPayload()?.role;
  const canUseMaidProfile = userRole === "ROLE_MAID" || userRole === "MAID";

  useEffect(() => {
    if (isAuthPage || !isLoggedIn) {
      setUsername("");
      return;
    }

    getMe()
      .then((member) => setUsername(member.name))
      .catch(() => {
        removeAuthToken();
        navigate("/login", { replace: true });
      });
  }, [isAuthPage, isLoggedIn, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      {!isAuthPage && (
        <header className="border-b bg-white sticky top-0 z-50">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-pink-600">
              Maid in Korea
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/"
                className="flex items-center gap-2 hover:text-pink-600 transition"
              >
                <Home className="w-4 h-4" />
                <span>홈</span>
              </Link>
              <Link
                to="/community"
                className="flex items-center gap-2 hover:text-pink-600 transition"
              >
                <Users className="w-4 h-4" />
                <span>커뮤니티</span>
              </Link>
              {canUseMaidProfile && (
                <Link
                  to="/maid/profile"
                  className="flex items-center gap-2 hover:text-pink-600 transition"
                >
                  <User className="w-4 h-4" />
                  <span>메이드 프로필</span>
                </Link>
              )}
            </nav>
            <div className="flex items-center gap-2">
              {isLoggedIn && (
                <>
                  <span className="hidden text-sm text-gray-700 sm:inline">
                    어서오세요{" "}
                    <span className="font-semibold text-pink-600">
                      {username || "회원"}
                    </span>{" "}
                    님
                  </span>
                  <Link to="/mypage">
                    <Button variant="outline" size="sm">
                      <User className="w-4 h-4 mr-2" />
                      마이페이지
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </header>
      )}
      <main className="flex-1">
        <Outlet />
      </main>
      {!isAuthPage && (
        <footer className="border-t bg-gray-50 py-8">
          <div className="container mx-auto px-4 text-center text-sm text-gray-600">
            © 2026 메이드카페. All rights reserved.
          </div>
        </footer>
      )}
    </div>
  );
}
