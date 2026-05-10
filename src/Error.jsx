import { Link } from "react-router";

function Error() {
  return (
    <div className="container">
      <div className="neo-error">
        <div className="neo-error-code">404</div>
        <p className="neo-error-text">Halaman yang kamu cari tidak ditemukan</p>
        <Link to="/" className="neo-btn neo-btn-yellow">Kembali ke Beranda</Link>
      </div>
    </div>
  );
}

export default Error;
