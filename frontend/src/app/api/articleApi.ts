import { getAuthToken } from "./authApi";

const API_BASE_URL = "";

export type Article = {
  articleId: number;
  memberId: number;
  name: string;
  createAt: string;
  title: string;
  contents: string;
  likeCount: number;
  comments: number;
};

type CursorPage<T> = {
  data: T[];
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

export type ArticlePayload = {
  title: string;
  contents: string;
};

function authHeaders() {
  const accessToken = getAuthToken();

  return accessToken
    ? {
        Authorization: accessToken,
      }
    : {};
}

export async function getArticles(cursor?: string | null, size = 10) {
  const searchParams = new URLSearchParams({ size: String(size) });

  if (cursor) {
    searchParams.set("cursor", cursor);
  }

  const response = await fetch(
    `${API_BASE_URL}/api/articles/v1?${searchParams.toString()}`,
    {
      headers: authHeaders(),
    },
  );
  const data: ApiResponse<CursorPage<Article>> = await response.json();

  if (!response.ok || !data.isSuccess) {
    throw new Error(data.message || "게시글을 불러오지 못했습니다.");
  }

  return data.result;
}

export async function createArticle(payload: ArticlePayload) {
  const response = await fetch(`${API_BASE_URL}/api/articles/v1`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(payload),
  });
  const data: ApiResponse<{ articleId: number }> = await response.json();

  if (!response.ok || !data.isSuccess) {
    throw new Error(data.message || "게시글 작성에 실패했습니다.");
  }

  return data.result;
}

export async function updateArticle(articleId: number, payload: ArticlePayload) {
  const response = await fetch(
    `${API_BASE_URL}/api/articles/v1?id=${articleId}`,
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
    throw new Error(data.message || "게시글 수정에 실패했습니다.");
  }
}

export async function deleteArticle(articleId: number) {
  const response = await fetch(
    `${API_BASE_URL}/api/articles/v1?id=${articleId}`,
    {
      method: "DELETE",
      headers: authHeaders(),
    },
  );
  const data: ApiResponse<null> = await response.json();

  if (!response.ok || !data.isSuccess) {
    throw new Error(data.message || "게시글 삭제에 실패했습니다.");
  }
}
