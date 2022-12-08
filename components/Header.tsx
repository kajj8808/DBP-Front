import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";

export default () => {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <header className="fixed top-0 z-50 flex h-[56px] w-full items-center justify-between bg-[#fff]/[0.6] px-8  shadow-md backdrop-blur-md dark:bg-[#282828]/[0.8]">
      <div>
        <Link href={"/"} className="font-bold text-inherit">
          HOME
        </Link>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => {
            signOut({ callbackUrl: "/login" });
          }}
        >
          로그아웃
        </button>
        <button
          onClick={() => {
            router.push("/admin");
          }}
        >
          관리자
        </button>
        <div className="h-12 w-12 overflow-hidden rounded-full shadow-inner shadow-slate-300 dark:shadow-black">
          <Image
            src={session?.user?.image}
            alt="profile"
            width={98}
            height={98}
          />
        </div>
      </div>
    </header>
  );
};
