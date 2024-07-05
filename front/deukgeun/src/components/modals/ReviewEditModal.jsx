import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import ModalLayout from "./ModalLayout";
import TextArea from "../shared/TextArea";
import Button from "../shared/Button";
import { updateReview, deleteReviewImages, uploadReviewImages } from "../../api/reviewApi";
import Fallback from "../shared/Fallback";
import { IoMdPhotos } from "react-icons/io";

const ReviewEditModal = ({ toggleModal, gymId, review, onUpdateReview }) => {
    const { userData, loading } = useAuth();
    const [formValues, setFormValues] = useState({
        gymId: parseInt(gymId, 10),
        comment: review.comment,
        rating: review.rating,
        userId: review.userId,
        userName: review.userName,
        email: review.email,
        id: review.id,
    });
    const [images, setImages] = useState([]);
    const [previewImages, setPreviewImages] = useState(review.images || []);
    const [imagesToDelete, setImagesToDelete] = useState([]);

    useEffect(() => {
        if (userData) {
            setFormValues((prevValues) => ({
                ...prevValues,
                userId: userData.userId,
                userName: userData.userName,
                email: userData.email,
            }));
        }
    }, [userData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };

    const handleRatingChange = (e) => {
        const { value } = e.target;
        setFormValues({
            ...formValues,
            rating: parseInt(value, 10),
        });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files); // Update images state with newly selected images
    };

    const handleDeleteImage = (index) => {
        const updatedImages = [...previewImages];
        const deletedImage = updatedImages.splice(index, 1)[0];
        setPreviewImages(updatedImages);

        // Mark image for deletion if it exists in review.images
        if (review.images.includes(deletedImage)) {
            const formData = new FormData();
            formData.append("imageName", deletedImage);
            setImagesToDelete([...imagesToDelete, formData]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Update the review details
            const updatedReview = {
                ...formValues,
                comment: formValues.comment,
                rating: formValues.rating,
                regDate: new Date().toISOString().split('T')[0],
            };

            // Update review details on the server
            await updateReview(updatedReview);

            // Prepare image operations
            const deletePromises = imagesToDelete.map(formData => deleteReviewImages(updatedReview.id, formData));
            const uploadPromises = images.map(image => {
                const formData = new FormData();
                formData.append("image", image);
                return uploadReviewImages(updatedReview.id, formData);
            });

            // Perform all image operations in parallel
            await Promise.all([...deletePromises, ...uploadPromises]);

            // Update the UI with the updated review
            onUpdateReview(updatedReview);
            toggleModal();
        } catch (error) {
            console.error("Failed to update review", error);
        }
    };

    if (loading) {
        return <Fallback />;
    }

    return (
        <ModalLayout toggleModal={toggleModal}>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col h-96">
                    <div className="flex flex-col gap-1 justify-center items-center">
                        <div className="mb-2 font-semibold text-xl">
                            리뷰 수정
                            <div className="mt-2 w-22 border-b-2 border-grayish-red border-opacity-20"></div>
                        </div>
                        <div className="flex justify-center gap-2">
                            <div className="mx-5 flex flex-row-reverse justify-end text-2xl">
                                {[...Array(5)].map((_, index) => {
                                    const ratingValue = index + 1;
                                    return (
                                        <React.Fragment key={ratingValue}>
                                            <input
                                                type="radio"
                                                className="peer hidden"
                                                id={`value${ratingValue}`}
                                                value={ratingValue.toString()}
                                                name="score"
                                                checked={formValues.rating === ratingValue}
                                                onChange={handleRatingChange}
                                            />
                                            <label
                                                htmlFor={`value${ratingValue}`}
                                                className="cursor-pointer text-gray-400 peer-hover:text-yellow-400 peer-checked:text-yellow-300"
                                            >
                                                ★
                                            </label>
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                        </div>
                        <label htmlFor="commentInput">
                            <TextArea
                                label="후기를 작성해주세요."
                                required={true}
                                id="commentInput"
                                name="comment"
                                value={formValues.comment}
                                onChange={handleInputChange}
                            />
                        </label>
                    </div>
                    <div>
                        {previewImages.length > 0 && (
                            <div className="flex space-x-2">
                                {previewImages.map((image, idx) => (
                                    <div key={idx} className="relative">
                                        <img
                                            src={`/images/${image}`}
                                            alt={`Review Image ${idx}`}
                                            className="w-24 h-22 object-cover rounded-lg border-gray-200 border-2"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteImage(idx)}
                                            className="absolute top-1 right-1 bg-gray-300 rounded-full w-6 h-6 flex justify-center items-center cursor-pointer hover:bg-red-400"
                                        >
                                            X
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <label className="w-[400px] h-[40px] pl-2 flex text-sm items-center cursor-pointer">
                            <IoMdPhotos className="w-7 h-7 px-1" />
                            이미지 수정
                            <input
                                type="file"
                                className="hidden"
                                onChange={handleImageChange}
                                multiple
                            />
                        </label>
                        <Button label="수정" width="100px" className="float-right mt-2" type="submit" />
                    </div>
                </div>
            </form>
        </ModalLayout>
    );
};

export default ReviewEditModal;
