import React, { useEffect, useState } from "react";
import { LuClipboardList } from "react-icons/lu";
import axios from "axios";
import Tr from "../components/shared/Tr";

const MemberList = () => {
  const [info, setInfo] = useState([]);

  // 임시 더미데이터
  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((res) => setInfo(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="container max-w-screen-lg mx-auto">
      <div className="flex items-center p-4">
        <LuClipboardList color="#ffbe98" size="56" />
        <span className="font-semibold text-2xl mx-3 ">회원 관리</span>
      </div>
      <table className="rounded-t-[20px] overflow-hidden min-w-full table-auto text-gray-800">
        <thead className="justify-between">
          <tr className="bg-peach-fuzz bg-opacity-50">
            <th className=" text-black px-4 py-3">회원번호</th>
            <th className="text-black px-4 py-3">이름</th>
            <th className="text-black px-4 py-3">이메일</th>
            <th className="text-black px-4 py-3">주소</th>
            <th className="text-black px-4 py-3">승인/거절</th>
          </tr>
        </thead>
        <Tr info={info} />
      </table>
    </div>
  );
};

export default MemberList;
