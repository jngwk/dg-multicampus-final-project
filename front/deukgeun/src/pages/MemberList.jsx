import React, { useEffect, useState } from "react";
import { LuClipboardList } from "react-icons/lu";
import { CiSearch } from "react-icons/ci";
import Table from "../components/shared/Table";
import Pagination from "../components/shared/Pagination";
import Loader from "../components/shared/Loader";

import { usersList } from "../api/adminApi";

const MemberList = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(10);
    const [totalPosts, setTotalPosts] = useState(0);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                // 서버에서 페이지 번호와 페이지당 항목 수를 매개변수로 받아 페이징 처리된 데이터를 반환
                const data = await usersList(currentPage, postsPerPage);
                const userList = data.dtoList.map(post => ({
                    userId: post.userId,
                    userName: post.userName,
                    email: post.email,
                    address: post.address,
                    role: post.role
                }));
                setPosts(userList);
                setTotalPosts(data.totalCount); // 서버에서 전체 게시물 수를 반환
                console.log(`Fetched data for page: ${currentPage}, size: ${postsPerPage}`, userList);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            setLoading(false);
        };

        fetchPosts();
    }, [currentPage, postsPerPage]); // currentPage와 postsPerPage 변경 시 데이터 다시 가져오기

    const paginate = pageNumber => setCurrentPage(pageNumber);

    const headers = ["회원번호", "이름", "이메일", "주소", "권한"];

    return (
        <div className="container max-w-screen-lg mx-auto">
            <div className="flex items-center pb-4">
                <LuClipboardList color="#ffbe98" size="56" />
                <span className="font-semibold text-2xl mx-3">회원 관리</span>

                <form className="w-1/4 ml-auto">
                    <label htmlFor="default-search" className="mb-4 text-sm font-medium text-grayish-red sr-only">Search</label>
                    <div className="relative">
                        <input type="text" id="default-search" className="block w-full p-2 ps-2 text-xs text-gray-900 border-gray-300 border-b-2 focus:outline-none" placeholder="이름, 이메일, 주소를 검색해주세요." required />
                        <div className="absolute inset-y-0 end-2 flex items-center ps-3">
                            <button>
                                <CiSearch className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            {loading ? <Loader /> : (
                <>
                    <Table headers={headers} data={posts} />
                    <Pagination postsPerPage={postsPerPage} totalPosts={totalPosts} paginate={paginate} />
                </>
            )}
        </div>
    );
};

export default MemberList;
