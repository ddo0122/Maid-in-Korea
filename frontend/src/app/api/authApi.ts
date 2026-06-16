const API_BASE_URL = "";

type AuthResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
  };
};

type MemberInfoResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    name: string;
    email: string;
    birth: string;
    address: string;
    detailAddress: string;
  };
};

type EmptyResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: null;
};

type AdminMeResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    adminId: number;
    loginId: string;
    cafeId: number;
  };
};

type AdminMonthlyScheduleResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: AdminMonthlySchedule;
};

type AdminMaidInvitationPageResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: AdminMaidInvitationPage;
};

type TokenPayload = {
  sub?: string;
  email?: string;
  role?: string;
  exp?: number;
  iat?: number;
};

export type SignupRequest = {
  name: string;
  email: string;
  password: string;
  gender: "MALE" | "FEMALE" | "NONE";
  birth: string;
  address: string;
  detailAddress: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type AdminLoginRequest = {
  loginId: string;
  password: string;
};

export type UpdateMemberRequest = {
  name: string;
  email: string;
  birth: string;
  address: string;
  detailAddress: string;
};

export type UpdateAdminCafeRequest = {
  name?: string;
  description?: string;
  phone?: string;
  website?: string;
  defaultOpenTime?: string;
  defaultCloseTime?: string;
  defaultLastOrderTime?: string;
  regularClosedDays?: string;
};

export type AdminScheduleMaid = {
  maidProfileId: number;
  name: string;
  startTime: string | null;
  endTime: string | null;
  note?: string | null;
};

export type AdminDailySchedule = {
  date: string;
  maids: AdminScheduleMaid[];
};

export type AdminOperatingHour = {
  businessDate: string;
  isOpen: boolean;
  openTime: string | null;
  closeTime: string | null;
  lastOrderTime: string | null;
  note: string | null;
};

export type AdminMonthlySchedule = {
  scheduleId: number | null;
  year: number;
  month: number;
  status: string;
  publishedAt: string | null;
  operatingHours: AdminOperatingHour[];
  schedules: AdminDailySchedule[];
};

export type AdminScheduleMaidRequest = {
  maidProfileId: number;
  startTime: string;
  endTime: string;
  note?: string;
};

export type AdminDailyScheduleRequest = {
  workDate: string;
  maids: AdminScheduleMaidRequest[];
};

export type AdminOperatingHourRequest = {
  businessDate: string;
  isOpen: boolean;
  openTime?: string;
  closeTime?: string;
  lastOrderTime?: string;
  note?: string;
};

export type UpsertAdminMonthlyScheduleRequest = {
  year: number;
  month: number;
  operatingHours: AdminOperatingHourRequest[];
  schedules: AdminDailyScheduleRequest[];
};

export type PatchAdminMonthlyScheduleRequest = {
  operatingHours?: AdminOperatingHourRequest[];
  schedules?: AdminDailyScheduleRequest[];
};

export type CreateAdminMenuRequest = {
  name: string;
  price: number;
  image?: string;
};

export type UpdateAdminMenuRequest = {
  name?: string;
  price?: number;
  image?: string;
};

export type AdminMaidInvitation = {
  invitationId: number;
  cafeId: number;
  cafeName: string;
  maidProfileId: number;
  maidProfileName: string;
  maidProfileDescription: string | null;
  maidProfileServiceArea: string | null;
  maidProfileInstagram: string | null;
  maidProfileX: string | null;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | string;
  createdAt: string;
  updatedAt: string;
};

export type AdminMaidInvitationPage = {
  data: AdminMaidInvitation[];
  hasNext: boolean;
  nextCursor: string | null;
  pageSize: number;
};

export async function signup(payload: SignupRequest) {
  return requestAuth("/auth/sign-up", payload, "회원가입에 실패했습니다.");
}

export async function login(payload: LoginRequest) {
  return requestAuth("/auth/login", payload, "로그인에 실패했습니다.");
}

export async function maidSignup(payload: SignupRequest) {
  return requestAuth("/api/maids/signup", payload, "회원가입에 실패했습니다.");
}

export async function maidLogin(payload: LoginRequest) {
  return requestAuth("/api/maids/login", payload, "로그인에 실패했습니다.");
}

export async function adminLogin(payload: AdminLoginRequest) {
  return requestAuth("/api/admin/v1/login", payload, "관리자 로그인에 실패했습니다.");
}

export async function getAdminMe() {
  const accessToken = getAuthToken();

  if (!accessToken) {
    throw new Error("로그인이 필요합니다.");
  }

  const response = await fetch(`${API_BASE_URL}/api/admin/v1/me`, {
    headers: {
      Authorization: accessToken,
    },
  });

  const data: AdminMeResponse = await response.json();

  if (!response.ok || !data.isSuccess) {
    throw new Error(data.message || "관리자 정보를 불러오지 못했습니다.");
  }

  return data.result;
}

export async function updateAdminCafe(payload: UpdateAdminCafeRequest) {
  const accessToken = getAuthToken();

  if (!accessToken) {
    throw new Error("로그인이 필요합니다.");
  }

  const response = await fetch(`${API_BASE_URL}/api/admin/cafes/v1/update`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: accessToken,
    },
    body: JSON.stringify(payload),
  });

  const data: EmptyResponse = await response.json();

  if (!response.ok || !data.isSuccess) {
    throw new Error(data.message || "카페 정보 수정에 실패했습니다.");
  }
}

