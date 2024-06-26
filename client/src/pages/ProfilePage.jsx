import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import PlacePage from "./PlacesPage";
import AccountNav from "../AccountNav";
import ManageBookingsPage from "./ManageBookingsPage";

export default function ProfilePage() {
  const [redirect, setRedirect] = useState(null);
  const { ready, user, setUser } = useContext(UserContext);
  let { subpage } = useParams();
  if (subpage === undefined) {
    subpage = "profile";
  }

  async function logout() {
    await axios.post("/logout");
    setRedirect("/");
    setUser(null);
  }

  if (!ready) {
    return "Loading .....";
  }
  if (ready && !user && !redirect) {
    return <Navigate to={"/login"} />;
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div>
      <AccountNav/>
      {subpage === "profile" && (
        <div className="text-center max-w-lg mx-auto">
          Đăng nhập với tài khoản {user.name} <br />
          <button onClick={logout} className="primary max-w-sm mt-2">
            {" "}
            Đăng Xuất{" "}
          </button>
        </div>
      )}
      {subpage === "places" && <PlacePage />}
      {user.approved && <ManageBookingsPage />}
    </div>
  );
}
