import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { useSession } from "next-auth/react";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "POST") {
    const {
      body: { content, userId, option, roomId },
    } = req;
    console.log(content, userId, option, roomId);
    const newAnswer = await client.message.create({
      data: {
        content,
        option,
        room_id: roomId,
        userUser_srl: userId,
      },
    });

    console.log(newAnswer);

    return res.json({
      ok: true,
    });
  }
}

export default withHandler({ methods: ["POST"], handler, isPrivate: false });
