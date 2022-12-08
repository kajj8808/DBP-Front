import AdminLayout from "@components/AdminLayout"
import prisma from "@libs/prisma"
import { useRouter } from "next/router"
import { Table, Button, Form, Row, Col, Alert } from 'react-bootstrap'
import { MouseEvent } from 'react'

export default ({ results }) => {
    const router = useRouter()

    function handleClick(e: MouseEvent<HTMLAnchorElement>) {
        e.preventDefault()
    
        const element = e.currentTarget
        router.push(element.href)
      }
    
    return (
        <AdminLayout>
            <h1>유저 관리</h1>
            <Alert variant="primary">
                <b>2.     회원 정보 변경 기능 (30)</b><br />
                A.      (10) PW / 이름 / 별명 / 주소 변경 (프로필 시간 구현 시 프로필 사진도 변경가능 해야함)<br />
                <b>7.     관리자 기능 구현 (80)</b><br />
                C.      (10) 사용자별 소속 부서 변경 기능<br />
                D.      (10) 사용자간 전체 대화 내용 검색 기능 : 시간별/ 키워드별 / 사용자 대화
            </Alert>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>이름</th>
                        <th>닉네임</th>
                        <th>부서</th>
                        <th>팀</th>
                        <th>정보 변경</th>
                    </tr>
                </thead>
                <tbody>
                {results.length != 0 ? results.map(item => (
                        <tr>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.nickname}</td>
                            <td>{item.department_id}</td>
                            <td>{item.team_id}</td>
                            <td><a href={`/admin/user_change_admin?id=` + item.id} onClick={handleClick}>정보 변경</a></td>
                        </tr>
                    )) : <tr><td colSpan={5} className="text-center">데이터가 없습니다.</td></tr>}
                </tbody>
            </Table>
        </AdminLayout>
    )
}

export async function getStaticProps() {
    var results = await prisma.user.findMany()
    results = JSON.parse(JSON.stringify(results))
    return { props: { results }}
}
