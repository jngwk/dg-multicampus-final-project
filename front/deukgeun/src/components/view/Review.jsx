import React, { useState, useEffect } from "react";
import { FcManager } from "react-icons/fc";
import { BsPinAngle } from "react-icons/bs";
import { MdOutlineRateReview } from "react-icons/md";
import classNames from "classnames";
import {
  getReviews,
  deleteReview,
  addReview,
  deleteReviewImages,
} from "../../api/reviewApi";
import { useAuth } from "../../context/AuthContext";
import ReviewEditModal from "../modals/ReviewEditModal";
import ReviewModal from "../modals/ReviewModal";
import AlertModal from "../modals/AlertModal";
import { useModal } from "../../hooks/useModal";
import { findMembership } from "../../api/membershipApi";

const ReviewContent = ({
  gymId,
  renderReviewCount = false,
  onReviewAdded,
  onReviewDeleted,
  onReviewUpdated,
  userData,
}) => {
  const [reviews, setReviews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentReview, setCurrentReview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [colorMapping, setColorMapping] = useState({});
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [isMember, setIsMember] = useState(false);

  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoadingReviews(true);
        const data = await getReviews(gymId);
        setReviews(data);
        const initialMapping = data.reduce((acc, review) => {
          acc[review.id] = getColorClassById(review.id);
          return acc;
        }, {});
        setColorMapping(initialMapping);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoadingReviews(false);
      }
    };

    const getMembership = async () => {
      try {
        const membership = await findMembership();
        if (membership.gymId === gymId) setIsMember(true);
      } catch (error) {
        console.error("get membership error in review", error);
      }
    };

    fetchReviews();
    if (
      sessionStorage.getItem("isLoggedIn") &&
      userData?.role === "ROLE_GENERAL"
    ) {
      getMembership();
    }
  }, [gymId, onReviewAdded, onReviewDeleted]);

  const handleEdit = (review) => {
    setCurrentReview(review);
    setIsModalOpen(true);
  };

  const handleDelete = async (reviewId, images) => {
    if (window.confirm("정말 리뷰를 삭제하시겠습니까?")) {
      try {
        await deleteReview(reviewId);
        if (images && images.length > 0) {
          await deleteReviewImages(reviewId);
        }

        setReviews((prevReviews) =>
          prevReviews.filter((r) => r.id !== reviewId)
        );
        setColorMapping((prevMapping) => {
          const newMapping = { ...prevMapping };
          delete newMapping[reviewId];
          return newMapping;
        });
        onReviewDeleted();
        onReviewUpdated();
      } catch (error) {
        console.error("Error deleting review:", error);
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentReview(null);
  };

  const handleUpdateReview = (updatedReview) => {
    setReviews((prevReviews) =>
      prevReviews.map((r) => (r.id === updatedReview.id ? updatedReview : r))
    );
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleImageModalClose = () => {
    setSelectedImage(null);
  };

  if (renderReviewCount) {
    return <div>등록 리뷰 수: {reviews.length}</div>;
  }

  const renderStars = (rating) => {
    return <span className="text-yellow-400">{"★".repeat(6 - rating)}</span>;
  };

  const getColorClassById = (id) => {
    const colors = ["bg-indigo-200"];
    const strId = String(id);
    const hash = strId
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const handleWheel = (e) => {
    const container = e.currentTarget;
    const delta = e.deltaY || e.detail || e.wheelDelta;

    const scrollSpeed = 0.5;
    container.scrollLeft += delta * scrollSpeed;

    e.preventDefault();
  };

  return (
    <div className="flex flex-wrap justify-center">
      {reviews && reviews.length > 0 ? (
        reviews.map((item) => {
          const colorClass =
            colorMapping[item.id] || getColorClassById(item.id);
          return (
            <div
              key={item.id}
              className={classNames(
                "sticky-note",
                colorClass,
                "w-80 h-80 p-6 m-4 shadow-lg transform rotate-2 transition duration-300 ease-in-out hover:rotate-0 hover:scale-105 relative"
              )}
            >
              <BsPinAngle className="absolute -top-3 -left-3 text-gray-700 text-2xl" />
              <div className="flex items-center mb-3">
                <div>
                  {userData &&
                  userData.userId === item.userId &&
                  userData.userImage?.userImage ? (
                    <img
                      src={`/images/${userData.userImage.userImage}`}
                      alt="Profile"
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <box-icon
                      name="user-circle"
                      type="solid"
                      size="md"
                      color="#9f8d8d"
                    ></box-icon>
                  )}
                </div>
                <div className="font-bold ml-3 mr-7 text-sm">
                  {item.userName}
                </div>
                <div className="mb-2">{renderStars(item.rating)}</div>
              </div>

              <p className="text-sm mb-3 h-24 overflow-y-auto scrollbar-hide">
                {item.comment}
              </p>
              {item.images && item.images.length > 0 && (
                <div
                  className="flex space-x-2 mt-2 w-full overflow-x-auto scrollbar-hide"
                  onWheel={handleWheel}
                >
                  {item.images.map((image, idx) => (
                    <img
                      key={idx}
                      src={`/images/${image}`}
                      alt={`Review Image ${idx}`}
                      className="w-auto h-24 object-cover rounded-lg  cursor-pointer"
                      onClick={() => handleImageClick(image)}
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
                    onClick={() => handleDelete(item.id, item.images)}
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
          );
        })
      ) : (
        <div className="flex flex-col gap-10 justify-center items-center h-[618px] w-[1000px]">
          <span className="text-4xl">😔</span>
          <span className="text-xl">등록된 리뷰가 없습니다</span>
        </div>
      )}
      {isModalOpen && currentReview && (
        <ReviewEditModal
          toggleModal={handleModalClose}
          gymId={gymId}
          review={currentReview}
          onUpdateReview={handleUpdateReview}
          onReviewUpdated={onReviewUpdated}
        />
      )}
      {selectedImage && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={handleImageModalClose}
        >
          <div className="relative">
            <img
              src={`/images/${selectedImage}`}
              alt="Enlarged Review"
              className="max-w-full max-h-full"
              onClick={(e) => e.stopPropagation()} // Prevents modal close on image click
            />
            <button
              onClick={handleImageModalClose}
              className="absolute top-0 right-0 m-2 text-white text-xl"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Review = ({ gymId, isMember }) => {
  const { isModalVisible, toggleModal } = useModal();
  const [isAlertModalVisible, setIsAlertModalVisible] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const { userData } = useAuth();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getReviews(gymId);
        setReviews(data);
        console.log("@@@ reviews", data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();
  }, [gymId, refreshKey]);

  const handleReviewSubmit = async (reviewData) => {
    try {
      const newReview = await addReview(gymId, reviewData);
      setReviews([...reviews, newReview]);
      setIsAlertModalVisible(true);
    } catch (error) {
      console.error("Error creating review:", error);
    }
  };

  const handleConfirmClick = () => {
    setIsAlertModalVisible(false);
  };

  const handleReviewAdded = (newReview) => {
    setIsAlertModalVisible(true);
    setReviews([...reviews, newReview]);
  };

  const handleReviewDeleted = (reviewId) => {
    setReviews((prevReviews) => prevReviews.filter((r) => r.id !== reviewId));
  };

  const handleReviewUpdated = () => {
    setRefreshKey((oldKey) => oldKey + 1);
  };

  return (
    <div>
      <div className="relative h-full">
        <div className="flex flex-col items-center text-center mb-5 w-full">
          <div className="mb-2 font-semibold text-2xl">
            리뷰
            <div className="mt-2 w-16 border-b-2 border-grayish-red border-opacity-20"></div>
          </div>
          <div className="">등록 리뷰 수: {reviews?.length}</div>
        </div>
        {isMember &&
          reviews?.filter((r) => r.userId === userData?.userId).length ===
            0 && (
            <button
              className="absolute top-12 -right-2 flex items-center mr-5"
              onClick={toggleModal}
            >
              <MdOutlineRateReview
                className="mx-1 mb-1"
                size="25"
                color="#9F8D8D"
              />
            </button>
          )}
        {isModalVisible && (
          <ReviewModal
            toggleModal={toggleModal}
            gymId={gymId}
            onReviewAdded={handleReviewAdded}
          />
        )}
      </div>
      <div className="w-full min-h-[700px] p-5 mb-10 flex justify-center border-y border-grayish-red">
        <div className="w-full flex justify-center flex-wrap overflow-y-auto scrollbar-hide">
          <ReviewContent
            gymId={gymId}
            onReviewAdded={handleReviewAdded}
            onReviewDeleted={handleReviewDeleted}
            onReviewUpdated={handleReviewUpdated}
            userData={userData}
          />
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
