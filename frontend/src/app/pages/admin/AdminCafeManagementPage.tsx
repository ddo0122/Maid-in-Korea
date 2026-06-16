import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Edit,
  Plus,
  Trash2,
  UserPlus,
} from "lucide-react";
import { getCafeDetail } from "../../api/cafeApi";
import {
  createAdminMenu,
  deleteAdminMenu,
  getAdminMe,
  getAdminMaidInvitations,
  getAdminMonthlySchedule,
  inviteAdminMaidProfile,
  patchAdminMonthlyScheduleDraft,
  publishAdminMonthlySchedule,
  saveAdminMonthlyScheduleDraft,
  updateAdminMenu,
  updateAdminCafe,
  type AdminMaidInvitation,
  type AdminMonthlySchedule,
  type AdminOperatingHour,
  type AdminScheduleMaid,
} from "../../api/authApi";

const adminCafeSections = new Set(["info", "schedule", "menu", "maid"]);
const DEFAULT_CAFE_IMAGE =
  "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200";
const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
const WEEKDAY_ALIASES = [
  { short: "일", full: "일요일", english: ["sun", "sunday"] },
  { short: "월", full: "월요일", english: ["mon", "monday"] },
  { short: "화", full: "화요일", english: ["tue", "tuesday"] },
  { short: "수", full: "수요일", english: ["wed", "wednesday"] },
  { short: "목", full: "목요일", english: ["thu", "thursday"] },
  { short: "금", full: "금요일", english: ["fri", "friday"] },
  { short: "토", full: "토요일", english: ["sat", "saturday"] },
];

type AdminMenu = {
  id: string;
  name: string;
  price: string;
  image: string;
};

function getInvitationStatusLabel(status: string) {
  if (status === "ACCEPTED") {
    return "수락됨";
  }
  if (status === "REJECTED") {
    return "거절됨";
  }
  return "대기중";
}

function getInvitationStatusClassName(status: string) {
  if (status === "ACCEPTED") {
    return "bg-green-100 text-green-700";
  }
  if (status === "REJECTED") {
    return "bg-red-100 text-red-700";
  }
  return "bg-yellow-100 text-yellow-700";
}

function formatDateTime(value: string | null | undefined) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0",
  )}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatMonthTitle(date: Date) {
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
  });
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
      dateKey: getDateKey(date),
      isCurrentMonth: date.getMonth() === month,
    };
  });
}

function formatOperatingHour(
  openTime: string | null,
  closeTime: string | null,
) {
  if (!openTime || !closeTime) {
    return "운영 시간 미등록";
  }

  return `${openTime} - ${closeTime}`;
}

function parseOperatingHourRange(value: string | null | undefined) {
  const match = value?.match(/(\d{1,2}:\d{2})\s*[-~]\s*(\d{1,2}:\d{2})/);

  if (!match) {
    return {
      openTime: "",
      closeTime: "",
    };
  }

  return {
    openTime: match[1],
    closeTime: match[2],
  };
}

function getMonthDateKeys(monthDate: Date) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const lastDate = new Date(year, month + 1, 0).getDate();

  return Array.from({ length: lastDate }, (_, index) =>
    getDateKey(new Date(year, month, index + 1)),
  );
}

function createEmptyMonthlySchedule(monthDate: Date): AdminMonthlySchedule {
  return {
    scheduleId: null,
    year: monthDate.getFullYear(),
    month: monthDate.getMonth() + 1,
    status: "DRAFT",
    publishedAt: null,
    operatingHours: [],
    schedules: [],
  };
}

function toAdminMenus(
  menus: Array<{
    menuId: number;
    name: string;
    price: number;
    image: string | null;
  }>,
): AdminMenu[] {
  return menus.map((menu) => ({
    id: String(menu.menuId),
    name: menu.name,
    price: String(menu.price),
    image: menu.image ?? "",
  }));
}

function getRegularClosedWeekdays(value: string) {
  const normalizedValue = value.toLowerCase();
  const koreanTokens = normalizedValue
    .replaceAll("요일", "")
    .split(/[\s,./|·]+/)
    .filter(Boolean);

  return new Set(
    WEEKDAY_ALIASES.flatMap(({ short, full, english }, weekdayIndex) =>
      normalizedValue.includes(full)
      || koreanTokens.includes(short)
      || english.some((alias) =>
        new RegExp(`\\b${alias}\\b`, "i").test(normalizedValue),
      )
        ? [weekdayIndex]
        : [],
    ),
  );
}