export async function getAdminMonthlySchedule(year: number, month: number) {
  const accessToken = getAuthToken();

  if (!accessToken) {
    throw new Error("로그인이 필요합니다.");
  }

  const searchParams = new URLSearchParams({
    year: String(year),
    month: String(month),
  });

  const response = await fetch(
    `${API_BASE_URL}/api/admin/cafes/v1/monthly-schedules?${searchParams.toString()}`,
    {
      headers: {
        Authorization: accessToken,
      },
    },
  );

  const data: AdminMonthlyScheduleResponse = await response.json();

  if (!response.ok || !data.isSuccess) {
    throw new Error(data.message || "월간 스케줄을 불러오지 못했습니다.");
  }

  return data.result;
}

export async function saveAdminMonthlyScheduleDraft(
  payload: UpsertAdminMonthlyScheduleRequest,
) {
  const accessToken = getAuthToken();

  if (!accessToken) {
    throw new Error("로그인이 필요합니다.");
  }

  const response = await fetch(`${API_BASE_URL}/api/admin/cafes/v1/monthly-schedules`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: accessToken,
    },
    body: JSON.stringify(payload),
  });

  const data: EmptyResponse = await response.json();

  if (!response.ok || !data.isSuccess) {
    throw new Error(data.message || "월간 스케줄 저장에 실패했습니다.");
  }
}

export async function patchAdminMonthlyScheduleDraft(
  scheduleId: number,
  payload: PatchAdminMonthlyScheduleRequest,
) {
  const accessToken = getAuthToken();

  if (!accessToken) {
    throw new Error("로그인이 필요합니다.");
  }

  const response = await fetch(
    `${API_BASE_URL}/api/admin/cafes/v1/monthly-schedules/${scheduleId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken,
      },
      body: JSON.stringify(payload),
    },
  );

  const data: EmptyResponse = await response.json();

  if (!response.ok || !data.isSuccess) {
    throw new Error(data.message || "월간 스케줄 수정에 실패했습니다.");
  }
}

export async function publishAdminMonthlySchedule(scheduleId: number) {
  const accessToken = getAuthToken();

  if (!accessToken) {
    throw new Error("로그인이 필요합니다.");
  }

  const response = await fetch(
    `${API_BASE_URL}/api/admin/cafes/v1/monthly-schedules/${scheduleId}/publish`,
    {
      method: "POST",
      headers: {
        Authorization: accessToken,
      },
    },
  );

  const data: EmptyResponse = await response.json();

  if (!response.ok || !data.isSuccess) {
    throw new Error(data.message || "월간 스케줄 게시에 실패했습니다.");
  }
}

export async function createAdminMenu(payload: CreateAdminMenuRequest) {
  const accessToken = getAuthToken();

  if (!accessToken) {
    throw new Error("로그인이 필요합니다.");
  }

  const response = await fetch(`${API_BASE_URL}/api/admin/cafes/v1/menus`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: accessToken,
    },
    body: JSON.stringify(payload),
  });

  const data: EmptyResponse = await response.json();

  if (!response.ok || !data.isSuccess) {
    throw new Error(data.message || "메뉴 추가에 실패했습니다.");
  }
}

export async function updateAdminMenu(
  menuId: number,
  payload: UpdateAdminMenuRequest,
) {
  const accessToken = getAuthToken();

  if (!accessToken) {
    throw new Error("로그인이 필요합니다.");
  }

  const searchParams = new URLSearchParams({ id: String(menuId) });

  const response = await fetch(
    `${API_BASE_URL}/api/admin/cafes/v1/menus?${searchParams.toString()}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken,
      },
      body: JSON.stringify(payload),
    },
  );

  const data: EmptyResponse = await response.json();

  if (!response.ok || !data.isSuccess) {
    throw new Error(data.message || "메뉴 수정에 실패했습니다.");
  }
}

