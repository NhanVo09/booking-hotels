import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Search(){
    const [searchTerm, setSearchTerm] = useState("");
    const [places, setPlaces] = useState([]);
    useEffect(() => {
        axios.get("/places", { params: { search: searchTerm } })
          .then(response => {
            setPlaces(response.data);
          });
          
      }, [searchTerm]);
      const filteredPlaces = places.filter(place => 
        place.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        place.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
      };
      return (
        <div className="m-8 ">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Tìm kiếm theo tiêu đề..."
            className="mb-4 p-2 border rounded-2xl"
          />
          <div className="grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredPlaces.length > 0 ? filteredPlaces.map((place) => (
              <Link to={'/place/' + place._id} key={place._id}>
                <div className="bg-gray-500 mt-8 mb-2 rounded-2xl flex">
                  {place.photo?.[0] && (
                    <img
                      className="rounded-2xl object-cover aspect-square"
                      src={"http://localhost:3000/uploads/" + place.photo[0]}
                      alt={place.title}
                    />
                  )}
                </div>
                <h2 className="font-bold">{place.address}</h2>
                <h3 className="text-sm truncate">{place.title}</h3>
                <div className="mt-1">
                  <span className="font-bold">{place.price}.000VND/đêm</span>
                </div>
              </Link>
            )) : <p>Không tìm thấy địa điểm phù hợp.</p>}
          </div>
        </div>
      );
    }