import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReviewList = ({ gymId }) => {
  const [reviews, setReviews] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:8282/api/reviews/reviewList/${gymId}`, {
          headers: {
            'Content-Type': 'application/json',
            // 필요한 경우 인증 토큰을 여기에 추가하세요
            // 'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
          },
          withCredentials: true
        });
        setReviews(response.data);
      } catch (error) {
        if (error.response) {
          // 요청이 만들어졌고 서버가 응답함
          console.error('Error Response:', error.response.data);
          console.error('Error Status:', error.response.status);
          console.error('Error Headers:', error.response.headers);
          setMessage(`Failed to fetch reviews: ${error.response.status}`);
        } else if (error.request) {
          // 요청이 만들어졌으나 응답을 받지 못함
          console.error('Error Request:', error.request);
          setMessage('Failed to fetch reviews: No response from server.');
        } else {
          // 요청 설정 중에 문제가 발생함
          console.error('Error Message:', error.message);
          setMessage(`Failed to fetch reviews: ${error.message}`);
        }
      }
    };

    fetchReviews();
  }, [gymId]);

  return (
    <div>
      <h2>Reviews for Gym {gymId}</h2>
      {message && <p style={{ color: 'red' }}>{message}</p>}
      <ul>
        {reviews.map((review) => (
          <li key={review.id}>
            <p>Rating: {review.rating}</p>
            <p>Comment: {review.comment}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReviewList;
