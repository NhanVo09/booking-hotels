import { useEffect, useState } from "react";
import axios from "axios";
import AdminPage from "./AdminPage";

export default function ManageComment() {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await axios.get("/comments");
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };
  const deleteComment = async (id) => {
    try {
      await axios.delete(`/comments/${id}`);
      fetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div>
      <AdminPage />
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl text-center font-bold mb-4">
          Danh sách Comment
        </h2>
        <table className="min-w-full bg-white border-gray-200 shadow-md rounded-md overflow-hidden">
          <thead className="bg-primary text-white">
            <tr>
              <th className="py-3 px-4 text-center">Nội dung</th>
              <th className="py-3 px-4 text-center">Tác giả</th>
              <th className="py-3 px-4 text-center">Ngày tạo</th>
              <th className="py-3 px-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {comments.map((comment) => (
              <tr key={comment._id} className="border-b border-gray-200 ">
                <td className="py-3 px-4 text-center">{comment.content}</td>
                <td className="py-3 px-4 text-center">{comment.user.name}</td>
                <td className="py-3 px-4 text-center">
                  {new Date(comment.createdAt).toLocaleString()}
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => deleteComment(comment._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}