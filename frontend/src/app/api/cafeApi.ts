const API_BASE_URL = "";

export type HomeCafe = {
  id: number;
  name: string;
  tag: string[];
  todayOperatingHour: string;
  coverImage: string | null;
  location: string;
  area: string;
  rating: number;
  distance: string | null;
};

type HomeCafeResponse = Omit<HomeCafe, "id"> & {
  id?: number | null;
  cafeId?: number | null;
};

export type CafeMenu = {
  menuId: number;
  name: string;
  price: number;
  image: string | null;
};

export type CafeScheduleMaid = {
  maidProfileId: number;
  name: string;
  startTime: string | null;
  endTime: string | null;
};

export type CafeSchedule = {
  date: string;
  maids: CafeScheduleMaid[];
};

export type CafeMaid = {
  maidProfileId: number;
  name: string;
  description: string | null;
  serviceArea: string | null;
  instagram: string | null;
  x: string | null;
};

export type CafeDetail = {
  name: string;
  coverImage: string | null;
  location: string;
  rating: number;
  description: string | null;
  operatingHour: string;
  phone: string | null;
  website: string | null;
  defaultOpenTime: string | null;
  defaultCloseTime: string | null;
  defaultLastOrderTime: string | null;
  regularClosedDays: string | null;
  menus: CafeMenu[];
  currentMonthSchedules: CafeSchedule[];
  maids: CafeMaid[];
};

type ApiResponse<T> = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
};

export async function getHomeCafes() {
  const response = await fetch(`${API_BASE_URL}/api/cafes/v1/home`);
  const data: ApiResponse<HomeCafeResponse[]> = await response.json();

  if (!response.ok || !data.isSuccess) {
    throw new Error(data.message || "카페 정보를 불러오지 못했습니다.");
  }

  return data.result.map((cafe, index) => ({
    ...cafe,
    id: cafe.id ?? cafe.cafeId ?? index + 1,
  }));
}

export async function getCafeDetail(cafeId: number) {
  const response = await fetch(`${API_BASE_URL}/api/cafes/v1/${cafeId}`);
  const data: ApiResponse<CafeDetail> = await response.json();

  if (!response.ok || !data.isSuccess) {
    throw new Error(data.message || "카페 상세 정보를 불러오지 못했습니다.");
  }

  return data.result;
}
