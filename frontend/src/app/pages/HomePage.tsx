import { useState } from "react";
import { Link } from "react-router";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Search, MapPin, Heart, Clock, Star } from "lucide-react";

const mockCafes = [
  {
    id: "1",
    name: "오마이 메이드 카페",
    location: "서울 홍대",
    image:
      "https://i.namu.wiki/i/Zc7wR3eN5-E07wELfOorf0PFw0aZAT6AXPTpQvXV0Ak3MbZF5rRZ_T_e6WNgZBd4_wNA2Q0nlHRMj76-JV90KA.webp",
    rating: 4.8,
    distance: "1.2km",
    isOpen: true,
    tags: ["신규", "인기"],
  },
  {
    id: "2",
    name: "메이드문",
    location: "서울 홍대",
    image:
      "https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20231004_149%2F1696396534792096by_PNG%2F1000008468.png",
    rating: 4.6,
    distance: "1.4km",
    isOpen: true,
    tags: ["추천"],
  },
  {
    id: "3",
    name: "마지텐시",
    location: "서울 홍대",
    image:
      "https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20250114_249%2F1736851160379Yzitu_JPEG%2F1000011307.jpg",
    rating: 4.9,
    distance: "1.3km",
    isOpen: false,
    tags: ["인기"],
  },
  {
    id: "4",
    name: "메이드리밍",
    location: "서울 홍대",
    image:
      "https://search.pstatic.net/common/?src=https%3A%2F%2Fnaverbooking-phinf.pstatic.net%2F20250806_201%2F1754451170975aUFz4_JPEG%2F%25B3%25D7%25C0%25CC%25B9%25F6_%25B7%25CE%25B0%25ED.jpeg",
    rating: 4.7,
    distance: "1.5km",
    isOpen: true,
    tags: ["신규"],
  },
];

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("전체");

  const filteredCafes = mockCafes.filter((cafe) => {
    const matchesSearch = cafe.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesLocation =
      selectedLocation === "전체" || cafe.location.includes(selectedLocation);
    return matchesSearch && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <section
        className="relative overflow-hidden bg-[url('https://mblogthumb-phinf.pstatic.net/MjAyMzExMTlfMTQw/MDAxNzAwMzk4MjUwMzc0.NGMIEmdxg96PpdvIVqOojJdH1ALa1-6hwuP07FEtvlwg.2ac1FuDZTnIDCg_C6weNeu9ZuHhS0-sEkmis3bUDI1Ug.PNG.saontsdkss119/image.png?type=w800')] 
        bg-cover
        text-white py-20"
      >
        <div className="absolute inset-0 bg-black/70" aria-hidden="true" />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">메이드 카페를 찾아보세요</h1>
          <p className="text-xl mb-8 text-pink-100">
            내 주변의 메이드 카페를 쉽게 찾고 예약하세요
          </p>
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="카페 이름으로 검색..."
                  className="pl-10 h-12 text-gray-900"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                size="lg"
                className="h-12 bg-white text-pink-600 hover:bg-gray-100"
              >
                검색
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={selectedLocation === "전체" ? "default" : "outline"}
            onClick={() => setSelectedLocation("전체")}
          >
            전체
          </Button>
          <Button
            variant={selectedLocation === "강남구" ? "default" : "outline"}
            onClick={() => setSelectedLocation("강남구")}
          >
            강남구
          </Button>
          <Button
            variant={selectedLocation === "홍대" ? "default" : "outline"}
            onClick={() => setSelectedLocation("홍대")}
          >
            홍대
          </Button>
          <Button
            variant={selectedLocation === "신촌" ? "default" : "outline"}
            onClick={() => setSelectedLocation("신촌")}
          >
            신촌
          </Button>
          <Button
            variant={selectedLocation === "명동" ? "default" : "outline"}
            onClick={() => setSelectedLocation("명동")}
          >
            명동
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCafes.map((cafe) => (
            <Link key={cafe.id} to={`/cafe/${cafe.id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                <div className="relative">
                  <img
                    src={cafe.image}
                    alt={cafe.name}
                    className="w-full h-48 object-cover"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <Heart className="w-5 h-5" />
                  </Button>
                  {cafe.tags.map((tag) => (
                    <Badge
                      key={tag}
                      className="absolute top-2 left-2 bg-pink-600"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <CardHeader>
                  <CardTitle className="flex items-start justify-between">
                    <span>{cafe.name}</span>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{cafe.rating}</span>
                    </div>
                  </CardTitle>
                  <CardDescription className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {cafe.location}
                    </span>
                    <span className="text-gray-500">{cafe.distance}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span
                      className={
                        cafe.isOpen ? "text-green-600" : "text-red-600"
                      }
                    >
                      {cafe.isOpen ? "영업중" : "영업종료"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
