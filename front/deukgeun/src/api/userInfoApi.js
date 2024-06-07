import axios from "axios";
const prefix = `/api`; // proxy 사용

export const userInfo = async (email) => {
    try {
        const response = await axios.get(`${prefix}/userInfo`, {
            params: { email }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching user info:", error);
        throw error;
    }
};