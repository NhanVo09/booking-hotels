import axios from "axios";
import { useEffect, useState } from "react";
import AdminPage from "./AdminPage";

export default function ManagePlace() {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const placesRes = await axios.get("/places");
    setPlaces(placesRes.data);
  };

  const approvePlace = async (id) => {
    await axios.patch(`/places/${id}`, { approved: true });
    fetchData();
  };

  const deletePlace = async (id) => {
    await axios.delete(`/places/${id}`);
    fetchData();
  };

  return (
    <div>
      <AdminPage />
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl text-center font-bold mb-4">
          DANH SÁCH KHÁCH SẠN
        </h2>
        <table className="min-w-full bg-white border-gray-200 shadow-md rounded-md overflow-hidden">
          <thead className="bg-primary text-white ">
            <tr>
              <th className="py-3 px-4 text-center">Tên</th>
              <th className="py-3 px-4 text-center">Địa chỉ</th>
              <th className="py-3 px-4 text-center">Mô tả</th>
              <th className="py-3 px-4 text-center">Trạng thái</th>
              <th className="py-3 px-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {places.map((place) => (
              <tr key={place._id} className="border-b border-gray-200">
                <td className="py-3 px-4 text-left">{place.title}</td>
                <td className="py-3 px-4 text-left">{place.address}</td>
                <td className="py-3 px-4 text-left">{place.description}</td>
                <td className="py-3 px-4 text-left">
                  {place.approved ? (
                    <span className="text-green-500 font-bold">Đã duyệt</span>
                  ) : (
                    <span className="text-red-500 font-bold">Chưa duyệt</span>
                  )}
                </td>
                <td className="py-3 px-4 text-left">
                  <div className="flex items-center">
                    {!place.approved && (
                      <button
                        onClick={() => approvePlace(place._id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md mr-2"
                      >
                        Duyệt
                      </button>
                    )}
                    <button
                      onClick={() => deletePlace(place._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md"
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
