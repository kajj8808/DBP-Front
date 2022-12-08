import Modal from "@components/Modal/Modal";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

function UserModal({ onClose }: any): any {
  const { data: session } = useSession();
  const [user, setUser] = useState("");

  useEffect(() => {
    setUser(session?.user?.id);
  }, [session]);

  return (
    <Modal onClose={onClose}>
      <h1>{user}</h1>
    </Modal>
  );
}

export default UserModal;
