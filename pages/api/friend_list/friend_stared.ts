import prisma from "@libs/prisma";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const data = req.body;
  const { user_id, friend_id, is_like } = data;

  const friend_liked = await prisma.friend.update({
    where: {
      user_id_friend_id: {
        user_id: user_id,
        friend_id: friend_id,
      },
    },
    data: {
      is_like: is_like,
    },
  });

  if (friend_liked) {
    res.status(201).json("liked");
  }
}

export default handler;
