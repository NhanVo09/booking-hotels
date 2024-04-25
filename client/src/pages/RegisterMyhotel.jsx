import axios from "axios";
import { useState, useEffect } from "react";
import AccountNav from "../AccountNav";

export default function RegisterMyhotel (){  
    const [currentUser, setCurrentUser] = useState(null);
    
    useEffect(() => {
      fetchCurrentUser();
    }, []);

    const fetchCurrentUser = async () => {
      try {
        const profileRes = await axios.get("/profile");
        setCurrentUser(profileRes.data._id); // Chỉ lấy ID của người dùng hiện tại
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    const requestUser = async (id) => {
        try {
          await axios.patch(`/users/${id}`, { request: false });
          console.log("Request sent successfully.");
          alert("Gửi yêu cầu thành công, Vui lòng chờ xét duyệt!")
        } catch (error) {
          console.error("Error sending request:", error);
        }
    };

    return (
        <div>
          <AccountNav/>
          <div className="text-center max-w-lg mx-auto">
            Đăng ký thành chủ khách sạn  <br />
            <button
              className="primary max-w-sm mt-2"
              onClick={() => requestUser(currentUser)} 
              
            >
              Gửi xét duyệt
            </button>
          </div>
        </div>
        
      );
}