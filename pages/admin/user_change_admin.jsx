import Postcode from "pages/postcode";
import { useEffect, useState } from "react";
import { getDepartments } from "../api/admin/departments";
import axios from "axios";
import { useRouter } from "next/router";

const userPage = ({ departments }) => {
  const [address, setAddress] = useState("");
  const [password, setPW] = useState("");
  const [depart, setDept] = useState([]);
  const [currentdept, setCurrentDept] = useState();
  const [team, setTeam] = useState([]);
  const [currentteam, setCurrentTeam] = useState();
  const onChangePW = (e) => {
    setPW(e.target.value);
  };
  const [name, setName] = useState("");
  const onChangeName = (e) => {
    setName(e.target.value);
  };
  const [nickname, setNN] = useState("");
  const onChangeNN = (e) => {
    setNN(e.target.value);
  };
  const [detail, setDetail] = useState("");
  const onChangeDetail = (e) => {
    setDetail(e.target.value);
  };
  const [img, setImg] = useState("");

  const router = useRouter();
  const id = router.query.id;

  const onImgChange = async (e) => {
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
        changeValue(id, res.data.data.url, "profile_img");
      });
  };

  useEffect(() => {
    setDept(departments);
    console.log(departments);
  }, [departments]);

  useEffect(() => {
    const current = departments.find((dep) => dep.dep_name === currentdept);
    if (current) {
      setTeam(current.teams);
    }
  }, [currentdept]);

  //정보변경을 위한 api요청
  async function changeValue(user_id, content, type) {
    const response = await fetch("../api/userpage/change_status", {
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

  async function changeAddress(user_id, content, type) {
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

  const onSelectChange = (e) => {
    setCurrentDept(e.target.value);
  };

  const onSelectChangeTeam = (e) => {
    setCurrentTeam(e.target.value);
  };

  return (
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
          onClick={() => changeValue(id, password, "password")}
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
          onClick={() => changeValue(id, name, "name")}
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
          onClick={() => changeValue(id, nickname, "nickname")}
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
            changeAddress(id, [address, detail], "address");
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
          placeholder="Nickname"
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
      <div className="mb-4 flex">
        <label className="mb-2 mt-2 block w-[100px] text-sm font-bold text-gray-700">
          부서
        </label>
        <select
          onChange={onSelectChange}
          className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
        >
          {depart.map((dept) => {
            return <option value={dept.dep_name}>{dept.dep_name}</option>;
          })}
        </select>
        <button
          className="focus:shadow-outline ml-5 w-40 rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700 focus:outline-none"
          type="button"
          onClick={() => {
            changeValue(
              id,
              departments.find((e) => e.dep_name === currentdept).dep_id,
              "dept"
            );
          }}
        >
          변경
        </button>
      </div>
      <div className="mb-4 flex">
        <label className="mb-2 mt-2 block w-[100px] text-sm font-bold text-gray-700">
          팀
        </label>
        <select
          onChange={onSelectChangeTeam}
          className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
        >
          {team.map((team) => {
            return <option value={team.team_name}>{team.team_name}</option>;
          })}
        </select>
        <button
          className="focus:shadow-outline ml-5 w-40 rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700 focus:outline-none"
          type="button"
          onClick={() => {
            changeValue(
              id,
              team.find((e) => e.team_name === currentteam).team_id,
              "team"
            ).then((res) => console.log(res));
          }}
        >
          변경
        </button>
      </div>
    </div>
  );
};

export default userPage;

export async function getServerSideProps() {
  const departments = await getDepartments();

  return { props: { departments } };
}
