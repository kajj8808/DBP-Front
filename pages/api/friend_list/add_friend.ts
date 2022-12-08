import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  let prisma = new PrismaClient();

  const data = req.body;
  const { user_id, friend_id } = data;

  const addFriend = await prisma.friend.create({
    data: {
      user_id: user_id,
      friend_id: friend_id,
      is_like: false,
      is_blocked: false,
    },
  });

  if (addFriend) {
    res.status(201).json(addFriend);
  }
}

export default handler;
