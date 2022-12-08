import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  let prisma = new PrismaClient();

  const data = req.body;
  const { id, room_id } = data;

  const deleteMember = await prisma.member.delete({
    where: {
      room_id_user_id: {
        room_id: room_id,
        user_id: id,
      },
    },
  });

  if (deleteMember) {
    res.status(201).json(deleteMember);
  }
}

export default handler;
