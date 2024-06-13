// 페이징 코드

import React,{useState} from "react";
import {BsChevronLeft, BsChevronRight} from "react-icons/bs";


const Pagination = ({ postsPerPage, totalPosts , paginate}) => {
    const pageNumbers = [];

    const pagesPerGroup = 5;
    const [currentGroup, setCurrentGroup] = useState(0);


    for(let i=1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
        pageNumbers.push(i);
    }


    //pagesPerGroup은 그룹당 몇 페이지 번호를 표시
    //Number Of Groups는 그룹의 총 수를 계산
    //startOfGroup , endOfGroup은 페이지 번호 배열을 슬라이싱하기 위한 인덱스를 계산
    const numberOfGroups = Math.ceil(pageNumbers.length / pagesPerGroup);
    const startOfGroup = currentGroup * pagesPerGroup;
    const endOfGroup = Math.min(startOfGroup + pagesPerGroup, pageNumbers.length);

    const handleNextGroup = () => {
        if (currentGroup < numberOfGroups - 1) {
            setCurrentGroup(currentGroup + 1);
        }
    };

    const handlePrevGroup = () => {
        if (currentGroup > 0) {
            setCurrentGroup(currentGroup - 1);
        }
    };
    
    // framerMotion 사용
    // const paginationVariants = {
    //     hidden : {
    //         opacity: 0,
    //         y: 200,
    //     },
    //     visible : {
    //         opacity: 1,
    //         y: 0,
    //         transition: {
    //             type: "spring",
    //             stiffness: 260,
    //             damping: 20,
    //             duration: 1,
    //         }
    //     }
    // }
    return (
        // <motion.div variants={paginationVariants} initial="hidden" animate="visible">
            <nav>
            <ul className=" mt-8 mb-4 pagination flex items-center justify-center">
                <span className={`w-6 h-6 mr-4 flex items-center justify-center ${currentGroup === 0 ? 'opacity-50' : 'cursor-pointer bg-grayish-red rounded-lg'}`} 
                    onClick={handlePrevGroup} >
                    <BsChevronLeft color="#ffffff" />
                </span>
                {pageNumbers.slice(startOfGroup, endOfGroup).map(number => (
                    <li key={number} className="page-item  border-grayish-red active:border-b-2 hover:border-b-2 w-8 h-8 flex items-center justify-center ">
                        <a onClick={() => paginate(number)} className="page-link cursor-pointer">
                            {number}
                        </a>
                    </li>
                ))}
                <span className={`w-6 h-6 ml-4 flex items-center justify-center ${currentGroup === numberOfGroups - 1 ? 'opacity-50' : 'cursor-pointer bg-grayish-red rounded-lg'}`} 
                    onClick={handleNextGroup}>
                    <BsChevronRight color="#ffffff" />
                </span>
            </ul>
        </nav>
        // </motion.div>
        
    )
}

export default Pagination;