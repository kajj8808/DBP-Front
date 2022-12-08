import React from "react";
import Modal from "@components/Modal/Modal";
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

function ChatModal({ onClose }: any): any {
  const { data: session } = useSession();
  const [roomName, setRoomName] = useState<string>("");
  const [friendlist, setFriendList] = useState<any[]>([]);
  const [checkedList, setCheckedLists] = useState([]);

  const onChangeRoomName = (e: any) => {
    setRoomName(e.target.value);
  };

  async function getFriend(user_id: string) {
    const response = await fetch("api/friend_list/get_list", {
      method: "POST",
      body: JSON.stringify({
        id: user_id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Something went wrong!");
    }
    return data;
  }

  async function makeRoom(user_id: string) {
    const response = await fetch("api/chat_list/make_room", {
      method: "POST",
      body: JSON.stringify({
        id: user_id,
        friendlist: checkedList,
        roomname: roomName,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Something went wrong!");
    }
    return data;
  }

  useEffect(() => {
    getFriend(session?.user?.email).then((res) => {
      setFriendList(res);
    });
  }, []);

  // 개별 체크 클릭 시 발생하는 함수
  const onCheckedElement = useCallback(
    (checked, list) => {
      if (checked) {
        setCheckedLists([...checkedList, list]);
      } else {
        setCheckedLists(checkedList.filter((el) => el !== list));
      }
    },
    [checkedList]
  );

  return (
    <Modal onClose={onClose}>
      <h1 className=" text-center text-[24px] font-bold">방만들기</h1>
      <div className="flex flex-col">
        <div className="flex place-content-between ">
          <label>방제목</label>
          <input
            onChange={onChangeRoomName}
            className=" rounded-full bg-gray-200 pl-2"
          />
        </div>
        <br className="" />
        {friendlist &&
          friendlist.map(function (friend) {
            return (
              <p className="flex place-content-between">
                <label htmlFor={friend.name}>
                  {friend.name + `(${friend.department_id}, ${friend.team_id})`}
                </label>
                <input
                  onChange={(e) =>
                    onCheckedElement(e.target.checked, friend.id)
                  }
                  type="checkbox"
                  id={friend.id}
                  value="친구"
                />
              </p>
            );
          })}
        <button
          onClick={() => {
            makeRoom(session?.user?.email);
          }}
        >
          방 만들기
        </button>
      </div>
    </Modal>
  );
}

export default ChatModal;
