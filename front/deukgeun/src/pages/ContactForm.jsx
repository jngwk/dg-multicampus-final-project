import React, { useState } from "react";
import TextArea from "../components/shared/TextArea";
import Input from "../components/shared/Input";
import Button from "../components/shared/Button";
import { useAuth } from "../context/AuthContext";
import useValidation from "../hooks/useValidation";

const initState = {
  userName: "",
  email: "",
  title: "",
  content: "",
};

const ContactForm = () => {
  const { user } = useAuth();
  const [formValues, setFormValues] = useState(initState);
  const { errors, validateForm } = useValidation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    if (!validateForm(formValues)) return;
    try {
      console.log("문의내역 DB에 기입하기");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mx-auto xl:grid xl:grid-cols-2 xl:translate-y-[30%] xl:w-[1000px] flex-col flex justify-center items-center translate-y-[10%]">
      <div className="w-[400px] p-11">
        <header className=" text-5xl mb-11 font-bold">문의하기</header>
        <div className="flex flex-col gap-6">
          <p className="w-80">득근을 방문에 주셔서 감사합니다.</p>
          <p className="w-80">
            문의하실 내용을 남겨주시면 영업일 기준 <br />
            48시간 이내에 답변을 드리겠습니다.
          </p>
          <p className="w-80">
            이메일로 답변 알림을 보내드리니, <br />
            확인 부탁드립니다.
          </p>
        </div>
      </div>
      <div className="w-[472px] h-fit mx-auto border-2 border-peach-fuzz rounded-md p-9">
        <span className="block text-5xl mb-4">🙋‍♀️</span>
        {!user && (
          <div className="flex justify-between w-[400px]">
            <Input
              label="이름"
              required={true}
              width="140px"
              value={formValues.userName}
              onChange={handleChange}
              error={errors.userName}
            />
            <Input
              label="이메일"
              required={true}
              width="240px"
              value={formValues.email}
              onChange={handleChange}
              error={errors.email}
            />
          </div>
        )}
        <div className="text-right">
          <Input
            label="제목"
            required={true}
            width="400px"
            value={formValues.title}
            onChange={handleChange}
            error={errors.title}
          />
          <TextArea
            label="문의내용"
            required={true}
            value={formValues.content}
            onChange={handleChange}
            error={errors.content}
          />
          <Button label="완료" width="180px" onClick={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
