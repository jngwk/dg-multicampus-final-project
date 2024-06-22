import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import ModalLayout from "./ModalLayout";
import TextArea from "../shared/TextArea";
import Button from "../shared/Button";
import { updateReview } from "../../api/reviewApi";
import Fallback from "../shared/Fallback";

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = {
                ...formValues,
                comment: formValues.comment,
                rating: formValues.rating,
                regDate: new Date().toISOString().split('T')[0],
            };
            const res = await updateReview(formData);
            onUpdateReview(formData);
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
                        <Button label="수정" width="100px" className={`float-right mt-2`} type="submit" />
                    </div>
                </div>
            </form>
        </ModalLayout>
    );
};

export default ReviewEditModal;
