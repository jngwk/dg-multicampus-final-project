import React, { useEffect, useState } from "react";
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
  reply: "",
};

const roles = {
  ROLE_GENERAL: "일반",
  ROLE_GYM: "헬스장",
  ROLE_TRAINER: "트레이너",
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
        setInquiries(inquiriesData.dtoList);
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
        prevInquiries.map((inquiry, i) =>
          i === index ? editedInquiry : inquiry
        )
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
      setInquiries((prevInquiries) =>
        prevInquiries.filter((_, i) => i !== index)
      );
    } catch (error) {
      console.error("Error deleting inquiry:", error);
    }
  };
  const handleReply = async (reply, inquiryId) => {
    try {
      const replyDate = new Date().toISOString().split("T")[0];
      const updatedInquiry = { id: inquiryId, reply, replyDate };
      // Call API to save reply
      await updateInquiry(updatedInquiry);
      setInquiries((prevInquiries) =>
        prevInquiries.map((inquiry) =>
          inquiry.id === inquiryId ? { ...inquiry, reply, replyDate } : inquiry
        )
      );
      toggleModal();
    } catch (error) {
      console.error("Error saving reply:", error);
    }
  };

  if (loading) {
    return <Fallback />;
  }

  return (
    <div className="flex flex-col items-center gap-5 max-h-[86dvh]">
      <div className="mt-8">
        <p className="font-semibold text-xl flex flex-row items-center">
          <div className="mr-1 text-3xl">📮</div> 문의내역
        </p>
      </div>

      <div className="overflow-y-scroll scrollbar border-y-4 border-peach-fuzz border-dotted flex flex-col space-y-5 w-3/4 items-center py-4 mb-4">
        {inquiries.length > 0 ? (
          inquiries.map((inquiry, index) => (
            <div className="flex flex-col w-full justify-between items-center">
              {/* 문의내역 */}
              <div
                className="border-4 border-grayish-red border-opacity-25 rounded-lg flex flex-col justify-center p-2 space-y-2 h-fit w-full "
              >
                {editingIndex === index ? (
                  <div className="h-1/5 font-semibold mx-2 flex flex-col space-y-1">
                    <Input
                      className="text-light-black "
                      value={editedInquiry.title}
                      onChange={(e) =>
                        setEditedInquiry({
                          ...editedInquiry,
                          title: e.target.value,
                        })
                      }
                    />
                    <TextArea
                      width="100%"
                      height="112px"
                      className=" overflow-y-scroll scrollbar text-[13px] border border-opacity-40 border-grayish-red rounded-lg p-2"
                      value={editedInquiry.content}
                      onChange={(e) =>
                        setEditedInquiry({
                          ...editedInquiry,
                          content: e.target.value,
                        })
                      }
                    />
                    <div className="flex flex-row">
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
                    <div className="text-[10px] text-grayish-red">
                      문의일: {inquiry.regDate}
                    </div>
                    <div className="flex flex-row items-center">
                      <div className="mr-2 text-light-black">{inquiry.title}</div>
                      <div className="text-[10px] pr-2 mr-2 text-grayish-red border-r border-grayish-red">
                        {inquiry.userName}
                      </div>
                      <div className="text-[10px] pr-2 mr-2 text-grayish-red border-r border-grayish-red">
                        {inquiry.email}
                      </div>
                      <div className="text-[10px] text-grayish-red overflow-hidden overflow-x-auto">
                        {inquiry.user ? roles[inquiry.user?.role] : "비회원"}
                      </div>
                    </div>
                  </div>
                )}

                {/* 수정 및 삭제 버튼 */}
                <div className="flex flex-col items-end space-y-2">
                  {editingIndex !== index && (
                    <div className="h-28 w-full overflow-y-scroll scrollbar text-[13px] py-2 px-4">
                      {inquiry.content}
                    </div>
                  )}
                  {userData.userName === inquiry.userName && (
                    <div className="flex flex-row">
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
                  {/* {userData.role === "ROLE_ADMIN" && ( */}
                  {userData.role === "ROLE_GYM" && (
                    <div>
                      <button
                        className="hover:font-semibold hover:text-bright-orange hover:border-b hover:border-bright-orange text-grayish-red text-[12px] mr-2"
                        onClick={() => {
                          toggleModal();
                        }}
                      >
                        답변작성하기
                      </button>
                      {isModalVisible && (
                        <QnaAns
                          toggleModal={toggleModal}
                          handleReply={handleReply}
                        />
                      )}
                    </div>
                  )}
                </div>
                {/* 문의답변 */}
                {inquiry.reply ? (
                  <div className="flex flex-col justify-center space-y-2 h-fit w-full border-t border-grayish-red border-opacity-25 py-3">
                    <div className="h-1/5 font-semibold mx-2 flex flex-col space-y-1">
                      <div className="text-[10px] text-grayish-red">
                        답변일: {inquiry.replyDate}
                      </div>
                      <div className="flex flex-row items-center">
                        <div className="mr-2 text-light-black">관리자</div>
                      </div>
                      <div className=" h-28 w-full overflow-y-scroll scrollbar text-[13px] text-gray-500 py-2 px-4">
                        {inquiry.reply}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col justify-center space-y-2 h-fit w-full border-t border-grayish-red border-opacity-25 py-3">
                    <div className="h-1/5 font-semibold mx-2 flex flex-col space-y-1">
                      <div className="text-[10px] text-grayish-red">
                       ... 답변을 기다려주세요 ... ?
                      </div>
                    </div>
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
