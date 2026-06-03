import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { KakaoAuthButton } from "../components/auth/KakaoAuthButton";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Checkbox } from "../components/ui/checkbox";

import { maidSignup, saveAuthToken, signup } from "../api/authApi";

export function SignupPage() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userConfirmPassword, setUserConfirmPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [userGender, setUserGender] = useState("");
  const [userBirthDate, setUserBirthDate] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [userAddressDetail, setUserAddressDetail] = useState("");
  const [maidEmail, setMaidEmail] = useState("");
  const [maidPassword, setMaidPassword] = useState("");
  const [maidConfirmPassword, setMaidConfirmPassword] = useState("");
  const [maidName, setMaidName] = useState("");
  const [maidGender, setMaidGender] = useState("");
  const [maidBirthDate, setMaidBirthDate] = useState("");
  const [maidAddress, setMaidAddress] = useState("");
  const [maidAddressDetail, setMaidAddressDetail] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleUserSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (userPassword != userConfirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const result = await signup({
        name: userName,
        email: userEmail,
        password: userPassword,
        gender: userGender as "MALE" | "FEMALE" | "NONE",
        birth: userBirthDate,
        address: userAddress,
        detailAddress: userAddressDetail,
      });

      saveAuthToken(result.tokenType, result.accessToken, result.refreshToken);
      navigate("/");
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "회원가입에 실패했습니다.",
      );
    }
  };

  const handleMaidSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (maidPassword !== maidConfirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const result = await maidSignup({
        name: maidName,
        email: maidEmail,
        password: maidPassword,
        gender: maidGender as "MALE" | "FEMALE" | "NONE",
        birth: maidBirthDate,
        address: maidAddress,
        detailAddress: maidAddressDetail,
      });

      saveAuthToken(result.tokenType, result.accessToken, result.refreshToken);
      navigate("/maid/profile");
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "회원가입에 실패했습니다.",
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-pink-600">
            SIGN UP
          </CardTitle>
          <CardDescription>Maid in Korea에 어서오세요</CardDescription>
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
                  <Label htmlFor="user-gender">성별</Label>
                  <select
                    id="user-gender"
                    value={userGender}
                    onChange={(e) => setUserGender(e.target.value)}
                    className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs outline-none transition-colors focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                    required
                  >
                    <option value="">성별을 선택하세요</option>
                    <option value="MALE">남성</option>
                    <option value="FEMALE">여성</option>
                    <option value="NONE">선택 안 함</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user-birth-date">생일</Label>
                  <Input
                    id="user-birth-date"
                    type="date"
                    value={userBirthDate}
                    onChange={(e) => setUserBirthDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user-address">주소</Label>
                  <Input
                    id="user-address"
                    type="text"
                    placeholder="주소"
                    value={userAddress}
                    onChange={(e) => setUserAddress(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user-address-detail">상세주소</Label>
                  <Input
                    id="user-address-detail"
                    type="text"
                    placeholder="상세주소"
                    value={userAddressDetail}
                    onChange={(e) => setUserAddressDetail(e.target.value)}
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
                    onCheckedChange={(checked) =>
                      setAgreeTerms(checked as boolean)
                    }
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
                  <Label htmlFor="maid-gender">성별</Label>
                  <select
                    id="maid-gender"
                    value={maidGender}
                    onChange={(e) => setMaidGender(e.target.value)}
                    className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs outline-none transition-colors focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                    required
                  >
                    <option value="">성별을 선택하세요</option>
                    <option value="FEMALE">여성</option>
                    <option value="MALE">남성</option>
                    <option value="NONE">선택 안 함</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maid-birth-date">생일</Label>
                  <Input
                    id="maid-birth-date"
                    type="date"
                    value={maidBirthDate}
                    onChange={(e) => setMaidBirthDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maid-address">주소</Label>
                  <Input
                    id="maid-address"
                    type="text"
                    placeholder="주소"
                    value={maidAddress}
                    onChange={(e) => setMaidAddress(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maid-address-detail">상세주소</Label>
                  <Input
                    id="maid-address-detail"
                    type="text"
                    placeholder="상세주소"
                    value={maidAddressDetail}
                    onChange={(e) => setMaidAddressDetail(e.target.value)}
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
                    onCheckedChange={(checked) =>
                      setAgreeTerms(checked as boolean)
                    }
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
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-500">또는</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>
          <KakaoAuthButton label="카카오톡으로 로그인" />
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">이미 계정이 있으신가요? </span>
            <Link
              to="/login"
              className="text-pink-600 hover:underline font-medium"
            >
              로그인
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
