import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import AddressLink from "../AddressLink";
import PlaceGallery from "../PlaceGallery";
import BookingDates from "../BookingDates";

export default function BookingPage() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    if (id) {
      axios.get("/bookings").then((response) => {
        const foundBooking = response.data.find(({ _id }) => _id === id);
        if (foundBooking) {
          setBooking(foundBooking);
        }
      });
    }
  }, [id]);
  const renderFunctionColumn = (booking) => {
    if (booking.cancel === null) {
      return <span></span>;
    } else if (booking.cancel === false) {
      return (
        <span className="text-green-500 font-bold">Yêu cầu hủy phòng</span>
      );
    } else if (booking.cancel) {
      return <span className="text-red-500 font-bold">Đã hủy</span>;
    }
  };
  const renderFunctionPay = (booking) => {
    if (booking.cancel === true) {
      return <span></span>;
    } else if (booking.pay === null) {
      return  <div className="text-center">
      <span className="text-red-500 font-bold ">Chưa thanh toán </span>
      <div className="bg-primary p-2 my-2 rounded-2xl flex items-center justify-between text-center">

      <Link
        to={`/account/bookings/${id}/${booking.price}`}
        className="p-6 text-white rounded-2xl"
      >
        <div>Tổng tiền</div>
        <div className="text-3xl">{booking.price}.000VND</div>
      </Link>
      </div>
    </div>;
    } else if (booking.pay === false) {
      return (
        <div className="text-center">
          <span className="text-red-500 font-bold text-center">Yêu cầu xác nhận</span>
          <div className="bg-primary p-2 my-2 rounded-2xl flex items-center justify-between text-center">

          <Link
            to={`/account/bookings/${id}/${booking.price}`}
            className=" p-6 text-white rounded-2xl"
          >
            <div>Tổng tiền</div>
            <div className="text-3xl">{booking.price}.000VND</div>
          </Link>
          </div>
        </div>
      );
    } else if (booking.pay) {
      return <span className="text-green-500 font-bold">Đã thanh toán</span>;
    }
  };

  if (!booking) {
    return "";
  }

  return (
    <div className="my-8">
      <h1 className="text-3xl">{booking.place.title}</h1>
      <AddressLink className="my-2 block">{booking.place.address}</AddressLink>
      <div className="bg-gray-200 p-6 my-6 rounded-2xl flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-4">
            Thông tin đặt phòng của bạn: {renderFunctionColumn(booking)} 
            
          </h2>

          <BookingDates booking={booking} />
          
        </div>
        <div className="">{renderFunctionPay(booking)}</div>
      </div>
      <PlaceGallery place={booking.place} />
    </div>
  );
}
