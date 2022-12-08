import React from "react";
import Modal from "@components/Modal/Modal";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

function FriendModal({ onClose }: any): any {
  const [userlist, setUserList] = useState<any[]>([]);
  const [search, setSearch] = useState<string>("");
  const { data: session } = useSession();
  const [selected, setSelected] = useState("1");

  const onChangeSelected = (e: any) => {
    setSelected(e.target.value);
  };

  async function getUser() {
    const response = await fetch("api/user_list/get_list", {
      method: "POST",
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

  async function addFriend(friend_id: string) {
    const response = await fetch("api/friend_list/add_friend", {
      method: "POST",
      body: JSON.stringify({
        user_id: session?.user?.email,
        friend_id: friend_id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Something went wrong!");
    } else {
      alert(`${friend_id} 님이 친구로 등록되었습니다.`);
    }
    return data;
  }

  const onChangeSearch = (e: any) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    getUser().then((res) => {
      setUserList(res);
    });
  }, []);

  return (
    <Modal onClose={onClose}>
      <h1 className=" text-center text-[24px] font-bold">사용자 검색</h1>
      <div className="my-3 flex place-content-between">
        <select defaultValue="1" onChange={onChangeSelected}>
          <option value="1">아이디</option>
          <option value="2">이름</option>
          <option value="3">부서</option>
        </select>
        <input
          onChange={onChangeSearch}
          className=" rounded-full bg-gray-200 pl-2"
        />
      </div>
      {userlist &&
        selected === "1" &&
        userlist
          .map((user) => {
            return user.id;
          })
          .filter((id) => id.includes(search))
          .map((filtered) => {
            return (
              <p className="flex place-content-between border-b-[1px] border-sky-300">
                <label htmlFor={filtered}>{filtered}</label>
                <button onClick={() => addFriend(filtered)}>친구추가</button>
              </p>
            );
          })}
      {userlist &&
        selected === "2" &&
        userlist
          .filter((user) => user.name.includes(search))
          .map((filtered) => {
            return (
              <p className="flex place-content-between border-b-[1px] border-sky-300">
                <label htmlFor={filtered.name}>{filtered.name}</label>
                <button onClick={() => addFriend(filtered.id)}>친구추가</button>
              </p>
            );
          })}
      {userlist &&
        selected === "3" &&
        userlist
          .filter((user) => user.dep_name.includes(search))
          .map((filtered) => {
            return (
              <p className="flex place-content-between border-b-[1px] border-sky-300">
                <label htmlFor={filtered.name}>
                  {filtered.name} , {filtered.dep_name}
                </label>
                <button onClick={() => addFriend(filtered.id)}>친구추가</button>
              </p>
            );
          })}
    </Modal>
  );
}

export default FriendModal;
