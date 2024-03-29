import axios from "axios";
import { useState, useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import {UserContext} from "../UserContext"
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const {setUser} = useContext(UserContext);
  async function handleLoginSubmit(ev){
    ev.preventDefault();
    try {
      const {data} = await axios.post('/login', {email, password});
      setUser(data);
      alert ("Đăng nhập thành công!");
      setRedirect(true);
    } catch (e) {
      alert("Đăng nhập không thành công. Vui lòng thử lại!");
    }
  }

  if(redirect){
    return <Navigate to={'/'}/>
  }
  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64 ">
        <h1 className=" text-4xl text-center mb-4"> ĐĂNG NHẬP </h1>
        <form className="max-w-md mx-auto " onSubmit={handleLoginSubmit}>
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
          <button className="primary">Đăng Nhập</button>
          <div className="text-center py-2 text-gray-500">
            Chưa có tài khoản?{" "}
            <Link className="underline text-gray-500" to={"/register"}>
              Đăng ký nhanh{" "}
            </Link>{" "}
          </div>
        </form>
      </div>
    </div>
  );
}
