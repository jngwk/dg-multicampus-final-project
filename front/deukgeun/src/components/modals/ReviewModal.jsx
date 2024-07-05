import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import ModalLayout from "./ModalLayout";
import TextArea from "../shared/TextArea";
import Button from "../shared/Button";
import { addReview, uploadReviewImages } from "../../api/reviewApi";
import Fallback from "../shared/Fallback";
import { IoMdPhotos } from "react-icons/io";
import { FaTimes } from "react-icons/fa";

const ReviewModal = ({ toggleModal, gymId, onReviewAdded }) => {
    const { userData, loading } = useAuth();
    const [formValues, setFormValues] = useState({
        gymId: parseInt(gymId, 10),
        comment: "",
        rating: 0,
        userId: 0,
        userName: "",
        email: "",
    });
    const [images, setImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);

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
        const filePreviews = files.map(file => URL.createObjectURL(file));

        setImages((prevImages) => [...prevImages, ...files]);
        setPreviewImages((prevPreviews) => [...prevPreviews, ...filePreviews]);
    };

    const handleImageRemove = (index) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
        setPreviewImages((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const reviewData = {
                gymId: formValues.gymId,
                comment: formValues.comment,
                rating: formValues.rating,
                userId: formValues.userId,
                userName: formValues.userName,
                email: formValues.email,
                regDate: new Date().toISOString().split('T')[0],
            };

            const reviewRes = await addReview(reviewData);

            if (reviewRes.RESULT === "SUCCESS") {
                const reviewId = reviewRes.reviewId;

                if (images.length > 0) {
                    const formData = new FormData();
                    images.forEach((image) => {
                        formData.append('files', image);
                    });

                    await uploadReviewImages(reviewId, formData);
                }

                toggleModal();
                onReviewAdded(reviewData);
            }
        } catch (error) {
            console.error("Failed to add review", error);
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
                            리뷰 작성
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
                            <IoMdPhotos className="w-7 h-7 px-1" />
                            이미지 넣기
                            <input
                                type="file"
                                className="hidden"
                                onChange={handleImageChange}
                                multiple
                            />
                        </label>
                        <Button label="작성" width="100px" className="float-right" type="submit" />
                    </div>
                    <div className="mt-2 flex flex-wrap">
                        {previewImages.map((src, index) => (
                            <div key={index} className="relative">
                                <img src={src} alt={`Preview ${index}`} className="w-24 h-24 object-cover m-1" />
                                <button
                                    type="button"
                                    className="absolute top-0 right-0 bg-black text-white rounded-full w-6 h-6 flex items-center justify-center"
                                    onClick={() => handleImageRemove(index)}
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </form>
        </ModalLayout>
    );
};

export default ReviewModal;
