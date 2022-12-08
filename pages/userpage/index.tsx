import Layout from "@components/layout";
import Sidebar from "@components/sidebar";
import Postcode from "pages/postcode";
import { useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

const userPage = () => {
  const [address, setAddress] = useState<string>("");
  const [password, setPW] = useState<string>("");
  const onChangePW = (e: any) => {
    setPW(e.target.value);
  };
  const [name, setName] = useState<string>("");
  const onChangeName = (e: any) => {
    setName(e.target.value);
  };
  const [nickname, setNN] = useState<string>("");
  const onChangeNN = (e: any) => {
    setNN(e.target.value);
  };
  const [detail, setDetail] = useState<string>("");
  const onChangeDetail = (e: any) => {
    setDetail(e.target.value);
  };
  const [img, setImg] = useState<string>("");

  const { data: session } = useSession();

  const onImgChange = async (e: any) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    formData.append("key", "a824c0f54ea6884f2465d718da417f51");
    axios
      .post("https://api.imgbb.com/1/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setImg(res.data.data.url);
        changeValue(session?.user?.email, res.data.data.url, "profile_img");
      });
  };

  //정보변경을 위한 api요청
  async function changeValue(user_id: string, content: string, type: string) {
    const response = await fetch("api/userpage/change_status", {
      method: "POST",
      body: JSON.stringify({
        id: user_id,
        content: content,
        type: type,
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

  async function changeAddress(
    user_id: string,
    content: string[],
    type: string
  ) {
    const response = await fetch("api/userpage/change_status", {
      method: "POST",
      body: JSON.stringify({
        id: user_id,
        content: content,
        type: type,
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

  return (
    <Layout>
      <Sidebar>
        <div className="container mx-auto w-2/3 px-5 py-10">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-semibold text-gray-700 md:text-4xl">
              회원정보 변경
            </h1>
          </div>
          <div className="mb-4 flex">
            <label className="mb-2 mt-2 w-[100px] text-sm font-bold text-gray-700">
              비밀번호
            </label>
            <input
              className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
              placeholder="PW"
              type="password"
              onChange={onChangePW}
            />
            <button
              className="focus:shadow-outline ml-5 w-40 rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700 focus:outline-none"
              type="button"
              onClick={() =>
                changeValue(session?.user?.email, password, "password")
              }
            >
              변경
            </button>
          </div>
          <div className="mb-4 flex">
            <label className="mb-2 mt-2 w-[100px] text-sm font-bold text-gray-700">
              이름
            </label>
            <input
              className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
              placeholder="Name"
              onChange={onChangeName}
            />
            <button
              className="focus:shadow-outline ml-5 w-40 rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700 focus:outline-none"
              type="button"
              onClick={() => changeValue(session?.user?.email, name, "name")}
            >
              변경
            </button>
          </div>
          <div className="mb-4 flex">
            <label className="mb-2 mt-2 w-[100px] text-sm font-bold text-gray-700">
              닉네임
            </label>
            <input
              className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
              placeholder="Nickname"
              onChange={onChangeNN}
            />
            <button
              className="focus:shadow-outline ml-5 w-40 rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700 focus:outline-none"
              type="button"
              onClick={() =>
                changeValue(session?.user?.email, nickname, "nickname")
              }
            >
              변경
            </button>
          </div>
          <div className="mb-4 flex">
            <label className="mb-2 mt-2 w-[100px] text-sm font-bold text-gray-700">
              주소
            </label>
            <input
              className="focus:shadow-outline mr-5 w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
              placeholder="Address"
              value={address}
              readOnly={true}
            />
            <Postcode setAddress={setAddress} />
          </div>
          <div className="mb-4 flex">
            <label className="mb-2 mt-2 block w-[100px] text-sm font-bold text-gray-700">
              상세주소
            </label>
            <input
              className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
              placeholder="DetailAdress"
              onChange={onChangeDetail}
            />
            <button
              className="focus:shadow-outline ml-5 w-40 rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700 focus:outline-none"
              type="button"
              onClick={() => {
                changeAddress(
                  session?.user?.email,
                  [address, detail],
                  "address"
                );
              }}
            >
              변경
            </button>
          </div>
          <div className="mb-4 flex">
            <label className="mb-2 mt-2 w-[100px] text-sm font-bold text-gray-700">
              프로필사진
            </label>
            <input
              className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
              placeholder="Profile"
              value={img}
              readOnly={true}
            />
            <label
              className="focus:shadow-outline ml-5 w-40 rounded bg-blue-500 py-2 px-4 text-center font-bold text-white hover:bg-blue-700 focus:outline-none"
              htmlFor="input_file"
            >
              변경
            </label>
            <input
              type="file"
              onChange={onImgChange}
              id="input_file"
              style={{ display: "none" }}
            />
          </div>
        </div>
      </Sidebar>
    </Layout>
  );
};

export default userPage;
