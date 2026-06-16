import { getAuthToken } from "./authApi";

const API_BASE_URL = "";

export type MaidProfile = {
  profileId: number;
  name: string;
  description: string | null;
  serviceArea: string | null;
  instagram: string | null;
  x: string | null;
  isActive: boolean;
};

export type MaidProfilePayload = {
  name: string;
  description?: string;
  serviceArea?: string;
  instagram?: string;
  x?: string;
  isActive?: boolean;
};

export type MaidInvitation = {
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

export type MaidInvitationPage = {
  data: MaidInvitation[];
  hasNext: boolean;
  nextCursor: string | null;
  pageSize: number;
};

type ApiResponse<T> = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
};

function getApiErrorMessage<T>(
  data: ApiResponse<T>,
  fallbackMessage: string,
) {
  if (typeof data.result === "string" && data.result.trim()) {
    return data.result;
  }

  return data.message || fallbackMessage;
}

function authHeaders() {
  const accessToken = getAuthToken();

  return accessToken
    ? {
        Authorization: accessToken,
      }
    : {};
}

export async function getMaidProfiles() {
  const response = await fetch(`${API_BASE_URL}/api/maids/v1/profiles`, {
    headers: authHeaders(),
  });
  const data: ApiResponse<MaidProfile[]> = await response.json();

  if (!response.ok || !data.isSuccess) {
    throw new Error(getApiErrorMessage(data, "메이드 프로필을 불러오지 못했습니다."));
  }

  return data.result;
}

export async function createMaidProfile(payload: MaidProfilePayload) {
  const response = await fetch(`${API_BASE_URL}/api/maids/v1/profiles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({
      ...payload,
      isActive: payload.isActive ?? true,
    }),
  });
  const data: ApiResponse<null> = await response.json();

  if (!response.ok || !data.isSuccess) {
    throw new Error(getApiErrorMessage(data, "메이드 프로필 생성에 실패했습니다."));
  }
}

export async function updateMaidProfile(
  profileId: number,
  payload: Omit<MaidProfilePayload, "isActive">,
) {
  const response = await fetch(
    `${API_BASE_URL}/api/maids/v1/profiles?profileId=${profileId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify(payload),
    },
  );
  const data: ApiResponse<null> = await response.json();

  if (!response.ok || !data.isSuccess) {
    throw new Error(getApiErrorMessage(data, "메이드 프로필 수정에 실패했습니다."));
  }
}

export async function deleteMaidProfile(profileId: number) {
  const response = await fetch(
    `${API_BASE_URL}/api/maids/v1/profiles?profileId=${profileId}`,
    {
      method: "DELETE",
      headers: authHeaders(),
    },
  );
  const data: ApiResponse<null> = await response.json();

  if (!response.ok || !data.isSuccess) {
    throw new Error(getApiErrorMessage(data, "메이드 프로필 삭제에 실패했습니다."));
  }
}

export async function getMaidInvitations(cursor?: string | null) {
  const searchParams = new URLSearchParams();
  if (cursor) {
    searchParams.set("cursor", cursor);
  }

  const queryString = searchParams.toString();
  const response = await fetch(
    `${API_BASE_URL}/api/maids/v1/invitations${queryString ? `?${queryString}` : ""}`,
    {
      headers: authHeaders(),
    },
  );
  const data: ApiResponse<MaidInvitationPage> = await response.json();

  if (!response.ok || !data.isSuccess) {
    throw new Error(getApiErrorMessage(data, "받은 요청을 불러오지 못했습니다."));
  }

  return data.result;
}

export async function respondMaidInvitation(
  invitationId: number,
  status: boolean,
) {
  const searchParams = new URLSearchParams({ status: String(status) });
  const response = await fetch(
    `${API_BASE_URL}/api/maids/v1/invitations/${invitationId}?${searchParams.toString()}`,
    {
      method: "PATCH",
      headers: authHeaders(),
    },
  );
  const data: ApiResponse<null> = await response.json();

  if (!response.ok || !data.isSuccess) {
    throw new Error(getApiErrorMessage(data, "요청 처리에 실패했습니다."));
  }
}
