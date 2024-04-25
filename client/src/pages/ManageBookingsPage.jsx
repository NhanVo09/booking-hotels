import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";

export default function ManageBookingsPage() {
  const [data, setData] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("/owners-places-bookings");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const cancelBooking = async (id) => {
    await axios.patch(`/bookings/${id}`, { cancel: true });
    fetchData();
  };

  const renderFunctionColumn = (booking) => {
    if (booking.cancel === null) {
      return <span></span>;
    } else if (booking.cancel === false) {
      return (
        <div>
          <span className="text-green-500 font-bold">Yêu cầu hủy phòng</span>
          <button
            onClick={() => cancelBooking(booking._id)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md mr-2 ml-3"
          >
            Duyệt
          </button>
        </div>
      );
    } else if (booking.cancel) {
      return <span className="text-red-500 font-bold">Đã hủy</span>;
    }
  };
  const payBooking = async (id) => {
    await axios.patch(`/bookings/${id}`, { pay: true });
    fetchData();
  };
  const renderFunctionPay = (booking) => {
    if (booking.cancel === true) {
      return <span></span>;
    } else if (booking.pay === null) {
      return <span className="text-red-500 font-bold">Chưa thanh toán</span>;
    } else if (booking.pay === false) {
      return (
        <div>
          <span className="text-red-500 font-bold">Yêu cầu xác nhận</span>
          <button
            onClick={() => payBooking(booking._id)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md mr-2 ml-3"
          >
            Duyệt
          </button>
        </div>
      );
    } else if (booking.pay) {
      return <span className="text-green-500 font-bold">Đã thanh toán</span>;
    }
  };

  return (
    <div>
      <div className="max-w-4xl mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-4 text-center">Quản lý Booking</h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-primary text-white uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-center">Khách hàng</th>
                <th className="py-3 px-6 text-center">Khách sạn</th>
                <th className="py-3 px-6 text-center">Thời gian đặt phòng</th>
                <th className="py-3 px-6 text-center">Thanh toán</th>
                <th className="py-3 px-6 text-center">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="text-sm font-light">
              {data.map(
                (item) =>
                  user.name === item.owner.name && (
                    <tr
                      key={item.booking._id}
                      className="border-b border-gray-200"
                    >
                      <td className="py-3 px-6 text-center">
                        {item.booking.name}
                      </td>
                      <td className="py-3 px-6 text-center">
                        {item.place.title}
                      </td>
                      <td className="py-3 px-6 text-center">
                        {new Date(item.booking.checkIn).toLocaleDateString()} -{" "}
                        {new Date(item.booking.checkOut).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-6 text-center">
                        {renderFunctionPay(item.booking)}
                      </td>
                      <td className="py-3 px-6 text-center">
                        {renderFunctionColumn(item.booking)}
                      </td>
                    </tr>
                  )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
