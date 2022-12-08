import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@libs/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req
    const team_id: number = Number(req.body.team_id)
    const team_name: string = req.body.team_name
    const dep_id: number = Number(req.body.dep_id)

    switch (method) {
        case "PUT":
            // CREATE
            try {
                const result = await prisma.team.create({
                    data: {
                        team_name: team_name,
                        department: {
                            connect: {
                                dep_id: dep_id
                            }
                        }
                    }
                })
        
                if (result != null) {
                    res.status(200).json({
                        "message": "추가되었습니다."
                    })
                } else {
                    res.status(400).json({
                        "message": "추가할 수 없습니다."
                    })
                }
            } catch (e) {
                res.status(400).json({
                    "message": "추가할 수 없습니다.\n" + e
                })
            }
            break
        case "POST":
            try {
                const result = await prisma.team.update({
                    where: {
                        team_id: team_id
                    }, data: {
                        team_name: team_name
                    }
                })
        
                if (result != null) {
                    res.status(200).json({
                        "message": "정보가 변경되었습니다."
                    })
                } else {
                    res.status(400).json({
                        "message": "정보를 변경할 수 없습니다."
                    })
                }
            } catch (e) {
                res.status(400).json({
                    "message": "정보를 변경할 수 없습니다.\n" + e
                })
            }
            break
        case "GET":
            // READ
            const teams = await getTeams(dep_id)
            res.status(400).json(teams)
            break
        case "DELETE":
            try {
                const result = await prisma.team.delete({
                    where: {
                        team_id: team_id
                    }
                })
        
                if (result != null) {
                    res.status(200).json({
                        "message": "삭제되었습니다."
                    })
                } else {
                    res.status(400).json({
                        "message": "삭제할 수 없습니다."
                    })
                }
            } catch (e) {
                res.status(400).json({
                    "message": "삭제할 수 없습니다.\n" + e
                })
            }
            break
    }
}

export async function getTeams(dep_id) {
    const teams = await prisma.team.findMany({
        where: {
            department: {
                dep_id: dep_id
            }
        },
        orderBy: {
            team_id: 'desc'
        },
        include: {
            department: true
        }
    })

    return teams
}
