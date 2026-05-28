const API_BASE_URL = "";

type AuthResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    accessToken: string;
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
  const response = await fetch(`${API_BASE_URL}/auth/sign-up`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data: AuthResponse = await response.json();

  if (!response.ok || !data.isSuccess) {
    throw new Error(data.message || "회원가입에 실패했습니다.");
  }

  return data.result;
}

export async function login(payload: LoginRequest) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data: AuthResponse = await response.json();

  if (!response.ok || !data.isSuccess) {
    throw new Error(data.message || "로그인에 실패했습니다.");
  }

  return data.result;
}

export function saveAuthToken(tokenType: string, accessToken: string) {
  localStorage.setItem("accessToken", `${tokenType} ${accessToken}`);
}

export function getAuthToken() {
  return localStorage.getItem("accessToken");
}

export function removeAuthToken() {
  localStorage.removeItem("accessToken");
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

  const response = await fetch(`${API_BASE_URL}/auth/v2/users/me`, {
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
