
export const Payments = () => {
  const Construction = "https://res.cloudinary.com/dljbnzwmr/image/upload/v1745817483/construction-illustration_wibddk.png"
  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 text-center box">
      <img
        src={Construction }
        alt="Under Construction"
        className="img-fluid mb-3 h-50 w-50"
        style={{ maxWidth: "300px" }}
      />
      <h3 className="fw-bold">Under Construction</h3>
      <p className="text-muted">We're working on this feature. Stay tuned!</p>
    </div>
  );
};
