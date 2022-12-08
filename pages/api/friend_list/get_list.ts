import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  let prisma = new PrismaClient();

  const data = req.body;
  const { id } = data;
  console.log(id);
  const friend = await prisma.$queryRaw`
  SELECT DISTINCT * FROM (SELECT * FROM User WHERE id in (SELECT friend_id FROM Friend WHERE user_id=${id})) as c JOIN (SELECT * FROM Friend WHERE user_id=${id}) as d ON c.id=d.friend_id ORDER BY d.is_like DESC;`;

  if (friend) {
    res.status(201).json(friend);
  }
}

export default handler;
