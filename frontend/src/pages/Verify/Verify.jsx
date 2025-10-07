import React, { useContext, useEffect } from 'react';
import './Verify.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const { url, token } = useContext(StoreContext); // include token if needed
  const navigate = useNavigate();

  const verifyPayment = async () => {
    try {
      const response = await axios.post(
        url + "/api/order/verify",
        { success, orderId },
        { headers: { token } } // send token if your API needs authentication
      );

      if (response.data.success) {
        navigate("/myorders");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Payment verification failed:", error);
      navigate("/");
    }
  };

  useEffect(() => {
    if (success !== null && orderId) {
      verifyPayment();
    } else {
      navigate("/"); // fallback if params missing
    }
  }, [success, orderId]);

  return (
    <div className="verify">
      <div className="spinner"></div>
      <p>Verifying your payment, please wait...</p>
    </div>
  );
};

export default Verify;
