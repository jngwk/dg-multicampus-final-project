import React, { useState } from 'react';
import axios from 'axios';

const ReviewForm = () => {
  const [gymId, setGymId] = useState('');
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [reviewId, setReviewId] = useState('');
  const [message, setMessage] = useState('');

  const handleAddSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:8282/api/reviews/add',
        {
          gymId: parseInt(gymId),
          rating: parseInt(rating),
          comment: comment
        },
        {
          headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIyOCIsInJvbGUiOiJST0xFX0FETUlOIiwiZXhwIjoxNzE4Nzc3NDkyLCJpYXQiOjE3MTg2OTEwOTJ9.gUONCbg-himZrulODOEvweTDxorvz0EfLlKw8hmGn9c',
            'Content-Type': 'application/json'
          }
        }
      );
      setMessage('Review added successfully.');
      // 추가 후 필드 초기화
      setGymId('');
      setRating('');
      setComment('');
    } catch (error) {
      setMessage('Failed to add review.');
      console.error('Error:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:8282/api/reviews/delete/${reviewId}`,
        {
          headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIyOCIsInJvbGUiOiJST0xFX0FETUlOIiwiZXhwIjoxNzE4Nzc3NDkyLCJpYXQiOjE3MTg2OTEwOTJ9.gUONCbg-himZrulODOEvweTDxorvz0EfLlKw8hmGn9c',
            'Content-Type': 'application/json'
          }
        }
      );
      setMessage('Review deleted successfully.');
      // 삭제 후 필드 초기화
      setReviewId('');
    } catch (error) {
      setMessage('Failed to delete review.');
      console.error('Error:', error);
    }
  };

  const handleUpdateSubmit = async (event) => {
    event.preventDefault();

    const reviewData = {
      id: parseInt(reviewId), // reviewId를 id로 수정
      rating: parseInt(rating),
      comment: comment
    };

    try {
      const response = await axios.put(
        `http://localhost:8282/api/reviews/update/${reviewData.id}`, // 업데이트 URL 수정
        reviewData,
        {
          headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIyOCIsInJvbGUiOiJST0xFX0FETUlOIiwiZXhwIjoxNzE4Nzc3NDkyLCJpYXQiOjE3MTg2OTEwOTJ9.gUONCbg-himZrulODOEvweTDxorvz0EfLlKw8hmGn9c',
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        setMessage('Review updated successfully.');
      } else {
        setMessage('Failed to update review.');
        console.error('Error:', response);
      }
    } catch (error) {
      setMessage('Failed to update review.');
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h2>Add Review</h2>
      <form onSubmit={handleAddSubmit}>
        <label htmlFor="gymId">Gym ID:</label><br />
        <input type="number" id="gymId" value={gymId} onChange={(e) => setGymId(e.target.value)} required /><br /><br />

        <label htmlFor="rating">Rating (1-5):</label><br />
        <input type="number" id="rating" value={rating} onChange={(e) => setRating(e.target.value)} min="1" max="5" required /><br /><br />

        <label htmlFor="comment">Comment:</label><br />
        <textarea id="comment" value={comment} onChange={(e) => setComment(e.target.value)} rows="4" cols="50" required /><br /><br />

        <button type="submit">Submit Review</button>
      </form>

      <br />
      <h2>Update Review</h2>
      <form onSubmit={handleUpdateSubmit}>
        <label htmlFor="reviewId">Review ID:</label><br />
        <input type="number" id="reviewId" value={reviewId} onChange={(e) => setReviewId(e.target.value)} required /><br /><br />

        <label htmlFor="rating">New Rating (1-5):</label><br />
        <input type="number" id="rating" value={rating} onChange={(e) => setRating(e.target.value)} min="1" max="5" required /><br /><br />

        <label htmlFor="comment">New Comment:</label><br />
        <textarea id="comment" value={comment} onChange={(e) => setComment(e.target.value)} rows="4" cols="50" required /><br /><br />

        <button type="submit">Update Review</button>
      </form>

      <br />
      <h2>Delete Review</h2>
      <label htmlFor="reviewId">Review ID:</label><br />
      <input type="number" id="reviewId" value={reviewId} onChange={(e) => setReviewId(e.target.value)} required /><br /><br />
      <button onClick={handleDelete}>Delete Review</button>

      {message && <p style={{ color: message.includes('successfully') ? 'green' : 'red' }}>{message}</p>}
    </div>
  );
};

export default ReviewForm;
