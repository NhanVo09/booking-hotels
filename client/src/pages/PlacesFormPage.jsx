import { useEffect, useState } from "react";
import Perks from "../Perks";
import PhotoUploader from "../PhotoUploader";
import axios from "axios";
import AccountNav from "../AccountNav";
import { Navigate, useParams } from "react-router-dom";

export default function PlacesFormPage() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [addedPhoto, setAddedPhoto] = useState([]);
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuest] = useState(1);
  const [price, setPrice]= useState("")
  const [redirect, setRedirect] = useState(false);
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/places/" + id).then(response => {
      const { data } = response;
      setTitle(data.title);
      setAddress(data.address);
      setAddedPhoto(data.photo);
      setDescription(data.description);
      setPerks(data.perks);
      setExtraInfo(data.extraInfo);
      setCheckIn(data.checkIn);
      setCheckOut(data.checkOut);
      setMaxGuest(data.maxGuests);
      setPrice(data.price);
    });
  }, [id]);
  function inputHeader(text) {
    return <h2 className="text-2xl mt-4">{text}</h2>;
  }

  function preInput(header) {
    return <>{inputHeader(header)}</>;
  }
  async function savePlace(ev) {
    ev.preventDefault();
    const PlaceData = {
      title,
      address,
      addedPhoto,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    };
    if (id) {
      await axios.put("/places", {
        id,
        ...PlaceData,
      });
      setRedirect(true);
    } else {
      await axios.post("/places", PlaceData);
      setRedirect(true);
    }
  }
  if (redirect) {
    return <Navigate to={"/account/places"} />;
  }
  return (
    <div>
      <AccountNav />
      <form onSubmit={savePlace}>
        {preInput("Tên khách sạn")}
        <input
          type="text"
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
          placeholder="Tên khách sạn"
        />
        {preInput("Địa chỉ")}
        <input
          type="text"
          value={address}
          onChange={(ev) => setAddress(ev.target.value)}
          placeholder="Địa chỉ"
        />
        {preInput("Hình ảnh")}

        <PhotoUploader addedPhoto={addedPhoto} onChange={setAddedPhoto} />

        {preInput("Mô tả")}
        <textarea
          value={description}
          onChange={(ev) => setDescription(ev.target.value)}
        />
        {preInput("Tiện nghi")}
        <div className="grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <Perks selected={perks} onChange={setPerks} />
        </div>
        {preInput("Thông tin thêm")}
        <textarea
          value={extraInfo}
          onChange={(ev) => setExtraInfo(ev.target.value)}
        />
        {preInput("Thời gian ra vào và số lượng khách tối đa")}
        <div className="grid sm:grid-cols-3 md:grid-cols-4">
          <div>
            <h3 className="mt-2 mb-1">Check-in</h3>
            <input
              className="border flex rounded-2xl gap-2 items-center  mt-2 -mb-1"
              type="text"
              placeholder="11:00"
              value={checkIn}
              onChange={(ev) => setCheckIn(ev.target.value)}
            />
          </div>
          <div>
            <h3 className="mt-2 mb-1">Check-out</h3>
            <input
              className="border flex rounded-2xl gap-2 items-center mt-2 -mb-1"
              type="text"
              placeholder="11:00"
              value={checkOut}
              onChange={(ev) => setCheckOut(ev.target.value)}
            />
          </div>
          <div>
            <h3 className="mt-2 mb-1">Số lượng khách</h3>
            <input
              className="mt-2 -mb-1"
              type="text"
              value={maxGuests}
              onChange={(ev) => setMaxGuest(ev.target.value)}
            />
          </div>
          <div>
            <h3 className="mt-2 mb-1">Giá</h3>
            <input
              className="mt-2 -mb-1"
              type="text"
              value={price}
              onChange={(ev) => setPrice(ev.target.value)}
            />
          </div>
        </div>
        <button className="primary my-4"> Lưu </button>
      </form>
    </div>
  );
}
