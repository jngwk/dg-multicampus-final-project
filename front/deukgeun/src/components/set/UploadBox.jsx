//센터이미지 업로드박스
import React, { useState } from "react";
import { RiFolderUploadFill } from "react-icons/ri";
import { PiXCircle } from "react-icons/pi";

const Logo = () => (
  <RiFolderUploadFill className="w-24 h-24 pointer-events-none" />
);

const UploadBox = ({name, required, onChange }) => {
  const [previewSrcList, setPreviewSrcList] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 12 - previewSrcList.length); // 최대 12장까지만 추가
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewSrcList((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file); // 'files'라는 이름으로 파일 추가
    });

    // 부모 컴포넌트로 변경된 파일 리스트 전달
    onChange(formData.getAll('files'));
  };

  const handleRemovePreview = (index) => {
    setPreviewSrcList((prev) => prev.filter((_, i) => i !== index));
    // Call the onChange callback to update parent component state
    const updatedFiles = previewSrcList.filter((_, i) => i !== index);
    onChange(updatedFiles);
  };

  return (
    <div className="w-full pb-3 overflow-y-hidden overflow-x-auto flex flex-col flex-nowrap gap-4 scrollbar">
    
      <div className="flex-shrink-0 w-fit h-fit">
        <label className="flex flex-col justify-center items-center w-44 h-36 bg-white rounded-md border border-gray-400 border-dashed p-4 overflow-hidden cursor-pointer hover:border-bright-orange">
          <input type="file" name={name} required={required} accept="images/*" className="hidden" onChange={handleFileChange} multiple />
          <Logo />
          <p className="font-medium text-center text-sm my-3 pre-line">
            클릭하여 파일을 <br />
            이곳에 가져오세요.
          </p>
          <p className="m-0 text-xs">파일당 최대 3MB</p>
        </label>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {previewSrcList.map((src, index) => (
          <div key={index} className="relative w-fit h-fit">
            <div className="flex flex-col justify-center items-center">
              <img src={src} alt="미리보기" className="w-24 h-24 object-cover rounded-lg border" />
              <button
                className="w-6 h-6 flex justify-center items-center absolute top-1 right-1 rounded-full text-red-300 hover:bg-red-300 hover:text-white transition duration-300"
                onClick={() => handleRemovePreview(index)}
              >
                <PiXCircle />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadBox;
