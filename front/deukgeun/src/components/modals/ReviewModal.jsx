import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import ModalLayout from "./ModalLayout";
import TextArea from "../shared/TextArea";
import { IoMdPhotos } from "react-icons/io";
import Button from "../shared/Button";
import { addReview, uploadReviewImages } from "../../api/reviewApi";
import Fallback from "../shared/Fallback";

const ReviewModal = ({ toggleModal, gymId }) => {
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
        setImages(files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Step 1: 리뷰 데이터 제출
            const reviewData = {
                gymId: formValues.gymId,
                comment: formValues.comment,
                rating: formValues.rating,
                userId: userData.userId,
                userName: userData.userName,
                email: userData.email,
                regDate: new Date().toISOString().split('T')[0],
            };

            const reviewRes = await addReview(reviewData);

            if (reviewRes.RESULT === "SUCCESS") {
                const reviewId = reviewRes.reviewId;

                // Step 2: 이미지 업로드
                if (images.length > 0) {
                    const formData = new FormData();
                    images.forEach((image, index) => {
                        formData.append(`files`, image);
                    });

                    await uploadReviewImages(reviewId, formData);
                }
                toggleModal();
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
                            리뷰작성
                            <div className="mt-2 w-16 border-b-2 border-grayish-red border-opacity-20"></div>
                        </div>
                        <label htmlFor="commentInput">후기를 작성해주세요.
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
                    <div className="mt-4">
                        <div className="flex justify-center gap-2">
                            {[1, 2, 3, 4, 5].map((value) => (
                                <label key={value}>
                                    <input
                                        type="radio"
                                        name="rating"
                                        value={value}
                                        checked={formValues.rating === value}
                                        onChange={handleRatingChange}
                                    />
                                    {value}★
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="flex text-sm items-center cursor-pointer">
                            <IoMdPhotos className="w-7 h-7 pr-1" />
                            파일 이미지 넣기
                            <input
                                type="file"
                                className="hidden"
                                onChange={handleImageChange}
                                multiple  // 여러 개의 파일 선택 가능하도록
                            />
                        </label>
                        <Button label="작성" width="100px" className={`float-right mt-2`} type="submit" />
                    </div>
                </div>
            </form>
        </ModalLayout>
    );
};

export default ReviewModal;
