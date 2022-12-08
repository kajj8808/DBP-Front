import client from "@libs/server/client";
import useMutation from "./useMutation";

interface IAMessage {
  content: string;
  userId: string | null | undefined;
  roomId: string;
  option: "file" | "text" | "emoji";
  userName?: string | null | undefined;
  profile_url?: string | null | undefined;
  id?: string;
  userUser_srl?: number;
}

interface IMessage {
  content: string;
  userId?: string | null | undefined;
  roomId: string;
  option: "file" | "text" | "emoji";
  userUser_srl?: number | undefined | null;
  user?: {
    profile_url?: string | null | undefined;
    userName?: string;
    id?: string;
    name?: string | null;
  };
}

const makeMessage = (
  { content, userId, roomId, option, userName, profile_url, id }: IAMessage,
  type: "client" | "server"
): IMessage => {
  let result;
  if (type === "client") {
    result = clientMessage({
      content,
      userUser_srl: +userId!,
      roomId,
      option,
      user: { profile_url, name: userName, id },
    });
  } else {
    result = serverMessage({
      content,
      option,
      roomId,
      userId,
    });
  }
  return result;
};

const clientMessage = (msg: IMessage) => ({ ...msg });
const serverMessage = (msg: IMessage) => ({ ...msg });
export default makeMessage;
