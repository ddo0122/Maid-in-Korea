import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Store, Users, Calendar, TrendingUp } from "lucide-react";

export function AdminDashboardPage() {
  const stats = [
    { title: "총 방문자", value: "1,234", change: "+12.5%", icon: Users, color: "text-blue-600" },
    { title: "오늘 예약", value: "45", change: "+8.2%", icon: Calendar, color: "text-green-600" },
    { title: "이달 매출", value: "₩4,500,000", change: "+23.1%", icon: TrendingUp, color: "text-purple-600" },
    { title: "근무 메이드", value: "8", change: "0%", icon: Store, color: "text-pink-600" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">대시보드</h1>
        <p className="text-gray-600">카페 운영 현황을 한눈에 확인하세요</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-gray-600 mt-1">
                <span className={stat.change.startsWith("+") ? "text-green-600" : "text-red-600"}>
                  {stat.change}
                </span>{" "}
                from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>최근 예약</CardTitle>
            <CardDescription>오늘의 최근 예약 내역입니다</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold">고객 {i}</p>
                    <p className="text-sm text-gray-600">{14 + i}:00 - 2명</p>
                  </div>
                  <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">확정</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>오늘의 근무 메이드</CardTitle>
            <CardDescription>오늘 근무 중인 메이드 목록입니다</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["사쿠라", "미유", "나나"].map((name) => (
                <div key={name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold">{name}</p>
                    <p className="text-sm text-gray-600">11:00 - 20:00</p>
                  </div>
                  <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">근무중</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
