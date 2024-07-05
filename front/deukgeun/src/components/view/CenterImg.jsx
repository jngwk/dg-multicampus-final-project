//헬스장 상세페이지 - 헬스장 사진

import React, { useEffect, useState } from 'react';
import { BsChevronCompactLeft, BsChevronCompactRight } from 'react-icons/bs';
import { RxDotFilled } from 'react-icons/rx';
import { GymInfo } from '../../api/gymApi';
import { useLocation } from "react-router-dom";

const CenterImg = ({gymId}) => {
    const location = useLocation();
    const [gymData, setGymData] = useState(null);
    const [imageUrls, setImageUrls] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true); // 이미지 로딩 상태 추가
    // 헬스장사진가져와야함
    useEffect(() => {
        const fetchGymData = async () => {
            try {
                const data = await GymInfo(gymId); // API 경로에 맞게 수정 필요

                 // API 응답 데이터 형식 확인
                 if (data && data.uploadFileName && Array.isArray(data.uploadFileName)) {
                    const fullImageUrls = data.uploadFileName.map(fileName => `${process.env.PUBLIC_URL}/images/${fileName}`);
                    setImageUrls(fullImageUrls);
                    setLoading(false);
                    // console.log('Fetched fullImageUrLs:', fullImageUrls); // 이미지 URL 확인
                    // console.log(`imageUrls: `, imageUrls);
                } else {
                    console.error('Invalid API response:', data);
                }
            } catch (error) {
                console.error('Error fetching gym images:', error);
            }
        };

        if (gymId) {
            fetchGymData();
        }
    }, [gymId]);
    useEffect(() => {
        console.log('Updated imageUrls:', imageUrls); // imageUrls가 업데이트될 때 로그
    }, [imageUrls]); 

    // const UploadFileName = [
    //     {
    //         url: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2620&q=80',
    //     },
    //     {
    //         url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80',
    //     },
    //     {
    //         url: 'https://images.unsplash.com/photo-1661961112951-f2bfd1f253ce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2672&q=80',
    //     },

    //     {
    //         url: 'https://images.unsplash.com/photo-1512756290469-ec264b7fbf87?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2253&q=80',
    //     },
    //     {
    //         url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2671&q=80',
    //     },
    // ];

    const prevSlide = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? imageUrls.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const nextSlide = () => {
        const isLastSlide = currentIndex === imageUrls.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    const goToSlide = (slideIndex) => {
        setCurrentIndex(slideIndex);
    };
    if (loading) {
        return <div>Loading...</div>; // 이미지 로딩 중 표시할 UI
    }

    return (

        <div className="w-full h-[800px] p-5 flex flex-col items-center">
            <div className="my-10">
                <div className="flex flex-col items-center text-center mb-2 font-semibold text-xl">
                    사진
                    <div className="mt-2 w-16 border-b-2 border-grayish-red border-opacity-20"></div>
                </div>
            </div>
            {imageUrls&&imageUrls.length>0&&
            <div className="max-w-[1000px] h-[500px] w-[1000px] relative">
                <div style={{ backgroundImage:  `url(${imageUrls[currentIndex]})` }}
                    className="w-full h-full rounded-2xl bg-center bg-cover duration-500"></div>
                {/*왼쪽 화살표*/}
                <div className="group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
                    <BsChevronCompactLeft onClick={prevSlide} size={30} />
                </div>
                {/*오른쪽 화살표*/}
                <div className="group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
                    <BsChevronCompactRight onClick={nextSlide} size={30} />
                </div>

                <div className='flex top-4 justify-center py-2'>

                    {imageUrls.map((imageUrl, index) => (
                        
                        <div
                            src={imageUrl}
                            key={index}
                            onClick={() => goToSlide(index)}
                            className='text-2xl cursor-pointer'
                        >
                            <RxDotFilled />
                        </div>
                    ))}
                </div>
            </div>
            }
        </div>
    );
};

export default CenterImg;