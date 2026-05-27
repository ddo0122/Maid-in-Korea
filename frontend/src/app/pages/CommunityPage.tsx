import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Textarea } from "../components/ui/textarea";
import { Input } from "../components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { MessageCircle, Heart, PenSquare, Send } from "lucide-react";
import communityPosts from "../data/communityPosts.json";

export function CommunityPage() {
  const [posts, setPosts] = useState(communityPosts);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreatePost = () => {
    if (newPostTitle && newPostContent) {
      const newPost = {
        id: Math.max(0, ...posts.map((post) => post.id)) + 1,
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

  const handleAddComment = (postId: number) => {
    if (newComment[postId]) {
      const updatedPosts = posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [
              ...post.comments,
              {
                id: Math.max(0, ...post.comments.map((comment) => comment.id)) + 1,
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
