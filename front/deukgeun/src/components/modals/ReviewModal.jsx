import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import ModalLayout from "./ModalLayout";
import TextArea from "../shared/TextArea";
import { IoMdPhotos } from "react-icons/io";
import Button from "../shared/Button";
import { addReview, uploadReviewImages } from "../../api/reviewApi";
import Fallback from "../shared/Fallback";
import AlertModal from "../modals/AlertModal";

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
    const [isAlertModalVisible, setIsAlertModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

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

    const handleConfirmClick = () => {
        setIsAlertModalVisible(false);
        toggleModal();
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const reviewData = {
                gymId: formValues.gymId,
                comment: formValues.comment,
                rating: formValues.rating,
                userId: userData.userId,
                userName: userData.userName,
                email: userData.email,
                regDate: new Date().toISOString().split("T")[0],
            };

            const reviewRes = await addReview(reviewData);

            if (reviewRes.RESULT === "SUCCESS") {
                const newReview = reviewRes.newReview; // 서버에서 추가된 새 리뷰 객체

                if (images.length > 0) {
                    const formData = new FormData();
                    images.forEach((image, index) => {
                        formData.append(`file${index}`, image); // 파일 이름을 명확히 지정
                    });

                    await uploadReviewImages(newReview.reviewId, formData);
                }

                // 부모 컴포넌트로 새 리뷰를 전달
                if (typeof onReviewAdded === 'function') {
                    onReviewAdded(newReview); // onReviewAdded는 ReviewModal의 props로 전달받은 콜백 함수
                }

                setIsAlertModalVisible(true);
                setFormValues({
                    gymId: parseInt(gymId, 10),
                    comment: "",
                    rating: 0,
                    userId: userData.userId,
                    userName: userData.userName,
                    email: userData.email,
                });
                setImages([]);
            } else {
                setError("리뷰를 추가하는 도중 문제가 발생했습니다.");
            }
        } catch (error) {
            console.error("Failed to add review", error);
            setError("리뷰를 추가하는 도중 문제가 발생했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    if (loading || isLoading) {
        return <Fallback />;
    }

    return (
        <>
            <ModalLayout toggleModal={toggleModal}>
                <div className="flex flex-col h-96">
                    <div className="flex flex-col gap-1 justify-center items-center">
                        <div className="mb-2 font-semibold text-xl">
                            리뷰작성
                            <div className="mt-2 w-20 border-b-2 border-grayish-red border-opacity-20"></div>
                        </div>

                        <div>
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
                            이미지넣기
                            <input
                                type="file"
                                className="hidden"
                                onChange={handleImageChange}
                                multiple
                            />
                        </label>
                        <Button
                            label="작성"
                            width="100px"
                            className="float-right"
                            onClick={handleSubmit}
                        />
                    </div>
                </div>
            </ModalLayout>
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
            {error && (
                <AlertModal
                    headerEmoji={"❌"}
                    line1={error}
                    button2={{
                        label: "닫기",
                        onClick: () => setError(null),
                    }}
                />
            )}
        </>
    );
};

export default ReviewModal;
