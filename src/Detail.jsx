import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useToast } from "./ToastContext.jsx";

function Detail() {
  let { title, id } = useParams();
  const [fav, setfav] = useState([]);
  const [isloading, setisloading] = useState(true);
  const [infodata, setdata] = useState();
  const { showToast } = useToast();

  const addFav = (id, name) => {
    try {
      let favorites = JSON.parse(localStorage.getItem("favorites") || "{}");
      let quranFavorites = favorites["doa"] || [];

      const index = quranFavorites.indexOf(id);
      if (index !== -1) {
        quranFavorites.splice(index, 1);
        showToast(`${name} dihapus dari favorit`, "success");
      } else {
        quranFavorites.push(id);
        showToast(`${name} ditambahkan ke favorit`, "success");
      }
      favorites["doa"] = quranFavorites;
      localStorage.setItem("favorites", JSON.stringify(favorites));
      setfav(quranFavorites);
    } catch (error) {
      showToast(`${name} gagal update favorit`, "error");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setisloading(true);
      try {
        const [data] = await Promise.all([fetch(`${import.meta.env.BASE_URL}assets/data.json`)]);
        const [dataInfo] = await Promise.all([data.json()]);
        let infodata = dataInfo.find((item) => item.id === parseInt(id));
        setdata(infodata);
        setisloading(false);
      } catch (error) {
        setisloading(false);
      }
    };
    fetchData();
    const dataLocalStorage = JSON.parse(localStorage.getItem("favorites"));
    if (Array.isArray(dataLocalStorage?.doa)) setfav(dataLocalStorage.doa);
  }, []);

  return (
    <div className="container">
      {isloading ? (
        <div className="neo-loading">
          <div className="neo-spinner" />
          <div className="neo-loading-text">Loading...</div>
        </div>
      ) : (
        <>
          <div className="neo-detail-header">
            <h1 className="neo-detail-title">{infodata.title}</h1>
            <button onClick={() => addFav(infodata.id, infodata.title)} className="neo-btn neo-btn-icon" style={{ background: fav.includes(infodata.id) ? "var(--red)" : "var(--white)" }}>
              {fav.includes(infodata.id) ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="var(--white)" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
                </svg>
              )}
            </button>
          </div>

          <div className="neo-card mb-lg">
            <div className="neo-ayah-card">
              <p className="neo-ayah-arabic mb-md">{infodata.arabic}</p>
              <p className="neo-ayah-latin">
                <span className="neo-badge" style={{ marginRight: 8 }}>&ldquo;</span>
                {infodata.latin}
                {infodata.source && <span className="text-muted text-sm"> ({infodata.source})</span>}
              </p>
            </div>
          </div>

          <p className="neo-info-card mb-lg" style={{ fontSize: 16 }}>
            Arti: &ldquo;{infodata.translation}&rdquo;
          </p>

          {infodata.notes && (
            <div className="neo-note-card mb-lg">
              <p>{infodata.notes}</p>
            </div>
          )}

          {infodata.fawaid && (
            <div className="neo-note-card mb-lg" style={{ background: "var(--green)" }}>
              <p>&ldquo;{infodata.fawaid}&rdquo;</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Detail;
