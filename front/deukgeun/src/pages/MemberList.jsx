import React, { useEffect, useState } from "react";
import { LuClipboardList } from "react-icons/lu";
import axios from "axios";
import Table from "../components/shared/Table";

const MemberList = () => {
    const [info, setInfo] = useState([]);

    // 임시 더미데이터
    useEffect(() => {
        axios.get('https://jsonplaceholder.typicode.com/users')
            .then(res => setInfo(res.data))
            .catch(err => console.log(err));
    }, []);

    
    const headers = ["회원번호", "이름", "이메일", "전화번호", "웹사이트"]; 

    return (
        <div className="container max-w-screen-lg mx-auto">
            <div className="flex items-center pb-4">
                <LuClipboardList color="#ffbe98" size="56" />
                <span className="font-semibold text-2xl mx-3">회원 관리</span>

                <form className="w-1/4 ml-auto">  
                <label for="default-search" class="mb-4 text-sm font-medium text-grayish-red sr-only">Search</label>
                    <div class="relative">
                        <input type="text" id="default-search" class="block w-full p-2 ps-2 text-xs text-gray-900  border-gray-300 border-b-2 focus:outline-none " placeholder="이름, 이메일, 주소를 검색해주세요." required />
                        {/* <button type="submit" class=" w-14 h-5 text-white absolute end-2.5 bottom-2 bg-peach-fuzz  hover:ring-1 focus:outline-none hover:ring-grayish-red font-medium rounded-lg text-sm px-2 py-0">Search</button> */}

                        <div class="absolute inset-y-0 end-2 flex items-center ps-3">
                            <button>
                            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                            </svg>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <Table headers={headers} data={info} />
        </div>
    );
};

export default MemberList;
