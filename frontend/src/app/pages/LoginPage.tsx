import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

export function LoginPage() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [maidEmail, setMaidEmail] = useState("");
  const [maidPassword, setMaidPassword] = useState("");

  const handleUserLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/");
  };

  const handleMaidLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/maid/profile");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-pink-600">로그인</CardTitle>
          <CardDescription>메이드카페에 오신 것을 환영합니다</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="user" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="user">일반 회원</TabsTrigger>
              <TabsTrigger value="maid">메이드</TabsTrigger>
            </TabsList>
            <TabsContent value="user">
              <form onSubmit={handleUserLogin} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="user-email">이메일</Label>
                  <Input
                    id="user-email"
                    type="email"
                    placeholder="your@email.com"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user-password">비밀번호</Label>
                  <Input
                    id="user-password"
                    type="password"
                    placeholder="••••••••"
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  로그인
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="maid">
              <form onSubmit={handleMaidLogin} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="maid-email">이메일</Label>
                  <Input
                    id="maid-email"
                    type="email"
                    placeholder="your@email.com"
                    value={maidEmail}
                    onChange={(e) => setMaidEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maid-password">비밀번호</Label>
                  <Input
                    id="maid-password"
                    type="password"
                    placeholder="••••••••"
                    value={maidPassword}
                    onChange={(e) => setMaidPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  로그인
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">계정이 없으신가요? </span>
            <Link to="/signup" className="text-pink-600 hover:underline font-medium">
              회원가입
            </Link>
          </div>
          <div className="mt-4 text-center text-sm">
            <Link to="/admin" className="text-gray-600 hover:text-pink-600 transition">
              관리자 로그인 →
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
