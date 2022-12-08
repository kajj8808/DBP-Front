import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@libs/prisma";
import { Department } from "@prisma/client";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req
    const dep_id: number = Number(req.body.dep_id)
    const dep_name = req.body.dep_name

    switch (method) {
        case "PUT":
            // CREATE
            try {
                const createResult = await prisma.department.create({
                    data: {
                        dep_name: dep_name
                    }
                })
        
                if (createResult != null) {
                    res.status(200).json({
                        "message": "부서가 추가되었습니다."
                    })
                } else {
                    res.status(400).json({
                        "message": "부서를 추가할 수 없습니다."
                    })
                }
            } catch (e) {
                res.status(400).json({
                    "message": "부서를 추가할 수 없습니다.\n" + e
                })
            }
            break
        case "POST":
            // UPDATE
            try {
                const createResult = await prisma.department.update({
                    where: {
                        dep_id: dep_id
                    }, data: {
                        dep_name: dep_name
                    }
                })
        
                if (createResult != null) {
                    res.status(200).json({
                        "message": "부서 정보가 변경되었습니다."
                    })
                } else {
                    res.status(400).json({
                        "message": "부서 정보를 변경할 수 없습니다."
                    })
                }
            } catch (e) {
                res.status(400).json({
                    "message": "부서 정보를 변경할 수 없습니다.\n" + e
                })
            }
            break
        case "GET":
            // READ
            res.status(400).json(getDepartments(dep_name))
            break
        case "DELETE":
            // DELETE
            try {
                const result = await prisma.department.delete({
                    where: {
                        dep_id: dep_id
                    }
                })
        
                if (result != null) {
                    res.status(200).json({
                        "message": "부서가 삭제되었습니다."
                    })
                } else {
                    res.status(400).json({
                        "message": "부서를 삭제할 수 없습니다."
                    })
                }
            } catch (e) {
                res.status(400).json({
                    "message": "부서를 삭제할 수 없습니다.\n" + e
                })
            }
            break
    }
}

export async function getDepartments(dep_name: string): Promise<Department[]> {
    const departments: Department[] = await prisma.department.findMany({
        where: {
            dep_name: dep_name
        },
        orderBy: {
            dep_id: 'desc'
        },
        include: {
            teams: true
        }
    })
    return departments
}

// export async function updateDepartment(dep_id: number, dep_name: string): Promise<Department[]> {
//     const departments: Department[] = await prisma.department.findMany({orderBy: {dep_id: 'asc'}})
//     return departments
// }
