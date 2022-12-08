import "bootstrap/dist/css/bootstrap.min.css";
import AdminNavbar from "./AdminNavbar";
import { Container } from "react-bootstrap";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { Button } from "react-bootstrap";
//
export default ({ children }) => {
  const router = useRouter();
  const { data: session } = useSession();

  if (true) {
    if (session?.user.is_admin == false) {
      return (
        <>
          <AdminNavbar />
          <Container>
            <p>관리자가 아닙니다.</p>
          </Container>
        </>
      );
    } else {
      return (
        <>
          <AdminNavbar />
          <main className="mt-3">
            <Container>{children}</Container>
          </main>
        </>
      );
    }
  } else {
    return (
      <>
        <AdminNavbar />
        <Container>
          <p>로그인이 필요합니다.</p>
          <Button onClick={() => router.push("/login")}>로그인</Button>
        </Container>
      </>
    );
  }
};
