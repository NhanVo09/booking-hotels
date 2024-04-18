import { useContext, useEffect, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext.jsx";
import PropTypes from "prop-types";

export default function BookingWidget({ place }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [room, setRoom] = useState("");
  const [redirect, setRedirect] = useState("");
  const { user } = useContext(UserContext);

    // function handleCbClick(ev) {
    //   const { checked, name } = ev.target;
    //   const { selected =[], onChange } = ev.target;
    //   if (checked) {
    //     onChange([...selected, name]);
    //   } else {
    //     onChange([...selected.filter((selectedName) => selectedName !== name)]);
    //   }
    // }
  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  let numberOfNights = 0;
  if (checkIn && checkOut) {
    numberOfNights = differenceInCalendarDays(
      new Date(checkOut),
      new Date(checkIn)
    );
  }

  async function bookThisPlace() {
    const response = await axios.post("/bookings", {
      checkIn,
      checkOut,
      numberOfGuests,
      name,
      phone,
      room,
      place: place._id,
      price: numberOfNights * place.price,
    });
    const bookingId = response.data._id;
    setRedirect(`/account/bookings/${bookingId}`);
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div className="bg-white shadow p-4 rounded-2xl">
      <div className="text-2xl text-center">
        Giá phòng: {place.price}.000 VND/đêm
      </div>
      <div className="border rounded-2xl mt-4">
        <div className="flex">
          <div className="py-3 px-4">
            <label>Ngày đi:</label>
            <input
              type="date"
              value={checkIn}
              onChange={(ev) => setCheckIn(ev.target.value)}
            />
          </div>
          <div className="py-3 px-4 border-l">
            <label>Ngày về:</label>
            <input
              type="date"
              value={checkOut}
              onChange={(ev) => setCheckOut(ev.target.value)}
            />
          </div>
        </div>
        <div className="py-3 px-4 border-t">
          <label>Số lượng khách:</label>
          <input
            type="number"
            value={numberOfGuests}
            onChange={(ev) => setNumberOfGuests(ev.target.value)}
          />
        </div>
        <div className="border p-4 rounded-2xl gap-2 items-center cursor-pointer mt-2">
          <div className="py-3 px-4 border-l ">
            <input
              type="checkbox"
              value={room}
              name = "Phòng đơn"
              onChange={(ev) => setRoom(ev.target.name)}
            />
            <label>Phòng đơn:</label>
          </div>
          <div className="py-3 px-4 border-l">
            <input
              type="checkbox"
              value={room}
              name = "Phòng đôi"
              onChange={(ev) => setRoom(ev.target.name)}
            />
            <label>Phòng đôi:</label>
          </div>
        </div>
        {numberOfNights > 0 && (
          <div className="py-4 px-4 border-t">
            <label>Họ và tên:</label>
            <input
              type="text"
              value={name}
              onChange={(ev) => setName(ev.target.value)}
            />
            <label>Số điện thoại:</label>
            <input
              type="tel"
              value={phone}
              onChange={(ev) => setPhone(ev.target.value)}
            />
          </div>
        )}
      </div>
      <button onClick={bookThisPlace} className="primary mt-4">
        ĐẶT PHÒNG
        {numberOfNights > 0 && (
          <span> {numberOfNights * place.price}.000 VND</span>
        )}
      </button>
    </div>
  );
}
BookingWidget.propTypes = {
  place: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
  }).isRequired,
};
