import { useRouter } from 'next/router'
import { Navbar, Container, Nav } from 'react-bootstrap'

export default () => {
    const router = useRouter();

    return (
        <>
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Brand>관리자</Navbar.Brand>
                    <Nav className="me-auto">
                        <button onClick={() => router.push("/admin/departments") } className="nav-link">부서/팀 관리</button>
                        <button onClick={() => router.push("/admin/users") } className="nav-link">유저 관리</button>
                        <button onClick={() => router.push("/admin/user_logs") } className="nav-link">유저 로그</button>
                        <button onClick={() => router.push("/admin/messages") } className="nav-link">대화 관리</button>
                    </Nav>
                </Container>
            </Navbar>
        </>
    )
}