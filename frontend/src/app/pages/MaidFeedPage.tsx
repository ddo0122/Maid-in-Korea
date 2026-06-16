import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Textarea } from "../components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Heart, Instagram, MapPin, Plus, Trash2, Twitter, Edit } from "lucide-react";
import {
  createFeed,
  deleteFeed,
  getFeeds,
  updateFeed,
  type Feed,
} from "../api/feedApi";
import { getMaidProfiles, type MaidProfile } from "../api/maidApi";

function formatCreatedAt(createdAt: string | null) {
  if (!createdAt) {
    return "";
  }

  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function MaidFeedPage() {
  const { profileId } = useParams();
  const navigate = useNavigate();
  const maidProfileId = Number(profileId);

  const [profiles, setProfiles] = useState<MaidProfile[]>([]);
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newFeedDescription, setNewFeedDescription] = useState("");
  const [editingFeedId, setEditingFeedId] = useState<number | null>(null);
  const [editDescription, setEditDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const profile = useMemo(
    () => profiles.find((item) => item.profileId === maidProfileId) ?? null,
    [maidProfileId, profiles],
  );

  async function fetchPageData() {
    if (!Number.isFinite(maidProfileId)) {
      setErrorMessage("잘못된 메이드 프로필입니다.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");
      const [profileList, feedList] = await Promise.all([
        getMaidProfiles(),
        getFeeds(maidProfileId),
      ]);
      setProfiles(profileList);
      setFeeds(feedList);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "피드 정보를 불러오지 못했습니다.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchPageData();
  }, [maidProfileId]);

  async function handleCreateFeed() {
    const description = newFeedDescription.trim();

    if (!description) {
      setErrorMessage("피드 내용을 입력해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");
      await createFeed(maidProfileId, description);
      setNewFeedDescription("");
      setIsDialogOpen(false);
      setFeeds(await getFeeds(maidProfileId));
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "피드 작성에 실패했습니다.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function openEditDialog(feed: Feed) {
    setEditingFeedId(feed.feedId);
    setEditDescription(feed.description);
  }

  async function handleUpdateFeed() {
    if (!editingFeedId) {
      return;
    }

    const description = editDescription.trim();

    if (!description) {
      setErrorMessage("피드 내용을 입력해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");
      await updateFeed(editingFeedId, description);
      setEditingFeedId(null);
      setFeeds(await getFeeds(maidProfileId));
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "피드 수정에 실패했습니다.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteFeed(feedId: number) {
    try {
      setIsSubmitting(true);
      setErrorMessage("");
      await deleteFeed(feedId);
      setFeeds((prevFeeds) => prevFeeds.filter((feed) => feed.feedId !== feedId));
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "피드 삭제에 실패했습니다.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 border-b bg-white">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
              <Avatar className="h-32 w-32">
                <AvatarFallback className="text-4xl">
                  {profile?.name?.[0] ?? "M"}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center md:text-left">
                <div className="mb-4 flex flex-col items-center gap-4 md:flex-row">
                  <h1 className="text-3xl font-bold">
                    {profile?.name ?? "메이드 피드"}
                  </h1>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button disabled={isLoading || !profile}>
                        <Plus className="mr-2 h-4 w-4" />
                        새 게시물
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>새 게시물 작성</DialogTitle>
                        <DialogDescription>
                          Feed에 새로운 게시물을 올려보세요
                        </DialogDescription>
                      </DialogHeader>
                      <div className="mt-4 space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="post-caption">내용</Label>
                          <Textarea
                            id="post-caption"
                            placeholder="내용을 입력하세요..."
                            rows={5}
                            value={newFeedDescription}
                            onChange={(event) =>
                              setNewFeedDescription(event.target.value)
                            }
                          />
                        </div>
                        <Button
                          onClick={handleCreateFeed}
                          className="w-full"
                          disabled={isSubmitting}
                        >
                          게시물 올리기
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="mb-4 flex justify-center gap-8 md:justify-start">
                  <div className="text-center">
                    <span className="text-xl font-bold">{feeds.length}</span>
                    <p className="text-sm text-gray-600">게시물</p>
                  </div>
                </div>

                <p className="mb-4 whitespace-pre-line text-gray-700">
                  {profile?.description ?? "프로필 정보를 불러오는 중입니다."}
                </p>

                {profile?.serviceArea && (
                  <div className="mb-4 flex flex-wrap justify-center gap-2 md:justify-start">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{profile.serviceArea}</span>
                    </div>
                  </div>
                )}

                <div className="flex justify-center gap-3 md:justify-start">
                  {profile?.instagram && (
                    <span className="flex items-center gap-2 text-pink-600">
                      <Instagram className="h-5 w-5" />
                      <span className="text-sm">{profile.instagram}</span>
                    </span>
                  )}
                  {profile?.x && (
                    <span className="flex items-center gap-2 text-pink-600">
                      <Twitter className="h-5 w-5" />
                      <span className="text-sm">{profile.x}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 pb-8">
          {errorMessage && (
            <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">
              {errorMessage}
            </div>
          )}

          {isLoading && (
            <div className="py-16 text-center text-gray-500">
              메이드 피드를 불러오는 중입니다.
            </div>
          )}

          {!isLoading && !profile && (
            <div className="rounded border bg-white px-6 py-12 text-center">
              <p className="mb-4 text-gray-600">프로필을 찾을 수 없습니다.</p>
              <Button onClick={() => navigate("/maid/profile")}>
                프로필 관리로 이동
              </Button>
            </div>
          )}

          {!isLoading && profile && feeds.length === 0 && (
            <div className="rounded border bg-white px-6 py-16 text-center text-gray-500">
              아직 등록된 피드가 없습니다.
            </div>
          )}

          {!isLoading && profile && feeds.length > 0 && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {feeds.map((feed) => (
                <Card key={feed.feedId} className="overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between gap-3 border-b p-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{profile.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate font-semibold">{profile.name}</p>
                        <p className="text-xs text-gray-500">
                          {formatCreatedAt(feed.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => openEditDialog(feed)}
                        disabled={isSubmitting}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDeleteFeed(feed.feedId)}
                        disabled={isSubmitting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <p className="mb-4 min-h-24 whitespace-pre-line text-sm text-gray-800">
                      {feed.description}
                    </p>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Heart className="h-5 w-5" />
                      <span className="font-semibold">{feed.likeCount}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog open={editingFeedId !== null} onOpenChange={() => setEditingFeedId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>게시물 수정</DialogTitle>
            <DialogDescription>피드 내용을 수정하세요</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              rows={5}
              value={editDescription}
              onChange={(event) => setEditDescription(event.target.value)}
            />
            <Button
              onClick={handleUpdateFeed}
              className="w-full"
              disabled={isSubmitting}
            >
              수정 완료
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
