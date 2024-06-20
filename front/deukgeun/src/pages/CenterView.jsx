//헬스장 조회 페이지 - Review 구현을 위해 임시 만듦.

import React from "react";
import Review from "../components/view/Review";
import TrainerInfo from "../components/view/TrainerInfo";

const CenterView = () => {
    return (
    <>
        <div className="flex flex-col space-y-56">
            <TrainerInfo/>
            <Review/>
        </div>
    </>
        
    );
};

export default CenterView;