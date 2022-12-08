import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@libs/prisma";
import { Department } from "@prisma/client";

export async function insertLoginLog(user_srl: number) {
    await prisma.userLog.create({
        data: {
            user_srl: user_srl,
            type: 0
        }
    })
}

export async function insertLogoutLog(user_srl: number) {
    await prisma.userLog.create({
        data: {
            user_srl: user_srl,
            type: 1
        }
    })
}