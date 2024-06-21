import React, { useState } from 'react';
import axios from 'axios';

const DeleteReview = () => {
  const [reviewId, setReviewId] = useState('');
  const [message, setMessage] = useState('');

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:8282/api/reviews/delete/${reviewId}`, {
        headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIyOSIsInJvbGUiOiJST0xFX0dFTkVSQUwiLCJleHAiOjE3MTg3NjQ0NTAsImlhdCI6MTcxODY3ODA1MH0.l3KOuhsPDlq7pFs18WvumvRjd3qugPIqv2BE9Somptk',
        },
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Failed to delete review.');
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h2>Delete Review</h2>
      <input type="text" placeholder="Enter Review ID" value={reviewId} onChange={(e) => setReviewId(e.target.value)} />
      <button onClick={handleDelete}>Delete Review</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default DeleteReview;