export async function deleteAdminMenu(menuId: number) {
  const accessToken = getAuthToken();

  if (!accessToken) {
    throw new Error("로그인이 필요합니다.");
  }

  const searchParams = new URLSearchParams({ id: String(menuId) });

  const response = await fetch(
    `${API_BASE_URL}/api/admin/cafes/v1/menus?${searchParams.toString()}`,
    {
      method: "DELETE",
      headers: {
        Authorization: accessToken,
      },
    },
  );

  const data: EmptyResponse = await response.json();

  if (!response.ok || !data.isSuccess) {
    throw new Error(data.message || "메뉴 삭제에 실패했습니다.");
  }
}

export async function getAdminMaidInvitations(cursor?: string | null) {
  const accessToken = getAuthToken();

  if (!accessToken) {
    throw new Error("로그인이 필요합니다.");
  }

  const searchParams = new URLSearchParams();
  if (cursor) {
    searchParams.set("cursor", cursor);
  }

  const queryString = searchParams.toString();
  const response = await fetch(
    `${API_BASE_URL}/api/admin/maids/v1/invitations${queryString ? `?${queryString}` : ""}`,
    {
      headers: {
        Authorization: accessToken,
      },
    },
  );

  const data: AdminMaidInvitationPageResponse = await response.json();

  if (!response.ok || !data.isSuccess) {
    throw new Error(data.message || "메이드 초대 목록을 불러오지 못했습니다.");
  }

  return data.result;
}

export async function inviteAdminMaidProfile(maidProfileId: number) {
  const accessToken = getAuthToken();

  if (!accessToken) {
    throw new Error("로그인이 필요합니다.");
  }

  const searchParams = new URLSearchParams({ id: String(maidProfileId) });
  const response = await fetch(
    `${API_BASE_URL}/api/admin/maids/v1/invitation?${searchParams.toString()}`,
    {
      method: "POST",
      headers: {
        Authorization: accessToken,
      },
    },
  );

  const data: EmptyResponse = await response.json();

  if (!response.ok || !data.isSuccess) {
    throw new Error(data.message || "메이드 등록 요청에 실패했습니다.");
  }
}

async function requestAuth(
  path: string,
  payload: SignupRequest | LoginRequest | AdminLoginRequest,
  fallbackMessage: string,
) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data: AuthResponse = await response.json();

  if (!response.ok || !data.isSuccess) {
    throw new Error(data.message || fallbackMessage);
  }

  return data.result;
}

export function saveAuthToken(
  tokenType: string,
  accessToken: string,
  refreshToken?: string,
) {
  localStorage.setItem("accessToken", `${tokenType} ${accessToken}`);

  if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken);
  }
}

export function getAuthToken() {
  return localStorage.getItem("accessToken");
}

export function removeAuthToken() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

export function getTokenPayload(): TokenPayload | null {
  const token = getAuthToken();

  if (!token) {
    return null;
  }

  const accessToken = token.replace(/^Bearer\s+/i, "");
  const payload = accessToken.split(".")[1];

  if (!payload) {
    return null;
  }

  try {
    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decodedPayload = decodeURIComponent(
      atob(normalizedPayload)
        .split("")
        .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`)
        .join(""),
    );

    return JSON.parse(decodedPayload) as TokenPayload;
  } catch {
    return null;
  }
}

export async function getMe() {
  const accessToken = getAuthToken();

  if (!accessToken) {
    throw new Error("로그인이 필요합니다.");
  }

  const response = await fetch(`${API_BASE_URL}/auth/v2/members/me`, {
    headers: {
      Authorization: accessToken,
    },
  });

  const data: MemberInfoResponse = await response.json();

  if (!response.ok || !data.isSuccess) {
    throw new Error(data.message || "사용자 정보를 불러오지 못했습니다.");
  }

  return data.result;
}

export async function updateMember(payload: UpdateMemberRequest) {
  const accessToken = getAuthToken();

  if (!accessToken) {
    throw new Error("로그인이 필요합니다.");
  }

  const response = await fetch(`${API_BASE_URL}/auth/v1/members/update`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: accessToken,
    },
    body: JSON.stringify(payload),
  });

  const data: EmptyResponse = await response.json();

  if (!response.ok || !data.isSuccess) {
    throw new Error(data.message || "회원 정보 수정에 실패했습니다.");
  }
}

export async function deleteMember() {
  const accessToken = getAuthToken();

  if (!accessToken) {
    throw new Error("로그인이 필요합니다.");
  }

  const response = await fetch(`${API_BASE_URL}/auth/v1/members/delete`, {
    method: "DELETE",
    headers: {
      Authorization: accessToken,
    },
  });

  const data: EmptyResponse = await response.json();

  if (!response.ok || !data.isSuccess) {
    throw new Error(data.message || "회원 탈퇴에 실패했습니다.");
  }
}
