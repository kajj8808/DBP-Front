import { Collapse, Table, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import { useState } from 'react';
import AdminLayout from '@components/AdminLayout';
import { getDepartments, deleteDepartment } from '../api/admin/departments'
import { useSession, signOut, signIn } from "next-auth/react";
import { useRouter } from 'next/router';

export default ({ departments }) => {
    const router = useRouter()
    const [openInsert, setOpenInsert] = useState(false);
    const [openSearch, setOpenSearch] = useState(false);

    const [departmentName, setDepartmentName] = useState<string>("");
    const [departmentNameSearch, setDepartmentNameSearch] = useState<string>("");

    const submitData = async (e) => {
        e.preventDefault()
        if (departmentName == "") {
            alert('부서명을 입력해주세요.')
        } else {
            const body = { 'dep_name': departmentName }
            await fetch(`/api/admin/departments`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })
            .then(() => {
                alert('부서가 추가되었습니다.')
                location.reload()
            })
            .catch((e) => {
                console.error(e)
            })
        }
      }

      const submitSearch = async (e) => {
        e.preventDefault()
        if (departmentNameSearch == '') {
            router.replace('/admin/departments')
        } else {
            router.replace('/admin/departments?dep_name=' + departmentNameSearch)
        }
      }
    
      const updateDepartment = async (e) => {
        e.preventDefault()

        const new_dep_name = window.prompt('변경할 부서 이름을 입력하세요.')

        if (new_dep_name != null && new_dep_name != "") {
            const dep_id = e.target.getAttribute('data-dep-id')

            const body = { 'dep_id': dep_id, 'dep_name': new_dep_name }

            await fetch(`/api/admin/departments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })
            .then((response) => {
                console.log(response)
                alert('부서 이름이 ' + new_dep_name + '(으)로 변경 되었습니다.')
                location.reload()
            })
            .catch((e) => {
                console.error(e)
            })
        }
      }
      
      const deleteDepartment = async (e) => {
        e.preventDefault()
        const dep_id = e.target.getAttribute('data-dep-id');

        const body = { 'dep_id': dep_id }

        await fetch(`/api/admin/departments`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        })
        .then((response) => {
            console.log(response)
            alert('부서가 삭제되었습니다.')
            location.reload()
        })
        .catch((e) => {
            console.error(e)
        })
      }

      const manageTeam = (e) => {
        e.preventDefault()
        const dep_id = e.target.getAttribute('data-dep-id');
        router.push(`/admin/team?dep_id=${dep_id}`)
      }

    return (
        <AdminLayout>
            <h1>부서 관리</h1>
            <Alert variant="primary">
               <b>7. 관리자 기능 구현 (80)</b><br />
                &nbsp;&nbsp; (10) 부서관리 기능 (부서등록 / 검색 / 변경)<br />
            </Alert>
            <p>
                <Button variant="dark" onClick={() => setOpenInsert(!openInsert)} aria-expanded={openInsert}>
                    부서 추가
                </Button>{`  `}
                <Button variant="light" onClick={() => setOpenSearch(!openSearch)} aria-expanded={openSearch}>
                    부서 검색
                </Button>
            </p>
            <Collapse in={openInsert}>
                <Form onSubmit={submitData}>
                    <Row className="mb-3">
                        <Col>
                            <Form.Control 
                                placeholder="부서 이름" 
                                value={departmentName} 
                                onChange={(e) => setDepartmentName(e.target.value)} 
                            />
                            </Col>
                        <Col><Button type="submit">부서 추가</Button></Col>
                    </Row>
                </Form>
            </Collapse>
            <Collapse in={openSearch}>
                <Form onSubmit={submitSearch}>
                    <Row className="mb-3">
                        <Col>
                            <Form.Control 
                                placeholder="부서 이름" 
                                value={departmentNameSearch} 
                                onChange={(e) => setDepartmentNameSearch(e.target.value)} 
                            />
                            </Col>
                        <Col><Button type="submit">검색</Button></Col>
                    </Row>
                </Form>
            </Collapse>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>부서 이름</th>
                        <th>부서 내 팀 수</th>
                        <th>팀 편집</th>
                        <th>편집/삭제</th>
                    </tr>
                </thead>
                <tbody>
                    {departments.length != 0 ? departments.map(dep => (
                        <tr>
                            <td><b>{dep.dep_name}</b></td>
                            <td className="text-muted">{dep.teams.length}개의 팀</td>
                            <td>
                                <Button variant="light" size="sm" data-dep-id={dep.dep_id} onClick={manageTeam}>팀 편집</Button>{' '}
                            </td>
                            <td>
                                <Button variant="warning" size="sm" data-dep-id={dep.dep_id} onClick={updateDepartment}>편집</Button>{' '}
                                <Button data-dep-id={dep.dep_id} onClick={deleteDepartment} variant="danger" size="sm">삭제</Button>
                            </td>
                        </tr>
                    )) : <tr><td colSpan={4} className="text-center">현재 부서가 없습니다.</td></tr>}
                </tbody>
                </Table>
        </AdminLayout>
    )
}

export async function getServerSideProps(context) {
    const departments = await getDepartments(context.query.dep_name)

    return { props: { departments } }
}
