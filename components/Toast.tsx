import {
  ToastContainer,
  toast,
  Zoom,
  Bounce,
  Flip,
  Slide,
} from "react-toastify";
import { SocketContext } from "@context/socket";
import { useContext, useEffect } from "react";
interface INotify {
  message: string;
  sender: string;
  avatar: string;
}

export default () => {
  const socket = useContext(SocketContext);

  useEffect(() => {
    socket.on("notify", (text) => {
      toast.info(text, {
        autoClose: 2000,
        position: "top-right",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        icon: "🔔",
        progress: undefined,
      });
    });
  }, []);

  return <ToastContainer />;
};
