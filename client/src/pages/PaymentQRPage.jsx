import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";

export default function PaymentQRPage() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    if (id) {
      axios.get(`/bookings/${id}`).then((response) => {
        setBooking(response.data);
      }).catch((error) => {
        console.error("Error fetching booking data:", error);
      });
    }
  }, [id]);

  const PayBooking = async (id) => {
    try {
      await axios.patch(`/bookings/${id}`, { pay: false });
      // Sau khi gửi yêu cầu thanh toán thành công, bạn có thể thực hiện các hành động khác nếu cần
    } catch (error) {
      console.error("Error sending payment request:", error);
    }
  };

  const renderFunctionPay = (booking) => {
    if (booking && booking.pay === false) {
      return <span className="text-red-500 font-bold mr-3">Đã gửi yêu cầu thanh toán</span>;
    } else if (booking && booking.pay === null) {
      return (
        <button
          onClick={() => PayBooking(booking._id)}
          className="p-2 max-w-full gap-4 mt-5 mb-10 bg-primary text-red-500 rounded-2xl font-bold"
        >
          Thanh toán
        </button>
      );
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-center">Thanh Toán QR</h2>
        <div>
         <img src="https://i.pinimg.com/564x/6f/43/0d/6f430d5a7d75ed2bad673ad301114625.jpg"/>
        </div>
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold">Tổng cộng:</h3>
          <p className="text-xl">{booking && booking.price}.000 VND</p>
        </div>
        <div className="text-center">
          {renderFunctionPay(booking)}
        </div>
      </div>
    </div>
  );
}

PaymentQRPage.propTypes = {
  price: PropTypes.number.isRequired,
};
