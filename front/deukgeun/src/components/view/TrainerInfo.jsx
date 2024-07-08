//트레이너소개 컴포넌트

import React, { useState } from "react";
import profileImg from "../../assets/profileImg.jpg";
import KimTrainer from "../../assets/KimTrainer.jpg";
import { FaPlus, FaMinus } from "react-icons/fa6";
// { trainers }
const TrainerInfo = ({ trainers }) => {
  // 임시로 넣어두는 데이터

  //   useEffect(() => {
  //     try {

  //     } catch (error) {
  //         console.log("error retreiving trainer information")
  //     }
  //   }, [])
  //   const trainers = [
  //     {
  //       userName: "김OO 트레이너",
  //       trainerImage: KimTrainer,
  //       //list형태를 위해 배열로
  //       trainerCareer: [
  //         "생활스포츠지도자 2급(보디빌딩)",
  //         "라이프가드 대한적십사",
  //         "스포츠 테이핑 교육수료",
  //         "소도구 테라피 교육수료",
  //         "前 세븐짐 트레이너",
  //         "前 BY GYM 트레이너",
  //         "現 송내 쏘마 휘트니스 트레이너",
  //         "WNGP 시흥 노비스 4위",
  //         "WNGP 시흥 루키 3위",
  //       ],
  //     },
  //     {
  //       userName: "최OO 트레이너",
  //       trainerImage: profileImg,
  //       trainerCareer: [
  //         "국민대학교 대학원(운동처방전공)",
  //         "자격증[국가공인] 생활스포츠지도사 2급 보디빌딩(피트니스) - 문화체육관광부",
  //         "자격증[국가공인] 생활스포츠지도사 2급 스쿼시 - 문화체육관광부",
  //         "자격증[국가공인] 유소년스포츠지도사 보디빌딩(피트니스) - 문화체육관광부",
  //         "자격증[국가공인] 스포츠경영관리사 - 문화체육관광부",
  //         "자격증[국가공인] 노인스포츠지도사 보디빌딩 - 문화체육관광부",
  //         "자격증대한운동사협회(KACEP) 운동사",
  //         "자격증NASM-CPT 미국스포츠의학회 국제공인트레이너 자격증",
  //         "자격증NASM-CES(미국스포츠의학회 교정운동전문가)",
  //         "자격증NASM-PES (운동 수행 능력 전문가)",
  //         "자격증미국스포츠의학회 NASM 인증센터 강남피티 대표",
  //         "자격증NSCA-CPT(미국체력관리협회)",
  //         "자격증NSCA KOREA 웨이트 트레이닝 코치",
  //         "자격증퍼스널 트레이너 자격증 (NSCA KOREA)",
  //         "자격증체력관리사 자격증 (NSCA KOREA)",
  //         "자격증NSCA 스포츠영양코치 자격증",
  //         "자격증IFBB PRO 트레이너",
  //         "자격증대한보디빌딩협회 심판",
  //         "자격증하이닥 지식인 운동전문가",
  //       ],
  //     },
  //   ];

  const [openIndex, setOpenIndex] = useState(-1);
  const [selectedImage, setSelectedImage] = useState(
    (trainers?.length > 0 && trainers[0]?.trainerImage) || ""
  );

  const toggleOpen = (index) => {
    console.log(trainers[index]);
    if (openIndex === index) {
      setOpenIndex(-1);
      setSelectedImage(
        (trainers.length > 0 && trainers[0]?.trainerImage) || ""
      ); // 첫번째 트레이너 사진으로 되돌리기
    } else {
      setOpenIndex(index);
      setSelectedImage(
        (trainers.length > 0 && trainers[index]?.trainerImage) || ""
      ); // 선택된 트레이너 이미지로 변경
    }
  };

  return (
    <div className="w-full">
      {/* 트레이너 소개 헤더 */}
      <div className="mb-10">
        <div className="flex flex-col items-center  text-center mb-2 font-semibold text-2xl">
          트레이너 소개
          <div className="mt-2 w-16 border-b-2 border-grayish-red border-opacity-20"></div>
        </div>
      </div>

      {/* 트레이너 정보 내용 */}

      <div className="w-full h-full flex justify-evenly items-center">
        {trainers?.length > 0 ? (
          <>
            <div className="flex justify-evenly">
              {selectedImage ? (
                <img
                  className="w-[400px] h-[500px] rounded-lg object-cover shadow-lg "
                  src={`/images/${selectedImage}`}
                  alt="Profile"
                />
              ) : (
                <div className="flex flex-col gap-10 justify-center items-center w-[400px] h-[500px] border border-grayish-red rounded-md">
                  <span className="text-4xl">😔</span>
                  <span className="text-xl">등록된 사진이 없습니다</span>
                </div>
              )}
            </div>
            <div className=" w-1/2 h-fit flex flex-col items-start justify-center">
              <ul
                className={`w-3/4 overflow-hidden overflow-y-auto scrollbar-hide border-t-light-black border-t-2 border-opacity-40 `}
              >
                {trainers.map((trainer, index) => (
                  <li
                    key={index}
                    className="list-none border-light-black border-b-2 border-opacity-40"
                  >
                    <div className="flex justify-between items-center py-5 px-4">
                      <p
                        className={`${
                          openIndex === index && ""
                        } font-semibold text-lg`}
                      >
                        {trainer.user.userName}
                      </p>
                      <button onClick={() => toggleOpen(index)}>
                        {openIndex === index ? <FaMinus /> : <FaPlus />}
                      </button>
                    </div>
                    {openIndex === index && (
                      <div className="expandable flex items-center p-4 mb-4 overflow-hidden overflow-y-auto scrollbar-hide">
                        <ul className="list-disc pl-5 space-y-2">
                          {trainer.trainerAbout || trainer.trainerCareer ? (
                            <>
                              <div className="mb-4">
                                {trainer.trainerAbout
                                  ?.split("\n")
                                  .map((line, index) => (
                                    <React.Fragment key={index}>
                                      {line}
                                      <br />
                                    </React.Fragment>
                                  ))}
                              </div>
                              {trainer.trainerCareer
                                ?.split("\n")
                                .map((line, index) => (
                                  <React.Fragment key={index}>
                                    {line}
                                    <br />
                                  </React.Fragment>
                                ))}
                            </>
                          ) : (
                            <p className="text-center">
                              등록된 정보가 없습니다..{" "}
                              <span className="text-xl">🙅</span>
                            </p>
                          )}
                        </ul>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-10 justify-center items-center h-[618px] w-[1000px] border border-grayish-red rounded-md">
            <span className="text-4xl">😔</span>
            <span className="text-xl">등록된 트레이너가 없습니다</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainerInfo;
