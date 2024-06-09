import React from "react";
import logo from "../assets/dg_logo_small.png";

const EmailTemplate = ({ verificationCode }) => {
  return (
    <html>
      <head>
        <style>
          {`
          body {
            font-family: 'Noto Sans KR', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f6f6f6;
            color: #333;
          }
          `}
        </style>
      </head>
      <body>
        <div className="max-w-lg mx-auto p-4 bg-white border border-gray-200 rounded-lg shadow">
          <div className="text-center py-4 border-b border-gray-200">
            <img src={logo} alt="Logo" className="max-w-xs mx-auto" />
          </div>
          <div className="p-4">
            <h1 className="text-2xl font-semibold mb-4">이메일 인증</h1>
            <p className="text-lg mb-4">
              득근을 찾아주셔서 감사합니다. 아래 인증번호를 입력해 이메일을
              인증해주세요:
            </p>
            <div className="text-center my-4">
              <span className="block text-xl font-bold text-blue-600">
                {verificationCode}
              </span>
            </div>
            <p className="text-lg">
              인증번호 요청을 하지 않으셨다면 해당 이메일을 무시해주시기
              바랍니다.
            </p>
          </div>
          <div className="text-center py-4 text-gray-500 border-t border-gray-200">
            <p>&copy; 2024 DeukGeun. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  );
};

export default EmailTemplate;
