import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddressLink from "../AddressLink";
import PlaceGallery from "../PlaceGallery";
import BookingWidget from "../BookingWidget";
import Comments from "../Comment";


export default function PlacePage ( ){
    const {id} = useParams();
    const [place, setPlace]= useState(null);
    useEffect(()=>{
        if(!id){
            return;
        }
        axios.get(`/places/${id}`).then(response =>{
            setPlace(response.data);
        });
    },[id]);
    

    if(!place) return'';
    return(
        <div className="mt-4 bg-gray-100 -mx-8 px-8 pt-8">
      <h1 className="text-3xl">{place.title}</h1>
      <AddressLink>{place.address}</AddressLink>
      <PlaceGallery place={place} />
      <div className="mt-8 mb-8 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]">
        <div>
          <div className="my-4">
            <h2 className="font-semibold text-2xl">Mô tả</h2>
            {place.description}
          </div>
          Giờ check-in: {place.checkIn}:00<br />
          Giờ check-out: {place.checkOut}:00<br />
          Số lượng khách tối đa / 1 phòng: {place.maxGuests}
          <h2 className="font-semibold text-2xl mt-8">TIỆN NGHI CỦA KHÁCH SẠN:</h2>
          <ul className=" mt-1 ">
            {place.perks.map((perk, index) => (
              <li key={index}>{perk}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <BookingWidget place={place} />
        </div>
      </div>
      <div className="bg-white -mx-8 px-8 py-8 border-t">
        <div>
          <h2 className="font-semibold text-2xl">Thông tin thêm</h2>
        </div>
        <div className="mb-4 mt-2 text-sm text-gray-700 leading-5">{place.extraInfo}</div>
      </div>
      <Comments place={place._id} />
    </div>
    );
}

