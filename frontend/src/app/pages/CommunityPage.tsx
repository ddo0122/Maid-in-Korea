import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Textarea } from "../components/ui/textarea";
import { Input } from "../components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { MessageCircle, Heart, PenSquare, Send } from "lucide-react";

const mockPosts = [
  {
    id: "1",
    author: "카페러버",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
    title: "강남 메이드 카페 후기",
    content: "오늘 강남에 있는 메이드 카페에 다녀왔어요! 정말 친절하고 음식도 맛있었습니다.",
    timestamp: "1시간 전",
    likes: 24,
    comments: [
      { id: "1", author: "메이드팬", content: "저도 거기 가봤는데 정말 좋더라구요!", timestamp: "30분 전" },
    ],
  },
  {
    id: "2",
    author: "메이드덕후",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100",
    title: "홍대 신규 오픈 카페 정보",
    content: "홍대에 새로운 메이드 카페가 오픈했다고 하네요. 다음 주에 가볼 예정입니다!",
    timestamp: "3시간 전",
    likes: 45,
    comments: [],
  },
  {
    id: "3",
    author: "스윗걸",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    title: "메이드 카페 추천 메뉴",
    content: "메이드 카페에서 꼭 먹어봐야 할 메뉴 추천해드릴게요. 오므라이스는 기본이고...",
    timestamp: "5시간 전",
    likes: 67,
    comments: [
      { id: "1", author: "푸드러버", content: "오므라이스 정말 맛있죠!", timestamp: "2시간 전" },
      { id: "2", author: "디저트킹", content: "파르페도 추천합니다~", timestamp: "1시간 전" },
    ],
  },
];

export function CommunityPage() {
  const [posts, setPosts] = useState(mockPosts);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreatePost = () => {
    if (newPostTitle && newPostContent) {
      const newPost = {
        id: String(posts.length + 1),
        author: "나",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
        title: newPostTitle,
        content: newPostContent,
        timestamp: "방금 전",
        likes: 0,
        comments: [],
      };
      setPosts([newPost, ...posts]);
      setNewPostTitle("");
      setNewPostContent("");
      setIsDialogOpen(false);
    }
  };

  const handleAddComment = (postId: string) => {
    if (newComment[postId]) {
      const updatedPosts = posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [
              ...post.comments,
              {
                id: String(post.comments.length + 1),
                author: "나",
                content: newComment[postId],
                timestamp: "방금 전",
              },
            ],
          };
        }
        return post;
      });
      setPosts(updatedPosts);
      setNewComment({ ...newComment, [postId]: "" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">커뮤니티</h1>
            <p className="text-gray-600">메이드 카페에 대한 이야기를 나눠보세요</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg">
                <PenSquare className="w-5 h-5 mr-2" />
                글쓰기
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>새 게시글 작성</DialogTitle>
                <DialogDescription>커뮤니티에 게시글을 작성해보세요</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
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
                <Button onClick={handleCreatePost} className="w-full">
                  게시글 작성
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-6">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Avatar>
                    <AvatarImage src={post.avatar} />
                    <AvatarFallback>{post.author[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{post.author}</p>
                    <p className="text-sm text-gray-500">{post.timestamp}</p>
                  </div>
                </div>
                <CardTitle>{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{post.content}</p>
                <div className="flex items-center gap-6 mb-4 text-gray-600">
                  <button className="flex items-center gap-2 hover:text-pink-600 transition">
                    <Heart className="w-5 h-5" />
                    <span>{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 hover:text-pink-600 transition">
                    <MessageCircle className="w-5 h-5" />
                    <span>{post.comments.length}</span>
                  </button>
                </div>

                {post.comments.length > 0 && (
                  <div className="space-y-3 mb-4 pl-4 border-l-2 border-gray-200">
                    {post.comments.map((comment) => (
                      <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-sm">{comment.author}</span>
                          <span className="text-xs text-gray-500">{comment.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-700">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <Input
                    placeholder="댓글을 입력하세요..."
                    value={newComment[post.id] || ""}
                    onChange={(e) =>
                      setNewComment({ ...newComment, [post.id]: e.target.value })
                    }
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleAddComment(post.id);
                      }
                    }}
                  />
                  <Button onClick={() => handleAddComment(post.id)} size="icon">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
