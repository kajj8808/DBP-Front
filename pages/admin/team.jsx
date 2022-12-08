import AdminLayout from "@components/AdminLayout";
import prisma from "@libs/prisma";
import { useRouter } from "next/router";
import { getTeams } from "pages/api/admin/teams";
import { Table, Button } from "react-bootstrap";

export default ({ teams }) => {
  const router = useRouter();
  const dep_id = Number(router.query.dep_id);

  async function addTeam(e) {
    e.preventDefault();
    const teamName = window.prompt("추가할 팀 이름을 입력하세요.");
    if (teamName != null && teamName != "") {
      console.log(teams);
      const body = { dep_id: dep_id, team_name: teamName };
      console.log(body);

      const result = await fetch(`/api/admin/teams`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
        .then((response) => {
          console.log(response);
          alert(teamName + "팀이 추가되었습니다.");
          location.reload();
        })
        .catch((e) => {
          alert(e);
        });
    }
  }

  async function updateTeam(e) {
    e.preventDefault();
    const teamName = window.prompt("변경할 팀 이름을 입력하세요.");
    const team_id = e.target.getAttribute("data-team-id");

    if (teamName != null && teamName != "") {
      const body = { team_id: team_id, team_name: teamName };
      console.log(body);
      const result = await fetch(`/api/admin/teams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
        .then((response) => {
          console.log(response);
          alert(teamName + "으로 변경되었습니다.");
          location.reload();
        })
        .catch((e) => {
          alert(e);
        });
    }
  }

  async function deleteTeam(e) {
    e.preventDefault();

    const team_id = e.target.getAttribute("data-team-id");
    const body = { team_id: team_id };
    const result = await fetch(`/api/admin/teams`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((response) => {
        console.log(response);
        alert("삭제되었습니다.");
        location.reload();
      })
      .catch((e) => {
        alert(e);
      });
  }

  return (
    <AdminLayout>
      <Button onClick={() => router.push("/admin/departments")} variant="light">
        ‹ 뒤로가기
      </Button>
      <br />
      <br />
      <h1>
        <b>{teams.length != 0 ? teams[0].department.dep_name : ""}</b> 부서 팀
        관리
      </h1>
      <p>
        <Button variant="dark" onClick={addTeam}>
          팀 추가
        </Button>
      </p>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>팀 이름</th>
            <th>편집/삭제</th>
          </tr>
        </thead>
        <tbody>
          {teams.length != 0 ? (
            teams.map((team) => (
              <tr>
                <td>{team.team_name}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    data-team-id={team.team_id}
                    onClick={updateTeam}
                  >
                    편집
                  </Button>{" "}
                  <Button
                    variant="danger"
                    size="sm"
                    data-team-id={team.team_id}
                    onClick={deleteTeam}
                  >
                    삭제
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center">
                현재 팀이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </AdminLayout>
  );
};

export async function getServerSideProps(context) {
  const dep_id = Number(context.query.dep_id);

  const teams = await getTeams(dep_id);

  return { props: { teams } };
}
