import React from "react";
import Layout from "../components/shared/Layout";
import { LuClipboardList } from "react-icons/lu";

const MemberList = (props) => {
    return (
        <Layout>
            <div className="flex items-center ">
                <LuClipboardList color="#ffbe98" size="56"/> 
                <span className="font-semibold text-2xl mx-3 ">회원 관리</span>
            </div>
            
        </Layout>
    );
};

export default MemberList;