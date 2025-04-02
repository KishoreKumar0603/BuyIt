import { Outlet } from "react-router-dom";
import { Sidebar } from "../Components/profileComponents/Sidebar";
import { UserGreeting } from "../Components/profileComponents/UserGreeting";

import '../assets/css/pages/Profile.css';
const ProfileLayout = () => {
  return (
    <div className="container-fluid px-5 min-vh-100">
      <div className="row">
        <div className="col-md-3" >
          <UserGreeting />
          <Sidebar />
        </div>

        {/* Content Area */}
        <div className="col-md-9">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;
