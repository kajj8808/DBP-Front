import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  let prisma = new PrismaClient();

  const data = req.body;
  const { id } = data;

  const chatRoomList = await prisma.member.findMany({
    where: {
      user_id: id,
    },
    distinct: ["room_id"],
    select: {
      room_id: true,
    },
  });

  const getRoomInfo = await prisma.chatRoom.findMany({
    where: {
      room_id: {
        in: chatRoomList.map((chatroom) => chatroom.room_id),
      },
    },
    select: {
      room_id: true,
      room_name: true,
      members: true,
    },
  });

  if (getRoomInfo) {
    res.status(201).json(getRoomInfo);
  }
}

export default handler;
