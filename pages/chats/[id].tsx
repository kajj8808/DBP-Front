import InPutLayer from "@components/InputLayer_";
import Image from "next/image";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FieldErrors, useForm } from "react-hook-form";
import Header from "@components/Header";
import Layout from "@components/layout";
import makeMessage from "@libs/client/makeMessage";
import useMutation from "@libs/client/useMutation";
import client from "@libs/server/client";
import { useSession } from "next-auth/react";
import { GetStaticProps } from "next";
import { saveAs } from "file-saver";
import { SocketContext } from "@context/socket";

interface MessageForm {
  message: string;
}

interface IUploadMessage {
  message: string;
  sender: string;
}

interface IMessage {
  sender: string;
  avatar: string;
  content: string;
  userId: number;
  option: "file" | "text" | "emoji";
}
interface IFac {
  content: string;
  option: "emoji" | "file" | "text";
  sender?: string;
}

export default ({ chats, roomId }) => {
  const {
    register,
    watch,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors },
  } = useForm<MessageForm>({
    mode: "onChange",
  });

  const socket = useContext(SocketContext);

  const [msgList, setMsgList] = useState<IMessage[]>([]);
  const { data: session } = useSession();
  const [filterMode, setFilterMode] = useState(false);
  const [filterList, setFilterList] = useState<IMessage[]>([]);
  const [filterText, setFilterText] = useState("");
  const [initalJoin, setInitialJoin] = useState(true);
  const [initalLoading, setInitialLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [sendAnswer, { data: answerData, loading: answerLoading }] =
    useMutation(`/api/chat/send`);

  useEffect(() => {
    if (session && initalJoin) {
      setInitialJoin(false);
      setFocus("message");
      setMsgList(() => chats);
      socket.emit("join_room", {
        roomName: roomId,
        userId: session.user?.id,
      });
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (initalLoading && !isLoading) {
      socket.on("message", (msgObj: IMessage) => {
        addMsgToMsgList(msgObj);
      });

      socket.on(
        "upload_done",
        ({
          url,
          fileName,
          senderId,
          senderName,
          roomName: roomNamee,
          profile_url,
        }: IUploadMessage) => {
          const clientMessage = makeMessage(
            {
              content: url,
              option: "file",
              roomId: roomNamee,
              userId: senderId,
              userName: senderName,
              profile_url,
              id: senderName,
            },
            "client"
          );

          // client side
          socket.emit("new_message", clientMessage, roomId);
          addMsgToMsgList(clientMessage);
          // server side *db data
          const serverMessage = makeMessage(
            {
              content: url,
              option: "file",
              roomId: roomNamee,
              userId: +senderId,
            },
            "server"
          );
          sendAnswer(serverMessage);
        }
      );
      setInitialLoading(false);
    }
  }, [isLoading]);

  useEffect(() => {
    if (answerData && answerData.ok) {
      reset();
    }
  }, [answerData, reset]);

  /* me is reverse */
  useEffect(() => {
    if (scrollRef.current) {
      console.log(msgList);
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [filterList, msgList]);

  const addMsgToMsgList = (msgObj: IMessage) => {
    setMsgList([...msgList, { ...msgObj }]);
  };

  const onValid = ({ message }: MessageForm) => {
    SMsgFactory({ content: message, option: "text" });
  };

  const onInvalid = (errors: FieldErrors) => {
    console.log(errors);
  };

  const scrollRef = useRef<HTMLUListElement>();

  const SMsgFactory = ({ content, option, sender }: IFac) => {
    const userId = session?.user.id;
    const profile_url = session?.user.image;
    const userName = session?.user.name;

    const clientMessage = makeMessage(
      {
        content,
        profile_url,
        userId,
        userName,
        roomId,
        option,
        id: session?.user?.email,
        sender: sender ? sender : "",
      },
      "client"
    );
    // client side
    socket.emit("new_message", clientMessage, roomId);
    addMsgToMsgList(clientMessage);

    // server side *db data
    const serverMessage = makeMessage(
      {
        content,
        option,
        roomId,
        userId,
        sender: sender ? sender : "",
      },
      "server"
    );
    sendAnswer(serverMessage);
  };

  const sendEmoji = (emoji: string) => {
    SMsgFactory({ content: emoji, option: "emoji" });
  };

  const [isTheme, setTheme] = useState<boolean>(false);

  return (
    <>
      {isLoading ? (
        ""
      ) : (
        <Layout>
          <div className="fixed top-32 z-20 flex w-full justify-center">
            <input
              type="text"
              onChange={(e) => {
                setFilterText(e.target.value);
                if (e.target.value === "") {
                  setFilterMode(false);
                  setFilterList([]);
                } else {
                  setFilterMode(true);
                  setFilterList(
                    msgList.filter((msg) => {
                      return msg.content.includes(e.target.value);
                    })
                  );
                }
              }}
              value={filterText}
              className="fixed top-[80px] z-10 w-[400px] rounded-3xl bg-[#fff]/[0.6] px-8 py-2"
            />
          </div>

          <InPutLayer
            className={`relative flex h-screen w-full flex-col ${
              isTheme
                ? "p- animate-text bg-gradient-to-r from-[#BE93C5] to-[#7BC6CC]"
                : "bg-slate-400 dark:bg-[#212121]"
            } sm:w-[500px] `}
            senderId={session?.user?.id}
            senderName={session?.user?.name}
            profile={session?.user?.image}
            roomName={roomId}
          >
            <ul
              className="flex h-full flex-col gap-4 overflow-y-scroll px-4"
              ref={scrollRef}
            >
              {(filterMode ? [...filterList] : [...msgList]).map(
                (msg, index) => (
                  <li key={index} className={`flex items-start space-x-2`}>
                    {/* Meesage Layer */}
                    <div
                      className={`flex w-full items-start space-x-2 ${
                        session?.user?.id === msg.userUser_srl
                          ? "flex-row-reverse space-x-reverse"
                          : ""
                      }`}
                    >
                      {/* Sender Avatar SenderUserName */}
                      <div className="h-12 w-12 overflow-hidden rounded-full shadow-inner shadow-slate-500 dark:shadow-black">
                        <Image
                          src={msg.user.profile_url}
                          alt="Avatarimage"
                          width={48}
                          height={48}
                        />
                      </div>
                      <div>
                        <div
                          className={`flex ${
                            session?.user?.id === msg.userUser_srl
                              ? "flex-row-reverse items-start space-x-reverse"
                              : ""
                          }`}
                        >
                          <div className="flex flex-col items-start justify-center gap-1">
                            <span
                              className={`flex w-full ${
                                session?.user?.id === msg.userUser_srl
                                  ? "justify-end"
                                  : ""
                              } font-bold`}
                            >
                              {msg.user.name}
                            </span>
                            <span className="relative -top-2 text-sm text-gray-500 ">
                              @{msg.user.id}
                            </span>
                          </div>
                        </div>
                        <div className="overflow-hidde max-w-sm ">
                          <div className="overflow-hidde flex items-center  ">
                            <div className="relative col-span-3 ">
                              {msg.option === "text" ? (
                                <div className="rounded-md px-4 py-2 shadow-inner shadow-slate-600 dark:shadow-black">
                                  <span>{msg.content}</span>
                                </div>
                              ) : null}
                              {msg.option === "emoji" ? (
                                <div className="rounded-3xl px-4 py-2 shadow-inner shadow-slate-600 dark:shadow-black">
                                  <Image
                                    src={`https://imagedelivery.net/${msg.content}`}
                                    alt="emoji"
                                    width={180}
                                    height={48}
                                  />
                                </div>
                              ) : null}
                              {msg.option === "file" ? (
                                <div className="overflow-hide gap-2 truncate text-ellipsis rounded-2xl py-3 px-4 shadow-inner shadow-slate-600 dark:shadow-black">
                                  <p className="overflow-hide flex max-w-[240px] justify-center truncate text-ellipsis">
                                    {msg.content}
                                  </p>
                                  <button
                                    onClick={() => {
                                      saveAs(`${msg.content}`, "fileName");
                                    }}
                                    className="mt-1 h-auto w-full max-w-sm rounded-3xl bg-red-500 py-2 text-sm font-bold text-white shadow-sm shadow-slate-600"
                                  >
                                    Download
                                  </button>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>
                        {/*       <div className="col-span-1">
              <span>{msg.readDiscount}</span>
            </div> */}
                      </div>
                    </div>
                    {/* Message Layer End */}
                  </li>
                )
              )}
            </ul>
            <form
              onSubmit={handleSubmit(onValid, onInvalid)}
              className="mt-1 grid w-full transform grid-cols-4 gap-2 p-2"
            >
              <input
                {...register("message", {
                  required: "Message is required",
                  /* minLength: {
            message: "The user name must be at least 3 characters",
            value: 3,
          }, */
                })}
                type="text"
                placeholder="message"
                autoFocus
                className="col-span-3 rounded-md px-2"
                autoComplete="off"
              />
              <input
                type="submit"
                className={`col-span-1 rounded-md px-2 py-1 text-white ${
                  watch("message") == "" ? "bg-slate-500 " : "bg-red-400 "
                }`}
                value={"Send"}
              />
              <div className="flex space-x-2 py-1">
                <button
                  onClick={() =>
                    sendEmoji(
                      "IXRk4cLAMK3f6nF2KrMjbA/3f9b0333-bf36-4e07-34ee-3691e5a02a00/public"
                    )
                  }
                >
                  😊
                </button>
                <button onClick={() => setTheme((mode) => !mode)}>🐾</button>
              </div>
            </form>
          </InPutLayer>
        </Layout>
      )}
    </>
  );
};

export function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { params } = ctx;

  const chats = await client.message.findMany({
    where: {
      room_id: `${params?.id}`,
    },
    include: {
      user: {
        select: {
          name: true,
          profile_url: true,
          id: true,
        },
      },
    },
  });

  return {
    props: {
      chats: JSON.parse(JSON.stringify(chats)),
      roomId: `${params?.id}`,
    },
  };
};
