import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [position, setPosition] = useState("")
  async function registerUser(ev) {
    ev.preventDefault();
    try {
      await axios.post("/register", {
        name,
        email,
        password,
        position,
      });

      alert("Đăng ký thành công");
    } catch (e) {
      alert("Đăng ký không thành công. Vui lòng thử lại!");
    }
  }
  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64 ">
        <h1 className=" text-4xl text-center mb-4"> ĐĂNG KÝ </h1>
        <form className="max-w-md mx-auto " onSubmit={registerUser}>
          <input
            type="text"
            placeholder={"Họ và tên"}
            value={name}
            onChange={(ev) => setName(ev.target.value)}
          />
          <input
            type="email"
            placeholder={"123@gmail.com"}
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
          />
          <input
          className="m-3"
              type="checkbox"
              value={position}
              name = "Người dùng"
              onChange={(ev) => setPosition(ev.target.name)}
            />
            <label>Người dùng:</label>
          <input
          className="m-3"
              type="checkbox"
              value={position}
              name = "Chủ khách sạn"
              onChange={(ev) => setPosition(ev.target.name)}
            />
            <label>Chủ khách sạn:</label>
          <button className="primary">Đăng ký</button>
          <div className="text-center py-2 text-gray-500">
            Đã có tài khoản{" "}
            <Link className="underline text-gray-500" to={"/login"}>
              Đăng nhập ngay{" "}
            </Link>{" "}
          </div>
        </form>
      </div>
    </div>
  );
}
