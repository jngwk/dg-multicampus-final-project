import React, { useEffect, useState } from "react";
import ModalLayout from "./ModalLayout";
import { findPT } from "../../api/ptApi";
import Button from "../shared/Button";
import useCustomNavigate from "../../hooks/useCustomNavigate";
import Loader from "../shared/Loader";
import MembershipPtSelectModal from "./MembershipPtSelectModal";

const MembershipModal = ({ membership, toggleModal }) => {
  const [pt, setPt] = useState();
  const [ptLoading, setPtLoading] = useState(false);
  const [isSelectModalVisible, setIsSelectModalVisible] = useState(false);
  const customNavigate = useCustomNavigate();
  useEffect(() => {
    if (membership.product?.ptCountTotal === 0) return;

    const getPt = async () => {
      try {
        setPtLoading(true);
        const data = await findPT();
        console.log("pt in membership modal", data);
        setPt(await findPT());
      } catch (error) {
        console.log("error getting pt in membership modal", error);
      } finally {
        setPtLoading(false);
      }
    };

    getPt();
  }, []);

  return (
    <>
      {!isSelectModalVisible ? (
        <ModalLayout toggleModal={toggleModal}>
          <div className="flex flex-col gap-3 w-[240px]">
            <div className="flex justify-between items-end mb-4">
              <span className="text-xl font-semibold">
                {membership.gym.user.userName}
              </span>
              <div>
                <div
                  className="translate-y-0.5 cursor-pointer"
                  onClick={() =>
                    customNavigate("/gymSearch", {
                      state: { searchWord: membership.gym.user.userName },
                    })
                  }
                >
                  <box-icon name="search" color="#bdbdbd" size="s"></box-icon>
                </div>
              </div>
            </div>
            <div>
              <div className="mb-3">
                <span className="font-bold text-base">📋 회원권</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">등록일</span>
                <span>{membership.regDate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">만료일</span>
                <span>{membership.expDate}</span>
              </div>
            </div>
            <hr />
            <div>
              <div className="mb-3">
                <span className="font-bold text-base">🏋️ PT</span>
              </div>

              {ptLoading ? (
                <div className="w-full h-full flex justify-center items-center">
                  <Loader />
                </div>
              ) : pt ? (
                <>
                  {/* <div className="flex justify-between items-center">
                    <span className="font-semibold">결제된 PT 횟수</span>
                    <span>{pt.ptCountTotal}</span>
                  </div> */}
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">PT 잔여 횟수</span>
                    <span>{pt.ptCountRemain}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">PT 트레이너</span>
                    <span>{pt.trainer.user.userName}</span>
                  </div>
                  <hr className="my-3" />
                  <p className="before:content-['*'] before:text-red-500 before:mr-1 text-center text-gray-500">
                    회원권이 만료되기 전에 <br />
                    <b>꼭</b> 남은 PT를 모두 사용해주세요!
                  </p>
                </>
              ) : (
                <div className="w-full h-full flex justify-center items-center">
                  등록된 PT권이 없습니다...
                </div>
              )}
            </div>
            <div className="mt-3">
              <Button
                label={"연장하기"}
                color={"bright-orange"}
                onClick={() => setIsSelectModalVisible(true)}
              />
            </div>
          </div>
        </ModalLayout>
      ) : (
        <MembershipPtSelectModal
          toggleModal={() => setIsSelectModalVisible(false)}
          selectedGym={membership.gym}
        />
      )}
    </>
  );
};

export default MembershipModal;
