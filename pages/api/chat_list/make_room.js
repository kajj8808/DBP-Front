import { PrismaClient } from "@prisma/client";

async function handler(req, res) {
  let prisma = new PrismaClient();

  const data = req.body;
  const { id, roomname, friendlist } = data;

  const createRoom = await prisma.chatRoom.create({
    data: {
      room_name: roomname,
    },
  });

  if (createRoom) {
    await prisma.member.createMany({
      data: friendlist.map((friend) => {
        return {
          room_id: createRoom.room_id,
          user_id: friend,
        };
      }),
    });

    await prisma.member.create({
      data: {
        room_id: createRoom.room_id,
        user_id: id,
      },
    });

    res.status(201).json(createRoom.room_id);
  }
}

export default handler;
