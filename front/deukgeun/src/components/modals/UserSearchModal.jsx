import React, { useState } from "react";
import ModalLayout from "./ModalLayout";
import Loader from "../shared/Loader";
import Input from "../shared/Input";
import useMasking from "../../hooks/useMasking";

const UserSearchModal = ({
  userData,
  toggleModal,
  users,
  usersLoading,
  formValues,
  setFormValues,
}) => {
  const [searchWord, setSearchWord] = useState("");
  const [search, setSearch] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const maskEmail = useMasking();

  const handleSearch = async () => {
    if (!searchWord) return;
    const filteredUsers = users.filter(
      (user) =>
        user.userName.includes(searchWord) || user.email.includes(searchWord)
    );
    setSearchResult(filteredUsers);
    setSearch(true);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleButtonClick = (user) => {
    //handle button click
    setFormValues({
      ...formValues,
      ptUserId: user.userId,
      ptUserName: user.userName,
    });
    toggleModal();
  };

  return (
    <ModalLayout toggleModal={toggleModal}>
      <div className="flex flex-col w-[300px] min-h-[300px]">
        <span className="text-start text-2xl mb-2">회원 선택하기 👆</span>
        {/* 일반 회원만 검색 가능 */}
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

        {/* 검색 전 */}

        <div className="flex flex-col">
          {search === false && (
            <>
              <div className="h-[200px] overflow-hidden overflow-y-auto">
                {usersLoading ? (
                  <Loader />
                ) : users.length > 0 ? (
                  users.map(
                    (user, index) =>
                      user.userId !== userData.userId && (
                        <div
                          className="cursor-pointer flex justify-between items-center hover:bg-peach-fuzz/50 px-2 py-2 rounded-md transition-all ease-in-out"
                          key={index}
                          onClick={() => handleButtonClick(user)}
                        >
                          <b>{user.userName}</b>

                          <span className="text-sm text-gray-700">
                            {maskEmail(user.email)}
                          </span>
                        </div>
                      )
                  )
                ) : (
                  <div className="flex flex-col justify-center items-center">
                    <span className="text-3xl pt-6">😔</span>
                    <span className="py-6">
                      트레이너 님과 연결 된 회원이 없습니다.
                    </span>
                  </div>
                )}
              </div>
              <hr className="mb-6"></hr>
              <p className="before:content-['*'] before:mr-0.5 before:text-red-500 text-center text-sm text-gray-700">
                트레이너 님과 연결 된 회원 목록이 표시됩니다.
              </p>
            </>
          )}

          {/* 검색 후 */}
          {search === true && (
            <>
              <div className="h-[200px] overflow-hidden overflow-y-auto">
                {searchResult && searchResult.length > 0 ? (
                  searchResult.map((user, index) => {
                    return (
                      <div
                        className="cursor-pointer flex justify-between items-center hover:bg-peach-fuzz/50 px-2 py-2 rounded-md transition-all ease-in-out"
                        key={index}
                        onClick={() => handleButtonClick(user.userId)}
                      >
                        <b>{user.userName}</b>

                        <span className="text-sm text-gray-700">
                          {maskEmail(user.email)}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col justify-center items-center">
                    <span className="text-3xl pt-6">😔</span>
                    <span className="py-6">
                      검색어와 일치하는 회원이 없습니다.
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

export default UserSearchModal;
