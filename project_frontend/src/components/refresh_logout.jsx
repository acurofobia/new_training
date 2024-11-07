import axios from "axios";

const handleLogout = async () => {
  try {
    await axios.post('/api/logout',{}, { headers: { Authorization: `Bearer ${refreshToken}` } });
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    return "/login_requiered";
  } catch (error) {
    console.error("Logout failed", error);
    return "/login_requiered";
  }
};

export const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await axios.post('/api/refresh', {}, { headers: { Authorization: `Bearer ${refreshToken}` } });
    localStorage.setItem('accessToken', response.data.access_token);
    return await "OK";
  } catch (error) {
    console.error("Token refresh failed", error);
    return await handleLogout();
  }
};