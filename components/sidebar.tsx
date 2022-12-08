import { useRouter } from "next/router";
import React from "react";
import { FaUser, FaComment } from "react-icons/fa";
import { AiFillSetting } from "react-icons/ai";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Sidebar({ children }: LayoutProps) {
  const router = useRouter();
  return (
    <div className="mt-14 w-screen">
      <ul className="fixed left-0 h-screen bg-blue-200">
        <li className="p-4 text-center">
          <FaUser
            onClick={() => {
              router.push("/friendlist");
            }}
            className="m-auto h-7 w-7"
          />
        </li>
        <li>
          <FaComment
            onClick={() => {
              router.push("/chatlist");
            }}
            className="m-auto h-7 w-7"
          />
        </li>
        <li>
          <AiFillSetting
            onClick={() => {
              router.push("/userpage");
            }}
            className=" mt-4 ml-[13px] h-8 w-8"
          />
        </li>
      </ul>
      <div className="ml-[60px]">{children}</div>
    </div>
  );
}
