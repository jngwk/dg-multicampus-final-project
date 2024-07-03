import React, { useState, useEffect } from "react";
import { FcManager } from "react-icons/fc";
import { BsPinAngle } from "react-icons/bs";
import { MdOutlineRateReview } from "react-icons/md";
import { getReviews, deleteReview, updateReview, addReview } from "../../api/reviewApi"; // createReview 추가
import { useAuth } from "../../context/AuthContext";
import ReviewEditModal from "../modals/ReviewEditModal";
import ReviewModal from "../modals/ReviewModal";
import AlertModal from "../modals/AlertModal";
import { useModal } from "../../hooks/useModal";

const ReviewContent = ({ gymId, renderReviewCount = false, onReviewAdded }) => {
  const [reviews, setReviews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentReview, setCurrentReview] = useState(null);
  const { userData } = useAuth();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getReviews(gymId);
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();
  }, [gymId, onReviewAdded]);

  const handleEdit = (review) => {
    setCurrentReview(review);
    setIsModalOpen(true);
  };

  const handleDelete = (reviewId) => {
    if (window.confirm("정말 리뷰를 삭제하시겠습니까?")) {
      deleteReview(reviewId)
        .then(() => {
          setReviews(reviews.filter((r) => r.id !== reviewId));
        })
        .catch((error) => {
          console.error("Error deleting review:", error);
        });
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentReview(null);
  };

  const handleUpdateReview = (updatedReview) => {
    setReviews(reviews.map((r) => (r.id === updatedReview.id ? updatedReview : r)));
  };

  if (renderReviewCount) {
    return <div>등록 리뷰 수: {reviews.length}</div>;
  }

  const getRandomColor = () => {
    const colors = ["orange-300", "yellow-200", "green-200", "blue-200", "indigo-200", "purple-200", "pink-200"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="flex flex-wrap justify-center">
      {reviews.map((item, index) => {
        const color = getRandomColor();
        return (
          <div
            key={index}
            className={`sticky-note bg-${color} w-64 h-64 p-6 m-4 shadow-lg transform rotate-2 transition duration-300 ease-in-out hover:rotate-0 hover:scale-105 relative`}
          >
            <BsPinAngle className="absolute -top-3 -left-3 text-gray-700 text-2xl" />
            <div className="flex items-center mb-3">
              <div className="border-white shadow-lg border-2 rounded-full overflow-hidden">
                <FcManager className="w-8 h-8" />
              </div>
              <div className="font-bold ml-3 text-sm">{item.userName}</div>
            </div>
            <p className="text-sm mb-2 h-24 overflow-y-auto">{item.comment}</p>
            {item.images && item.images.length > 0 && (
              <div className="flex space-x-2 mt-2">
                {item.images.map((image, idx) => (
                  <img
                    key={idx}
                    src={`/images/${image}`}
                    alt={`Review Image ${idx}`}
                    className="w-12 h-12 object-cover rounded-lg border-gray-200 border-2"
                  />
                ))}
              </div>
            )}
            {userData && userData.userId === item.userId && (
              <div className="flex space-x-2 mt-2 absolute bottom-2 right-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                >
                  수정
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                >
                  삭제
                </button>
              </div>
            )}
          </div>
        );
      })}
      {isModalOpen && currentReview && (
        <ReviewEditModal
          toggleModal={handleModalClose}
          gymId={gymId}
          review={currentReview}
          onUpdateReview={handleUpdateReview}
        />
      )}
    </div>
  );
};

const Review = ({ gymId }) => {
  const { isModalVisible, toggleModal } = useModal();
  const [isAlertModalVisible, setIsAlertModalVisible] = useState(false);

  const handleReviewSubmit = async (reviewData) => {
    try {
      const newReview = await addReview(gymId, reviewData);
      setIsAlertModalVisible(true);
    } catch (error) {
      console.error("Error creating review:", error);
    }
  };

  const handleConfirmClick = () => {
    setIsAlertModalVisible(false);
  };

  const handleReviewAdded = (newReview) => {
    // Optional: Add newReview to state if needed
    // This function is called when a new review is successfully added
  };

  return (
    <div>
      <div className="relative h-full">
        <div className="flex flex-col items-center text-center mb-5">
          <div className="mb-2 font-semibold text-xl">
            리뷰
            <div className="mt-2 w-16 border-b-2 border-grayish-red border-opacity-20"></div>
          </div>
          <ReviewContent gymId={gymId} renderReviewCount={true} />
        </div>
        <button
          className="absolute top-12 right-0 flex items-center mr-5"
          onClick={toggleModal}
        >
          <div className="hover:font-bold">리뷰작성</div>
          <MdOutlineRateReview className="mx-1 mb-1" size="25" color="#9F8D8D" />
        </button>
        {isModalVisible && (
          <ReviewModal
            toggleModal={toggleModal}
            gymId={gymId}
            onReviewAdded={handleReviewAdded}
          />
        )}
      </div>
      <div className="w-full p-5 mb-10 flex justify-center bg-grayish-red bg-opacity-20 border-y border-grayish-red">
        <div className="w-full flex justify-center flex-wrap overflow-y-auto scrollbar-hide">
          <ReviewContent gymId={gymId} onReviewAdded={handleReviewAdded} />
        </div>
      </div>
      {isAlertModalVisible && (
        <AlertModal
          headerEmoji={"✔️"}
          line1={"리뷰가 성공적으로 등록되었습니다!"}
          button2={{
            label: "확인",
            onClick: handleConfirmClick,
          }}
        />
      )}
    </div>
  );
};

export default Review;
