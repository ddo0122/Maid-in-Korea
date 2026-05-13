import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Home } from "lucide-react";

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-pink-600 mb-4">404</h1>
        <h2 className="text-3xl font-bold mb-4">페이지를 찾을 수 없습니다</h2>
        <p className="text-gray-600 mb-8">
          요청하신 페이지가 존재하지 않거나 삭제되었습니다.
        </p>
        <Link to="/">
          <Button size="lg">
            <Home className="w-5 h-5 mr-2" />
            홈으로 돌아가기
          </Button>
        </Link>
      </div>
    </div>
  );
}
