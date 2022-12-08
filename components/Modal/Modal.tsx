import React from "react";
import { FaTimes } from "react-icons/fa";
import ModalContainer from "./ModalContainer";

function Modal({ onClose, children }: any) {
  const handleClose = () => {
    onClose?.();
  };
  return (
    <ModalContainer>
      <div className="fixed top-0 bottom-0 left-0 right-0 z-[9999] h-full w-full bg-black bg-opacity-20">
        <div className="scrollbar absolute top-1/2 left-1/2 max-h-[600px] w-[300px] -translate-x-1/2 -translate-y-1/2 transform overflow-x-hidden rounded-[15px] bg-white">
          <div className=" float-right mt-3 cursor-pointer p-0">
            <FaTimes
              className="w-[30px] text-[#5d5d5d]"
              onClick={handleClose}
            />
          </div>
          <div className="my-[30px] mx-[30px]">{children}</div>
        </div>
      </div>
    </ModalContainer>
  );
}

export default Modal;
