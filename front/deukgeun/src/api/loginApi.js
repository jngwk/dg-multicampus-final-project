import axios from "axios";
export const API_SERVER_HOST = "http://localhost:8282";
const prefix = `${API_SERVER_HOST}/api`;
// const prefix = `/api`; // proxy 사용

export const login = async (email, password) => {
    try {
        const response = await axios.post('/api/login', { email, password });
        if (response.data.role === 'ROLE_GYM') {
          const gymResponse = await axios.post('/api/gym/login', { email, password });
          return gymResponse.data;
        }
        return response.data;
    } catch (error) {
        throw new Error('로그인 실패: ' + error.message);
    }
};