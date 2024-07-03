// 백 연결해서 확인 필요

import React, { useEffect, useState } from "react";
import { FcInspection } from "react-icons/fc";
import { ListInquery, updateInquiry, deleteInquiryApi } from "../api/qnaApi";
import { useAuth } from "../context/AuthContext";
import Fallback from "../components/shared/Fallback";
import { useModal } from "../hooks/useModal";
import QnaAns from "../components/modals/QnaAns";
import TextArea from "../components/shared/TextArea";
import Input from "../components/shared/Input";

const initState = {
  userName: "",
  email: "",
  title: "",
  content: "",
};

const QnaList = () => {
  const { userData, loading } = useAuth();
  const [formValues, setFormValues] = useState(initState);
  const [inquiries, setInquiries] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedInquiry, setEditedInquiry] = useState(initState);
  const { isModalVisible, toggleModal } = useModal();

  useEffect(() => {
    if (userData) {
      setFormValues((prevValues) => ({
        ...prevValues,
        userName: userData.userName,
        email: userData.email,
      }));
    }
  }, [userData]);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const inquiriesData = await ListInquery();
        setInquiries(inquiriesData);
      } catch (error) {
        console.error("Error fetching inquiries:", error);
      }
    };

    fetchInquiries();
  }, []);

  const editInquiry = (index, inquiry) => {
    setEditingIndex(index);
    setEditedInquiry(inquiry);
  };

  const saveInquiry = async (index) => {
    try {
      // Call API to update the inquiry
      await updateInquiry(editedInquiry);
      setInquiries((prevInquiries) =>
        prevInquiries.map((inquiry, i) => (i === index ? editedInquiry : inquiry))
      );
      setEditingIndex(null);
    } catch (error) {
      console.error("Error updating inquiry:", error);
    }
  };

  const deleteInquiry = async (index, inquiryId) => {
    try {
      // Call API to delete the inquiry
      await deleteInquiryApi(inquiryId);
      setInquiries((prevInquiries) => prevInquiries.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error deleting inquiry:", error);
    }
  };

  if (loading) {
    return <Fallback />;
  }

  return (
    <div className="flex flex-col items-center space-y-14 my-10">
      <div className="flex flex-row items-center absolute left-64">
        <p className="font-semibold text-xl flex flex-row items-center"> 
          <div className="mr-1 text-3xl">📮</div> 문의내역</p>
      </div>

      <div className="overflow-y-scroll scrollbar min-h-screen max-h-[15dvh] border-y-4 border-peach-fuzz border-dotted flex flex-col space-y-5 w-3/4 items-center py-2">
        {inquiries.length > 0 ? (
          inquiries.map((inquiry, index) => (
            <div key={index} className="flex flex-col justify-center p-2 space-y-2 h-fit bg-peach-fuzz bg-opacity-25 w-full rounded-lg">
              {editingIndex === index ? (
                <div className="h-1/5 font-semibold mx-2 flex flex-col space-y-1">
                  <Input
                    className="text-light-black "
                    value={editedInquiry.title}
                    onChange={(e) => setEditedInquiry({ ...editedInquiry, title: e.target.value })}
                  />
                  <TextArea
                    width="100%"
                    height="112px"
                    className=" overflow-y-scroll scrollbar text-[13px] border border-opacity-40 border-grayish-red rounded-lg p-2"
                    value={editedInquiry.content}
                    onChange={(e) => setEditedInquiry({ ...editedInquiry, content: e.target.value })}
                  />                  <div className="flex flex-row">
                    <button
                      className="hover:font-semibold hover:text-bright-orange hover:border-b hover:border-bright-orange text-grayish-red text-[12px] mr-2"
                      onClick={() => saveInquiry(index)}
                    >
                      저장
                    </button>
                    <button
                      className="hover:font-semibold hover:text-bright-orange hover:border-b hover:border-bright-orange text-grayish-red text-[12px] mr-2"
                      onClick={() => setEditingIndex(null)}
                    >
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-1/5 font-semibold mx-2 flex flex-col space-y-1">
                  <div className="text-[10px] text-grayish-red">문의한 날짜: {inquiry.date}</div>
                  <div className="flex flex-row items-center">
                    <div className="mr-2 text-light-black">{inquiry.title}</div>
                    <div className="text-[10px] pr-2 mr-2 text-grayish-red border-r border-grayish-red">{inquiry.userName}</div>
                    <div className="text-[10px] text-grayish-red overflow-hidden overflow-x-auto">{inquiry.email}</div>
                  </div>
                </div>
              )}
              <div className="flex flex-col items-end space-y-2">
                {editingIndex !== index && (
                  <div className="h-28 w-full overflow-y-scroll scrollbar text-[13px] border border-opacity-40 border-grayish-red rounded-lg p-2">
                    {inquiry.content}
                  </div>
                )}
                {(userData.userName === inquiry.userName && userData.email === inquiry.email) && (<div className="flex flex-row">

                  {editingIndex === index ? null : (
                    <>
                      <button
                        className="hover:font-semibold hover:text-bright-orange hover:border-b hover:border-bright-orange text-grayish-red text-[12px] mr-2"
                        onClick={() => editInquiry(index, inquiry)}
                      >
                        수정
                      </button>
                      <button
                        className="hover:font-semibold hover:text-bright-orange hover:border-b hover:border-bright-orange text-grayish-red text-[12px] mr-2"
                        onClick={() => deleteInquiry(index, inquiry.id)}
                      >
                        삭제
                      </button>
                    </>
                  )}
                </div>
                )}
                {userData.role === "ROLE_GYM" && (
                  <div>
                    <button
                      className="hover:font-semibold hover:text-bright-orange hover:border-b hover:border-bright-orange text-grayish-red text-[12px] mr-2"
                      onClick={toggleModal}
                    >
                      답변작성하기
                    </button>
                    {isModalVisible ? <QnaAns toggleModal={toggleModal} /> : ""}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-grayish-red">문의내역이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default QnaList;
