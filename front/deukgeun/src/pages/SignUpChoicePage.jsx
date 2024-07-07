import React from "react";
import Button from "../components/shared/Button";
import useCustomNavigate from "../hooks/useCustomNavigate";
import CustomParticles from "../components/shared/CustomParticles";

const SignUpChoicePage = () => {
  const customNavigate = useCustomNavigate();

  return (
    // translate-y-1/2
    <>
      <div className="w-full min-h-[80dvh] flex justify-center items-center">
        <div className="w-full flex justify-center items-center">
          <div className="w-96 h-auto flex flex-col justify-center items-center">
            <div className="mb-5 text-xl font-medium">
              운동하러 오셨나요? <span className="text-2xl ml-3">💪</span>
            </div>
            <Button
              label="일반 회원"
              className="mb-5 text-lg font-semibold"
              width="180px"
              height="64px"
              onClick={() =>
                customNavigate("/signUp/form", { state: { role: "general" } })
              }
            />
            <div className="w-16 h-3 border-t border-gray-500 my-6"></div>
            <div className="mb-5 text-xl font-medium">
              헬스장을 운영중인 사장님이신가요?
              <span className="text-2xl ml-3">🤔</span>
            </div>
            <Button
              label="헬스장 회원"
              className="text-lg font-semibold"
              color="bright-orange"
              width="180px"
              height="64px"
              onClick={() =>
                customNavigate("/signUp/form", { state: { role: "gym" } })
              }
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUpChoicePage;
