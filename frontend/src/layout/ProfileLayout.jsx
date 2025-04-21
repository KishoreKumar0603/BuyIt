import { Outlet } from "react-router-dom";
import { Sidebar } from "../Components/profileComponents/Sidebar";
import { UserGreeting } from "../Components/profileComponents/UserGreeting";
import { useEffect, useState } from "react";
import axios from "axios";
import "../assets/css/pages/Profile.css";

const ProfileLayout = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:5000/api/user/my-profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserData(res.data.user);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container-fluid px-5 min-vh-100">
      <div className="row">
        <div className="col-md-3">
          <UserGreeting user={userData} />
          <Sidebar />
        </div>

        {/* Content Area */}
        <div className="col-md-9">
          <Outlet context={{ user: userData ,token}} />
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;
