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
      if (userData.role === "ROLE_GENERAL") {
        const gymList = await searchGyms(searchWord);
        console.log("handleSearch in gym search map", gymList);
        setSearchResult(gymList);
      } else {
        const filteredUsers = availableUsers.filter(
          (user) =>
            user.userName.toLowerCase().includes(searchWord.toLowerCase()) ||
            roles[user.role].includes(searchWord)
        );
        setSearchResult(filteredUsers);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
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
        <div>
          <Input
            name={"searchWord"}
            value={searchWord}
            placeholder={
              userData.role === "ROLE_GENERAL"
                ? "헬스장을 검색해주세요..."
                : "검색어를 입력해주세요..."
            }
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
                  <div className="flex flex-col h-full justify-center items-center text-center">
                    <span className="text-3xl pt-6">😢</span>
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
          {search === true && (
            <>
              <div className="h-[200px] overflow-hidden overflow-y-auto">
                {searchResult && searchResult.length > 0 ? (
                  searchResult.map((result, index) => {
                    return userData.role === "ROLE_GENERAL" ? (
                      <div
                        className="cursor-pointer flex justify-between items-center hover:bg-peach-fuzz/50 px-2 py-2 rounded-md transition-all ease-in-out"
                        key={index}
                        onClick={() => handleButtonClick(result.user.userId)}
                      >
                        <b>{result.user.userName}</b>
                        <div
                          className="translate-y-1"
                          onClick={() =>
                            customNavigate("/gymSearch", {
                              state: { searchWord: result.user.userName },
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
                    ) : (
                      <div
                        className="cursor-pointer flex justify-between items-center hover:bg-peach-fuzz/50 px-2 py-2 rounded-md transition-all ease-in-out"
                        key={index}
                        onClick={() => handleButtonClick(result.userId)}
                      >
                        <b>{result.userName}</b>
                        <span className="text-sm text-gray-700">
                          {roles[result.role]}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col justify-center items-center text-center">
                    <span className="text-3xl pt-6">😔</span>
                    <span className="py-6">
                      검색어와 일치하는 결과가 없습니다.
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
