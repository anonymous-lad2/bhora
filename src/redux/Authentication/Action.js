import axios from "axios";
import {
  REGISTER_REQUEST, REGISTER_SUCCESS, REGISTER_FAILURE,
  LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE,
  GET_USER_REQUEST, GET_USER_SUCCESS, GET_USER_FAILURE,
  LOGOUT,
  UPDATE_USER_REQUEST, UPDATE_USER_SUCCESS, UPDATE_USER_FAILURE,
  CHANGE_PASSWORD_REQUEST, CHANGE_PASSWORD_SUCCESS, CHANGE_PASSWORD_FAILURE,
  REFRESH_TOKEN_REQUEST, REFRESH_TOKEN_SUCCESS, REFRESH_TOKEN_FAILURE,
} from "./ActionType";
import { api, API_URL } from "../../config/api";


export const registerUser = (reqData) => async (dispatch) => {
    dispatch({ type: REGISTER_REQUEST });
    try {
      const { data } = await axios.post(
        `${API_URL}/user/register`,
        reqData.userData
      );
      if (data.jwt) localStorage.setItem("jwt", data.jwt);
      reqData.navigate("/");
      dispatch({type:REGISTER_SUCCESS, payload: data.jwt})
      console.log("register success", data)
    } catch (error) {
      dispatch({type:REGISTER_FAILURE, payload:error.response.data.message || error.message})
      console.log("error", error);
    }
  };
  
  export const loginUser = (reqData) => async (dispatch) => {
    dispatch({ type: LOGIN_REQUEST });
    try {
      const { data } = await axios.post(
        `${API_URL}/user/login`,
        reqData.userData
      );
      if (data.jwt) localStorage.setItem("jwt", data.jwt);
      reqData.navigate("/")
      dispatch({type:LOGIN_SUCCESS, payload: data.jwt})
      console.log("Login success", data)
    } catch (error) {
      dispatch({type:LOGIN_FAILURE, payload:error.response.data.message || error.message})
      console.log("error", error);
    }
  };
  
  export const getUser = (jwt) => async (dispatch) => {
    dispatch({ type: GET_USER_REQUEST });
    try {
      const { data } = await api.get(
        `/user/getUser`,{
          headers:{
              Authorization:`Bearer ${jwt}`
          }
        }
      );
      dispatch({type:GET_USER_SUCCESS, payload: data.data})
      console.log("user profile", data)
    } catch (error) {
      dispatch({type:GET_USER_FAILURE, payload:error.response.data.message || error.message})
      console.log("error", error);
    }
  };
  
  
  export const logout = (navigate) => async (dispatch) => {
    try {
      localStorage.clear()
      dispatch({type:LOGOUT})
      if(navigate) navigate("/login") 
      console.log("logout success")
    } catch (error) {
      console.log("error during local logout", error);
    }
  };
  
export const updateUser = (reqData, jwt) => async (dispatch) => {
  dispatch({ type: UPDATE_USER_REQUEST });
  try {
    const { data } = await api.put(
      `/user/updateDetails`,
      reqData.userData,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    dispatch({ type: UPDATE_USER_SUCCESS, payload: data.data }); 
    console.log("Update user success", data);
  } catch (error) {
    dispatch({ type: UPDATE_USER_FAILURE, payload: error.response.data.message || error.message });
    console.log("error updating user", error);
  }
};

// 2. Change Password
export const changePassword = (reqData, jwt) => async (dispatch) => {
  dispatch({ type: CHANGE_PASSWORD_REQUEST });
  try {
    const { data } = await api.put(
      `/user/changePassword`, 
      reqData.passwordData,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    dispatch({ type: CHANGE_PASSWORD_SUCCESS, payload: data.message }); 
    console.log("Change password success", data);
  } catch (error) {
    dispatch({ type: CHANGE_PASSWORD_FAILURE, payload: error.response.data.message || error.message });
    console.log("error changing password", error);
  }
};


export const refreshToken = (refreshToken) => async (dispatch) => {
  dispatch({ type: REFRESH_TOKEN_REQUEST });
  
  const headers = {
    Authorization: `Bearer ${refreshToken}`, 
  };
  
  try {
    const { data } = await api.get(`/user/refreshToken`, { headers });
    const newJwt = data.jwt; 
    
    if (newJwt) {
        localStorage.setItem("jwt", newJwt); 
        dispatch({ type: REFRESH_TOKEN_SUCCESS, payload: newJwt });
        console.log("Token refresh success, new JWT saved.");
        return newJwt; 
    } else {
        throw new Error(data.message || "Refresh failed: No new token received.");
    }
  } catch (error) {
    localStorage.clear(); 
    const errorMessage = error.response?.data?.message || error.message;
    
    dispatch({ type: REFRESH_TOKEN_FAILURE, payload: errorMessage });
    console.log("Error refreshing token. Forced logout.", error);
    
    throw error; 
  }
};