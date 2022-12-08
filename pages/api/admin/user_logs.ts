import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@libs/prisma";
import { insertLoginLog, insertLogoutLog } from '@libs/admin/user_logs';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const user_srl: number = Number(req.body.user_srl)
    const type: number = Number(req.body.type)

    if (type == 0) {
        await insertLoginLog(user_srl)
        res.status(200).json({ })
    } else {
        await insertLogoutLog(user_srl)
        res.status(200).json({ })
    }
}