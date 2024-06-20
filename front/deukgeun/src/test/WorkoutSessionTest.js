import React, { useEffect, useState } from 'react';
import axios from 'axios';

const WorkoutSessionTest = () => {
  const [workoutSessions, setWorkoutSessions] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8282/api/workoutSession/2024-06')
      .then(response => {
        setWorkoutSessions(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error);
      });
  }, []);

  return (
    <div>
      <h1>Workout Sessions for June 2024</h1>
      <table border="1">
        <thead>
          <tr>
            <th>Workout Session ID</th>
            <th>User ID</th>
            <th>PT Session ID</th>
            <th>Workout Date</th>
            <th>Content</th>
            <th>Body Weight</th>
            <th>Memo</th>
          </tr>
        </thead>
        <tbody>
          {workoutSessions.map(session => (
            <tr key={session.workoutSessionId}>
              <td>{session.workoutSessionId}</td>
              <td>{session.userId || 'N/A'}</td>
              <td>{session.ptSessionId || 'N/A'}</td>
              <td>{session.workoutDate}</td>
              <td>{session.content}</td>
              <td>{session.bodyWeight || 'N/A'}</td>
              <td>{session.memo || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
