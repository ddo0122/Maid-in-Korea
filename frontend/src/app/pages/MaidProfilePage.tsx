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
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Plus, Edit, Trash2, Instagram, Twitter, ExternalLink, Inbox } from "lucide-react";
import {
  createMaidProfile,
  deleteMaidProfile,
  getMaidProfiles,
  updateMaidProfile,
  type MaidProfile,
} from "../api/maidApi";

type ProfileForm = {
  name: string;
  description: string;
  serviceArea: string;
  instagram: string;
  x: string;
};

const EMPTY_FORM: ProfileForm = {
  name: "",
  description: "",
  serviceArea: "",
  instagram: "",
  x: "",
};

function toPayload(form: ProfileForm) {
  return {
    name: form.name.trim(),
    description: form.description.trim(),
    serviceArea: form.serviceArea.trim(),
    instagram: form.instagram.trim(),
    x: form.x.trim(),
  };
}

export function MaidProfilePage() {
  const [profiles, setProfiles] = useState<MaidProfile[]>([]);
  const [createForm, setCreateForm] = useState<ProfileForm>(EMPTY_FORM);
  const [editForm, setEditForm] = useState<ProfileForm>(EMPTY_FORM);
  const [editingProfileId, setEditingProfileId] = useState<number | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function fetchProfiles() {
    try {
      setIsLoading(true);
      setErrorMessage("");
      const profileList = await getMaidProfiles();
      setProfiles(profileList);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "메이드 프로필을 불러오지 못했습니다.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchProfiles();
  }, []);

  async function handleCreateProfile() {
    const payload = toPayload(createForm);

    if (!payload.name) {
      setErrorMessage("프로필 이름을 입력해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");
      await createMaidProfile(payload);
      setCreateForm(EMPTY_FORM);
      setIsCreateDialogOpen(false);
      await fetchProfiles();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "메이드 프로필 생성에 실패했습니다.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function openEditDialog(profile: MaidProfile) {
    setEditingProfileId(profile.profileId);
    setEditForm({
      name: profile.name,
      description: profile.description ?? "",
      serviceArea: profile.serviceArea ?? "",
      instagram: profile.instagram ?? "",
      x: profile.x ?? "",
    });
  }

  async function handleUpdateProfile() {
    if (!editingProfileId) {
      return;
    }

    const payload = toPayload(editForm);

    if (!payload.name) {
      setErrorMessage("프로필 이름을 입력해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");
      await updateMaidProfile(editingProfileId, payload);
      setEditingProfileId(null);
      await fetchProfiles();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "메이드 프로필 수정에 실패했습니다.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteProfile(profileId: number) {
    try {
      setIsSubmitting(true);
      setErrorMessage("");
      await deleteMaidProfile(profileId);
      setProfiles((prevProfiles) =>
        prevProfiles.filter((profile) => profile.profileId !== profileId),
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "메이드 프로필 삭제에 실패했습니다.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="mb-2 text-4xl font-bold">메이드 프로필 관리</h1>
            <p className="text-gray-600">여러 프로필을 생성하고 관리하세요</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link to="/maid/invitations">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <Inbox className="mr-2 h-5 w-5" />
                받은 요청
              </Button>
            </Link>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg">
                  <Plus className="mr-2 h-5 w-5" />
                  새 프로필 생성
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>새 메이드 프로필 생성</DialogTitle>
                  <DialogDescription>
                    새로운 메이드 프로필을 생성하세요
                  </DialogDescription>
                </DialogHeader>
                <ProfileFormFields form={createForm} onChange={setCreateForm} />
                <Button
                  onClick={handleCreateProfile}
                  className="w-full"
                  disabled={isSubmitting}
                >
                  프로필 생성
                </Button>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {errorMessage}
          </div>
        )}

        {isLoading && (
          <div className="py-16 text-center text-gray-500">
            메이드 프로필을 불러오는 중입니다.
          </div>
        )}

        {!isLoading && profiles.length === 0 && (
          <Card className="p-12 text-center">
            <p className="mb-4 text-gray-500">아직 생성된 프로필이 없습니다.</p>
            <p className="mb-6 text-sm text-gray-400">
              새 프로필을 생성하여 여러 카페에서 활동할 수 있습니다.
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-5 w-5" />
              첫 프로필 만들기
            </Button>
          </Card>
        )}

        {!isLoading && profiles.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {profiles.map((profile) => (
              <Card key={profile.profileId} className="overflow-hidden">
                <CardHeader className="text-center">
                  <div className="mb-4 flex justify-center">
                    <Avatar className="h-24 w-24">
                      <AvatarFallback>{profile.name[0]}</AvatarFallback>
                    </Avatar>
                  </div>
                  <CardTitle>{profile.name}</CardTitle>
                  <CardDescription className="text-xs">
                    ID: {profile.profileId}
                  </CardDescription>
                  <div>
                    <Badge variant={profile.isActive ? "default" : "secondary"}>
                      {profile.isActive ? "활성" : "비활성"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-gray-700">
                    {profile.description || "등록된 소개가 없습니다."}
                  </p>

                  <div className="mb-4 space-y-2 text-sm">
                    <p>
                      <span className="font-semibold">서비스 지역: </span>
                      {profile.serviceArea || "미등록"}
                    </p>
                    <div className="flex gap-2">
                      {profile.instagram && (
                        <span className="flex items-center gap-1 text-pink-600">
                          <Instagram className="h-4 w-4" />
                          {profile.instagram}
                        </span>
                      )}
                      {profile.x && (
                        <span className="flex items-center gap-1 text-pink-600">
                          <Twitter className="h-4 w-4" />
                          {profile.x}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Link to={`/maid/feed/${profile.profileId}`} className="flex-1">
                      <Button variant="outline" className="w-full" size="sm">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Feed 보기
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(profile)}
                      disabled={isSubmitting}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteProfile(profile.profileId)}
                      disabled={isSubmitting}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog
        open={editingProfileId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setEditingProfileId(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>메이드 프로필 수정</DialogTitle>
            <DialogDescription>프로필 정보를 수정합니다.</DialogDescription>
          </DialogHeader>
          <ProfileFormFields form={editForm} onChange={setEditForm} />
          <Button
            onClick={handleUpdateProfile}
            className="w-full"
            disabled={isSubmitting}
          >
            수정 완료
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ProfileFormFields({
  form,
  onChange,
}: {
  form: ProfileForm;
  onChange: (form: ProfileForm) => void;
}) {
  return (
    <div className="mt-4 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="profile-name">이름</Label>
        <Input
          id="profile-name"
          placeholder="프로필 이름"
          value={form.name}
          onChange={(e) => onChange({ ...form, name: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="profile-description">소개글</Label>
        <Textarea
          id="profile-description"
          placeholder="자기소개를 입력하세요"
          rows={4}
          value={form.description}
          onChange={(e) => onChange({ ...form, description: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="profile-service-area">서비스 지역</Label>
        <Input
          id="profile-service-area"
          placeholder="예: 서울 홍대"
          value={form.serviceArea}
          onChange={(e) => onChange({ ...form, serviceArea: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="profile-instagram">Instagram</Label>
          <Input
            id="profile-instagram"
            placeholder="instagram_id"
            value={form.instagram}
            onChange={(e) => onChange({ ...form, instagram: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="profile-x">X</Label>
          <Input
            id="profile-x"
            placeholder="x_id"
            value={form.x}
            onChange={(e) => onChange({ ...form, x: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
