//PT회원관리 페이지

import React, { useEffect, useState } from "react";
import { LuClipboardList } from "react-icons/lu";
import { CiSearch } from "react-icons/ci";
import axios from "axios";
import Table from "../components/shared/Table";
import Pagination from "../components/shared/Pagination";
import Loader from "../components/shared/Loader";

const PTMemberList = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(10);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const res = await axios.get('https://jsonplaceholder.typicode.com/comments');
                setPosts(res.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return <Loader />;
    }

    const headers = ["회원번호", "이름", "이메일", "주소", "남은 횟수"]; // Headers array

    // Function to extract necessary columns based on headers array
    const extractColumns = (item) => {
        return headers.map(header => {
            switch (header) {
                case "회원번호":
                    return item.id;
                case "이름":
                    return item.name;
                case "이메일":
                    return item.email;
                case "주소":
                    return item.body; 
                case "남은 횟수":
                    return item.postId; 
                default:
                    return ''; 
            }
        });
    };

    //get current posts
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    //Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <div className="container max-w-screen-lg mx-auto">
            <div className="flex ">
                <div className="flex items-center">
                    <LuClipboardList color="#ffbe98" size="56" />
                    <span className="font-semibold text-2xl mx-3"> PT 회원 관리</span>
                </div>

                <form className="w-1/4 ml-auto">
                    <label htmlFor="default-search" className="mb-4 text-sm font-medium text-grayish-red sr-only">Search</label>
                    <div className="relative top-7 end-6 ">
                        <input type="text" id="default-search" className="block w-full p-2 ps-2 text-xs text-gray-900 border-gray-300 border-b-2 focus:outline-none" placeholder="이름, 이메일, 주소를 검색해주세요." required />

                        <div className="absolute inset-y-0 end-2  flex items-center ps-3">
                            <button>
                                <CiSearch className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <Table headers={headers} data={currentPosts} extractColumns={extractColumns} />
            <Pagination postsPerPage={postsPerPage} totalPosts={posts.length} paginate={paginate} />
        </div>
    );
};

export default PTMemberList;
