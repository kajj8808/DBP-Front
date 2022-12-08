import { Table, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import { useState } from 'react';
import AdminLayout from '@components/AdminLayout';
import axios from 'axios';
import prisma from '@libs/prisma';
import { useRouter } from 'next/router';

export default ({ results }) => {
    const router = useRouter()
    const user_id = router.query.user_id

    async function testLoginLog(e) {
        e.preventDefault()
        const response = await axios.put('/api/admin/user_logs', {
            user_srl: 1, 
            type: 0
        })
        console.log(response)
        alert('테스트 로그 추가 완료')
    }

    async function testLogoutLog(e) {
        e.preventDefault()
        axios.put('/api/admin/user_logs', {
            user_srl: 1, 
            type: 1
        })
        .then(function (response) {
            alert('테스트 로그 추가 완료')
            location.reload()
        })
    }

    async function searchUser(e) {
        e.preventDefault()
        const user_id = window.prompt("검색할 사용자 아이디를 입력하세요.")
        router.push(`/admin/user_logs?user_id=${user_id}`)
    }

    return (
        <AdminLayout>
            <h1>유저 로그</h1>
            <Alert variant="primary">
                <b>7. 관리자 기능 구현 (80)</b><br />
                &nbsp;&nbsp; E. (10) 사용자별 로그인 / 로그아웃 시간 기록 검색 기능<br />
                {/* <hr />
                <p className="mb-0">
                   <button onClick={testLoginLog}>테스트용 로그인 로그 추가</button>{' '}
                   <button onClick={testLogoutLog}>테스트용 로그아웃 로그 추가</button>
                </p> */ }
            </Alert>
            <p>
                <Button variant="dark" onClick={searchUser}>사용자 검색</Button>
                {user_id != null ? <><span> 사용자 '{user_id}' 검색 결과 </span><Button variant="light" onClick={() => router.push('/admin/user_logs')}>검색 초기화</Button></> : <></>}
            </p>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>날짜</th>
                        <th>사용자 아이디</th>
                        <th>로그인/로그아웃</th>
                    </tr>
                </thead>
                <tbody>
                {results.length != 0 ? results.map(item => (
                        <tr>
                            <td>{(new Date(item.date)).toLocaleString()}</td>
                            <td>{item.id}</td>
                            <td>{item.type == 0 ? <b>로그인</b> : "로그아웃"}</td>
                        </tr>
                    )) : <tr><td colSpan={3} className="text-center">데이터가 없습니다.</td></tr>}
                </tbody>
            </Table>
        </AdminLayout>
    )
}

export async function getServerSideProps(context) {
    if (context.query.user_id != null) {
        var results = await prisma.$queryRaw`SELECT * from User, UserLog where User.user_srl = UserLog.user_srl and User.id = ${context.query.user_id} order by date desc`
        results = JSON.parse(JSON.stringify(results))
        return { props: { results }}
    } else {
        var results = await prisma.$queryRaw`SELECT * from User, UserLog where User.user_srl = UserLog.user_srl order by date desc`
        results = JSON.parse(JSON.stringify(results))
        return { props: { results }}
    }
}
