import { useState } from "react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Plus, Edit, Trash2, Instagram, Twitter, ExternalLink } from "lucide-react";
import maidProfiles from "../data/maidProfiles.json";

export function MaidProfilePage() {
  const [profiles, setProfiles] = useState(maidProfiles);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProfileName, setNewProfileName] = useState("");
  const [newProfileBio, setNewProfileBio] = useState("");

  const handleCreateProfile = () => {
    if (newProfileName && newProfileBio) {
      const newProfile = {
        id: Math.max(0, ...profiles.map((profile) => profile.id)) + 1,
        name: newProfileName,
        bio: newProfileBio,
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
        followers: 0,
        following: 0,
        posts: 0,
        cafes: [],
        sns: [],
        feedPosts: [],
      };
      setProfiles([...profiles, newProfile]);
      setNewProfileName("");
      setNewProfileBio("");
      setIsDialogOpen(false);
    }
  };

  const handleDeleteProfile = (id: number) => {
    setProfiles(profiles.filter((profile) => profile.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">메이드 프로필 관리</h1>
            <p className="text-gray-600">여러 프로필을 생성하고 관리하세요</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg">
                <Plus className="w-5 h-5 mr-2" />
                새 프로필 생성
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>새 메이드 프로필 생성</DialogTitle>
                <DialogDescription>새로운 메이드 프로필을 생성하세요</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="profile-name">이름</Label>
                  <Input
                    id="profile-name"
                    placeholder="프로필 이름"
                    value={newProfileName}
                    onChange={(e) => setNewProfileName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile-bio">소개글</Label>
                  <Textarea
                    id="profile-bio"
                    placeholder="자기소개를 입력하세요"
                    rows={4}
                    value={newProfileBio}
                    onChange={(e) => setNewProfileBio(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile-avatar">프로필 이미지</Label>
                  <Input id="profile-avatar" type="file" accept="image/*" />
                </div>
                <Button onClick={handleCreateProfile} className="w-full">
                  프로필 생성
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile) => (
            <Card key={profile.id} className="overflow-hidden">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profile.avatar} />
                    <AvatarFallback>{profile.name[0]}</AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle>{profile.name}</CardTitle>
                <CardDescription className="text-xs">ID: {profile.id}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-4">{profile.bio}</p>

                {profile.cafes.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold mb-2">근무 중인 카페:</p>
                    <div className="space-y-1">
                      {profile.cafes.map((cafe, index) => (
                        <p key={index} className="text-xs text-gray-600">
                          • {cafe}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {profile.sns.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold mb-2">SNS:</p>
                    <div className="flex gap-2">
                      {profile.sns.map((sns, index) => (
                        <a
                          key={index}
                          href="#"
                          className="text-pink-600 hover:text-pink-700 transition"
                        >
                          {sns.type === "instagram" ? (
                            <Instagram className="w-5 h-5" />
                          ) : (
                            <Twitter className="w-5 h-5" />
                          )}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <Link to={`/maid/feed/${profile.id}`} className="flex-1">
                    <Button variant="outline" className="w-full" size="sm">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Feed 보기
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteProfile(profile.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {profiles.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-gray-500 mb-4">아직 생성된 프로필이 없습니다.</p>
            <p className="text-sm text-gray-400 mb-6">
              새 프로필을 생성하여 여러 카페에서 활동할 수 있습니다.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-5 h-5 mr-2" />
              첫 프로필 만들기
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
