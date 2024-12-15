import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const { sendOTP, verifyOtpAndRegister } = useContext(AuthContext);
  const navigate = useNavigate(); 
  const [step, setStep] = useState(1); // Step 1: Email, Step 2: OTP Verification
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [formData, setFormData] = useState({ name: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ error: "", success: "" });

  const handleSendOTP = async () => {
    setLoading(true);
    setFeedback({ error: "", success: "" });

    try {
      const result = await sendOTP(email);
      setFeedback({ success: result.message });
      setStep(2);
    } catch (err) {
      setFeedback({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    setFeedback({ error: "", success: "" });
    

    try {
      const result = await verifyOtpAndRegister({ ...formData, email, otp });
      setFeedback({ success: result.message });
      
      // Navigate to login page after successful registration
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setFeedback({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {step === 1 && (
        <div>
          <h2>Register</h2>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleSendOTP} disabled={loading}>
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2>Verify OTP</h2>
          <input
            type="text"
            placeholder="Enter your OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter your name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <button onClick={handleVerifyOTP} disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP and Register"}
          </button>
        </div>
      )}

      {feedback.error && <p style={{ color: "red" }}>{feedback.error}</p>}
      {feedback.success && <p style={{ color: "green" }}>{feedback.success}</p>}
    </div>
  );
};

export default Register;
