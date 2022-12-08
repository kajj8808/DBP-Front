import React from "react";
import { createPortal } from "react-dom";

function ModalContainer({ children }) {
  return typeof window !== "undefined"
    ? createPortal(<>{children}</>, document.getElementById("modal"))
    : null;
}

export default ModalContainer;
