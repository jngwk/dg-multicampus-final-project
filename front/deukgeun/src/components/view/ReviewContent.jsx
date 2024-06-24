import React, { useState, useEffect } from "react";
import { FcManager } from "react-icons/fc";
import { getReviews, deleteReview, updateReview } from "../../api/reviewApi";
import { useAuth } from "../../context/AuthContext";
import ReviewEditModal from "../modals/ReviewEditModal";

const ReviewContent = ({ gymId }) => {
    const [reviews, setReviews] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentReview, setCurrentReview] = useState(null);
    const { userData } = useAuth();

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                // Assume getReviews function retrieves reviews with userName, comment, images (array of filenames)
                const data = await getReviews(gymId); // Adjust how you fetch reviews based on your API structure
                setReviews(data);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };

        const gymId = 1; // Example gymId; adjust as needed
        fetchReviews();
    //     if (gymId) {
    //         fetchReviews();
    //     }
    // }, [gymId]);
    }, []);

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

    return (
        <>
            {reviews.map((item, index) => (
                <div key={index} className="flex justify-center items-center h-full border-b-2 border-gray-300">
                    <div className={`px-10 my-4 w-[550px] h-5/6 text-start ${index % 2 === 0 && index !== reviews.length - 1 ? 'border-r-2 border-gray-300' : ''}`}>
                        <div className="flex items-center mb-3">
                            <div className="border-white shadow-lg border-2 rounded-full overflow-hidden"><FcManager className="w-8 h-8 "/></div>
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
                        {/* Display review images */}
                        {item.images && item.images.length > 0 && (
                            <div className="flex space-x-2">
                                {item.images.map((image, idx) => (
                                    <img
                                        key={idx}
                                        src={`/images/${image}`} // Assuming images are filenames in the public/images directory
                                        alt={`Review Image ${idx}`}
                                        className="w-24 h-24 object-cover rounded-lg border-gray-200 border-2"
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ))}
            {isModalOpen && currentReview && (
                <ReviewEditModal
                    toggleModal={handleModalClose}
                    gymId={gymId} // Pass gymId to the modal
                    review={currentReview}
                    onUpdateReview={handleUpdateReview}
                />
            )}
        </>
    );
};

export default ReviewContent;
