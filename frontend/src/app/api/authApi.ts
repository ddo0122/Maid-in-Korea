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

async function requestAuth(
  path: string,
  payload: SignupRequest | LoginRequest,
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
