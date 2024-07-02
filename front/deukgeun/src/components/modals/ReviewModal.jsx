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
            // Step 1: Submit review data
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

                // Step 2: Upload images if there are any
                if (images.length > 0) {
                    const formData = new FormData();
                    images.forEach((image, index) => {
                        formData.append('files', image);  // Use 'files' as the key
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
                            {/* <div class="mx-5 flex flex-row-reverse justify-end text-2xl">
                                        <label for="score"></label>
                                        <input type="radio" class="peer hidden" id="value5" value="5" name="score"
                                        checked={formValues.rating === 5}
                                            onChange={handleRatingChange} />
                                        <label for="value5"
                                        class="cursor-pointer text-gray-400 peer-hover:text-yellow-400 peer-checked:text-yellow-300">★</label>
                                        <input type="radio" class="peer hidden" id="value4" value="4" name="score" 
                                        checked={formValues.rating === 4}
                                        onChange={handleRatingChange}/>
                                        <label for="value4"
                                        class="cursor-pointer text-gray-400 peer-hover:text-yellow-400 peer-checked:text-yellow-300">★</label>
                                        <input type="radio" class="peer hidden" id="value3" value="3" name="score"
                                        checked={formValues.rating === 3}
                                        onChange={handleRatingChange} />
                                        <label for="value3"
                                        class="cursor-pointer text-gray-400 peer-hover:text-yellow-400 peer-checked:text-yellow-300">★</label>
                                        <input type="radio" class="peer hidden" id="value2" value="2" name="score" 
                                        checked={formValues.rating === 2}
                                        onChange={handleRatingChange}/>
                                        <label for="value2"
                                        class="cursor-pointer text-gray-400 peer-hover:text-yellow-400 peer-checked:text-yellow-300">★</label>
                                        <input type="radio" class="peer hidden" id="value1" value="1" name="score"
                                        checked={formValues.rating === 1}
                                        onChange={handleRatingChange} />
                                        <label for="value1"
                                        class="cursor-pointer peer text-gray-400 peer-hover:text-yellow-400 peer-checked:text-yellow-300">★</label>
                            </div> */}
                            {/* {[1, 2, 3, 4, 5].map((value) => (
                                    <label key={value}>
                                        <input
                                            type="radio"
                                            name="rating"
                                            value={value}
                                            checked={formValues.rating === value}
                                            onChange={handleRatingChange}
                                        />
                                        {value} ★
                                    </label>
                                ))} */}
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
                        <label className=" w-[400px] h-[40px] pl-2 flex text-sm items-center cursor-pointer">
                            <IoMdPhotos className="w-7 h-7 px-1" />
                            이미지넣기
                            <input
                                type="file"
                                className="hidden"
                                onChange={handleImageChange}
                                multiple  // 여러 개의 파일 선택 가능하도록
                            />
                           
                        </label>
                        <Button label="작성" width="100px" className="float-right" type="submit" />
                    </div>
                </div>
            </form>
        </ModalLayout>
    );
};

export default ReviewModal;
