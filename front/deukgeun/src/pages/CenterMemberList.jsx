//센터별 회원List 페이지

import React, { useEffect, useState } from "react";
import { LuClipboardList } from "react-icons/lu";
import { HiOutlineSpeakerphone } from "react-icons/hi";
import { BsCaretDownFill, BsCaretUp  } from "react-icons/bs";
import axios from "axios";
import Table from "../components/shared/Table";
import Pagination from "../components/shared/Pagination";
import Loader from "../components/shared/Loader";

const CenterMemberList = ({}) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false); 
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(10);

    //dropdown메뉴
    const [isDrop, setIsDrop] = useState(false);

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

    
    const headers = ["회원번호", "이름", "이메일", "주소", "등록상태(만료일)"]; // Headers array

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
                case "등록상태(만료일)":
                    return item.postId; 
                default:
                    return ''; 
            }
        });
    };

    return (
        <div className="container max-w-screen-lg mx-auto">
                <div className=" flex items-center ">
                    <LuClipboardList color="#ffbe98" size="56" />
                    {/* []부분에 해당 지점이름 데이터 가져오기 */}
                    <span className="font-semibold text-2xl mx-3"> [바디채널 OO점] 회원 정보 </span> 
                </div>

                <div className="flex justify-center items-center mt-4">  
                    <HiOutlineSpeakerphone className="w-7 h-7" color="FE8742" />
                    <div className="relative flex flex-col items-center w-4/6  rounded-lg ml-4">
                        <div className="cursor-pointer border-2 border-peach-fuzz font-semibold py-1 px-4 rounded-lg  w-full flex items-center  hover:border-l-peach-fuzz  justify-between tracking-wider active:border-grayish-red duration-200 active:font-semibold">
                            첫 이벤트 내용
                            <button onClick={() => setIsDrop((prev) => !prev)} className="">
                            {!isDrop ? (
                                <BsCaretDownFill className="h-8"/>
                            ): (
                                <BsCaretUp className="h-8"/>
                            )}
                            </button>
                        </div>

                        {isDrop && 
                            <div className="absolute bg-white border-peach-fuzz border-2 roundedlg top-12 flex flex-col items-start rounded-lg w-full">
                                {/* map 함수써서 데이터 가져오기 */}
                                {headers.map((item, i ) => (
                                    <div className="py-1 px-4 font-semibold flex w-full cursor-pointer rounded-r-lg border-l-transparent hover:border-l-peach-fuzz border-l-4 overflow-x-auto whitespace-nowrap scrollbar-hide " key={i}>
                                        <h3>ㅇㄹㄷㄹㄷㄹㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷ</h3>
                                        <h3>ㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷ</h3>
                                    </div>
                                ))}
                            </div>
                        }
                        
                    </div>
                </div>

            <Table headers={headers} data={currentPosts} loading={loading} extractColumns={extractColumns} />
            <Pagination postsPerPage={postsPerPage} totalPosts={posts.length} paginate={paginate}/>
        </div>
    );
};

export default CenterMemberList;
