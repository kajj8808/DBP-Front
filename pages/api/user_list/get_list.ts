import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  let prisma = new PrismaClient();

  const chatRoomList =
    await prisma.$queryRaw`SELECT * FROM User as u JOIN Department as d ON u.department_id = d.dep_id;`;

  if (chatRoomList) {
    res.status(201).json(chatRoomList);
  }
}

export default handler;
