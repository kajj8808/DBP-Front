import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { useSession } from "next-auth/react";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "GET") {
    const {
      body: { userId },
    } = req;

    const user = await client?.user.findUnique({
      where: {
        user_srl: userId,
      },
    });

    return res.json({
      ok: true,
    });
  }
}

export default withHandler({ methods: ["GET"], handler, isPrivate: false });
