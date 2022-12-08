import AdminLayout from "@components/AdminLayout";
import { Table, Button, Form, Row, Col, Alert } from "react-bootstrap";
import prisma from "@libs/prisma";
import { useRouter } from "next/router";

export default ({ results }) => {
  const router = useRouter();

  function searchDate(e) {
    e.preventDefault();
    const searchText = window.prompt("YYYY-mm-dd 형식으로 입력하세요.");
    if (searchText != null) {
      router.push(`/admin/messages?date=${searchText}`);
    }
  }

  function searchKeyword(e) {
    e.preventDefault();
    const searchText = window.prompt("내용에 포함된 키워드를 입력하세요.");
    if (searchText != null) {
      router.push(`/admin/messages?keyword=${searchText}`);
    }
  }

  function searchName(e) {
    e.preventDefault();
    const searchText = window.prompt("사용자 이름을 입력하세요. (닉네임 x)");
    if (searchText != null) {
      router.push(`/admin/messages?name=${searchText}`);
    }
  }

  return (
    <AdminLayout>
      <h1>대화 관리</h1>
      <Alert variant="primary">
        <b>7. 관리자 기능 구현 (80)</b>
        <br />
        D. (10) 사용자간 전체 대화 내용 검색 기능 : 시간별/ 키워드별 / 사용자
        대화
      </Alert>
      <p>
        <Button variant="dark" onClick={searchDate}>
          시간별 검색
        </Button>
        {` `}
        <Button variant="dark" onClick={searchKeyword}>
          키워드별 검색
        </Button>
        {` `}
        <Button variant="dark" onClick={searchName}>
          사용자 검색
        </Button>
        {` `}
        <Button variant="light" onClick={() => router.push("/admin/messages")}>
          검색 초기화
        </Button>
      </p>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>내용</th>
            <th>보낸 사람 (이름/닉네임)</th>
            <th>전송 시간</th>
          </tr>
        </thead>
        <tbody>
          {results.length != 0 ? (
            results.map((item) => (
              <tr>
                <td>{item.content}</td>
                <td>
                  {item.user.name} ({item.user.nickname})
                </td>
                <td>{new Date(item.created_time).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="text-center">
                데이터가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </AdminLayout>
  );
};

export async function getServerSideProps(context) {
  var { date, keyword, name } = context.query;

  var today = new Date(date);
  var tomorrow = new Date(date);
  tomorrow.setDate(today.getDate() + 1);

  if (date != null) {
    var results = await prisma.message.findMany({
      where: {
        created_time: {
          gte: today,
          lt: tomorrow,
        },
        content: { contains: keyword },
        user: {
          name: name,
        },
      },
      include: {
        user: true,
      },
    });

    results = JSON.parse(JSON.stringify(results));

    return { props: { results } };
  } else {
    var results = await prisma.message.findMany({
      where: {
        content: { contains: keyword },
        user: {
          name: { contains: name },
        },
      },
      include: {
        user: true,
      },
    });

    results = JSON.parse(JSON.stringify(results));

    return { props: { results } };
  }
}
