import { createContext, useState } from "react";
import API from "../utility/api";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  
  const login = async (email, password) => {
    try {
      // Create FormData to match FastAPI's OAuth2PasswordRequestForm
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);

      // Get token
      const response = await API.post("/login", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const token = response.data.access_token;
      
      // Get user data from /current-user endpoint
      const userResponse = await API.get("/current-user", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const userData = userResponse.data;
      setUser(userData);
      setToken(token);
      localStorage.setItem("token", token);

      return userData;
    } catch (error) {
      console.error('Login Error:', error);
      
      // More detailed error handling
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const errorMessage = error.response.data?.detail || 
                             error.response.data?.message || 
                             "Login failed. Please try again.";
        throw new Error(errorMessage);
      } else if (error.request) {
        // The request was made but no response was received
        throw new Error("No response received from server. Please check your connection.");
      } else {
        // Something happened in setting up the request that triggered an Error
        throw new Error("Error setting up login request. Please try again.");
      }
    }
  }

  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("token");
  };

  const sendOTP = async (email) => {
    try {
      const response = await API.post("/register/send-otp", { email });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail || "Failed to send OTP. Try again later.";
      throw new Error(errorMessage);
    }
  };

  const verifyOtpAndRegister = async (formData) => {
    try {
      const response = await API.post("/register/verify-otp", formData);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail ||
        "Registration failed. Please try again.";
      throw new Error(errorMessage);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, sendOTP, verifyOtpAndRegister }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
