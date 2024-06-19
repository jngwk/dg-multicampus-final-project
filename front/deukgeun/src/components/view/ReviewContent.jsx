// 작성한 리뷰 내용 불러오는 컴포넌트
import React from "react";
import { FcManager } from "react-icons/fc";

const ReviewContent = () => {

    const commentList = [
        { profileimg: ' ', 
            userName: '나팔팔', 
            comment : '헬스장이 깔끔하고 너무 좋아요! PT 트레이너님들도 친절하시고 자세히 알려주셔요! 헬스장이 깔끔하고 너무 좋아요! PT 트레이너님들도 친절하시고 자세히 알려주셔요! 헬스장이 깔끔하고 너무 좋아요! PT 트레이너님들도 친절하시고 자세히 알려주셔요! 헬스장이 깔끔하고 너무 좋아요! PT 트레이너님들도 친절하시고 자세히 알려주셔요! 헬스장이 깔끔하고 너무 좋아요! PT 트레이너님들도 친절하시고 자세히 알려주셔요! 헬스장이 깔끔하고 너무 좋아요! PT 트레이너님들도 친절하시고 자세히 알려주셔요! 헬스장이 깔끔하고 너무 좋아요! PT 트레이너님들도 친절하시고 자세히 알려주셔요! 헬스장이 깔끔하고 너무 좋아요! PT 트레이너님들도 친절하시고 자세히 알려주셔요! 헬스장이 깔끔하고 너무 좋아요! PT 트레이너님들도 친절하시고 자세히 알려주셔요! ',
            reviewimg: ' ' },
        { profileimg: ' ', userName: '김오오', comment : '가 본 곳  중 기구가 가장 다양하면서 사람이 많은데에 비해 시설자체가 굉장히 깨끗하더라구요! 특히 샤워장이나 운동복도 특유에 쉰내 없이 청결한 상태를 유지하고 있어 안심하고 운동하기 편할 것 같아요' },
        { profileimg: ' ', userName: '육칠칠', comment : '최고의 시설, 합리적인 가격, 친절한 선생님 👍🏻 PT중독자라 근처 PT다 받아봤는데 여기 계신 OO쌤처럼 친절하고 세심한 분은 첨 뵙는것 같아요! 피티가 고민이신분들이라면 망설이지말고 OO쌤에게 받으세요!  OO쌤 덕분에 전 스트레스 없는 식단과 운동으로 건강하게 다이어트 성공했습니다🤗' },
        { profileimg: ' ', userName: '남궁사사', comment : '헬스장이 깔끔하고 너무 좋아요! PT 트레이너님들도 친절하시고 자세히 알려주셔요! 이번 여름 기대해봐도 될것같네요!! ' },
        { profileimg: ' ', userName: '이미미', comment : '기구 사용법을 잘 모를경우 상주하고 계시는 헬스트레이너에게 문의하시면 친절하게 알려주시니 편하게 물어보시고 탄탄한 바디라인 만들어 보세요! ' },
    ];

    // const commentList = {
    //     profileimg: "",
    //     userName: "",
    //     comment: "",
    //     reviewimg: "",
    // };



    return (
        <>
            {commentList.map((item, index) => (
                <div key={index} className="flex justify-center items-center h-full border-b-2 border-gray-300">
                    <div className={`px-10 my-4 w-[550px] h-5/6 text-start ${index % 2 === 0 && index !== commentList.length - 1 ? 'border-r-2 border-gray-300' : ''}`}>
                        <div className="flex items-center mb-3">
                            <div className=" border-white shadow-lg border-2 rounded-full overflow-hidden"><FcManager className="w-8 h-8 "/></div>
                            <div className="font-bold ml-3">{item.userName}</div>
                        </div>
                        <div className="h-24 text-sm my-5 overflow-y-auto scrollbar text-justify">
                            {item.comment} 
                        </div>
                        <div className="cursor-pointer h-2/4 w-full rounded-lg border-grayish-red border-2">{item.reviewimg}</div>
                    </div>
                </div>
            ))}
        </>
    );
};

export default ReviewContent;