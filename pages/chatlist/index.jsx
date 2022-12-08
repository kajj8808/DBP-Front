import Layout from "@components/layout";
import Sidebar from "@components/sidebar";
import Router, { useRouter } from "next/router";
import ChatModal from "./chatModal";
import { useSession } from "next-auth/react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { BiMessageRoundedAdd } from "react-icons/bi";

const Chat_list = () => {
  const { data: session } = useSession();
  const [rooms, setRoom] = useSyncExternalStore([]);
  const [modal, setModal] = useState < boolean > false;
  const router = useRouter();
  async function getChatRoom(user_id) {
    const response = await fetch("api/chat_list/get_list", {
      method: "POST",
      body: JSON.stringify({
        id: user_id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log(data);
    if (!response.ok) {
      throw new Error(data.message || "Something went wrong!");
    }
    return data;
  }

  async function DeleteRoom(user_id, room_id) {
    const response = await fetch("api/chat_list/delete_room", {
      method: "POST",
      body: JSON.stringify({
        id: user_id,
        room_id: room_id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log(data);
    if (!response.ok) {
      throw new Error(data.message || "Something went wrong!");
    }
    return data;
  }

  useEffect(() => {
    getChatRoom(session?.user?.email).then((res) => {
      setRoom(res);
    });
  }, []);

  const joinRoom = (room_id) => {
    Router.push({ pathname: `/chats/${room_id}` });
  };

  return (
    <Layout>
      <Sidebar>
        <span className=" flex h-10 flex-row-reverse bg-gray-100">
          <BiMessageRoundedAdd onClick={() => setModal(true)} size={40} />
          {modal && (
            <ChatModal
              onClose={() => {
                setModal(false);
              }}
            />
          )}
        </span>
        <div>
          {rooms.map((room) => {
            return (
              <div className="flex place-content-between border pb-3 pl-[15px] pt-[10px] font-bold hover:bg-blue-200">
                <button onClick={() => joinRoom(room.room_id)}>
                  {room.room_name +
                    "(" +
                    `${room.members.map((member) => {
                      return member.user_id;
                    })}` +
                    ")"}
                </button>
                <button
                  onClick={() => {
                    DeleteRoom(session?.user?.email, room.room_id).then(() => {
                      getChatRoom(session?.user?.email).then((res) => {
                        setRoom(res);
                      });
                    });
                  }}
                >
                  나가기
                </button>
              </div>
            );
          })}
        </div>
      </Sidebar>
    </Layout>
  );
};

export default Chat_list;
