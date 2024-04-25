import axios from "axios";
import { useState, useEffect } from "react";
import AdminPage from "./AdminPage";

export default function ManageUser() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    const userRes = await axios.get("/users");
    setUsers(userRes.data);
  };

  const approveUser = async (id) => {
    await axios.patch(`/users/${id}`, { approved: true, request: true });
    fetchData();
  };
  const deleteUser = async (id) => {
    await axios.delete(`/users/${id}`);
    fetchData();
  };

  const renderFunctionColumn = (user) => {
    if (user.request === null) {
      return <span className="text-gray-500 font-bold">Người dùng</span>;
    } else if (user.request === false) {
      return <span className="text-red-500 font-bold">yêu cầu duyệt</span>;
    } else if (user.request) {
      return <span className="text-green-500 font-bold">Chủ khách sạn</span>;
    } 
  };

  return (
    <div>
      <AdminPage />
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl text-center font-bold mb-4">NGƯỜI DÙNG</h2>
        <table className="min-w-full bg-white border-gray-200 shadow-md rounded-md overflow-hidden">
          <thead className="bg-primary text-white ">
            <tr>
              <th className="py-3 px-4 text-left">Tên</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Chức năng</th>
              <th className="py-3 px-4 text-left">Hành động</th>
              <th className="py-3 px-4 text-left">Trạng thái</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b border-gray-200">
                <td className="py-3 px-4 text-left">{user.name}</td>
                <td className="py-3 px-4 text-left">{user.email}</td>
                <td className="py-3 px-4 text-left">
                  {renderFunctionColumn(user)}
                </td>
                <td className="py-3 px-4 text-left">
                  <div>
                  {!user.approved  &&(
                    <button
                      onClick={() => approveUser(user._id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md mr-2"
                    >
                      Duyệt
                    </button>)}
                    <button
                      onClick={() => deleteUser(user._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md mr-2"
                    >
                      Xóa
                    </button>
                  </div>
                </td>
                <td className="py-3 px-4 text-left">
                  {user.approved ? (
                    <span className="text-green-500 font-bold">Đã duyệt</span>
                  ) : (
                    <span className="text-red-500 font-bold">Chưa duyệt</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
