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
            </div>
            <Table headers={headers} data={info} />
        </div>
    );
};

export default MemberList;
