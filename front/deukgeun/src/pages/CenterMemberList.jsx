//센터별 회원List 페이지

import React, { useEffect, useState, useRef} from "react";
import { LuClipboardList } from "react-icons/lu";
import { HiOutlineSpeakerphone } from "react-icons/hi";
import axios from "axios";
import Table from "../components/shared/Table";
import Pagination from "../components/shared/Pagination";
import Loader from "../components/shared/Loader";

const CenterMemberList = ({}) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false); 
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(10);

    //공지사항
    const [idx, setIdx] = useState(0);
    const idxRef = useRef(0); //current값 증가

    const eventDetails = [
        { no: 1, title: "첫 번째 이벤트 내용 - Line 1" },
        { no: 2, title: "두 번째 이벤트 내용 - Line 2" },
        { no: 3, title: "세 번째 이벤트 내용 - Line 3" },
        { no: 4, title: "네 번째 이벤트 내용 - Line 4" },
      ];

    useEffect(() => {
        const interval = setInterval(() => {
            idxRef.current = (idxRef.current + 1) % eventDetails.length;
            setIdx(idxRef.current);
            console.log(idxRef.current);
        }, 5000);
    
        return () => clearInterval(interval);
    }, [eventDetails.length]);


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
                    <div className="relative items-center w-4/6 ml-4">
                            <ul className=" notice overflow-hidden px-2 h-[40px] cursor-pointer rounded-lg border-2 border-peach-fuzz">
                                <div className="transform transition-transform duration-1000 ease-in-out"
                                   style={{ transform: `translateY(-${40 * idx}px)`}}>
                                    {eventDetails.map((item, i) => {
                                        return (
                                            <li className="notice_content py-[4px] h-[40px] leading-3" key={i}>
                                                <div className="notice_title whitespace-nowrap text-sm py-1 px-4 font-semibold border-l-peach-fuzz border-l-4">{item['title']}</div>
                                            </li>
                                        )
                                    })}
                                </div>
                            </ul>
                    </div>
                </div>

            <Table headers={headers} data={currentPosts} loading={loading} extractColumns={extractColumns} />
            <Pagination postsPerPage={postsPerPage} totalPosts={posts.length} paginate={paginate}/>
        </div>
    );
};

export default CenterMemberList;
