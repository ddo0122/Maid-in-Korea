import { useEffect, useState } from "react";
import { User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { getMe } from "../api/authApi";

type MemberInfo = {
  name: string;
  email: string;
};

export function MyPage() {
  const [member, setMember] = useState<MemberInfo | null>(null);

  useEffect(() => {
    getMe().then(setMember);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="container mx-auto px-4 py-10">
        <Card className="mx-auto max-w-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-pink-600" />
              마이페이지
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">이름</p>
              <p className="font-medium">{member?.name || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">이메일</p>
              <p className="font-medium">{member?.email || "-"}</p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
