import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Checkbox } from "../components/ui/checkbox";

export function SignupPage() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userConfirmPassword, setUserConfirmPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [maidEmail, setMaidEmail] = useState("");
  const [maidPassword, setMaidPassword] = useState("");
  const [maidConfirmPassword, setMaidConfirmPassword] = useState("");
  const [maidName, setMaidName] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleUserSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (userPassword !== userConfirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    navigate("/login");
  };

  const handleMaidSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (maidPassword !== maidConfirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-pink-600">회원가입</CardTitle>
          <CardDescription>새로운 계정을 만들어보세요</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="user" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="user">일반 회원</TabsTrigger>
              <TabsTrigger value="maid">메이드</TabsTrigger>
            </TabsList>
            <TabsContent value="user">
              <form onSubmit={handleUserSignup} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="user-name">이름</Label>
                  <Input
                    id="user-name"
                    type="text"
                    placeholder="홍길동"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                  />
                </div>
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
                <div className="space-y-2">
                  <Label htmlFor="user-confirm-password">비밀번호 확인</Label>
                  <Input
                    id="user-confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={userConfirmPassword}
                    onChange={(e) => setUserConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={agreeTerms}
                    onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    이용약관 및 개인정보처리방침에 동의합니다
                  </label>
                </div>
                <Button type="submit" className="w-full" disabled={!agreeTerms}>
                  회원가입
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="maid">
              <form onSubmit={handleMaidSignup} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="maid-name">이름</Label>
                  <Input
                    id="maid-name"
                    type="text"
                    placeholder="이름"
                    value={maidName}
                    onChange={(e) => setMaidName(e.target.value)}
                    required
                  />
                </div>
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
                <div className="space-y-2">
                  <Label htmlFor="maid-confirm-password">비밀번호 확인</Label>
                  <Input
                    id="maid-confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={maidConfirmPassword}
                    onChange={(e) => setMaidConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="maid-terms"
                    checked={agreeTerms}
                    onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                  />
                  <label htmlFor="maid-terms" className="text-sm text-gray-600">
                    이용약관 및 개인정보처리방침에 동의합니다
                  </label>
                </div>
                <Button type="submit" className="w-full" disabled={!agreeTerms}>
                  회원가입
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">이미 계정이 있으신가요? </span>
            <Link to="/login" className="text-pink-600 hover:underline font-medium">
              로그인
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
