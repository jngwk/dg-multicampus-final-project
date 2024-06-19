//센터별 TrainerList 페이지

import React, { useEffect, useState } from "react";
import { LuClipboardList } from "react-icons/lu";
import { LiaUserPlusSolid } from "react-icons/lia";
import axios from "axios";
import Table from "../components/shared/Table";
import Pagination from "../components/shared/Pagination";
import Loader from "../components/shared/Loader";

const CenterTrainerList = ({}) => {
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

    
    const headers = ["회원번호", "이름", "이메일", "경력"]; // Headers array

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
                case "경력":
                    return item.body; 
                default:
                    return ''; 
            }
        });
    };

    return (
        <div className="container max-w-screen-lg mx-auto">
            <div className="flex">
                <div className=" flex items-center ">
                    <LuClipboardList color="#ffbe98" size="56" />
                    {/* []부분에 해당 지점이름 데이터 가져오기 */}
                    <span className="font-semibold text-2xl mx-3"> [바디채널 OO점] 트레이너</span> 
                </div>

                <div className="w-1/4 ml-auto ">  
                    <div class="relative">
                        <div class="absolute top-8 end-6 flex items-center ps-3">
                            <button className=" flex items-center justify-center w-20 h-13 p-1 border-2 border-grayish-red rounded-lg text-sm">
                                <LiaUserPlusSolid className="w-5 h-5 mr-1" color="#9F8D8D" /> 등록
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Table headers={headers} data={currentPosts} loading={loading} extractColumns={extractColumns} />
            <Pagination postsPerPage={postsPerPage} totalPosts={posts.length} paginate={paginate}/>
        </div>
    );
};

export default CenterTrainerList;
