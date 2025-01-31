import axios from "axios";
import { refreshAccessToken } from "./refresh_logout";

export const protected_fetch = async (navigate, method, url, accessToken, data=null) => {
  try {
    const response = await axios({
      url: url,
      method: method,
      data: data,
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    return response;
  } catch (error) {
    if (error.status == 401) {
      const result = await refreshAccessToken();
      if (result == "OK") {
        const accessToken = localStorage.getItem('accessToken');
        console.log("Token refreshed");
        return protected_fetch(navigate, method, url, accessToken, data);
      } else {
        navigate(`${result}`);
      }
    } else {
      console.log(error, "Error occured in protected fetch");
    }
  }
}