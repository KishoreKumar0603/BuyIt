export const UserGreeting = ({ user }) => {

  const profilePic = "https://res.cloudinary.com/dljbnzwmr/image/upload/v1745817482/userProfile_gsufq3.png";
  const userName = user?.name || "User";

  return (
    <div className="user-greetings mb-4 p-2 mb-3 box">
      <div className="row g-0 h-100">
        <div className="col-4 h-100 d-flex justify-content-center align-items-center">
          <img
            src={profilePic}
            alt="profile"
            className="rounded-circle user-pic-img"
          />
        </div>
        <div className="col-8 h-100 d-flex align-items-center">
          <div className="m-0">
            <span className="secondary">Hello,</span>
            <h5>{userName}</h5>
          </div>
        </div>
      </div>
    </div>
  );
};
