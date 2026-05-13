import { useState } from "react";
import { useParams, Link } from "react-router";
import { Button } from "../components/ui/button";
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
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  MapPin,
  Clock,
  Heart,
  Phone,
  Globe,
  Calendar,
  Star,
} from "lucide-react";

const mockCafeDetail = {
  id: "1",
  name: "오마이 메이드카페",
  description:
    "서울 최고의 메이드 카페입니다. 친절한 메이드들이 여러분을 맞이합니다.",
  coverImage:
    "https://mblogthumb-phinf.pstatic.net/MjAyMzA3MTNfNDQg/MDAxNjg5MjUwNTMzNDU5.1-QrveaEavSjSxAtEuRItMcThUqjK2qyZOzubdtkr3kg.pl62WNWyQdpBZSae-v0-pJAsbSzthUPJ251U4WK6EQUg.JPEG.hhyy114/IMG_1167.JPG?type=w800",
  location: "서울 마포구 서교동 358-115",
  phone: "02-1111-2222",
  website: "@ohmy_maidcafe",
  rating: 4.8,
  isOpen: true,
  openingHours: "15:00 - 22:00",
  menus: [
    {
      id: "1",
      name: "딸기 파르페",
      price: 8000,
      image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400",
    },
    {
      id: "2",
      name: "오므라이스",
      price: 12000,
      image:
        "https://images.unsplash.com/photo-1513442542250-854d436a73f2?w=400",
    },
    {
      id: "3",
      name: "메이드 특제 음료",
      price: 6000,
      image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400",
    },
    {
      id: "4",
      name: "케이크 세트",
      price: 15000,
      image:
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400",
    },
  ],
  schedule: [
    { date: "2026-05-13", maids: ["사쿠라", "미유", "나나"] },
    { date: "2026-05-14", maids: ["유이", "사쿠라", "레이"] },
    { date: "2026-05-15", maids: ["미유", "나나", "유이"] },
    { date: "2026-05-16", maids: ["레이", "사쿠라", "미유"] },
    { date: "2026-05-17", maids: ["나나", "유이", "레이"] },
  ],
  maidFeeds: [
    {
      id: "1",
      maidName: "사쿠라",
      maidAvatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100",
      content: "오늘도 즐거운 하루였어요! 많이 방문해주세요 💕",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
      timestamp: "2시간 전",
      likes: 145,
    },
    {
      id: "2",
      maidName: "미유",
      maidAvatar:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100",
      content: "새로운 메뉴 나왔어요! 꼭 드셔보세요 🍰",
      image:
        "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400",
      timestamp: "5시간 전",
      likes: 203,
    },
  ],
};

export function CafeDetailPage() {
  const { cafeId } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-96">
        <img
          src={mockCafeDetail.coverImage}
          alt={mockCafeDetail.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="container mx-auto">
            <h1 className="text-5xl font-bold mb-2">{mockCafeDetail.name}</h1>
            <div className="flex items-center gap-4 text-lg">
              <span className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                {mockCafeDetail.location}
              </span>
              <span className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                {mockCafeDetail.rating}
              </span>
              <Badge
                variant={mockCafeDetail.isOpen ? "default" : "destructive"}
                className="text-sm"
              >
                {mockCafeDetail.isOpen ? "영업중" : "영업종료"}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>소개</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{mockCafeDetail.description}</p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-500" />
                    <span>{mockCafeDetail.openingHours}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <span>{mockCafeDetail.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-gray-500" />
                    <span>{mockCafeDetail.website}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="menu" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="menu">메뉴</TabsTrigger>
                <TabsTrigger value="schedule">스케줄</TabsTrigger>
                <TabsTrigger value="feeds">메이드 피드</TabsTrigger>
              </TabsList>
              <TabsContent value="menu">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {mockCafeDetail.menus.map((menu) => (
                    <Card key={menu.id}>
                      <div className="flex gap-4 p-4">
                        <img
                          src={menu.image}
                          alt={menu.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{menu.name}</h3>
                          <p className="text-pink-600 font-bold text-xl mt-2">
                            {menu.price.toLocaleString()}원
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="schedule">
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      이번 주 근무 스케줄
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockCafeDetail.schedule.map((day) => (
                        <div
                          key={day.date}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                          <span className="font-medium">
                            {new Date(day.date).toLocaleDateString("ko-KR", {
                              month: "long",
                              day: "numeric",
                              weekday: "short",
                            })}
                          </span>
                          <div className="flex gap-2">
                            {day.maids.map((maid) => (
                              <Badge key={maid} variant="secondary">
                                {maid}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="feeds">
                <div className="space-y-4 mt-4">
                  {mockCafeDetail.maidFeeds.map((feed) => (
                    <Card key={feed.id}>
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={feed.maidAvatar} />
                            <AvatarFallback>{feed.maidName[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">
                              {feed.maidName}
                            </CardTitle>
                            <CardDescription>{feed.timestamp}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-4">{feed.content}</p>
                        <img
                          src={feed.image}
                          alt="Feed"
                          className="w-full rounded-lg mb-4"
                        />
                        <div className="flex items-center gap-2 text-gray-600">
                          <Heart className="w-5 h-5" />
                          <span>{feed.likes} likes</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>예약하기</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" size="lg">
                  예약하기
                </Button>
                <Button
                  variant={isFavorite ? "default" : "outline"}
                  className="w-full"
                  size="lg"
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  <Heart
                    className={`w-5 h-5 mr-2 ${isFavorite ? "fill-current" : ""}`}
                  />
                  {isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
