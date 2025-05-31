import { Route, Routes } from "react-router";
import { ThemeProvider } from "./components/theme-provider";
import Header from "./components/header/Header";
import Home from "@/components/home/Home";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import NewFlat from "./components/flats/NewFlat";
import MyFavorites from "./components/flats/MyFavorites";
import FlatView from "./components/flats/FlatView";
import MyFlats from "./components/flats/MyFlats";
import EditFlat from "./components/flats/EditFlat";
import Profile from "./components/profile/Profile";
import Admin from "./components/admin/Admin";
import EditProfile from "./components/profile/editProfile";

const App = () => {
  return (
    <ThemeProvider>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/new-flat" element={<NewFlat />} />
        <Route path="/flat/:idFlat" element={<FlatView />} />
        <Route path="/my-favorites" element={<MyFavorites />} />
        <Route path="/my-flats" element={<MyFlats />} />
        <Route path="/flat-edit/:idFlat" element={<EditFlat />} />
        <Route path="/profile/:idProfile" element={<Profile />} />
        <Route path="/edit-profile/:idProfile" element={<EditProfile />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
