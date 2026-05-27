import { useState } from "react";
import { useParams } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Textarea } from "../components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Heart, MessageCircle, Send, Plus, Instagram, Twitter, MapPin } from "lucide-react";
import maidProfiles from "../data/maidProfiles.json";

export function MaidFeedPage() {
  const { profileId } = useParams();
  const selectedProfile =
    maidProfiles.find((profile) => profile.id === Number(profileId)) ??
    maidProfiles[0];

  const [profile] = useState(selectedProfile);
  const [posts, setPosts] = useState(selectedProfile.feedPosts);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPostCaption, setNewPostCaption] = useState("");
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});

  const handleCreatePost = () => {
    if (newPostCaption) {
      const newPost = {
        id: Math.max(0, ...posts.map((post) => post.id)) + 1,
        image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600",
        caption: newPostCaption,
        likes: 0,
        comments: [],
        timestamp: "방금 전",
      };
      setPosts([newPost, ...posts]);
      setNewPostCaption("");
      setIsDialogOpen(false);
    }
  };

  const handleLike = (postId: number) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  const handleAddComment = (postId: number) => {
    if (newComment[postId]) {
      setPosts(
        posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: [
                  ...post.comments,
                  { author: "나", text: newComment[postId] },
                ],
              }
            : post
        )
      );
      setNewComment({ ...newComment, [postId]: "" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white border-b mb-8">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <Avatar className="w-32 h-32">
                <AvatarImage src={profile.avatar} />
                <AvatarFallback>{profile.name[0]}</AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                  <h1 className="text-3xl font-bold">{profile.name}</h1>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        새 게시물
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>새 게시물 작성</DialogTitle>
                        <DialogDescription>Feed에 새로운 게시물을 올려보세요</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="post-image">이미지</Label>
                          <Input id="post-image" type="file" accept="image/*,video/*" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="post-caption">캡션</Label>
                          <Textarea
                            id="post-caption"
                            placeholder="내용을 입력하세요..."
                            rows={4}
                            value={newPostCaption}
                            onChange={(e) => setNewPostCaption(e.target.value)}
                          />
                        </div>
                        <Button onClick={handleCreatePost} className="w-full">
                          게시물 올리기
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="flex justify-center md:justify-start gap-8 mb-4">
                  <div className="text-center">
                    <span className="font-bold text-xl">{profile.posts}</span>
                    <p className="text-gray-600 text-sm">게시물</p>
                  </div>
                  <div className="text-center">
                    <span className="font-bold text-xl">{profile.followers}</span>
                    <p className="text-gray-600 text-sm">팔로워</p>
                  </div>
                  <div className="text-center">
                    <span className="font-bold text-xl">{profile.following}</span>
                    <p className="text-gray-600 text-sm">팔로잉</p>
                  </div>
                </div>

                <p className="text-gray-700 whitespace-pre-line mb-4">{profile.bio}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {profile.cafes.map((cafe, index) => (
                    <div key={index} className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{cafe}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  {profile.sns.map((sns, index) => (
                    <a
                      key={index}
                      href="#"
                      className="flex items-center gap-2 text-pink-600 hover:text-pink-700 transition"
                    >
                      {sns.type === "instagram" ? (
                        <Instagram className="w-5 h-5" />
                      ) : (
                        <Twitter className="w-5 h-5" />
                      )}
                      <span className="text-sm">{sns.handle}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Card key={post.id} className="overflow-hidden">
                <img
                  src={post.image}
                  alt="Post"
                  className="w-full h-64 object-cover cursor-pointer hover:opacity-90 transition"
                />
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <button
                      onClick={() => handleLike(post.id)}
                      className="flex items-center gap-2 text-gray-700 hover:text-pink-600 transition"
                    >
                      <Heart className="w-6 h-6" />
                      <span className="font-semibold">{post.likes}</span>
                    </button>
                    <div className="flex items-center gap-2 text-gray-700">
                      <MessageCircle className="w-6 h-6" />
                      <span className="font-semibold">{post.comments.length}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-800 mb-2">{post.caption}</p>
                  <p className="text-xs text-gray-500 mb-3">{post.timestamp}</p>

                  {post.comments.length > 0 && (
                    <div className="space-y-2 mb-3 pb-3 border-b">
                      {post.comments.map((comment, index) => (
                        <div key={index} className="text-sm">
                          <span className="font-semibold mr-2">{comment.author}</span>
                          <span className="text-gray-700">{comment.text}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Input
                      placeholder="댓글 달기..."
                      value={newComment[post.id] || ""}
                      onChange={(e) =>
                        setNewComment({ ...newComment, [post.id]: e.target.value })
                      }
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleAddComment(post.id);
                        }
                      }}
                      className="text-sm"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleAddComment(post.id)}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
