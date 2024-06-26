import React from "react";
import Button from "../shared/Button";
import underline from "../../assets/curved-underline.png";
import orangeUnderline from "../../assets/curved-underline-orange.png";
import useCustomNavigate from "../../hooks/useCustomNavigate";
import { useLoginModalContext } from "../../context/LoginModalContext";
import Slider from "@ant-design/react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import calendarDemo from "../../assets/calendar-demo.webp";

//  TODO snap scroll 안됨
const Section = ({}) => {
  const customNavigate = useCustomNavigate();
  const { toggleLoginModal } = useLoginModalContext();

  return (
    <>
      {/* section 2 */}
      <div
        className={`snap-start h-[100dvh] w-full flex justify-center items-center gap-52 text-xl text-white bg-light-black`}
      >
        {/* right */}
        <div className="flex flex-col gap-14 w-max relative">
          <span className="font-bold text-3xl">
            직접 가서 상담하기 너무 귀찮아..
          </span>
          <div className="flex flex-col gap-6">
            <span>'득근'에서 그 귀찮음을 해결하세요!</span>
            <div className="relative">
              <span>헬스장 조회로 간편하게 알아보고,</span>
              <div className="absolute  left-[220px]">
                <img className="h-3 w-20" src={underline} alt="underline" />
              </div>
            </div>
            <div className="relative">
              <span>채팅으로 상담하고 온라인으로 결제하고!</span>
              <div className="absolute  left-[86px]">
                <img className="h-3 w-20" src={underline} alt="underline" />
              </div>
              <div className="absolute  left-[280px]">
                <img className="h-3 w-20" src={underline} alt="underline" />
              </div>
            </div>
          </div>
          <div className="relative w-fit">
            <Button
              label={"하루라도 빨리 근성장하기"}
              className={"text-black font-bold"}
              color="bright-orange"
              width="300px"
              height="76px"
              onClick={() => customNavigate("/gymSearch")}
            />
            <span className="absolute text-5xl -right-5 -top-4 ">🏋️</span>
          </div>
        </div>
        {/* left */}
        <div className="w-1/3 h-[400px] relative">
          <Slider
            dots={false}
            infinite={true}
            arrows={true}
            speed={500}
            slidesToShow={1}
            slidesToScroll={1}
            adaptiveHeight={true}
            // prevArrow={<CustomPrevArrow />}
            // nextArrow={<CustomNextArrow />}
          >
            <div className="bg-black h-[400px]">
              <h3>1</h3>
            </div>
            <div className="bg-black h-[400px]">
              <h3>2</h3>
            </div>
            <div className="bg-black h-[400px]">
              <h3>3</h3>
            </div>
            <div className="bg-black h-[400px]">
              <h3>4</h3>
            </div>
            <div className="bg-black h-[400px]">
              <h3>5</h3>
            </div>
            <div className="bg-black h-[400px]">
              <h3>6</h3>
            </div>
          </Slider>
        </div>
      </div>
      {/* end of section 2 */}

      {/* section 1 */}
      <div
        className={`snap-start h-[100dvh] w-full flex flex-row-reverse  justify-center items-center gap-4 text-xl`}
      >
        {/* left */}
        <div className="flex flex-col gap-14 w-max relative">
          <span className="font-bold text-3xl">인바디 결과, 믿으시나요?</span>
          <div className="flex flex-col gap-6">
            <span>인바디 결과에 연연해 하지마세요!</span>
            <div className="relative">
              <span>인바디는 수분에 민감한 기계로, 결과가 부정확합니다.</span>
              <div className="absolute  left-[358px]">
                <img
                  className="h-3 w-16"
                  src={orangeUnderline}
                  alt="underline"
                />
              </div>
            </div>
            <div className="relative">
              <span>
                본인의 근성장을 확실하게 하기 위해 ‘득근’의 <b>운동일지</b>를
                활용해 보세요!
              </span>
              <div className="absolute  left-16">
                <img
                  className="h-3 w-16"
                  src={orangeUnderline}
                  alt="underline"
                />
              </div>
              <div className="absolute  left-[410px]">
                <img
                  className="h-3 w-20"
                  src={orangeUnderline}
                  alt="underline"
                />
              </div>
            </div>
          </div>
          <div className="relative w-fit">
            <Button
              label={"근성장 기록하기"}
              className={"text-black font-bold"}
              color="bright-orange"
              width="200px"
              height="76px"
              onClick={() =>
                sessionStorage.getItem("isLoggedIn")
                  ? customNavigate("/calendar")
                  : toggleLoginModal()
              }
            />
            <span className="absolute text-4xl -right-3 -top-4">✏️</span>
          </div>
        </div>
        {/* right */}
        <div className="w-1/3 relative">이미지</div>
      </div>
      {/* end of section 1 */}

      {/* section 3 */}
      <div
        className={`snap-start h-[100dvh] w-full flex justify-center items-center gap-4 bg-light-black text-white text-xl`}
      >
        {/* right */}
        <div className="flex flex-col gap-14 w-max relative">
          <div className="relative">
            <span className="font-bold text-3xl">헬스장을 운영하시나요?</span>
            <div className="absolute  left-[130px]">
              <img className="h-3 w-16" src={underline} alt="underline" />
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <span>‘득근’이 도와드릴게요!</span>
            <div className="relative">
              <span>회원 통계, PT 캘린더 등 유용한 기능으로</span>
              <div className="absolute  left-[220px]">
                <img className="h-2 w-28" src={underline} alt="underline" />
              </div>
            </div>
            <div className="relative">
              <span>회원권 및 데이터를 관리하고</span>
              <div className="absolute  left-[180px]">
                <img className="h-3 w-20" src={underline} alt="underline" />
              </div>
            </div>
            <div className="relative">
              <span>센터에 꼭 맞는 프로모션과 PT 커리큘럼을 만들어보세요</span>
              <div className="absolute  left-[66px]">
                <img className="h-3 w-[70px]" src={underline} alt="underline" />
              </div>
            </div>
          </div>
          <div className="relative w-fit">
            <Button
              label={"헬스장 대박나기"}
              className={"text-black font-bold"}
              color="bright-orange"
              width="250px"
              height="76px"
              // TODO 헬스장 회원인지 확인
              onClick={() =>
                sessionStorage.getItem("isLoggedIn")
                  ? customNavigate("/stats")
                  : toggleLoginModal()
              }
            />
            <span className="absolute text-5xl -right-5 -top-4 ">👍</span>
          </div>
        </div>
        {/* left */}
        <div className="w-1/3 relative rounded-xl overflow-hidden"></div>
      </div>
      {/* end of section 3 */}

      {/* section 4 */}
      <div
        className={`snap-start h-[100dvh] w-full flex flex-col gap-60 justify-center items-center text-xl`}
      >
        <div className="flex justify-center items-center gap-4 relative">
          <span className="text-5xl">💪</span>
          <span className="font-bold text-4xl">'득근'의 파트너 헬스장</span>
          <div className="absolute -bottom-3 left-[220px]">
            <img className="h-4 w-28" src={orangeUnderline} alt="underline" />
          </div>
        </div>
        {/* TODO 헬스장 불러와서 사진 표시하기 */}
        <div className="w-full h-[340px] relative overflow-hidden">
          <Slider
            dots={false}
            infinite={true}
            autoplay={true}
            speed={500}
            slidesToShow={5}
            slidesToScroll={1}
            adaptiveHeight={true}
            // prevArrow={<CustomPrevArrow />}
            // nextArrow={<CustomNextArrow />}
          >
            <div>
              <img
                src=""
                alt="image1"
                className="border bg-gray-300 rounded-full h-[340px]"
              />
            </div>
            <div>
              <img
                src=""
                alt="image1"
                className="border bg-gray-300 rounded-full h-[340px]"
              />
            </div>
            <div>
              <img
                src=""
                alt="image1"
                className="border bg-gray-300 rounded-full h-[340px]"
              />
            </div>
            <div>
              <img
                src=""
                alt="image1"
                className="border bg-gray-300 rounded-full h-[340px]"
              />
            </div>
            <div>
              <img
                src=""
                alt="image1"
                className="border bg-gray-300 rounded-full h-[340px]"
              />
            </div>
            <div>
              <img
                src=""
                alt="image1"
                className="border bg-gray-300 rounded-full h-[340px]"
              />
            </div>
          </Slider>
        </div>
        {/* <div className="flex justify-between items-end gap-12 overflow-hidden">
          <div className="border bg-gray-300 rounded-full w-[510px] h-[340px]"></div>
          <div className="border bg-gray-300 rounded-full w-[600px] h-[400px]"></div>
          <div className="border bg-gray-300 rounded-full w-[510px] h-[340px]"></div>
        </div> */}
        <div className="relative flex gap-6 justify-center items-center">
          <div>
            <span className="font-bold text-3xl">사장님도 '득근'하세요!</span>
            <div className="absolute left-[136px]">
              <img className="h-3 w-16" src={orangeUnderline} alt="underline" />
            </div>
          </div>
          <Button
            label={"득근하기"}
            className={"text-black font-bold"}
            color="bright-orange"
            width="160px"
            height="76px"
            // TODO 헬스장 회원인지 확인
            onClick={() =>
              sessionStorage.getItem("isLoggedIn")
                ? customNavigate("/stats")
                : customNavigate("/signUp/form", { state: { role: "gym" } })
            }
          />
          <span className="absolute text-5xl -right-5 -top-4 ">🤝</span>
        </div>
      </div>
      {/* end of section 4 */}
    </>
  );
};

export default Section;