export function AdminCafeManagementPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const sectionParam = searchParams.get("section") ?? "info";
  const activeSection = adminCafeSections.has(sectionParam)
    ? sectionParam
    : "info";

  const [cafeName, setCafeName] = useState("");
  const [cafeDescription, setCafeDescription] = useState("");
  const [openingHours, setOpeningHours] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState("");
  const [defaultOpenTime, setDefaultOpenTime] = useState("");
  const [defaultCloseTime, setDefaultCloseTime] = useState("");
  const [defaultLastOrderTime, setDefaultLastOrderTime] = useState("");
  const [regularClosedDays, setRegularClosedDays] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [isCafeInfoLoading, setIsCafeInfoLoading] = useState(true);
  const [isCafeInfoSaving, setIsCafeInfoSaving] = useState(false);
  const [cafeInfoError, setCafeInfoError] = useState("");
  const [adminCafeId, setAdminCafeId] = useState<number | null>(null);

  const [menus, setMenus] = useState<AdminMenu[]>([]);
  const [menuError, setMenuError] = useState("");
  const [isMenuSaving, setIsMenuSaving] = useState(false);

  const [maidInvitations, setMaidInvitations] = useState<AdminMaidInvitation[]>([]);
  const [maidInvitationCursor, setMaidInvitationCursor] = useState<string | null>(null);
  const [hasMoreMaidInvitations, setHasMoreMaidInvitations] = useState(false);
  const [isMaidInvitationLoading, setIsMaidInvitationLoading] = useState(false);
  const [isMaidInvitationSaving, setIsMaidInvitationSaving] = useState(false);
  const [maidInvitationError, setMaidInvitationError] = useState("");

  const [newMenuName, setNewMenuName] = useState("");
  const [newMenuPrice, setNewMenuPrice] = useState("");
  const [newMenuImage, setNewMenuImage] = useState("");
  const [editingMenuId, setEditingMenuId] = useState<string | null>(null);
  const [editMenuName, setEditMenuName] = useState("");
  const [editMenuPrice, setEditMenuPrice] = useState("");
  const [editMenuImage, setEditMenuImage] = useState("");
  const [newMaidProfileId, setNewMaidProfileId] = useState("");
  const [isMenuDialogOpen, setIsMenuDialogOpen] = useState(false);
  const [isEditMenuDialogOpen, setIsEditMenuDialogOpen] = useState(false);
  const [isMaidDialogOpen, setIsMaidDialogOpen] = useState(false);
  const [scheduleMonth, setScheduleMonth] = useState(() => new Date());
  const [monthlySchedule, setMonthlySchedule] =
    useState<AdminMonthlySchedule | null>(null);
  const [isScheduleLoading, setIsScheduleLoading] = useState(false);
  const [isScheduleSaving, setIsScheduleSaving] = useState(false);
  const [isSchedulePublishing, setIsSchedulePublishing] = useState(false);
  const [scheduleError, setScheduleError] = useState("");
  const [selectedScheduleDate, setSelectedScheduleDate] = useState("");
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [scheduleIsOpen, setScheduleIsOpen] = useState(true);
  const [scheduleOpenTime, setScheduleOpenTime] = useState("11:00");
  const [scheduleCloseTime, setScheduleCloseTime] = useState("22:00");
  const [scheduleLastOrderTime, setScheduleLastOrderTime] = useState("21:00");
  const [scheduleNote, setScheduleNote] = useState("");
  const [scheduleMaidProfileId, setScheduleMaidProfileId] = useState("");
  const [scheduleMaidStartTime, setScheduleMaidStartTime] = useState("11:00");
  const [scheduleMaidEndTime, setScheduleMaidEndTime] = useState("18:00");
  const [scheduleMaidNote, setScheduleMaidNote] = useState("");

  const calendarDays = useMemo(
    () => buildCalendarDays(scheduleMonth),
    [scheduleMonth],
  );
  const todayKey = useMemo(() => getDateKey(new Date()), []);
  const scheduleMonthDateKeys = useMemo(
    () => getMonthDateKeys(scheduleMonth),
    [scheduleMonth],
  );
  const operatingHourByDate = useMemo(() => {
    return new Map(
      (monthlySchedule?.operatingHours ?? []).map((operatingHour) => [
        operatingHour.businessDate,
        operatingHour,
      ]),
    );
  }, [monthlySchedule]);
  const scheduleByDate = useMemo(() => {
    return new Map(
      (monthlySchedule?.schedules ?? []).map((schedule) => [
        schedule.date,
        schedule,
      ]),
    );
  }, [monthlySchedule]);
  const regularClosedWeekdays = useMemo(
    () => getRegularClosedWeekdays(regularClosedDays),
    [regularClosedDays],
  );
  const fallbackDefaultLastOrderTime =
    defaultLastOrderTime || defaultCloseTime;
  const hasDefaultOperatingHours =
    Boolean(defaultOpenTime)
    && Boolean(defaultCloseTime);
  const shouldUseDefaultForGeneratedClosedDraft = useMemo(() => {
    if (!hasDefaultOperatingHours || !monthlySchedule) {
      return false;
    }

    const monthDateKeySet = new Set(scheduleMonthDateKeys);
    const hasOnlyClosedDays =
      monthlySchedule.operatingHours.length === scheduleMonthDateKeys.length
      && monthlySchedule.operatingHours.every(
        (operatingHour) =>
          monthDateKeySet.has(operatingHour.businessDate)
          && operatingHour.isOpen === false
          && !operatingHour.note,
      );
    const hasNoMaidSchedules = monthlySchedule.schedules.every(
      (schedule) => schedule.maids.length === 0,
    );

    return hasOnlyClosedDays && hasNoMaidSchedules;
  }, [
    hasDefaultOperatingHours,
    monthlySchedule,
    scheduleMonthDateKeys,
  ]);

  function getRegisteredOperatingHour(dateKey: string) {
    if (shouldUseDefaultForGeneratedClosedDraft) {
      return undefined;
    }

    return operatingHourByDate.get(dateKey);
  }

  function getDefaultOperatingHour(dateKey: string): AdminOperatingHour | null {
    if (regularClosedWeekdays.has(new Date(`${dateKey}T00:00:00`).getDay())) {
      return {
        businessDate: dateKey,
        isOpen: false,
        openTime: null,
        closeTime: null,
        lastOrderTime: null,
        note: "정기 휴무",
      };
    }

    if (!hasDefaultOperatingHours) {
      return null;
    }

    return {
      businessDate: dateKey,
      isOpen: true,
      openTime: defaultOpenTime,
      closeTime: defaultCloseTime,
      lastOrderTime: fallbackDefaultLastOrderTime,
      note: null,
    };
  }

  function getDisplayOperatingHour(dateKey: string) {
    return getRegisteredOperatingHour(dateKey) ?? getDefaultOperatingHour(dateKey);
  }

  async function refreshMenus(cafeId: number) {
    const cafeDetail = await getCafeDetail(cafeId);
    setMenus(toAdminMenus(cafeDetail.menus));
  }

  useEffect(() => {
    let isMounted = true;

    async function fetchCafeInfo() {
      try {
        setIsCafeInfoLoading(true);
        setCafeInfoError("");
        const admin = await getAdminMe();
        const cafeDetail = await getCafeDetail(admin.cafeId);

        if (!isMounted) {
          return;
        }

        setAdminCafeId(admin.cafeId);
        setCafeName(cafeDetail.name);
        setCafeDescription(cafeDetail.description ?? "");
        setOpeningHours(cafeDetail.operatingHour ?? "");
        setPhone(cafeDetail.phone ?? "");
        setWebsite(cafeDetail.website ?? "");
        setLocation(cafeDetail.location ?? "");
        setRating(String(cafeDetail.rating ?? ""));
        const parsedOperatingHour = parseOperatingHourRange(
          cafeDetail.operatingHour,
        );
        setDefaultOpenTime(
          cafeDetail.defaultOpenTime ?? parsedOperatingHour.openTime,
        );
        setDefaultCloseTime(
          cafeDetail.defaultCloseTime ?? parsedOperatingHour.closeTime,
        );
        setDefaultLastOrderTime(cafeDetail.defaultLastOrderTime ?? "");
        setRegularClosedDays(cafeDetail.regularClosedDays ?? "");
        setCoverImage(cafeDetail.coverImage);
        setMenus(toAdminMenus(cafeDetail.menus));
      } catch (error) {
        if (isMounted) {
          setCafeInfoError(
            error instanceof Error
              ? error.message
              : "카페 기본 정보를 불러오지 못했습니다.",
          );
        }
      } finally {
        if (isMounted) {
          setIsCafeInfoLoading(false);
        }
      }
    }

    fetchCafeInfo();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (activeSection !== "schedule") {
      return;
    }

    let isMounted = true;

    async function fetchMonthlySchedule() {
      try {
        setIsScheduleLoading(true);
        setScheduleError("");
        const schedule = await getAdminMonthlySchedule(
          scheduleMonth.getFullYear(),
          scheduleMonth.getMonth() + 1,
        );

        if (isMounted) {
          setMonthlySchedule(schedule);
        }
      } catch (error) {
        if (isMounted) {
          setMonthlySchedule(null);
          setScheduleError(
            error instanceof Error
              ? error.message
              : "월간 스케줄을 불러오지 못했습니다.",
          );
        }
      } finally {
        if (isMounted) {
          setIsScheduleLoading(false);
        }
      }
    }

    fetchMonthlySchedule();

    return () => {
      isMounted = false;
    };
  }, [activeSection, scheduleMonth]);

  useEffect(() => {
    if (activeSection !== "maid") {
      return;
    }

    refreshMaidInvitations();
  }, [activeSection]);

  const handleUpdateCafeInfo = async () => {
    const timeValues = [
      defaultOpenTime,
      defaultCloseTime,
      defaultLastOrderTime,
    ];
    const hasAnyTimeValue = timeValues.some(Boolean);
    const hasAllTimeValues = timeValues.every(Boolean);

    if (hasAnyTimeValue && !hasAllTimeValues) {
      alert("기본 영업 시간은 오픈, 마감, 라스트오더 시간을 모두 입력해야 합니다.");
      return;
    }

    setIsCafeInfoSaving(true);

    try {
      await updateAdminCafe({
        name: cafeName.trim(),
        description: cafeDescription.trim(),
        phone: phone.trim() || undefined,
        website: website.trim() || undefined,
        defaultOpenTime: defaultOpenTime || undefined,
        defaultCloseTime: defaultCloseTime || undefined,
        defaultLastOrderTime: defaultLastOrderTime || undefined,
        regularClosedDays: regularClosedDays.trim() || undefined,
      });

      alert("카페 정보가 업데이트되었습니다.");
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "카페 정보 수정에 실패했습니다.",
      );
    } finally {
      setIsCafeInfoSaving(false);
    }
  };

  const handleAddMenu = async () => {
    if (!adminCafeId) {
      setMenuError("카페 정보를 먼저 불러와야 합니다.");
      return;
    }

    const price = Number(newMenuPrice);
    if (!newMenuName.trim() || !Number.isFinite(price) || price < 0) {
      setMenuError("메뉴 이름과 가격을 확인해주세요.");
      return;
    }

    try {
      setIsMenuSaving(true);
      setMenuError("");
      await createAdminMenu({
        name: newMenuName.trim(),
        price,
        image: newMenuImage.trim() || undefined,
      });
      await refreshMenus(adminCafeId);
      setNewMenuName("");
      setNewMenuPrice("");
      setNewMenuImage("");
      setIsMenuDialogOpen(false);
    } catch (error) {
      setMenuError(
        error instanceof Error ? error.message : "메뉴 추가에 실패했습니다.",
      );
    } finally {
      setIsMenuSaving(false);
    }
  };

  const openEditMenuDialog = (menu: AdminMenu) => {
    setEditingMenuId(menu.id);
    setEditMenuName(menu.name);
    setEditMenuPrice(menu.price);
    setEditMenuImage(menu.image);
    setMenuError("");
    setIsEditMenuDialogOpen(true);
  };

  const handleUpdateMenu = async () => {
    if (!adminCafeId || !editingMenuId) {
      setMenuError("수정할 메뉴를 선택해주세요.");
      return;
    }

    const price = Number(editMenuPrice);
    if (!editMenuName.trim() || !Number.isFinite(price) || price < 0) {
      setMenuError("메뉴 이름과 가격을 확인해주세요.");
      return;
    }

    try {
      setIsMenuSaving(true);
      setMenuError("");
      await updateAdminMenu(Number(editingMenuId), {
        name: editMenuName.trim(),
        price,
        image: editMenuImage.trim() || undefined,
      });
      await refreshMenus(adminCafeId);
      setEditingMenuId(null);
      setIsEditMenuDialogOpen(false);
    } catch (error) {
      setMenuError(
        error instanceof Error ? error.message : "메뉴 수정에 실패했습니다.",
      );
    } finally {
      setIsMenuSaving(false);
    }
  };

  const handleDeleteMenu = async (id: string) => {
    if (!adminCafeId) {
      setMenuError("카페 정보를 먼저 불러와야 합니다.");
      return;
    }

    try {
      setIsMenuSaving(true);
      setMenuError("");
      await deleteAdminMenu(Number(id));
      await refreshMenus(adminCafeId);
    } catch (error) {
      setMenuError(
        error instanceof Error ? error.message : "메뉴 삭제에 실패했습니다.",
      );
    } finally {
      setIsMenuSaving(false);
    }
  };

  async function refreshMaidInvitations(cursor?: string | null) {
    setIsMaidInvitationLoading(true);

    try {
      setMaidInvitationError("");
      const invitationPage = await getAdminMaidInvitations(cursor);

      setMaidInvitations((prevInvitations) =>
        cursor
          ? [...prevInvitations, ...invitationPage.data]
          : invitationPage.data,
      );
      setMaidInvitationCursor(invitationPage.nextCursor);
      setHasMoreMaidInvitations(invitationPage.hasNext);
    } catch (error) {
      setMaidInvitationError(
        error instanceof Error
          ? error.message
          : "메이드 초대 목록을 불러오지 못했습니다.",
      );
    } finally {
      setIsMaidInvitationLoading(false);
    }
  }

  const handleAddMaid = async () => {
    const maidProfileId = Number(newMaidProfileId);

    if (!newMaidProfileId.trim() || !Number.isInteger(maidProfileId) || maidProfileId < 1) {
      setMaidInvitationError("메이드 프로필 ID는 1 이상의 숫자여야 합니다.");
      return;
    }

    try {
      setIsMaidInvitationSaving(true);
      setMaidInvitationError("");
      await inviteAdminMaidProfile(maidProfileId);
      await refreshMaidInvitations();
      setNewMaidProfileId("");
      setIsMaidDialogOpen(false);
      alert("메이드 등록 요청을 보냈습니다.");
    } catch (error) {
      setMaidInvitationError(
        error instanceof Error ? error.message : "메이드 등록 요청에 실패했습니다.",
      );
    } finally {
      setIsMaidInvitationSaving(false);
    }
  };

  function openScheduleEditor(dateKey: string) {
    const operatingHour = getDisplayOperatingHour(dateKey);
    const schedule = scheduleByDate.get(dateKey);
    const firstMaid = schedule?.maids[0];

    setSelectedScheduleDate(dateKey);
    setScheduleIsOpen(operatingHour?.isOpen ?? true);
    setScheduleOpenTime(operatingHour?.openTime || defaultOpenTime || "11:00");
    setScheduleCloseTime(operatingHour?.closeTime || defaultCloseTime || "22:00");
    setScheduleLastOrderTime(
      operatingHour?.lastOrderTime || fallbackDefaultLastOrderTime || "21:00",
    );
    setScheduleNote(operatingHour?.note ?? "");
    setScheduleMaidProfileId(firstMaid?.maidProfileId ? String(firstMaid.maidProfileId) : "");
    setScheduleMaidStartTime(firstMaid?.startTime ?? "11:00");
    setScheduleMaidEndTime(firstMaid?.endTime ?? "18:00");
    setScheduleMaidNote(firstMaid?.note ?? "");
    setIsScheduleDialogOpen(true);
  }

  function applyScheduleDay() {
    if (!selectedScheduleDate) {
      return;
    }

    if (scheduleIsOpen && (!scheduleOpenTime || !scheduleCloseTime || !scheduleLastOrderTime)) {
      alert("영업일은 오픈, 마감, 라스트오더 시간을 모두 입력해야 합니다.");
      return;
    }

    const maidProfileId = Number(scheduleMaidProfileId);
    const hasMaidInput = scheduleMaidProfileId.trim() !== "";

    if (
      scheduleIsOpen
      && hasMaidInput
      && (!Number.isFinite(maidProfileId) || !scheduleMaidStartTime || !scheduleMaidEndTime)
    ) {
      alert("메이드 프로필 ID와 근무 시작/종료 시간을 확인하세요.");
      return;
    }

    const nextOperatingHour: AdminOperatingHour = {
      businessDate: selectedScheduleDate,
      isOpen: scheduleIsOpen,
      openTime: scheduleIsOpen ? scheduleOpenTime : null,
      closeTime: scheduleIsOpen ? scheduleCloseTime : null,
      lastOrderTime: scheduleIsOpen ? scheduleLastOrderTime : null,
      note: scheduleNote.trim() || null,
    };

    const nextMaids: AdminScheduleMaid[] =
      scheduleIsOpen && hasMaidInput
        ? [
            {
              maidProfileId,
              name: `프로필 ${maidProfileId}`,
              startTime: scheduleMaidStartTime,
              endTime: scheduleMaidEndTime,
              note: scheduleMaidNote.trim() || null,
            },
          ]
        : [];

    setMonthlySchedule((prevSchedule) => {
      const baseSchedule = prevSchedule ?? createEmptyMonthlySchedule(scheduleMonth);

      return {
        ...baseSchedule,
        operatingHours: [
          ...baseSchedule.operatingHours.filter(
            (operatingHour) => operatingHour.businessDate !== selectedScheduleDate,
          ),
          nextOperatingHour,
        ].sort((a, b) => a.businessDate.localeCompare(b.businessDate)),
        schedules: [
          ...baseSchedule.schedules.filter(
            (schedule) => schedule.date !== selectedScheduleDate,
          ),
          {
            date: selectedScheduleDate,
            maids: nextMaids,
          },
        ].sort((a, b) => a.date.localeCompare(b.date)),
      };
    });

    setScheduleError("");
    setIsScheduleDialogOpen(false);
  }

  function buildMonthlySchedulePayload() {
    const baseSchedule = monthlySchedule ?? createEmptyMonthlySchedule(scheduleMonth);
    const operatingHourMap = new Map(
      baseSchedule.operatingHours.map((operatingHour) => [
        operatingHour.businessDate,
        operatingHour,
      ]),
    );
    const scheduleMap = new Map(
      baseSchedule.schedules.map((schedule) => [schedule.date, schedule]),
    );
    return {
      year: scheduleMonth.getFullYear(),
      month: scheduleMonth.getMonth() + 1,
      operatingHours: scheduleMonthDateKeys.flatMap((dateKey) => {
        const registeredOperatingHour = shouldUseDefaultForGeneratedClosedDraft
          ? undefined
          : operatingHourMap.get(dateKey);
        const defaultOperatingHour = getDefaultOperatingHour(dateKey);
        const operatingHour = registeredOperatingHour ?? defaultOperatingHour;

        if (!operatingHour) {
          return [];
        }

        if (!operatingHour.isOpen) {
          return {
            businessDate: dateKey,
            isOpen: false,
            note: operatingHour?.note ?? undefined,
          };
        }

        return {
          businessDate: dateKey,
          isOpen: true,
          openTime: operatingHour.openTime ?? undefined,
          closeTime: operatingHour.closeTime ?? undefined,
          lastOrderTime: operatingHour.lastOrderTime ?? undefined,
          note: operatingHour.note ?? undefined,
        };
      }),
      schedules: scheduleMonthDateKeys.map((dateKey) => ({
        workDate: dateKey,
        maids: (scheduleMap.get(dateKey)?.maids ?? [])
          .filter(
            (maid) =>
              maid.maidProfileId && maid.startTime && maid.endTime,
          )
          .map((maid) => ({
            maidProfileId: maid.maidProfileId,
            startTime: maid.startTime as string,
            endTime: maid.endTime as string,
            note: maid.note ?? undefined,
          })),
      })),
    };
  }

  async function refreshMonthlySchedule() {
    const schedule = await getAdminMonthlySchedule(
      scheduleMonth.getFullYear(),
      scheduleMonth.getMonth() + 1,
    );
    setMonthlySchedule(schedule);
  }

  async function handleSaveScheduleDraft() {
    setIsScheduleSaving(true);

    try {
      const payload = buildMonthlySchedulePayload();

      if (monthlySchedule?.scheduleId) {
        await patchAdminMonthlyScheduleDraft(monthlySchedule.scheduleId, {
          operatingHours: payload.operatingHours,
          schedules: payload.schedules,
        });
      } else {
        await saveAdminMonthlyScheduleDraft(payload);
      }

      await refreshMonthlySchedule();
      setScheduleError("");
      alert("월간 스케줄 초안이 저장되었습니다.");
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "월간 스케줄 저장에 실패했습니다.",
      );
    } finally {
      setIsScheduleSaving(false);
    }
  }

  async function handlePublishSchedule() {
    if (!monthlySchedule?.scheduleId) {
      alert("먼저 월간 스케줄 초안을 저장하세요.");
      return;
    }

    setIsSchedulePublishing(true);

    try {
      await publishAdminMonthlySchedule(monthlySchedule.scheduleId);
      await refreshMonthlySchedule();
      alert("월간 스케줄이 게시되었습니다.");
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "월간 스케줄 게시에 실패했습니다.",
      );
    } finally {
      setIsSchedulePublishing(false);
    }
  }

  function moveScheduleMonth(amount: number) {
    setScheduleMonth(
      (currentMonth) =>
        new Date(currentMonth.getFullYear(), currentMonth.getMonth() + amount, 1),
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">카페 관리</h1>
        <p className="text-gray-600">카페 정보, 메뉴, 메이드를 관리하세요</p>
      </div>

      <Tabs
        value={activeSection}
        onValueChange={(value) => setSearchParams({ section: value })}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="info">기본 정보</TabsTrigger>
          <TabsTrigger value="schedule">스케줄 관리</TabsTrigger>
          <TabsTrigger value="menu">메뉴 관리</TabsTrigger>
          <TabsTrigger value="maid">메이드 관리</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>카페 기본 정보</CardTitle>
              <CardDescription>카페의 기본 정보를 수정하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isCafeInfoLoading && (
                <p className="text-sm text-gray-500">
                  카페 기본 정보를 불러오는 중입니다.
                </p>
              )}
              {cafeInfoError && (
                <p className="text-sm text-red-600">{cafeInfoError}</p>
              )}
              {!isCafeInfoLoading && (
                <div className="overflow-hidden rounded-lg border">
                  <img
                    src={coverImage || DEFAULT_CAFE_IMAGE}
                    alt={cafeName || "카페 대표 이미지"}
                    className="h-56 w-full object-cover"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="cafe-name">카페 이름</Label>
                <Input
                  id="cafe-name"
                  value={cafeName}
                  onChange={(e) => setCafeName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cafe-description">소개</Label>
                <Textarea
                  id="cafe-description"
                  value={cafeDescription}
                  onChange={(e) => setCafeDescription(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">주소</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  disabled
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="opening-hours">영업 시간</Label>
                  <Input
                    id="opening-hours"
                    value={openingHours}
                    onChange={(e) => setOpeningHours(e.target.value)}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">전화번호</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="website">웹사이트</Label>
                  <Input
                    id="website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rating">평점</Label>
                  <Input
                    id="rating"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    disabled
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="default-open-time">기본 오픈 시간</Label>
                  <Input
                    id="default-open-time"
                    type="time"
                    value={defaultOpenTime}
                    onChange={(e) => setDefaultOpenTime(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="default-close-time">기본 마감 시간</Label>
                  <Input
                    id="default-close-time"
                    type="time"
                    value={defaultCloseTime}
                    onChange={(e) => setDefaultCloseTime(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="default-last-order-time">
                    기본 라스트오더
                  </Label>
                  <Input
                    id="default-last-order-time"
                    type="time"
                    value={defaultLastOrderTime}
                    onChange={(e) => setDefaultLastOrderTime(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="regular-closed-days">정기 휴무일</Label>
                <Input
                  id="regular-closed-days"
                  value={regularClosedDays}
                  onChange={(e) => setRegularClosedDays(e.target.value)}
                  placeholder="예: 매주 월요일"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cover-image">대표 이미지</Label>
                <Input id="cover-image" type="file" accept="image/*" disabled />
              </div>
              <Button
                onClick={handleUpdateCafeInfo}
                className="w-full"
                disabled={isCafeInfoLoading || isCafeInfoSaving}
              >
                {isCafeInfoSaving ? "업데이트 중" : "정보 업데이트"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle>스케줄 관리</CardTitle>
                  <CardDescription>
                    월별 운영 시간과 메이드 근무 스케줄을 관리하세요
                  </CardDescription>
                  <p className="mt-1 text-sm text-gray-500">
                    상태: {monthlySchedule?.status ?? "초안 없음"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => moveScheduleMonth(-1)}
                    aria-label="이전 달"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="min-w-32 text-center font-semibold">
                    {formatMonthTitle(scheduleMonth)}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => moveScheduleMonth(1)}
                    aria-label="다음 달"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setScheduleMonth(new Date())}
                  >
                    오늘
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isScheduleLoading && (
                <p className="mb-4 text-sm text-gray-500">
                  월간 스케줄을 불러오는 중입니다.
                </p>
              )}
              {scheduleError && (
                <p className="mb-4 text-sm text-red-600">{scheduleError}</p>
              )}
              <div className="overflow-hidden rounded-lg border">
                <div className="grid grid-cols-7 bg-gray-100 text-center text-sm font-medium text-gray-600">
                  {WEEKDAYS.map((weekday, index) => (
                    <div
                      key={weekday}
                      className={`border-r px-2 py-3 last:border-r-0 ${
                        index === 0 ? "text-red-600" : ""
                      } ${index === 6 ? "text-blue-600" : ""}`}
                    >
                      {weekday}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7">
                  {calendarDays.map((day) => {
                    const dayOfWeek = day.date.getDay();
                    const isToday = day.dateKey === todayKey;
                    const operatingHour = getDisplayOperatingHour(day.dateKey);
                    const schedule = scheduleByDate.get(day.dateKey);
                    const maids = schedule?.maids ?? [];
                    const isClosed = operatingHour?.isOpen === false;

                    return (
                      <button
                        key={day.dateKey}
                        type="button"
                        onClick={() => {
                          if (day.isCurrentMonth) {
                            openScheduleEditor(day.dateKey);
                          }
                        }}
                        className={`min-h-32 border-r border-t p-3 text-left transition hover:bg-pink-50 last:border-r-0 ${
                          day.isCurrentMonth ? "bg-white" : "bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold ${
                              isToday
                                ? "bg-pink-600 text-white"
                                : day.isCurrentMonth
                                  ? "text-gray-900"
                                  : "text-gray-400"
                            } ${dayOfWeek === 0 && !isToday ? "text-red-600" : ""} ${
                              dayOfWeek === 6 && !isToday ? "text-blue-600" : ""
                            }`}
                          >
                            {day.date.getDate()}
                          </span>
                          {day.isCurrentMonth && (
                            <CalendarDays className="h-4 w-4 text-gray-300" />
                          )}
                        </div>
                        {day.isCurrentMonth ? (
                          <div className="mt-4 space-y-2">
                            <div
                              className={`rounded-md px-2 py-1 text-xs ${
                                isClosed
                                  ? "bg-red-50 text-red-700"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {isClosed
                                ? "휴무"
                                : formatOperatingHour(
                                    operatingHour?.openTime ?? null,
                                    operatingHour?.closeTime ?? null,
                                  )}
                            </div>
                            {maids.length > 0 ? (
                              <div className="space-y-1">
                                {maids.slice(0, 3).map((maid) => (
                                  <div
                                    key={`${day.dateKey}-${maid.maidProfileId}-${maid.startTime ?? ""}`}
                                    className="truncate rounded-md bg-pink-50 px-2 py-1 text-xs text-pink-700"
                                    title={`${maid.name}${
                                      maid.startTime && maid.endTime
                                        ? ` ${maid.startTime}-${maid.endTime}`
                                        : ""
                                    }`}
                                  >
                                    {maid.name}
                                    {maid.startTime && maid.endTime
                                      ? ` ${maid.startTime}-${maid.endTime}`
                                      : ""}
                                  </div>
                                ))}
                                {maids.length > 3 && (
                                  <div className="rounded-md bg-pink-100 px-2 py-1 text-xs text-pink-700">
                                    외 {maids.length - 3}명
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="rounded-md bg-gray-50 px-2 py-1 text-xs text-gray-400">
                                근무 메이드 없음
                              </div>
                            )}
                          </div>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSaveScheduleDraft}
                  disabled={isScheduleSaving || isSchedulePublishing}
                >
                  {isScheduleSaving
                    ? "저장 중"
                    : monthlySchedule?.scheduleId
                      ? "초안 수정"
                      : "초안 등록"}
                </Button>
                <Button
                  type="button"
                  onClick={handlePublishSchedule}
                  disabled={
                    isScheduleSaving
                    || isSchedulePublishing
                    || !monthlySchedule?.scheduleId
                  }
                >
                  {isSchedulePublishing ? "게시 중" : "게시"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Dialog
            open={isScheduleDialogOpen}
            onOpenChange={setIsScheduleDialogOpen}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{selectedScheduleDate} 스케줄</DialogTitle>
                <DialogDescription>
                  운영 시간과 근무 메이드를 입력한 뒤 적용하세요.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="schedule-open-state">영업 여부</Label>
                  <select
                    id="schedule-open-state"
                    value={scheduleIsOpen ? "open" : "closed"}
                    onChange={(event) =>
                      setScheduleIsOpen(event.target.value === "open")
                    }
                    className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs outline-none transition-colors focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                  >
                    <option value="open">영업</option>
                    <option value="closed">휴무</option>
                  </select>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="schedule-open-time">오픈</Label>
                    <Input
                      id="schedule-open-time"
                      type="time"
                      value={scheduleOpenTime}
                      onChange={(event) => setScheduleOpenTime(event.target.value)}
                      disabled={!scheduleIsOpen}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="schedule-close-time">마감</Label>
                    <Input
                      id="schedule-close-time"
                      type="time"
                      value={scheduleCloseTime}
                      onChange={(event) => setScheduleCloseTime(event.target.value)}
                      disabled={!scheduleIsOpen}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="schedule-last-order-time">라스트오더</Label>
                    <Input
                      id="schedule-last-order-time"
                      type="time"
                      value={scheduleLastOrderTime}
                      onChange={(event) =>
                        setScheduleLastOrderTime(event.target.value)
                      }
                      disabled={!scheduleIsOpen}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="schedule-note">운영 메모</Label>
                  <Input
                    id="schedule-note"
                    value={scheduleNote}
                    onChange={(event) => setScheduleNote(event.target.value)}
                    placeholder="선택 입력"
                  />
                </div>
                <div className="rounded-lg border p-4">
                  <div className="mb-3">
                    <p className="font-semibold">근무 메이드</p>
                    <p className="text-sm text-gray-500">
                      현재는 한 날짜에 한 명씩 입력할 수 있습니다.
                    </p>
                  </div>
                  <div className="grid gap-3 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="schedule-maid-profile-id">
                        프로필 ID
                      </Label>
                      <Input
                        id="schedule-maid-profile-id"
                        type="number"
                        value={scheduleMaidProfileId}
                        onChange={(event) =>
                          setScheduleMaidProfileId(event.target.value)
                        }
                        disabled={!scheduleIsOpen}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="schedule-maid-start-time">시작</Label>
                      <Input
                        id="schedule-maid-start-time"
                        type="time"
                        value={scheduleMaidStartTime}
                        onChange={(event) =>
                          setScheduleMaidStartTime(event.target.value)
                        }
                        disabled={!scheduleIsOpen}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="schedule-maid-end-time">종료</Label>
                      <Input
                        id="schedule-maid-end-time"
                        type="time"
                        value={scheduleMaidEndTime}
                        onChange={(event) =>
                          setScheduleMaidEndTime(event.target.value)
                        }
                        disabled={!scheduleIsOpen}
                      />
                    </div>
                  </div>
                  <div className="mt-3 space-y-2">
                    <Label htmlFor="schedule-maid-note">근무 메모</Label>
                    <Input
                      id="schedule-maid-note"
                      value={scheduleMaidNote}
                      onChange={(event) =>
                        setScheduleMaidNote(event.target.value)
                      }
                      placeholder="선택 입력"
                      disabled={!scheduleIsOpen}
                    />
                  </div>
                </div>
                <Button onClick={applyScheduleDay} className="w-full">
                  적용
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="menu">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>메뉴 관리</CardTitle>
                  <CardDescription>카페의 메뉴를 추가, 수정, 삭제하세요</CardDescription>
                </div>
                <Dialog open={isMenuDialogOpen} onOpenChange={setIsMenuDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      메뉴 추가
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>새 메뉴 추가</DialogTitle>
                      <DialogDescription>새로운 메뉴를 추가하세요</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="menu-name">메뉴 이름</Label>
                        <Input
                          id="menu-name"
                          placeholder="메뉴 이름"
                          value={newMenuName}
                          onChange={(e) => setNewMenuName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="menu-price">가격</Label>
                        <Input
                          id="menu-price"
                          type="number"
                          placeholder="가격"
                          value={newMenuPrice}
                          onChange={(e) => setNewMenuPrice(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="menu-image">이미지</Label>
                        <Input
                          id="menu-image"
                          placeholder="이미지 URL"
                          value={newMenuImage}
                          onChange={(e) => setNewMenuImage(e.target.value)}
                        />
                      </div>
                      <Button
                        onClick={handleAddMenu}
                        className="w-full"
                        disabled={isMenuSaving}
                      >
                        {isMenuSaving ? "추가 중" : "추가"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Dialog
                  open={isEditMenuDialogOpen}
                  onOpenChange={setIsEditMenuDialogOpen}
                >
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>메뉴 수정</DialogTitle>
                      <DialogDescription>메뉴 정보를 수정하세요</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-menu-name">메뉴 이름</Label>
                        <Input
                          id="edit-menu-name"
                          placeholder="메뉴 이름"
                          value={editMenuName}
                          onChange={(e) => setEditMenuName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-menu-price">가격</Label>
                        <Input
                          id="edit-menu-price"
                          type="number"
                          placeholder="가격"
                          value={editMenuPrice}
                          onChange={(e) => setEditMenuPrice(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-menu-image">이미지</Label>
                        <Input
                          id="edit-menu-image"
                          placeholder="이미지 URL"
                          value={editMenuImage}
                          onChange={(e) => setEditMenuImage(e.target.value)}
                        />
                      </div>
                      <Button
                        onClick={handleUpdateMenu}
                        className="w-full"
                        disabled={isMenuSaving}
                      >
                        {isMenuSaving ? "수정 중" : "수정"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {menuError ? (
                  <p className="text-sm text-red-600">{menuError}</p>
                ) : null}
                {menus.map((menu) => (
                  <div key={menu.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold">{menu.name}</p>
                      <p className="text-sm text-gray-600">{Number(menu.price).toLocaleString()}원</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        disabled={isMenuSaving}
                        onClick={() => openEditMenuDialog(menu)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        disabled={isMenuSaving}
                        onClick={() => handleDeleteMenu(menu.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {menus.length === 0 ? (
                  <p className="text-sm text-gray-500">등록된 메뉴가 없습니다.</p>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maid">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle>메이드 관리</CardTitle>
                  <CardDescription>
                    메이드 프로필 ID로 등록 요청을 보내고 초대 상태를 확인하세요
                  </CardDescription>
                </div>
                <Dialog open={isMaidDialogOpen} onOpenChange={setIsMaidDialogOpen}>
                  <DialogTrigger asChild>
                    <Button disabled={isMaidInvitationSaving}>
                      <UserPlus className="w-4 h-4 mr-2" />
                      메이드 등록 요청
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>메이드 등록 요청</DialogTitle>
                      <DialogDescription>
                        메이드 프로필 ID를 입력하여 등록 요청을 보내세요
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="maid-profile-id">메이드 프로필 ID</Label>
                        <Input
                          id="maid-profile-id"
                          inputMode="numeric"
                          placeholder="예: 12"
                          value={newMaidProfileId}
                          onChange={(e) => setNewMaidProfileId(e.target.value)}
                        />
                      </div>
                      <Button
                        onClick={handleAddMaid}
                        className="w-full"
                        disabled={isMaidInvitationSaving}
                      >
                        {isMaidInvitationSaving ? "요청 전송 중" : "등록 요청 보내기"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {maidInvitationError && (
                  <p className="text-sm text-red-600">{maidInvitationError}</p>
                )}
                {isMaidInvitationLoading && maidInvitations.length === 0 && (
                  <p className="text-sm text-gray-500">
                    메이드 초대 목록을 불러오는 중입니다.
                  </p>
                )}
                {maidInvitations.map((invitation) => (
                  <div
                    key={invitation.invitationId}
                    className="flex flex-col gap-4 rounded-lg bg-gray-50 p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold">
                          {invitation.maidProfileName}
                        </p>
                        <span className="text-xs text-gray-500">
                          초대 #{invitation.invitationId}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        프로필 ID: {invitation.maidProfileId}
                      </p>
                      {invitation.maidProfileDescription && (
                        <p className="line-clamp-2 text-sm text-gray-600">
                          {invitation.maidProfileDescription}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                        {invitation.maidProfileServiceArea && (
                          <span>활동 지역: {invitation.maidProfileServiceArea}</span>
                        )}
                        {invitation.maidProfileInstagram && (
                          <span>Instagram: {invitation.maidProfileInstagram}</span>
                        )}
                        {invitation.maidProfileX && (
                          <span>X: {invitation.maidProfileX}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col gap-2 text-left md:items-end md:text-right">
                      <span
                        className={`w-fit rounded px-2 py-1 text-xs ${getInvitationStatusClassName(
                          invitation.status,
                        )}`}
                      >
                        {getInvitationStatusLabel(invitation.status)}
                      </span>
                      <p className="text-xs text-gray-500">
                        요청일: {formatDateTime(invitation.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
                {!isMaidInvitationLoading && maidInvitations.length === 0 && (
                  <p className="text-sm text-gray-500">
                    보낸 메이드 등록 요청이 없습니다.
                  </p>
                )}
                {hasMoreMaidInvitations && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    disabled={isMaidInvitationLoading}
                    onClick={() => refreshMaidInvitations(maidInvitationCursor)}
                  >
                    {isMaidInvitationLoading ? "불러오는 중" : "더 보기"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
