//리뷰 컴포넌트

import React from "react";
import { MdOutlineRateReview } from "react-icons/md";
import ReviewContent from "./ReviewContent";

const Review = () => {
    return (
        <div>
            {/* 리뷰 작성 헤더 */}
            <div className="relative">
                <div className="flex flex-col items-center text-center mb-10">
                    <div className="mb-2 font-semibold text-xl">
                        리뷰
                        <div className="mt-2 w-16 border-b-2 border-grayish-red border-opacity-20 "></div>
                    </div>
                    등록 리뷰 수: 52
                </div>
                <button className="absolute top-12 right-0 flex items-center mr-5">
                    <div className="hover:font-bold">
                        리뷰작성
                    </div>
                    <MdOutlineRateReview className="mx-1 mb-1" size="25" color="#9F8D8D" />
                </button>
            </div>

            {/* 리뷰 내용 */}
            <div className="w-full  h-[500px] p-5 flex justify-center rounded-lg bg-grayish-red bg-opacity-20 border-2 border-grayish-red">
                <div className="w-[1100px] flex justify-center flex-wrap overflow-y-auto scrollbar-hide">
                    <ReviewContent />
                </div>
            </div>
        </div>
    );
};

export default Review;
