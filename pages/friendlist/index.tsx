import { useState, useEffect, useContext } from "react";
import { useSession } from "next-auth/react";
import Layout from "@components/layout";
import Sidebar from "@components/sidebar";
import FriendModal from "./friendModal";
import { AiOutlineUserAdd } from "react-icons/ai";

const Friend = () => {
  const [friendlist, setFriendList] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [modal, setModal] = useState<boolean>(false);

  const { data: session } = useSession();

  async function setFriendLike(friend_id: any, is_like: any) {
    const response = await fetch("api/friend_list/friend_stared", {
      method: "POST",
      body: JSON.stringify({
        user_id: session?.user?.email,
        friend_id: friend_id,
        is_like: is_like,
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

  //친구리스트 불러오는 POST요청
  async function getFriend() {
    const response = await fetch("api/friend_list/get_list", {
      method: "POST",
      body: JSON.stringify({
        id: session?.user?.email,
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

  //페이지 접속시 친구 리스트 불러옴
  useEffect(() => {
    getFriend().then((res) => {
      setFriendList(res);
    });
  }, []);

  const onChange = (e: any) => {
    setName(e.target.value);
  };

  return (
    <Layout>
      <Sidebar>
        <div className="text-2xl font-bold">친구리스트</div>
        <span className="flex h-10 flex-row-reverse bg-gray-100">
          <AiOutlineUserAdd
            className="mr-2"
            onClick={() => setModal(true)}
            size={40}
          />
          {modal && (
            <FriendModal
              onClose={() => {
                setModal(false);
                getFriend().then((res) => {
                  setFriendList(res);
                });
              }}
            />
          )}
        </span>
        {friendlist &&
          friendlist.map(function (friend) {
            return (
              <div
                key={friend.id}
                className="flex border pb-3 pl-[15px] pt-[10px]"
              >
                <img
                  className="top-[18px] left-[120px] mr-4 h-[50px] w-[50px]  cursor-pointer rounded-full border-gray-500"
                  src={friend.profile_url}
                  alt=""
                  width="48px"
                  onClick={() => {}}
                ></img>
                <li className=" mt-3 list-none text-[14px] font-bold">
                  {friend.id}
                </li>
                <button
                  onClick={() => {
                    setFriendLike(friend.friend_id, !friend.is_like).then(() =>
                      getFriend().then((res) => {
                        setFriendList(res);
                      })
                    );
                  }}
                >
                  {friend.is_like ? "❤️" : "🤍"}
                </button>
              </div>
            );
          })}
      </Sidebar>
    </Layout>
  );
};

export default Friend;
