import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import ModalLayout from "./ModalLayout";
import TextArea from "../shared/TextArea";
import Button from "../shared/Button";
import { updateReview, updateReviewImages } from "../../api/reviewApi";
import Fallback from "../shared/Fallback";
import { IoMdPhotos } from "react-icons/io";
import { FaTimes } from "react-icons/fa";


const ReviewEditModal = ({ toggleModal, gymId, review, onUpdateReview, onReviewUpdated }) => {
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
    const [previewImages, setPreviewImages] = useState(
        review.images.map(image => ({ src: `/images/${image}`, isNew: false })) || []
    );
    const [imagesToDelete, setImagesToDelete] = useState([]);
    const [isUpdated, setIsUpdated] = useState(false);



    const fetchUpdatedReview = useCallback(async () => {
        // TODO: 여기에 업데이트된 리뷰를 가져오는 API 호출을 추가합니다.
        // 예: const updatedReviewData = await getReviewById(review.id);
        // onUpdateReview(updatedReviewData);
    }, [review.id, onUpdateReview]);

    useEffect(() => {
        if (isUpdated) {
            fetchUpdatedReview();
            setIsUpdated(false);
        }
    }, [isUpdated, fetchUpdatedReview]);

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
        const filePreviews = files.map(file => ({ src: URL.createObjectURL(file), isNew: true }));

        setImages((prevImages) => [...prevImages, ...files]);
        setPreviewImages((prevPreviews) => [...prevPreviews, ...filePreviews]);
    };

    const handleDeleteImage = (index) => {
        const updatedImages = [...previewImages];
        const deletedImage = updatedImages.splice(index, 1)[0];
        setPreviewImages(updatedImages);

        if (!deletedImage.isNew && review.images.includes(deletedImage.src.replace('/images/', ''))) {
            setImagesToDelete([...imagesToDelete, deletedImage.src.replace('/images/', '')]);
        }

        if (deletedImage.isNew) {
            setImages((prevImages) => prevImages.filter((_, i) => i !== index - review.images.length));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedReview = {
                ...formValues,
                comment: formValues.comment,
                rating: formValues.rating,
                regDate: new Date().toISOString().split('T')[0],
            };
    
            await updateReview(updatedReview);
    
            if (imagesToDelete.length > 0 || images.length > 0) {
                const formData = new FormData();
                
                if (imagesToDelete.length > 0) {
                    imagesToDelete.forEach(imageName => formData.append("imageNames", imageName));
                }
                
                if (images.length > 0) {
                    images.forEach(image => formData.append("newFiles", image));
                }
    
                await updateReviewImages(updatedReview.id, formData);
            }
    
            onUpdateReview(updatedReview);
            onReviewUpdated(); // 새로 추가된 부분
            toggleModal();
        } catch (error) {
            console.error("Failed to update review", error);
        }
    };

    if (loading) {
        return <Fallback />;
    }

    const handleWheel = (e) => {
        const container = e.currentTarget;
        const delta = e.deltaY || e.detail || e.wheelDelta;
      
        // Adjust scroll speed and direction as needed
        const scrollSpeed = 0.5;
        container.scrollLeft += delta * scrollSpeed;
      
        e.preventDefault();
      };

    return (
        <ModalLayout toggleModal={toggleModal}>
            <form onSubmit={handleSubmit} >
                <div className="flex flex-col h-fit">
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
                        <label className="w-[400px] h-[40px] pl-2 flex text-sm items-center cursor-pointer">
                            <IoMdPhotos className="w-7 h-7 px-1 "  color="#9f8d8d"  />
                            이미지 추가
                            <input
                                type="file"
                                className="hidden"
                                onChange={handleImageChange}
                                multiple
                            />
                        </label>
                        <div className="mt-2 grid grid-cols-4 ">
                            {previewImages.map((image, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={image.src}
                                        alt={`Preview ${index}`}
                                        className="w-24 h-24 object-cover m-1"
                                    />
                                    <button
                                        type="button"
                                        className="absolute top-0 right-0 bg-black text-white rounded-full w-6 h-6 flex items-center justify-center"
                                        onClick={() => handleDeleteImage(index)}
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <Button label="수정" width="100px" className="float-right mt-2" type="submit" />
                    </div>
                </div>
            </form>
        </ModalLayout>
    );
};

export default ReviewEditModal;