import { Outlet, Link, useLocation } from "react-router";
import { LayoutDashboard, Store, LogOut } from "lucide-react";
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
              <Link to="/admin/dashboard">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white hover:bg-gray-800"
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  대시보드
                </Button>
              </Link>
              <Link to="/admin/cafe-management">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white hover:bg-gray-800"
                >
                  <Store className="w-4 h-4 mr-2" />
                  카페 관리
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
