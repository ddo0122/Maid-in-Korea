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
import cafes from "../data/cafes.json";

export function CafeDetailPage() {
  const { cafeId } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);
  const cafeDetail = cafes.find((cafe) => cafe.id === Number(cafeId)) ?? cafes[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-96">
        <img
          src={cafeDetail.coverImage}
          alt={cafeDetail.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="container mx-auto">
            <h1 className="text-5xl font-bold mb-2">{cafeDetail.name}</h1>
            <div className="flex items-center gap-4 text-lg">
              <span className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                {cafeDetail.location}
              </span>
              <span className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                {cafeDetail.rating}
              </span>
              <Badge
                variant={cafeDetail.isOpen ? "default" : "destructive"}
                className="text-sm"
              >
                {cafeDetail.isOpen ? "영업중" : "영업종료"}
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
                <p className="text-gray-700">
                  {cafeDetail.description || "등록된 소개가 없습니다."}
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-500" />
                    <span>{cafeDetail.openingHours || "운영 시간 미등록"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <span>{cafeDetail.phone || "전화번호 미등록"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-gray-500" />
                    <span>{cafeDetail.website || "웹사이트 미등록"}</span>
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
                  {cafeDetail.menus.map((menu) => (
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
                  {cafeDetail.menus.length === 0 && (
                    <p className="text-gray-500">등록된 메뉴가 없습니다.</p>
                  )}
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
                      {cafeDetail.schedule.map((day) => (
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
                      {cafeDetail.schedule.length === 0 && (
                        <p className="text-gray-500">
                          등록된 스케줄이 없습니다.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="feeds">
                <div className="space-y-4 mt-4">
                  {cafeDetail.maidFeeds.map((feed) => (
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
                  {cafeDetail.maidFeeds.length === 0 && (
                    <p className="text-gray-500">
                      등록된 메이드 피드가 없습니다.
                    </p>
                  )}
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
