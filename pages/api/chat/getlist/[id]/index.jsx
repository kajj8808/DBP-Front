import client from "@libs/server/client";
import withHandler from "@libs/server/withHandler";

async function handler(req, res) {
  const {
    query: { id },
  } = req;

  return res.json({
    ok: true,
    id,
  });
}

export default withHandler({ methods: ["GET"], handler });
