import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Textarea } from "../components/ui/textarea";
import { Input } from "../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { MessageCircle, Heart, PenSquare, Pencil, Trash2 } from "lucide-react";
import {
  createArticle,
  deleteArticle,
  getArticles,
  updateArticle,
  type Article,
} from "../api/articleApi";
import { getTokenPayload } from "../api/authApi";

const PAGE_SIZE = 10;

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("ko-KR", {
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function CommunityPage() {
  const currentMemberId = Number(getTokenPayload()?.sub);
  const [posts, setPosts] = useState<Article[]>([]);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [editPostId, setEditPostId] = useState<number | null>(null);
  const [editPostTitle, setEditPostTitle] = useState("");
  const [editPostContent, setEditPostContent] = useState("");
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasNext, setHasNext] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  async function fetchPosts(cursor?: string | null) {
    try {
      setIsLoading(true);
      setErrorMessage("");
      const page = await getArticles(cursor, PAGE_SIZE);

      setPosts((prevPosts) =>
        cursor ? [...prevPosts, ...page.data] : page.data,
      );
      setNextCursor(page.nextCursor);
      setHasNext(page.hasNext);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "게시글을 불러오지 못했습니다.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  async function handleCreatePost() {
    const title = newPostTitle.trim();
    const contents = newPostContent.trim();

    if (!title || !contents) {
      setErrorMessage("제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");
      await createArticle({ title, contents });
      setNewPostTitle("");
      setNewPostContent("");
      setIsDialogOpen(false);
      await fetchPosts();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "게시글 작성에 실패했습니다.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function openEditDialog(post: Article) {
    setEditPostId(post.articleId);
    setEditPostTitle(post.title);
    setEditPostContent(post.contents);
  }

  async function handleUpdatePost() {
    const title = editPostTitle.trim();
    const contents = editPostContent.trim();

    if (!editPostId || !title || !contents) {
      setErrorMessage("제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");
      await updateArticle(editPostId, { title, contents });
      setEditPostId(null);
      await fetchPosts();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "게시글 수정에 실패했습니다.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeletePost(articleId: number) {
    try {
      setIsSubmitting(true);
      setErrorMessage("");
      await deleteArticle(articleId);
      setPosts((prevPosts) =>
        prevPosts.filter((post) => post.articleId !== articleId),
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "게시글 삭제에 실패했습니다.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="mb-2 text-4xl font-bold">커뮤니티</h1>
            <p className="text-gray-600">
              메이드 카페에 대한 이야기를 나눠보세요
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg">
                <PenSquare className="mr-2 h-5 w-5" />
                글쓰기
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>새 게시글 작성</DialogTitle>
                <DialogDescription>
                  커뮤니티에 게시글을 작성해보세요
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">제목</Label>
                  <Input
                    id="title"
                    placeholder="제목을 입력하세요"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">내용</Label>
                  <Textarea
                    id="content"
                    placeholder="내용을 입력하세요"
                    rows={6}
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleCreatePost}
                  className="w-full"
                  disabled={isSubmitting}
                >
                  게시글 작성
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {errorMessage && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {errorMessage}
          </div>
        )}

        {isLoading && posts.length === 0 && (
          <div className="py-16 text-center text-gray-500">
            게시글을 불러오는 중입니다.
          </div>
        )}

        {!isLoading && posts.length === 0 && !errorMessage && (
          <div className="py-16 text-center text-gray-500">
            등록된 게시글이 없습니다.
          </div>
        )}

        <div className="space-y-6">
          {posts.map((post) => (
            <Card key={post.articleId}>
              <CardHeader>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{post.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{post.name}</p>
                      <p className="text-sm text-gray-500">
                        {formatDateTime(post.createAt)}
                      </p>
                    </div>
                  </div>
                  {post.memberId === currentMemberId && (
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(post)}
                        disabled={isSubmitting}
                        aria-label="게시글 수정"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeletePost(post.articleId)}
                        disabled={isSubmitting}
                        aria-label="게시글 삭제"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                <CardTitle>{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 whitespace-pre-wrap text-gray-700">
                  {post.contents}
                </p>
                <div className="flex items-center gap-6 text-gray-600">
                  <span className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    {post.likeCount}
                  </span>
                  <span className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    {post.comments}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {hasNext && (
          <div className="mt-8 flex justify-center">
            <Button
              variant="outline"
              onClick={() => fetchPosts(nextCursor)}
              disabled={isLoading}
            >
              더보기
            </Button>
          </div>
        )}
      </div>

      <Dialog
        open={editPostId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setEditPostId(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>게시글 수정</DialogTitle>
            <DialogDescription>작성한 게시글을 수정합니다.</DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">제목</Label>
              <Input
                id="edit-title"
                value={editPostTitle}
                onChange={(e) => setEditPostTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-content">내용</Label>
              <Textarea
                id="edit-content"
                rows={6}
                value={editPostContent}
                onChange={(e) => setEditPostContent(e.target.value)}
              />
            </div>
            <Button
              onClick={handleUpdatePost}
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
