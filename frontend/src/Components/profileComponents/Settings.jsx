
import Construnction from '../../assets/images/construction-illustration.png'
export const Settings = () => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 text-center box">
      <img
        src={Construnction }
        alt="Under Construction"
        className="img-fluid mb-3 h-50 w-50"
        style={{ maxWidth: "300px" }}
      />
      <h3 className="fw-bold">Under Construction</h3>
      <p className="text-muted">We're working on this feature. Stay tuned!</p>
    </div>
  );
};
