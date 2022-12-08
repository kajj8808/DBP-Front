import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { Roboto } from "@next/font/google";

import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";

import Head from "next/head";
import { createContext } from "react";
import { socket, SocketContext } from "context/socket";
import Toast from "@components/Toast";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  console.log("App is Running");

  return (
    <>
      <Toast />
      <SessionProvider>
        <SocketContext.Provider value={socket}>
          <div className={roboto.className}>
            <Head>
              <title>GOOD LUCK CHAT</title>
            </Head>
            <div id="modal"></div>
            <Component {...pageProps} />
          </div>
        </SocketContext.Provider>
      </SessionProvider>
    </>
  );
}
