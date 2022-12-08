import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "@libs/auth";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  let prisma = new PrismaClient();

  const data = req.body;
  const { id, type, content } = data;

  if (type === "password") {
    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        password: await hashPassword(content),
      },
    });
    res.status(201).json({ messages: "password changed successfully" });
  } else if (type === "name") {
    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        name: content,
      },
    });
    res.status(201).json({ messages: "name changed successfully" });
  } else if (type === "nickname") {
    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        nickname: content,
      },
    });
    res.status(201).json({ messages: "nickname changed successfully" });
  } else if (type === "address") {
    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        address: content[0],
        detail_address: content[1],
      },
    });
    res.status(201).json({ messages: "address changed successfully" });
  } else if (type === "profile_img") {
    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        profile_url: content,
      },
    });
    res.status(201).json({ messages: "profile_image changed successfully" });
  } else if (type === "dept") {
    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        department_id: content,
      },
    });
    res.status(201).json({ messages: "dept changed successfully" });
  } else if (type === "team") {
    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        team_id: content,
      },
    });
    res.status(201).json({ messages: "team changed successfully" });
  }
}
export default handler;
