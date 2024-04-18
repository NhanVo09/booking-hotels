// components/Comments.js
import { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";

function Comments({ place }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      const response = await axios.get(`/comments/${place}`);
      setComments(response.data);
    };

    fetchComments();
  }, [place]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      const response = await axios.post(
        "/comments",
        {
          content,
          place,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setComments([...comments, response.data]);
      setContent("");
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  return (
    <div>
      <h1 className="font-semibold text-2xl py-4">BÌNH LUẬN</h1>
      {comments.map((comment, index) => (
        <div className="my-4 flex" key={index}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
          <p>
            {comment.user.name}: {comment.content}
          </p>
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <textarea
         className="mt-8"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Viết bình luận"
        ></textarea>
        <button className="primary mt-4" type="submit">Gửi bình luận</button>
      </form>
    </div>
  );
}

Comments.propTypes = {
  place: PropTypes.string.isRequired,
};

export default Comments;
