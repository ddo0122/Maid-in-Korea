import { getAuthToken } from "./authApi";

const API_BASE_URL = "";

export type Feed = {
  feedId: number;
  description: string;
  likeCount: number;
  createdAt: string | null;
};

type ApiResponse<T> = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
};

function authHeaders() {
  const accessToken = getAuthToken();

  return accessToken
    ? {
        Authorization: accessToken,
      }
    : {};
}

async function parseResponse<T>(response: Response, fallbackMessage: string) {
  const data: ApiResponse<T> = await response.json();

  if (!response.ok || !data.isSuccess) {
    throw new Error(data.message || fallbackMessage);
  }

  return data.result;
}

export async function getFeeds(maidProfileId: number) {
  const response = await fetch(
    `${API_BASE_URL}/api/feeds/v1/getFeed/${maidProfileId}`,
    {
      headers: authHeaders(),
    },
  );

  return parseResponse<Feed[]>(response, "피드를 불러오지 못했습니다.");
}

export async function createFeed(maidProfileId: number, description: string) {
  const response = await fetch(`${API_BASE_URL}/api/feeds/v1/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({
      maidProfileId,
      description,
    }),
  });

  await parseResponse<null>(response, "피드 작성에 실패했습니다.");
}

export async function updateFeed(feedId: number, description: string) {
  const response = await fetch(`${API_BASE_URL}/api/feeds/v1?id=${feedId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({ description }),
  });

  await parseResponse<null>(response, "피드 수정에 실패했습니다.");
}

export async function deleteFeed(feedId: number) {
  const response = await fetch(`${API_BASE_URL}/api/feeds/v1?id=${feedId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  await parseResponse<null>(response, "피드 삭제에 실패했습니다.");
}
