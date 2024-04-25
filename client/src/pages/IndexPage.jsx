import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function IndexPage() {
  const [places, setPlaces] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const placesRes = await axios.get("/places");
    const approvedPlaces = placesRes.data.filter(place => place.approved);
    setPlaces(approvedPlaces);
  };
  return (
    <div>
    <div className="mt-8 grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
      {places.length > 0 &&
      
        places.map((place) => (
          <Link to={'/place/' + place._id} key={place} >
            <div className="bg-gray-500 mt-8 mb-2 rounded-2xl flex">
              {place.photo?.[0] && (
                <img
                className="rounded-2xl object-cover aspect-square"
                src={"http://localhost:3000/uploads/" + place.photo[0]}
              />
              )}
            </div>
           <h2 className="font-bold"> {place.title} </h2>
           <h3 className="text-sm truncate"> {place.address}</h3>
           <div className="mt-1">
            <span className="font-bold">{place.price}.000VND/đêm</span>
           </div>
          </Link>
          
        ))}
    </div>
    </div>
  );
}
