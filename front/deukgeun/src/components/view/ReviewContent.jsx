// 작성한 리뷰 내용 불러오는 컴포넌트
import React, { useState, useEffect } from "react";
import { FcManager } from "react-icons/fc";
import { getReviews, deleteReview, updateReview } from "../../api/reviewApi";
import {useAuth} from "../../context/AuthContext";
import ReviewEditModal from "../modals/ReviewEditModal";
// const ReviewContent = ({ gymId }) => {
const ReviewContent = () => {
    const [reviews, setReviews] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentReview, setCurrentReview] = useState(null);
    const {userData} = useAuth();
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const data = await getReviews(gymId); // gymId는 상황에 맞게 설정해야 합니다.
                setReviews(data); // Assuming data is an array of reviews with userName, comment, createdAt
            } catch (error) {
                console.error(`Error fetching reviews:`, error);
            }
        };

        const gymId = 1; // 예시로 gymId를 하드코딩하거나, 필요에 따라 동적으로 설정합니다.
        fetchReviews();

    //     if (gymId) {
    //         fetchReviews();
    //     }
    // }, [gymId]); 헬스장 페이지 완성되면 gymId 받아올 예정
    }, []);

    // const commentList = [
    //     { profileimg: ' ', 
    //         userName: '나팔팔', 
    //         comment : '헬스장이 깔끔하고 너무 좋아요! PT 트레이너님들도 친절하시고 자세히 알려주셔요! 헬스장이 깔끔하고 너무 좋아요! PT 트레이너님들도 친절하시고 자세히 알려주셔요! 헬스장이 깔끔하고 너무 좋아요! PT 트레이너님들도 친절하시고 자세히 알려주셔요! 헬스장이 깔끔하고 너무 좋아요! PT 트레이너님들도 친절하시고 자세히 알려주셔요! 헬스장이 깔끔하고 너무 좋아요! PT 트레이너님들도 친절하시고 자세히 알려주셔요! 헬스장이 깔끔하고 너무 좋아요! PT 트레이너님들도 친절하시고 자세히 알려주셔요! 헬스장이 깔끔하고 너무 좋아요! PT 트레이너님들도 친절하시고 자세히 알려주셔요! 헬스장이 깔끔하고 너무 좋아요! PT 트레이너님들도 친절하시고 자세히 알려주셔요! 헬스장이 깔끔하고 너무 좋아요! PT 트레이너님들도 친절하시고 자세히 알려주셔요! ',
    //         reviewimg: ' ' },
    //     { profileimg: ' ', userName: '김오오', comment : '가 본 곳  중 기구가 가장 다양하면서 사람이 많은데에 비해 시설자체가 굉장히 깨끗하더라구요! 특히 샤워장이나 운동복도 특유에 쉰내 없이 청결한 상태를 유지하고 있어 안심하고 운동하기 편할 것 같아요' },
    //     { profileimg: ' ', userName: '육칠칠', comment : '최고의 시설, 합리적인 가격, 친절한 선생님 👍🏻 PT중독자라 근처 PT다 받아봤는데 여기 계신 OO쌤처럼 친절하고 세심한 분은 첨 뵙는것 같아요! 피티가 고민이신분들이라면 망설이지말고 OO쌤에게 받으세요!  OO쌤 덕분에 전 스트레스 없는 식단과 운동으로 건강하게 다이어트 성공했습니다🤗' },
    //     { profileimg: ' ', userName: '남궁사사', comment : '헬스장이 깔끔하고 너무 좋아요! PT 트레이너님들도 친절하시고 자세히 알려주셔요! 이번 여름 기대해봐도 될것같네요!! ' },
    //     { profileimg: ' ', userName: '이미미', comment : '기구 사용법을 잘 모를경우 상주하고 계시는 헬스트레이너에게 문의하시면 친절하게 알려주시니 편하게 물어보시고 탄탄한 바디라인 만들어 보세요! ' },
    // ];

    // const commentList = {
    //     profileimg: "",
    //     userName: "",
    //     comment: "",
    //     reviewimg: "",
    // };
    const handleEdit = (review) => {
        setCurrentReview(review);
        setIsModalOpen(true);
    };

    const handleDelete = (reviewId) => {
        if (window.confirm("Are you sure you want to delete this review?")) {
            deleteReview(reviewId).then(() => {
                setReviews(reviews.filter(r => r.id !== reviewId));
            }).catch(error => {
                console.error("Error deleting review:", error);
            });
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setCurrentReview(null);
    };

    const handleUpdateReview = (updatedReview) => {
        setReviews(reviews.map(r => r.id === updatedReview.id ? updatedReview : r));
    };

    return (
        <>
            {reviews.map((item, index) => (
                <div key={index} className="flex justify-center items-center h-full border-b-2 border-gray-300">
                    <div className={`px-10 my-4 w-[550px] h-5/6 text-start ${index % 2 === 0 && index !== reviews.length - 1 ? 'border-r-2 border-gray-300' : ''}`}>
                        <div className="flex items-center mb-3">
                            <div className=" border-white shadow-lg border-2 rounded-full overflow-hidden"><FcManager className="w-8 h-8 "/></div>
                            <div className="font-bold ml-3">{item.userName}</div>
                        </div>
                        <div className="h-24 text-sm my-5 overflow-y-auto scrollbar text-justify">
                            {item.comment}
                            {userData && userData.userId === item.userId && (
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleEdit(item)}
                                    className="bg-blue-500 text-white px-2 py-1 rounded"
                                >
                                    수정
                                </button>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                >
                                    삭제
                                </button>
                            </div>
                        )} 
                        </div>
                        {/* <div className="cursor-pointer h-2/4 w-full rounded-lg border-grayish-red border-2">{item.reviewimg}</div> */}
                    </div>
                </div>
            ))}
             {isModalOpen && currentReview && (
                <ReviewEditModal
                    toggleModal={handleModalClose}
                    gymId={1}
                    review={currentReview}
                    onUpdateReview={handleUpdateReview}
                />
            )}
        </>
    );
};

export default ReviewContent;