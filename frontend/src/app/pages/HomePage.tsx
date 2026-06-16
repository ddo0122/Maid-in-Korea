import { useEffect, useMemo, useState } from "react";
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
import { Search, MapPin, Clock, Star } from "lucide-react";
import { getHomeCafes, type HomeCafe } from "../api/cafeApi";

const CLOSED_LABEL = "영업안함";
const DEFAULT_CAFE_IMAGE =
  "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800";

export function HomePage() {
  const [cafes, setCafes] = useState<HomeCafe[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("전체");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchHomeCafes() {
      try {
        setIsLoading(true);
        setErrorMessage("");
        const homeCafes = await getHomeCafes();

        if (isMounted) {
          setCafes(homeCafes);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "카페 정보를 불러오지 못했습니다.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchHomeCafes();

    return () => {
      isMounted = false;
    };
  }, []);

  const locationOptions = useMemo(() => {
    const areas = cafes
      .map((cafe) => cafe.area)
      .filter((area): area is string => Boolean(area));

    return ["전체", ...Array.from(new Set(areas))];
  }, [cafes]);

  const filteredCafes = cafes.filter((cafe) => {
    const matchesSearch = cafe.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesLocation =
      selectedLocation === "전체" ||
      cafe.area.includes(selectedLocation) ||
      cafe.location.includes(selectedLocation);
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
          {locationOptions.map((location) => (
            <Button
              key={location}
              variant={selectedLocation === location ? "default" : "outline"}
              onClick={() => setSelectedLocation(location)}
            >
              {location}
            </Button>
          ))}
        </div>

        {isLoading && (
          <div className="py-16 text-center text-gray-500">
            카페 정보를 불러오는 중입니다.
          </div>
        )}

        {!isLoading && errorMessage && (
          <div className="py-16 text-center text-red-600">{errorMessage}</div>
        )}

        {!isLoading && !errorMessage && filteredCafes.length === 0 && (
          <div className="py-16 text-center text-gray-500">
            조건에 맞는 카페가 없습니다.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCafes.map((cafe) => (
            <Link key={cafe.id} to={`/cafe/${cafe.id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                <div className="relative">
                  <img
                    src={cafe.coverImage || DEFAULT_CAFE_IMAGE}
                    alt={cafe.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 left-2 flex flex-wrap gap-1 pr-12">
                    {cafe.tag.map((tag) => (
                      <Badge key={tag} className="bg-pink-600">
                        {tag}
                      </Badge>
                    ))}
                  </div>
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
                      {cafe.area || cafe.location}
                    </span>
                    {cafe.distance && (
                      <span className="text-gray-500">{cafe.distance}</span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span
                      className={
                        cafe.todayOperatingHour === CLOSED_LABEL
                          ? "text-red-600"
                          : "text-green-600"
                      }
                    >
                      {cafe.todayOperatingHour}
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
