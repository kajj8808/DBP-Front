import React, { useContext, useEffect, useState } from "react";
import Header from "./Header";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    setIsDark(window.localStorage.getItem("theme") === "dark" ? true : false);
  }, []);
  return (
    <div className={`${isDark ? "dark" : ""} `}>
      {/* white :  #aaa  #f1f1f1*/}
      <div className="relative h-screen w-full justify-center bg-[#fff] text-neutral-700 dark:bg-[#0f0f0f] dark:text-[#aaa] sm:flex">
        <Header />
        {children}
        <div className="fixed bottom-3 right-3 ">
          <button
            className={`h-8 w-8 rounded-full bg-[#0c0f1d]/[0.8] p-2 dark:bg-[#fff]`}
            onClick={() => {
              setIsDark((dark) => !dark);
              console.log(isDark);
              !isDark
                ? window.localStorage.setItem("theme", "dark")
                : window.localStorage.setItem("theme", "white");
            }}
          />
        </div>
      </div>
    </div>
  );
}
