import React from "react";
import ModalLayout from "./ModalLayout";
import Button from "../shared/Button";
import useCustomNavigate from "../../hooks/useCustomNavigate";

const AlertModal = ({ headerEmoji, line1, line2, button1, button2 }) => {
  const customNavigate = useCustomNavigate();

  return (
    <ModalLayout>
      <div className="flex flex-col justify-center items-center">
        <div>
          <span className="text-5xl">{headerEmoji}</span>
        </div>
        <div className="text-center flex flex-col justify-center gap-10 p-16 text-lg">
          <span>{line1}</span>
          {line2 && <span>{line2}</span>}
        </div>
        <div className="flex gap-6">
          {button1 && (
            <Button
              label={button1.label}
              onClick={
                button1.path
                  ? () => customNavigate(button1.path, button1.option)
                  : button1.onClick
              }
              width="100px"
              height="50px"
            />
          )}
          {button2 && (
            <Button
              label={button2.label}
              onClick={
                button2.path
                  ? () => customNavigate(button2.path, button2.option)
                  : button2.onClick
              }
              color="bright-orange"
              width="100px"
              height="50px"
            />
          )}
        </div>
      </div>
    </ModalLayout>
  );
};

export default AlertModal;
