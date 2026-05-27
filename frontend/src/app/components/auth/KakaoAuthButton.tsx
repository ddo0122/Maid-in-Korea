import { Button } from "../ui/button";

type KakaoAuthButtonProps = {
  label: string;
};

const kakaoAuthUrl =
  (import.meta as unknown as { env?: { VITE_KAKAO_AUTH_URL?: string } }).env
    ?.VITE_KAKAO_AUTH_URL || "http://localhost:8080/oauth/authorize/kakao";

export function KakaoAuthButton({ label }: KakaoAuthButtonProps) {
  const handleKakaoAuth = () => {
    window.location.href = kakaoAuthUrl;
  };

  return (
    <Button
      type="button"
      onClick={handleKakaoAuth}
      className="w-full bg-[#FEE500] text-[#191919] hover:bg-[#f2d900] focus-visible:ring-[#FEE500]/50"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="size-5"
        fill="currentColor"
      >
        <path d="M12 4C7.03 4 3 7.13 3 11c0 2.48 1.65 4.66 4.14 5.91l-.75 2.75c-.07.25.21.45.43.31l3.29-2.17c.61.13 1.24.2 1.89.2 4.97 0 9-3.13 9-7s-4.03-7-9-7Z" />
      </svg>
      {label}
    </Button>
  );
}
