import { Outlet } from "react-router-dom";
import { Sidebar } from "../Components/profileComponents/Sidebar";
import { UserGreeting } from "../Components/profileComponents/UserGreeting";
import { useEffect, useState } from "react";
import "../assets/css/pages/Profile.css";
import axiosInstance from "../context/axiosInstance";

const ProfileLayout = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get("/api/user/my-profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserData(res.data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    if (userData) {
      document.title = `Profile | ${userData.name}`;
    } else {
      document.title = "BuyIt | Profile";
    }
  }, [userData]);

  // Loading spinner UI
  if (loading) {
    return (
      <div className="d-flex justify-content-center min-vh-100">
        <div className="spinner-border text-dark" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-5 min-vh-100">
      <div className="row">
        <div className="col-md-3">
          <UserGreeting user={userData} />
          <Sidebar />
        </div>

        {/* Content Area */}
        <div className="col-md-9">
          <Outlet context={{ user: userData, token }} />
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;
