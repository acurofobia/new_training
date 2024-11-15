import axios from "axios";
import { refreshAccessToken } from "./refresh_logout";
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

export const protected_fetch = async (string) => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const response = await axios.get(string, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    return response.data.last_answered
  } catch (error) {
    if (error.status == 401) {
      const result = await refreshAccessToken();
      if (result == "OK") {
        protected_fetch();
      } else {
        navigate(`${result}`);
      }
    } else {
      console.log(error);
    }
  }
}