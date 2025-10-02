import {
  GET_USER_FAILURE,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT, 
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE,
  REGISTER_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REFRESH_TOKEN_REQUEST,
  REFRESH_TOKEN_SUCCESS,
  REFRESH_TOKEN_FAILURE,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAILURE,
  CHANGE_PASSWORD_REQUEST,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_FAILURE,
} from "./ActionType";

const initialState = {
  user: null,
  isLoading: false,
  error: null,
  jwt: null, // Stores the Access Token (or JWT)
  refreshToken: null, // New field to store the Refresh Token
  success: null, // For general success messages (e.g., "Password Updated Successfully")
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    // --- REQUEST CASES (Set isLoading to true, clear old error/success) ---
    case REGISTER_REQUEST:
    case LOGIN_REQUEST:
    case GET_USER_REQUEST:
    case REFRESH_TOKEN_REQUEST:
    case UPDATE_USER_REQUEST:
    case CHANGE_PASSWORD_REQUEST:
    case LOGOUT_REQUEST:
      return { ...state, isLoading: true, error: null, success: null };

    // --- LOGIN & REGISTER SUCCESS (Get JWT) ---
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      // Assuming action.payload is an object: { token: '...', refreshToken: '...' }
      return {
        ...state,
        isLoading: false,
        jwt: action.payload.token,
        refreshToken: action.payload.refreshToken || state.refreshToken, // Keep existing if not provided
        success: "Successful",
      };

    // --- GET USER & UPDATE USER SUCCESS (Update user object) ---
    case GET_USER_SUCCESS:
    case UPDATE_USER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        user: action.payload,
        success: action.type === UPDATE_USER_SUCCESS ? "Details Updated Successfully" : null
      };
      
    // --- REFRESH TOKEN SUCCESS (Update JWT only) ---
    case REFRESH_TOKEN_SUCCESS:
      // Assuming action.payload is the new access token string
      return {
        ...state,
        isLoading: false,
        jwt: action.payload,
        error: null,
      };
      
    // --- CHANGE PASSWORD SUCCESS (Display success message) ---
    case CHANGE_PASSWORD_SUCCESS:
        return {
            ...state,
            isLoading: false,
            success: "Password Changed Successfully",
            error: null,
        };

    // --- LOGOUT CASES (Clear state) ---
    case LOGOUT: // Synchronous (local) logout
    case LOGOUT_SUCCESS: // Asynchronous (server) logout success
      return initialState;

    // --- FAILURE CASES (Set error message) ---
    case REGISTER_FAILURE:
    case LOGIN_FAILURE:
    case GET_USER_FAILURE:
    case REFRESH_TOKEN_FAILURE:
    case UPDATE_USER_FAILURE:
    case CHANGE_PASSWORD_FAILURE:
    case LOGOUT_FAILURE: // Even if server logout fails, we still want to clear local data
      // For failure, we typically clear tokens locally (especially on refresh failure)
      // but keep the state for debugging/displaying the error.
      const failureState = { ...state, isLoading: false, error: action.payload, success: null };
      
      // If refresh token fails, we should clear the tokens, forcing a full login
      if (action.type === REFRESH_TOKEN_FAILURE || action.type === LOGOUT_FAILURE) {
        return initialState; 
      }
      
      return failureState;

    // --- DEFAULT ---
    default:
      return state;
  }
};