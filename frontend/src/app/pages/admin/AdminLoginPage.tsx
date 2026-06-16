import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Shield } from "lucide-react";
import { adminLogin, saveAuthToken } from "../../api/authApi";

export function AdminLoginPage() {
  const navigate = useNavigate();
  const [adminId, setAdminId] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await adminLogin({
        loginId: adminId,
        password: adminPassword,
      });

      saveAuthToken(result.tokenType, result.accessToken, result.refreshToken);
      navigate("/admin/cafe-management?section=info", { replace: true });
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "관리자 로그인에 실패했습니다.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gray-900 rounded-full">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">관리자 로그인</CardTitle>
          <CardDescription>승인된 관리자만 접근 가능합니다</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-id">관리자 ID</Label>
              <Input
                id="admin-id"
                type="text"
                placeholder="개발자가 제공한 ID"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password">비밀번호</Label>
              <Input
                id="admin-password"
                type="password"
                placeholder="••••••••"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gray-900 hover:bg-gray-800"
              disabled={isSubmitting}
            >
              {isSubmitting ? "로그인 중" : "로그인"}
            </Button>
          </form>
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              <strong>신규 관리자 등록:</strong>
              <br />
              실제 영업중인 업장 확인 후 개발자의 직접 승인을 통해 계정이 생성됩니다.
            </p>
          </div>
          <div className="mt-4 text-center text-sm">
            <Link to="/" className="text-gray-600 hover:text-pink-600 transition">
              ← 일반 사용자 페이지로 돌아가기
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
