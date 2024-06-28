import { useState, useEffect } from "react";
import axios from "axios";

const useIamport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.iamport.kr/js/iamport.payment-1.1.5.js";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);
  const requestPayment = (paymentData) => {
    return new Promise((resolve, reject) => {
      const { IMP } = window;
      if (!IMP) {
        reject(new Error("IMP 객체가 초기화되지 않았습니다."));
        return;
      }

      IMP.init("imp80562260");

      console.log("Requesting payment with data:", paymentData); // Payment request log

      paymentData.pg = "html5_inicis";

      IMP.request_pay(paymentData, (rsp) => {
        console.log("Payment response:", rsp); // Payment response log
        if (rsp.success) {
          resolve({
            success: true,
            impUid: rsp.imp_uid,
          });
        } else {
          reject({
            success: false,
            error: rsp.error_msg,
          });
        }
      });
    });
  };

  const verifyPayment = async (impUid) => {
    setLoading(true);
    try {
      const response = await axios.post(`/api/payment/verify/${impUid}`, {});

      console.log("Verify payment response:", response.data); // Verify payment response log

      return response.data;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { verifyPayment, loading, error };
};

export default useIamport;