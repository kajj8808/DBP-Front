import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState, useRef } from "react";

export default function Home() {
  const [formStatus, setFormStatus] = useState<string>("");
  const idInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  async function submitHandler(event: React.SyntheticEvent) {
    event.preventDefault();

    const enteredId = idInputRef.current?.value;
    const enteredpassword = passwordInputRef.current?.value;

    const result = await signIn("credentials", {
      redirect: false,
      id: enteredId,
      password: enteredpassword,
    });

    if (!result?.error) {
      setFormStatus(`로그인 성공`);
      router.replace("/");
    } else {
      setFormStatus(`${result.error}`);
    }
  }

  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "authenticated") {
    router.replace("/chatlist");
    return <div>loading</div>;
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-green-200 to-green-500">
      <form onSubmit={submitHandler}>
        <div className="w-96 rounded bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-center">
            <img src="goodluck.svg" className="h-32" />
          </div>
          <label className="text-gray-700">ID</label>
          <input
            className="mb-4 w-full rounded-xl bg-green-200 py-2 px-1 text-black outline-none autofill:bg-green-300"
            type="id"
            ref={idInputRef}
          />
          <label className="text-gray-700">Password</label>
          <input
            className="mb-4 w-full rounded-xl bg-green-200 py-2 px-1 text-black outline-none autofill:bg-green-300"
            type="password"
            ref={passwordInputRef}
          />
          <input id="auto-login" className="mx-2 mb-6" type="checkbox" />
          <label htmlFor="auto-login">자동로그인</label>
          <p className="text-xs italic text-red-500">{formStatus}</p>
          <button
            type="submit"
            className="my-1 w-full rounded bg-green-500 py-2 text-white transition-colors hover:bg-green-600"
          >
            로그인
          </button>
          <button
            type="button"
            className="my-1 w-full rounded bg-green-500 py-2 text-white transition-colors hover:bg-green-600"
            onClick={() => router.replace("/signup")}
          >
            회원가입
          </button>
        </div>
      </form>
    </div>
  );
}
