import React, { SetStateAction, Dispatch } from "react";
import { useDaumPostcodePopup } from "react-daum-postcode";

interface PostcodeProps {
  setAddress: Dispatch<SetStateAction<string>>;
}

const Postcode: React.FunctionComponent<PostcodeProps> = ({ setAddress }) => {
  const open = useDaumPostcodePopup();

  const handleComplete = (data: any) => {
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }

    setAddress(fullAddress);
  };

  const handleClick = () => {
    open({ onComplete: handleComplete });
  };

  return (
    <button
      className="bg-blue-500 w-40 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      type="button"
      onClick={handleClick}
    >
      주소찾기
    </button>
  );
};

export default Postcode;
