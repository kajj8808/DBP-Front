import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "@libs/auth";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  let prisma = new PrismaClient();

  if (req.method !== "POST") {
    return;
  }

  const data = req.body;

  const {
    id,
    password,
    name,
    nickname,
    profileImageURL,
    address,
    detailAddress,
    deptid,
    teamid,
    is_admin,
  } = data;

  if (
    !id ||
    !password ||
    !name ||
    !nickname ||
    !profileImageURL ||
    !address ||
    !detailAddress ||
    !deptid ||
    !teamid ||
    password.trim().length < 7
  ) {
    res.status(422).json({
      message: "회원가입에 오류가 발생했습니다.",
      error: true,
    });
    return;
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      name: true,
    },
  });

  if (existingUser) {
    res.status(422).json({ message: "User ID already exists!", error: true });
    return;
  }

  const hashedPassword = await hashPassword(password);

  const result = await prisma.user.create({
    data: {
      id: id,
      password: hashedPassword,
      name: name,
      nickname: nickname,
      profile_url: profileImageURL,
      address: address,
      detail_address: detailAddress,
      department_id: deptid,
      team_id: teamid,
      is_admin: is_admin ?? false,
    },
  });

  if (result) {
    res.status(201).json({ message: "Created user!", error: false });
  } else {
    res.status(422).json({ message: "Prisma error occured!", error: true });
  }
}

export default handler;
