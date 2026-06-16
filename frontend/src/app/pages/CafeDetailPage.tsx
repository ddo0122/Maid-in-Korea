import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
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
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import {
  MapPin,
  Clock,
  Phone,
  Globe,
  Calendar,
  Star,
  Instagram,
} from "lucide-react";
import {
  getCafeDetail,
  type CafeDetail,
  type CafeSchedule,
} from "../api/cafeApi";

const CLOSED_LABEL = "영업안함";
const DEFAULT_CAFE_IMAGE =
  "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200";
const DEFAULT_MENU_IMAGE =
  "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400";
const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function parseLocalDate(date: string) {
  return new Date(`${date}T00:00:00`);
}

function formatMonthTitle(date: Date) {
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
  });
}

function formatScheduleTime(startTime: string | null, endTime: string | null) {
  if (!startTime && !endTime) {
    return "";
  }

  return `${startTime ?? ""}${startTime && endTime ? " - " : ""}${endTime ?? ""}`;
}

function buildCalendarDays(monthDate: Date) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDate = new Date(year, month, 1);
  const lastDate = new Date(year, month + 1, 0);
  const calendarStart = new Date(firstDate);
  calendarStart.setDate(firstDate.getDate() - firstDate.getDay());

  const totalDays = Math.ceil((firstDate.getDay() + lastDate.getDate()) / 7) * 7;

  return Array.from({ length: totalDays }, (_, index) => {
    const date = new Date(calendarStart);
    date.setDate(calendarStart.getDate() + index);

    return {
      date,
      dateKey: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0",
      )}-${String(date.getDate()).padStart(2, "0")}`,
      isCurrentMonth: date.getMonth() === month,
    };
  });
}

export function CafeDetailPage() {
  const { id } = useParams();
  const [cafeDetail, setCafeDetail] = useState<CafeDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;
    const cafeId = Number(id);

    async function fetchCafeDetail() {
      if (!Number.isFinite(cafeId)) {
        setErrorMessage("잘못된 카페 주소입니다.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setErrorMessage("");
        const detail = await getCafeDetail(cafeId);

        if (isMounted) {
          setCafeDetail(detail);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "카페 상세 정보를 불러오지 못했습니다.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchCafeDetail();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const scheduleByDate = useMemo(() => {
    return new Map(
      (cafeDetail?.currentMonthSchedules ?? []).map((schedule) => [
        schedule.date,
        schedule,
      ]),
    );
  }, [cafeDetail]);

  const calendarMonth = useMemo(() => {
    const firstSchedule = cafeDetail?.currentMonthSchedules[0];
    return firstSchedule ? parseLocalDate(firstSchedule.date) : new Date();
  }, [cafeDetail]);

  const calendarDays = useMemo(
    () => buildCalendarDays(calendarMonth),
    [calendarMonth],
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-24 text-center text-gray-500">
        카페 상세 정보를 불러오는 중입니다.
      </div>
    );
  }

  if (errorMessage || !cafeDetail) {
    return (
      <div className="min-h-screen bg-gray-50 py-24 text-center text-red-600">
        {errorMessage || "카페 상세 정보를 불러오지 못했습니다."}
      </div>
    );
  }

  const isOpen = cafeDetail.operatingHour !== CLOSED_LABEL;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-96">
        <img
          src={cafeDetail.coverImage || DEFAULT_CAFE_IMAGE}
          alt={cafeDetail.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="container mx-auto">
            <h1 className="mb-2 text-5xl font-bold">{cafeDetail.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-lg">
              <span className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {cafeDetail.location}
              </span>
              <span className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                {cafeDetail.rating}
              </span>
              <Badge
                variant={isOpen ? "default" : "destructive"}
                className="text-sm"
              >
                {cafeDetail.operatingHour}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-5xl">
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
                    <Clock className="h-5 w-5 text-gray-500" />
                    <span>{cafeDetail.operatingHour || "운영 시간 미등록"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-gray-500" />
                    <span>{cafeDetail.phone || "전화번호 미등록"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-gray-500" />
                    <span>{cafeDetail.website || "웹사이트 미등록"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="menu" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="menu">메뉴</TabsTrigger>
                <TabsTrigger value="schedule">스케줄</TabsTrigger>
                <TabsTrigger value="maids">메이드 목록</TabsTrigger>
              </TabsList>

              <TabsContent value="menu">
                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  {cafeDetail.menus.map((menu, index) => (
                    <Card key={`${menu.name}-${index}`}>
                      <div className="flex gap-4 p-4">
                        <img
                          src={menu.image || DEFAULT_MENU_IMAGE}
                          alt={menu.name}
                          className="h-24 w-24 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold">{menu.name}</h3>
                          <p className="mt-2 text-xl font-bold text-pink-600">
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
                      <Calendar className="h-5 w-5" />
                      {formatMonthTitle(calendarMonth)} 근무 스케줄
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-7 border-l border-t border-gray-200 bg-white">
                      {WEEKDAYS.map((weekday) => (
                        <div
                          key={weekday}
                          className="border-b border-r border-gray-200 bg-gray-50 py-2 text-center text-sm font-medium text-gray-600"
                        >
                          {weekday}
                        </div>
                      ))}
                      {calendarDays.map((day) => {
                        const schedule = scheduleByDate.get(day.dateKey);

                        return (
                          <div
                            key={day.dateKey}
                            className={`min-h-32 border-b border-r border-gray-200 p-2 ${
                              day.isCurrentMonth ? "bg-white" : "bg-gray-50"
                            }`}
                          >
                            <div
                              className={`mb-2 text-sm font-medium ${
                                day.isCurrentMonth
                                  ? "text-gray-900"
                                  : "text-gray-400"
                              }`}
                            >
                              {day.date.getDate()}
                            </div>
                            {schedule && <ScheduleDay schedule={schedule} />}
                          </div>
                        );
                      })}
                    </div>
                    {cafeDetail.currentMonthSchedules.length === 0 && (
                      <p className="mt-4 text-gray-500">
                        등록된 스케줄이 없습니다.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="maids">
                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  {cafeDetail.maids.map((maid) => (
                    <Card key={maid.maidProfileId}>
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{maid.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">
                              {maid.name}
                            </CardTitle>
                            <CardDescription>
                              {maid.serviceArea || "서비스 지역 미등록"}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-gray-700">
                          {maid.description || "등록된 소개가 없습니다."}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {maid.instagram && (
                            <Badge variant="secondary" className="gap-1">
                              <Instagram className="h-3 w-3" />
                              {maid.instagram}
                            </Badge>
                          )}
                          {maid.x && (
                            <Badge variant="secondary">X {maid.x}</Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {cafeDetail.maids.length === 0 && (
                    <p className="text-gray-500">등록된 메이드가 없습니다.</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
        </div>
      </div>
    </div>
  );
}

function ScheduleDay({ schedule }: { schedule: CafeSchedule }) {
  if (schedule.maids.length === 0) {
    return <p className="text-xs text-gray-400">근무 없음</p>;
  }

  return (
    <div className="space-y-1">
      {schedule.maids.map((maid) => (
        <div
          key={`${schedule.date}-${maid.maidProfileId}-${maid.startTime}`}
          className="rounded bg-pink-50 px-2 py-1 text-xs text-pink-700"
        >
          <div className="font-medium">{maid.name}</div>
          {formatScheduleTime(maid.startTime, maid.endTime) && (
            <div className="text-pink-500">
              {formatScheduleTime(maid.startTime, maid.endTime)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
