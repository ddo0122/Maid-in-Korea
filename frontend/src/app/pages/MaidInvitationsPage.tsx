import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, Check, X } from "lucide-react";
import {
  getMaidInvitations,
  respondMaidInvitation,
  type MaidInvitation,
} from "../api/maidApi";

function getStatusLabel(status: string) {
  if (status === "ACCEPTED") {
    return "수락됨";
  }
  if (status === "REJECTED") {
    return "거절됨";
  }
  return "대기중";
}

function getStatusVariant(status: string) {
  if (status === "ACCEPTED") {
    return "default" as const;
  }
  if (status === "REJECTED") {
    return "destructive" as const;
  }
  return "secondary" as const;
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

export function MaidInvitationsPage() {
  const [invitations, setInvitations] = useState<MaidInvitation[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasNext, setHasNext] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  async function fetchInvitations(cursor?: string | null) {
    try {
      setIsLoading(true);
      setErrorMessage("");
      const page = await getMaidInvitations(cursor);

      setInvitations((prevInvitations) =>
        cursor ? [...prevInvitations, ...page.data] : page.data,
      );
      setNextCursor(page.nextCursor);
      setHasNext(page.hasNext);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "받은 요청을 불러오지 못했습니다.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchInvitations();
  }, []);

  async function handleInvitation(invitationId: number, status: boolean) {
    try {
      setProcessingId(invitationId);
      setErrorMessage("");
      await respondMaidInvitation(invitationId, status);
      await fetchInvitations();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "요청 처리에 실패했습니다.",
      );
    } finally {
      setProcessingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="mb-2 text-4xl font-bold">받은 요청</h1>
            <p className="text-gray-600">
              카페에서 내 메이드 프로필로 보낸 등록 요청을 확인하세요
            </p>
          </div>
          <Link to="/maid/profile">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              프로필 관리
            </Button>
          </Link>
        </div>

        {errorMessage && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {errorMessage}
          </div>
        )}

        {isLoading && invitations.length === 0 && (
          <div className="py-16 text-center text-gray-500">
            받은 요청을 불러오는 중입니다.
          </div>
        )}

        {!isLoading && invitations.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-gray-500">아직 받은 요청이 없습니다.</p>
          </Card>
        )}

        <div className="space-y-4">
          {invitations.map((invitation) => {
            const isPending = invitation.status === "PENDING";
            const isProcessing = processingId === invitation.invitationId;

            return (
              <Card key={invitation.invitationId}>
                <CardHeader>
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <CardTitle>{invitation.cafeName}</CardTitle>
                      <CardDescription>
                        {invitation.maidProfileName} 프로필로 온 요청
                      </CardDescription>
                    </div>
                    <Badge variant={getStatusVariant(invitation.status)}>
                      {getStatusLabel(invitation.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 grid grid-cols-1 gap-3 text-sm text-gray-600 md:grid-cols-2">
                    <p>초대 ID: {invitation.invitationId}</p>
                    <p>프로필 ID: {invitation.maidProfileId}</p>
                    <p>요청일: {formatDateTime(invitation.createdAt)}</p>
                    <p>수정일: {formatDateTime(invitation.updatedAt)}</p>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                    <Button
                      variant="outline"
                      disabled={!isPending || isProcessing}
                      onClick={() => handleInvitation(invitation.invitationId, false)}
                    >
                      <X className="mr-2 h-4 w-4" />
                      거절
                    </Button>
                    <Button
                      disabled={!isPending || isProcessing}
                      onClick={() => handleInvitation(invitation.invitationId, true)}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      수락
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {hasNext && (
          <Button
            variant="outline"
            className="mt-6 w-full"
            disabled={isLoading}
            onClick={() => fetchInvitations(nextCursor)}
          >
            {isLoading ? "불러오는 중" : "더 보기"}
          </Button>
        )}
      </div>
    </div>
  );
}
