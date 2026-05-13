import { Outlet, Link, useLocation } from "react-router";
import { Home, MapPin, Users, User, LogIn } from "lucide-react";
import { Button } from "../components/ui/button";

export function MainLayout() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="min-h-screen flex flex-col">
      {!isAuthPage && (
        <header className="border-b bg-white sticky top-0 z-50">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-pink-600">
              메이드카페
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="flex items-center gap-2 hover:text-pink-600 transition">
                <Home className="w-4 h-4" />
                <span>홈</span>
              </Link>
              <Link to="/community" className="flex items-center gap-2 hover:text-pink-600 transition">
                <Users className="w-4 h-4" />
                <span>커뮤니티</span>
              </Link>
              <Link to="/maid/profile" className="flex items-center gap-2 hover:text-pink-600 transition">
                <User className="w-4 h-4" />
                <span>메이드 프로필</span>
              </Link>
            </nav>
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  <LogIn className="w-4 h-4 mr-2" />
                  로그인
                </Button>
              </Link>
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
