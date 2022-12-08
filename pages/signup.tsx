import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { getDepartments } from "./api/admin/departments";
import Postcode from "./postcode";
import axios from "axios";

export interface FormValue {
  id: string;
  password: string;
  name: string;
  nickname: string;
  profileImageURL: string;
  address: string;
  detailAddress: string;
  deptid: number;
  teamid: number;
}

const ReactHookForms = ({ departments }) => {
  const { register, handleSubmit } = useForm<FormValue>();
  const [formStatus, setFormStatus] = useState<string>("");
  const router = useRouter();
  const [address, setAddress] = useState<string>("");
  const [img, setImg] = useState<string>("");
  const [depart, setDept] = useState<string[]>([]);
  const [currentdept, setCurrentDept] = useState();
  const [team, setTeam] = useState<string[]>([]);
  const [currentteam, setCurrentTeam] = useState();

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
        console.log(img);
      });
  };

  const onSelectChange = (e: any) => {
    setCurrentDept(e.target.value);
  };

  const onSelectChangeTeam = (e: any) => {
    setCurrentTeam(e.target.value);
  };

  useEffect(() => {
    setDept(departments);
    console.log(departments);
  }, [departments]);

  useEffect(() => {
    const current = departments.find((dep) => dep.dep_id == currentdept);
    if (current) {
      setTeam(current.teams);
      console.log(current);
    }
  }, [currentdept]);

  async function createUser(obj: FormValue): Promise<any> {
    const response = await fetch("api/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        id: obj.id,
        password: obj.password,
        name: obj.name,
        nickname: obj.nickname,
        profileImageURL: obj.profileImageURL,
        address: address,
        detailAddress: obj.detailAddress,
        deptid: Number(obj.deptid),
        teamid: Number(obj.teamid),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log(obj);
    if (!response.ok) {
      throw new Error(data.message || "Something went wrong!");
    }
    return data;
  }

  //회원가입 버튼 눌렀을 때 값 받아옴
  const onSubmitHandler: SubmitHandler<FormValue> = async (data) => {
    try {
      const result = await createUser(data);
      setFormStatus(`Sign up Success: ${result.message}`);
      router.push("/login");
    } catch (error: any) {
      setFormStatus(`Error Occured: ${error.message}`);
    }
  };

  const imageChange = (e: any) => {
    setImg(e.target.value);
    console.log(img);
  };

  return (
    <div className="container mx-auto w-2/3 px-5 py-10">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-semibold text-gray-700 md:text-4xl">
          Sign Up
        </h1>
      </div>
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold text-gray-700">
            아이디
          </label>
          <input
            className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
            {...register("id")}
            placeholder="ID"
          />
        </div>
        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold text-gray-700">
            비밀번호
          </label>
          <input
            className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
            type="password"
            {...register("password")}
            placeholder="PASSWORD"
          />
        </div>
        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold text-gray-700">
            이름
          </label>
          <input
            className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
            {...register("name")}
            placeholder="NAME"
          />
        </div>
        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold text-gray-700">
            닉네임
          </label>

          <input
            className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
            {...register("nickname")}
            placeholder="NICKNAME"
          />
        </div>
        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold text-gray-700">
            프로필이미지
          </label>
          <div className="flex space-x-4">
            <input
              value={img}
              className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
              {...register("profileImageURL")}
              placeholder="ProfileImage"
              readOnly={true}
            />
            <label
              className="focus:shadow-outline w-40 rounded bg-blue-500 py-2 px-4 text-center font-bold text-white hover:bg-blue-700 focus:outline-none"
              htmlFor="input_file"
            >
              이미지 등록
            </label>
            <input
              type="file"
              onChange={onImgChange}
              id="input_file"
              style={{ display: "none" }}
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold text-gray-700">
            주소
          </label>
          <div className="flex  space-x-4">
            <input
              className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
              {...register("address")}
              placeholder="ADDRESS"
              value={address}
              readOnly={true}
            />
            <Postcode setAddress={setAddress} />
          </div>
        </div>
        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold text-gray-700">
            상세주소
          </label>
          <input
            className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
            {...register("detailAddress")}
            placeholder="DetailAdress"
          />
        </div>
        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold text-gray-700">
            부서
          </label>
          <select
            className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
            {...register("deptid", { required: true })}
            onChange={onSelectChange}
          >
            {depart.map((dept) => {
              return <option value={dept.dep_id}>{dept.dep_name}</option>;
            })}
          </select>
        </div>
        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold text-gray-700">
            팀
          </label>
          <select
            className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
            {...register("teamid", { required: true })}
            onChange={onSelectChangeTeam}
          >
            {team.map((team) => {
              return <option value={team.team_id}>{team.team_name}</option>;
            })}
          </select>
        </div>
        <p className="text-xs italic text-red-500">{formStatus}</p>
        <div className="flex items-center justify-between">
          <button
            className="focus:shadow-outline rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700 focus:outline-none"
            type="submit"
          >
            회원가입
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReactHookForms;

export async function getServerSideProps() {
  const departments = await getDepartments();

  return { props: { departments } };
}
