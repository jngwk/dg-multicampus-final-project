import React, { useState } from "react";
import ModalLayout from "./ModalLayout";
import Button from "../shared/Button";
import Bprofile from "../../assets/blank_profile.png";
import { Link } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";



const MyInfo = ({ toggleModal }) => {

        const [passwordType, setPasswordType] = useState({
            type: 'password',
            visible: false
        });
        
        //password type 변경하는 함수
        const handlePasswordType = (e) => {
            setPasswordType(() => {
                if (!passwordType.visible) {
                    return { type: 'text', visible: true };
                }
                return { type: 'password', visible: false };
            })
        }

    return (
        <ModalLayout toggleModal={toggleModal}>
            <div className="userEdit">
                <div className="text-2xl font-semibold pb-3">
                    <p>내 정보</p>
                </div>
                <div className="userEdit-img">
                    <label className="flex justify-center items-center">
                        <img src={Bprofile}  className="rounded-full border-black" alt="프로필 사진" />
                    </label>
                </div>
                <div className="pt-3">
                    <dl>
                        {/* 이름 */}
                        <div className=" px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-10">
                            <dt className="text-sm font-normal text-gray-500">
                                이름
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            최OO
                            </dd>
                        </div>
                        {/* 아이디 */}
                        <div className=" px-4  py-2  sm:grid sm:grid-cols-3 sm:gap-10">
                                <dt className="text-sm font-medium text-gray-500">
                                아이디
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                Choi123
                                </dd>
                        </div>
                        {/* 비밀번호 */}
                        <div className=" px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-10">
                            <dt className="text-sm font-medium text-gray-500">
                            비밀번호
                            </dt>
                            <dd className="flex text-gray-900 sm:mt-0 sm:col-span-2">
                                <input  id="hs-toggle-password" className="w-full text-sm focus:outline-none border-b-2 " type={passwordType.type}></input>
                                <div>
                                    <span onClick={handlePasswordType}>
                                        {  passwordType.visible ? <FaRegEye /> : <FaRegEyeSlash /> }
                                    </span>
                                </div>
                            </dd>
                        </div>
                        {/* 이메일 */}
                        <div className=" px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-10 ">
                            <dt className="text-sm font-medium text-gray-500">
                            E-mail
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            Choi123@naver.com
                            </dd>
                        </div>
                        {/* 주소 */}
                        <div className=" px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-10">
                            <dt className="text-sm font-medium text-gray-500">
                            주소
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            서울특별시 강남구 삼성로 648 2층
                            </dd>
                        </div>
                        {/* 등록된 헬스장 */}
                        <div className=" px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-10">
                            <dt className="text-sm font-medium text-gray-500">
                            등록된 헬스장
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            바디채널 OO점 (만료일: 2024.05..
                            </dd>
                        </div>

                    </dl>
                </div>

                <div className=" pt-6 flex float-end">
                    <div className="m-2" >
                    <Button height="40px" width="100px" color="peach-fuzz" label="수정" />
                    </div>
                    <div className="m-2">
                    <Button height="40px" width="100px" color="bright-orange" label="완료" />
                    </div>
                </div>
            </div>
                
        </ModalLayout>
      );

};

export default MyInfo;