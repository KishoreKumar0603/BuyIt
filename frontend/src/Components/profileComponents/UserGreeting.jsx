import UserProfile from '../../assets/images/userProfile.png'
export const UserGreeting = () => {

  return (
    <div className='user-greetings mb-4 p-2 mb-3 box'>
        <div className="row g-0 h-100">
            <div className="col-4 h-100 d-flex justify-content-center align-items-center">
                <img src={UserProfile} alt="profile.png" className='rounded-circle user-pic-img' />
            </div>
            <div className="col-8 h-100 d-flex align-items-center">
                <div className='m-0'><span className='secondary'>Hello,</span>
                    
                    <h5>Kishore Kumar S</h5>
                </div>
            </div>
        </div>
    </div>
  )
}
