import { useEffect, useState } from "react";
import { Save, Trash2, User } from "lucide-react";
import { useNavigate } from "react-router";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";
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
import {
  deleteMember,
  getMe,
  removeAuthToken,
  updateMember,
} from "../api/authApi";

type MemberInfo = {
  name: string;
  email: string;
  birth: string;
  address: string;
  detailAddress: string;
};

const initialForm: MemberInfo = {
  name: "",
  email: "",
  birth: "",
  address: "",
  detailAddress: "",
};

export function MyPage() {
  const navigate = useNavigate();
  const [member, setMember] = useState<MemberInfo | null>(null);
  const [form, setForm] = useState<MemberInfo>(initialForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    getMe()
      .then((data) => {
        setMember(data);
        setForm(data);
      })
      .catch((error) => {
        alert(
          error instanceof Error
            ? error.message
            : "사용자 정보를 불러오지 못했습니다.",
        );
      })
      .finally(() => setIsLoading(false));
  }, []);

  function handleChange(field: keyof MemberInfo, value: string) {
    setForm((prevForm) => ({ ...prevForm, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);

    try {
      await updateMember(form);
      setMember(form);
      alert("회원 정보가 수정되었습니다.");
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "회원 정보 수정에 실패했습니다.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteMember() {
    setIsDeleting(true);

    try {
      await deleteMember();
      removeAuthToken();
      alert("회원 탈퇴가 완료되었습니다.");
      navigate("/login", { replace: true });
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "회원 탈퇴에 실패했습니다.",
      );
      setIsDeleting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="container mx-auto px-4 py-10">
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-pink-600" />
              마이페이지
            </CardTitle>
            <CardDescription>
              회원 정보를 확인하고 필요한 내용을 수정하세요.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <p className="text-sm text-gray-500">
                회원 정보를 불러오는 중입니다.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="member-name">이름</Label>
                    <Input
                      id="member-name"
                      value={form.name}
                      onChange={(event) =>
                        handleChange("name", event.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="member-email">이메일</Label>
                    <Input
                      id="member-email"
                      type="email"
                      value={form.email}
                      onChange={(event) =>
                        handleChange("email", event.target.value)
                      }
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="member-birth">생년월일</Label>
                  <Input
                    id="member-birth"
                    type="date"
                    value={form.birth}
                    onChange={(event) =>
                      handleChange("birth", event.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="member-address">주소</Label>
                  <Input
                    id="member-address"
                    value={form.address}
                    onChange={(event) =>
                      handleChange("address", event.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="member-detail-address">상세주소</Label>
                  <Input
                    id="member-detail-address"
                    value={form.detailAddress}
                    onChange={(event) =>
                      handleChange("detailAddress", event.target.value)
                    }
                    required
                  />
                </div>
                <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                        disabled={isSaving || isDeleting}
                      >
                        <Trash2 className="h-4 w-4" />
                        회원 탈퇴
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>회원 탈퇴</AlertDialogTitle>
                        <AlertDialogDescription>
                          탈퇴하면 현재 계정으로 다시 로그인할 수 없습니다.
                          계속 진행하시겠습니까?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>
                          취소
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteMember}
                          disabled={isDeleting}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {isDeleting ? "탈퇴 중" : "탈퇴하기"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <Button type="submit" disabled={isSaving || !member}>
                    <Save className="h-4 w-4" />
                    {isSaving ? "저장 중" : "저장"}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
