import React, { useState } from "react";
import ModalLayout from "./ModalLayout";
import Loader from "../shared/Loader";
import Input from "../shared/Input";
import { searchGyms } from "../../api/gymApi";
import useCustomNavigate from "../../hooks/useCustomNavigate";

const AvailableUsersModal = ({
  availableUsersLoading,
  availableUsers,
  userData,
  toggleModal,
  handleButtonClick,
}) => {
  const roles = {
    ROLE_GENERAL: "회원",
    ROLE_GYM: "헬스장",
    ROLE_TRAINER: "트레이너",
  };
  const [searchWord, setSearchWord] = useState("");
  const [search, setSearch] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const customNavigate = useCustomNavigate();

  const handleSearch = async () => {
    if (!searchWord) return;
    try {
      setSearch(true);
      const gymList = await searchGyms(searchWord);
      console.log("handleSearch in gym search map", gymList);
      setSearchResult(gymList);
    } catch (error) {
      console.error("Error fetching gym list:", error);
      setSearch(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <ModalLayout toggleModal={toggleModal}>
      <div className="flex flex-col w-[300px] min-h-[300px]">
        <span className="text-start text-2xl mb-2">대화 선택하기 👆</span>
        {/* 일반 회원만 검색 가능 */}
        {userData.role === "ROLE_GENERAL" ? (
          <div>
            <Input
              name={"searchWord"}
              value={searchWord}
              placeholder="헬스장을 검색해주세요..."
              onChange={(e) => setSearchWord(e.target.value)}
              width="100%"
              feature={
                <div className="-translate-y-1">
                  <box-icon name="search" color="#bdbdbd" size="s"></box-icon>
                </div>
              }
              featureEnableOnLoad={true}
              featureOnClick={handleSearch}
              onKeyPress={handleKeyPress}
            />
          </div>
        ) : (
          <hr className="mb-4"></hr>
        )}

        {/* 검색 전 */}

        <div className="flex flex-col">
          {search === false && (
            <>
              <div className="h-[200px] overflow-hidden overflow-y-auto">
                {availableUsersLoading ? (
                  <Loader />
                ) : availableUsers.length > 0 ? (
                  availableUsers.map(
                    (user, index) =>
                      user.userId !== userData.userId && (
                        <div
                          className="cursor-pointer flex justify-between items-center hover:bg-peach-fuzz/50 px-2 py-2 rounded-md transition-all ease-in-out"
                          key={index}
                          onClick={() => handleButtonClick(user.userId)}
                        >
                          <b>{user.userName}</b>
                          <span className="text-sm text-gray-700">
                            {roles[user.role]}
                          </span>
                        </div>
                      )
                  )
                ) : (
                  <div className="flex flex-col justify-center items-center">
                    <span className="text-3xl pt-6">😔</span>
                    <span className="py-6">
                      대화 가능한 상대가 없습니다.
                      {userData.role === "ROLE_GENERAL" && (
                        <>
                          <br /> 헬스장 조회를 통해 대화를 시작하거나 회원권
                          또는 PT 등록을 해주세요.
                        </>
                      )}
                    </span>
                  </div>
                )}
              </div>
              <hr className="mb-6"></hr>
              <p className="before:content-['*'] before:mr-0.5 before:text-red-500 text-center text-sm text-gray-700">
                회원님과 연관 된 회원 목록이 표시됩니다.
              </p>
            </>
          )}

          {/* 검색 후 */}
          {search === true && (
            <>
              <div className="h-[200px] overflow-hidden overflow-y-auto">
                {searchResult && searchResult.length > 0 ? (
                  searchResult.map((gym, index) => {
                    return (
                      <div
                        className="cursor-pointer flex justify-between items-center hover:bg-peach-fuzz/50 px-2 py-2 rounded-md transition-all ease-in-out"
                        key={index}
                        onClick={() => handleButtonClick(gym.user.userId)}
                      >
                        <b>{gym.user.userName}</b>

                        <div
                          className="translate-y-1"
                          // TODO 클릭시 상세페이지로 이동
                          onClick={() =>
                            customNavigate("/gymSearch", {
                              state: { searchWord: gym.user.userName },
                            })
                          }
                        >
                          <box-icon
                            name="search"
                            color="#bdbdbd"
                            size="s"
                          ></box-icon>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col justify-center items-center">
                    <span className="text-3xl pt-6">😔</span>
                    <span className="py-6">
                      검색어와 일치하는 헬스장이 없습니다.
                    </span>
                  </div>
                )}
              </div>
              <hr className="mb-6"></hr>
              <p
                className="text-center text-sm text-gray-500 hover:text-gray-700 underline underline-offset-4 cursor-pointer"
                onClick={() => setSearch(false)}
              >
                돌아가기
              </p>
            </>
          )}
        </div>
      </div>
    </ModalLayout>
  );
};

export default AvailableUsersModal;
