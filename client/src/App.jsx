import { Route, Routes } from "react-router-dom";
import "./App.css";
import IndexPage from "./pages/IndexPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import Layout from "./Layout.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import axios from "axios";
import { UserContextProvider } from "./UserContext.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import PlacesPage from "./pages/PlacesPage.jsx";
import PlacesFormPage from "./pages/PlacesFormPage.jsx";
import PlacePage from "./pages/PlacePage.jsx";
import BookingsPage from "./pages/BookingsPage.jsx";
import BookingPage from "./pages/BookingPage.jsx";
import Search from "./Search.jsx";
import AdminPage from "./admin/AdminPage"
import ManageUser from "./admin/ManageUser.jsx";
import ManagePlaces from "./admin/ManagePlaces.jsx";
import ManageComment from "./admin/ManageComment.jsx"
import RegisterMyhotel from "./pages/RegisterMyhotel.jsx";
import ManageBookingsPage from "./pages/ManageBookingsPage.jsx";
import PaymentQRPage from "./pages/PaymentQRPage.jsx";
axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/admin" element={<AdminPage/>}/>
          <Route path="/admin/users" element={<ManageUser/>}/>
          <Route path="places" element={<ManagePlaces/>}/>
          <Route path="/admin/comments" element={<ManageComment/>}/>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/account" element={<ProfilePage />} />
          <Route path="/account/registerplaces" element={<RegisterMyhotel />} />
          <Route path="/account/places" element={<PlacesPage />} />
          <Route path="/account/places/new" element={<PlacesFormPage />} />
          <Route path="/account/places/:id" element={<PlacesFormPage />} />
          <Route path="/place/:id" element={<PlacePage />} />
          <Route path="/place/search" element={<Search />} />
          <Route path="/account/bookings" element={<BookingsPage />} />
          <Route path="/account/bookings/:id" element={<BookingPage />} />
          <Route path="/account/ownerplaces" element={<ManageBookingsPage />} />
          <Route path="/account/bookings/:id/:price" element={<PaymentQRPage />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
