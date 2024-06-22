<<<<<<< HEAD
//관리자페이지-전체회원관리 테이블 화면 구현

=======
>>>>>>> 60c7921400a822dc5e01e98e4e5368d3a2a03d12
import React, { useEffect, useState } from "react";
import { LuClipboardList } from "react-icons/lu";
import { CiSearch } from "react-icons/ci";
import axios from "axios";
import Table from "../components/shared/Table";
import Pagination from "../components/shared/Pagination";
import Loader from "../components/shared/Loader";

<<<<<<< HEAD
const MemberList = ({}) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false); 
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(10);

  // 임시 더미데이터
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const res = await axios.get(
        "https://jsonplaceholder.typicode.com/comments"
      );
      setPosts(res.data);
      setLoading(false);
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <Loader />;
  }

  //get current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  //Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

    
    const headers = ["회원번호", "이름", "이메일", "주소"]; // Headers array

    // header에 따로 데이터 불러오기
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
                default:
                    return ''; 
            }
        });
    };

    return (
        <div className="container max-w-screen-lg mx-auto">
            <div className="flex">
              <div className="flex items-center">
                <LuClipboardList color="#ffbe98" size="56" />
                <span className="font-semibold text-2xl mx-3">회원 관리</span>
              </div>

                <form className="w-1/4 ml-auto">  
                <label for="default-search" class="mb-4 text-sm font-medium text-grayish-red sr-only">Search</label>
                    <div class="relative top-7 end-6 ">
                        <input type="text" id="default-search" class="block w-full p-2 ps-2 text-xs text-gray-900  border-gray-300 border-b-2 focus:outline-none " placeholder="이름, 이메일, 주소를 검색해주세요." required />

                        <div class="absolute inset-y-0 end-2 flex items-center ps-3">
                            <button>
                                <CiSearch className="w-4 h-4"/>
=======
import { usersInfo } from "../api/adminApi";

const MemberList = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false); // 로딩페이지 바꿔야함
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(10);
    // 임시 더미데이터
    useEffect(() => {

        const fetchPosts = async () => {
            setLoading(true);
            const res = await axios.get('https://jsonplaceholder.typicode.com/comments');
            setPosts(res.data);
            setLoading(false);
        }

        fetchPosts();
    }, []);


    if(loading) {
        return <Loader/>;
    }

    // get current posts
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = (posts && posts.length > 0) ? posts.slice(indexOfFirstPost, indexOfLastPost) : [];

    // Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);

    const headers = ["회원번호", "이름", "이메일", "주소", "승인/거절"];

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
>>>>>>> 60c7921400a822dc5e01e98e4e5368d3a2a03d12
                            </button>
                        </div>
                    </div>
                </form>
            </div>
<<<<<<< HEAD
            <Table headers={headers} data={currentPosts} loading={loading} extractColumns={extractColumns} />
            <Pagination postsPerPage={postsPerPage} totalPosts={posts.length} paginate={paginate}/>
=======
            <Table headers={headers} data={currentPosts} loading={loading} />
            <Pagination postsPerPage={postsPerPage} totalPosts={posts ? posts.length : 0} paginate={paginate} />
>>>>>>> 60c7921400a822dc5e01e98e4e5368d3a2a03d12
        </div>
    );
};

<<<<<<< HEAD
export default MemberList;
=======
export default MemberList;
>>>>>>> 60c7921400a822dc5e01e98e4e5368d3a2a03d12
