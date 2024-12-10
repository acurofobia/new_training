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
    console.log(response.data)
    return response.data;
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