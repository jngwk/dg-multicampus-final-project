import React, { useState, useEffect } from "react";
import { FcManager } from "react-icons/fc";
import { BsPinAngle } from "react-icons/bs";
import { getReviews, deleteReview, updateReview } from "../../api/reviewApi";
import { useAuth } from "../../context/AuthContext";
import ReviewEditModal from "../modals/ReviewEditModal";

const ReviewContent = ({ gymId, renderReviewCount = false }) => {
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
  }, [gymId]);

  const handleEdit = (review) => {
    setCurrentReview(review);
    setIsModalOpen(true);
  };

  const handleDelete = (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
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
    const colors = ["orange-300","yellow-200","green-200","blue-200","indigo-200","purple-200","pink-200"];
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

export default ReviewContent;
