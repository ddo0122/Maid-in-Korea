import { Outlet, Link, useLocation } from "react-router";
import { CalendarDays, Info, LogOut, UserRound, Utensils } from "lucide-react";
import { Button } from "../components/ui/button";

export function AdminLayout() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/admin";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {!isLoginPage ? (
        <div className="flex h-screen">
          <aside className="w-64 bg-gray-900 text-white">
            <div className="p-6">
              <h1 className="text-2xl font-bold">관리자 페이지</h1>
            </div>
            <nav className="px-4 space-y-2">
              <Link to="/admin/cafe-management?section=info">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white hover:bg-gray-800"
                >
                  <Info className="w-4 h-4 mr-2" />
                  기본정보
                </Button>
              </Link>
              <Link to="/admin/cafe-management?section=schedule">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white hover:bg-gray-800"
                >
                  <CalendarDays className="w-4 h-4 mr-2" />
                  스케줄 관리
                </Button>
              </Link>
              <Link to="/admin/cafe-management?section=menu">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white hover:bg-gray-800"
                >
                  <Utensils className="w-4 h-4 mr-2" />
                  메뉴 관리
                </Button>
              </Link>
              <Link to="/admin/cafe-management?section=maid">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white hover:bg-gray-800"
                >
                  <UserRound className="w-4 h-4 mr-2" />
                  메이드 관리
                </Button>
              </Link>
            </nav>
            <div className="absolute bottom-4 left-4 right-4">
              <Link to="/admin">
                <Button variant="ghost" className="w-full justify-start text-white hover:bg-gray-800">
                  <LogOut className="w-4 h-4 mr-2" />
                  로그아웃
                </Button>
              </Link>
            </div>
          </aside>
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      ) : (
        <Outlet />
      )}
    </div>
  );
}
