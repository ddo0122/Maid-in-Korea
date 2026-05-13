import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Plus, Edit, Trash2, UserPlus } from "lucide-react";

export function AdminCafeManagementPage() {
  const [cafeName, setCafeName] = useState("카페 메이드 서울");
  const [cafeDescription, setCafeDescription] = useState("서울 최고의 메이드 카페입니다.");
  const [openingHours, setOpeningHours] = useState("11:00 - 22:00");
  const [phone, setPhone] = useState("02-1234-5678");

  const [menus, setMenus] = useState([
    { id: "1", name: "딸기 파르페", price: "8000", image: "" },
    { id: "2", name: "오므라이스", price: "12000", image: "" },
  ]);

  const [maids, setMaids] = useState([
    { id: "1", name: "사쿠라", profileId: "sakura123", status: "승인됨" },
    { id: "2", name: "미유", profileId: "miyu456", status: "승인됨" },
    { id: "3", name: "나나", profileId: "nana789", status: "대기중" },
  ]);

  const [newMenuName, setNewMenuName] = useState("");
  const [newMenuPrice, setNewMenuPrice] = useState("");
  const [newMaidProfileId, setNewMaidProfileId] = useState("");
  const [isMenuDialogOpen, setIsMenuDialogOpen] = useState(false);
  const [isMaidDialogOpen, setIsMaidDialogOpen] = useState(false);

  const handleUpdateCafeInfo = () => {
    alert("카페 정보가 업데이트되었습니다.");
  };

  const handleAddMenu = () => {
    if (newMenuName && newMenuPrice) {
      const newMenu = {
        id: String(menus.length + 1),
        name: newMenuName,
        price: newMenuPrice,
        image: "",
      };
      setMenus([...menus, newMenu]);
      setNewMenuName("");
      setNewMenuPrice("");
      setIsMenuDialogOpen(false);
    }
  };

  const handleDeleteMenu = (id: string) => {
    setMenus(menus.filter((menu) => menu.id !== id));
  };

  const handleAddMaid = () => {
    if (newMaidProfileId) {
      const newMaid = {
        id: String(maids.length + 1),
        name: "새 메이드",
        profileId: newMaidProfileId,
        status: "대기중",
      };
      setMaids([...maids, newMaid]);
      setNewMaidProfileId("");
      setIsMaidDialogOpen(false);
    }
  };

  const handleRemoveMaid = (id: string) => {
    setMaids(maids.filter((maid) => maid.id !== id));
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">카페 관리</h1>
        <p className="text-gray-600">카페 정보, 메뉴, 메이드를 관리하세요</p>
      </div>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="info">기본 정보</TabsTrigger>
          <TabsTrigger value="menu">메뉴 관리</TabsTrigger>
          <TabsTrigger value="maid">메이드 관리</TabsTrigger>
          <TabsTrigger value="notice">공지사항</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>카페 기본 정보</CardTitle>
              <CardDescription>카페의 기본 정보를 수정하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cafe-name">카페 이름</Label>
                <Input
                  id="cafe-name"
                  value={cafeName}
                  onChange={(e) => setCafeName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cafe-description">소개</Label>
                <Textarea
                  id="cafe-description"
                  value={cafeDescription}
                  onChange={(e) => setCafeDescription(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="opening-hours">영업 시간</Label>
                  <Input
                    id="opening-hours"
                    value={openingHours}
                    onChange={(e) => setOpeningHours(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">전화번호</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cover-image">대표 이미지</Label>
                <Input id="cover-image" type="file" accept="image/*" />
              </div>
              <Button onClick={handleUpdateCafeInfo} className="w-full">
                정보 업데이트
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="menu">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>메뉴 관리</CardTitle>
                  <CardDescription>카페의 메뉴를 추가, 수정, 삭제하세요</CardDescription>
                </div>
                <Dialog open={isMenuDialogOpen} onOpenChange={setIsMenuDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      메뉴 추가
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>새 메뉴 추가</DialogTitle>
                      <DialogDescription>새로운 메뉴를 추가하세요</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="menu-name">메뉴 이름</Label>
                        <Input
                          id="menu-name"
                          placeholder="메뉴 이름"
                          value={newMenuName}
                          onChange={(e) => setNewMenuName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="menu-price">가격</Label>
                        <Input
                          id="menu-price"
                          type="number"
                          placeholder="가격"
                          value={newMenuPrice}
                          onChange={(e) => setNewMenuPrice(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="menu-image">이미지</Label>
                        <Input id="menu-image" type="file" accept="image/*" />
                      </div>
                      <Button onClick={handleAddMenu} className="w-full">
                        추가
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {menus.map((menu) => (
                  <div key={menu.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold">{menu.name}</p>
                      <p className="text-sm text-gray-600">{Number(menu.price).toLocaleString()}원</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteMenu(menu.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maid">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>메이드 관리</CardTitle>
                  <CardDescription>메이드를 등록하고 관리하세요</CardDescription>
                </div>
                <Dialog open={isMaidDialogOpen} onOpenChange={setIsMaidDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="w-4 h-4 mr-2" />
                      메이드 등록 요청
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>메이드 등록 요청</DialogTitle>
                      <DialogDescription>
                        메이드 프로필 ID를 입력하여 등록 요청을 보내세요
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="maid-profile-id">메이드 프로필 ID</Label>
                        <Input
                          id="maid-profile-id"
                          placeholder="예: sakura123"
                          value={newMaidProfileId}
                          onChange={(e) => setNewMaidProfileId(e.target.value)}
                        />
                      </div>
                      <Button onClick={handleAddMaid} className="w-full">
                        등록 요청 보내기
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {maids.map((maid) => (
                  <div key={maid.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold">{maid.name}</p>
                      <p className="text-sm text-gray-600">프로필 ID: {maid.profileId}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          maid.status === "승인됨"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {maid.status}
                      </span>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleRemoveMaid(maid.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notice">
          <Card>
            <CardHeader>
              <CardTitle>공지사항 관리</CardTitle>
              <CardDescription>카페 공지사항을 작성하고 관리하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notice-title">제목</Label>
                <Input id="notice-title" placeholder="공지사항 제목" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notice-content">내용</Label>
                <Textarea id="notice-content" placeholder="공지사항 내용" rows={6} />
              </div>
              <Button className="w-full">공지사항 등록</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
