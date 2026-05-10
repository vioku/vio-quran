import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { useToast } from "./ToastContext.jsx";

function Quran() {
  let { id } = useParams();
  const [isloading, setisloading] = useState(true);
  const [fav, setfav] = useState();
  const [data, setData] = useState(null);
  const [isaudio, setisaudio] = useState(false);
  const [pagination, setpagination] = useState();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchData = async (id) => {
      setisloading(true);
      try {
        const [response, info] = await Promise.all([fetch(`${import.meta.env.BASE_URL}assets/quran/${id}.json`), fetch(`${import.meta.env.BASE_URL}assets/quran.json`)]);
        const [jsonData, jsonInfo] = await Promise.all([response.json(), info.json()]);
        const findSurah = jsonInfo.find((surah) => surah.nomor == id);
        const index = jsonInfo.findIndex((surah) => surah.nomor == id);
        setpagination({
          next: index !== -1 && index < jsonInfo.length - 1 ? { id: jsonInfo[index + 1].nomor, nama: jsonInfo[index + 1].nama } : null,
          prev: index !== -1 && index > 0 ? { id: jsonInfo[index - 1].nomor, nama: jsonInfo[index - 1].nama } : null,
        });
        setData({ ...findSurah, data: jsonData });
        setisloading(false);
      } catch (error) {
        setisloading(false);
      }
    };
    fetchData(id);
    const dataLocalStorage = JSON.parse(localStorage.getItem("favorites"));
    if (Array.isArray(dataLocalStorage?.quran)) setfav(dataLocalStorage.quran);
  }, [id]);

  const addFav = (id, name) => {
    try {
      let favorites = JSON.parse(localStorage.getItem("favorites") || "{}");
      let quranFavorites = favorites["quran"] || [];

      const index = quranFavorites.indexOf(id);
      if (index !== -1) {
        quranFavorites.splice(index, 1);
        showToast(`${name} dihapus dari favorit`, "success");
      } else {
        quranFavorites.push(id);
        showToast(`${name} ditambahkan ke favorit`, "success");
      }

      favorites["quran"] = quranFavorites;
      localStorage.setItem("favorites", JSON.stringify(favorites));
      setfav(quranFavorites);
    } catch (error) {
      showToast(`${name} gagal update favorit`, "error");
    }
  };

  return (
    <div className="container">
      {isloading ? (
        <div className="neo-loading">
          <div className="neo-spinner" />
          <div className="neo-loading-text">Loading...</div>
        </div>
      ) : (
        <>
          <div className="text-center mb-sm">
            <h1 className="page-title">{data.nama}</h1>
            <p className="section-title text-muted">{data.arti}</p>
          </div>

          <div className="neo-card mb-lg">
            <div className="flex items-center justify-between gap-md">
              <button onClick={() => setisaudio(!isaudio)} className="neo-btn neo-btn-yellow">
                {isaudio ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.25 5C5.56 5 5 5.56 5 6.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C7.5 5.56 6.94 5 6.25 5m3.5 0c-.69 0-1.25.56-1.25 1.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C11 5.56 10.44 5 9.75 5" />
                    </svg>
                    <span>Hentikan Audio</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814z" />
                    </svg>
                    <span>Putar Audio</span>
                  </>
                )}
              </button>
              <button onClick={() => addFav(data.nomor, data.nama)} className="neo-btn neo-btn-icon" style={{ background: fav?.includes(data.nomor) ? "var(--red)" : "var(--white)" }}>
                {fav?.includes(data.nomor) ? (
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
          </div>

          <div className="neo-info-card mb-lg">
            <p dangerouslySetInnerHTML={{ __html: data.keterangan }} />
          </div>

          <div className="neo-card mb-lg">
            {data.data.map((item) => (
              <div key={item.nomor} className="neo-ayah-card">
                <div className="neo-ayah-top">
                  <div className="neo-ayah-num">{item.nomor}</div>
                  <p className="neo-ayah-arabic">{item.ar}</p>
                </div>
                <div className="neo-ayah-latin" dangerouslySetInnerHTML={{ __html: item.tr }} />
                <p className="neo-ayah-arti">{item.id}</p>
              </div>
            ))}
          </div>

          <div className="neo-pagination">
            {pagination.prev ? (
              <Link to={`/surah/${pagination.prev.id}`} className="neo-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
                </svg>
                <span>{pagination.prev.nama}</span>
              </Link>
            ) : (
              <div />
            )}
            {pagination.next && (
              <Link to={`/surah/${pagination.next.id}`} className="neo-btn">
                <span>{pagination.next.nama}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708" />
                </svg>
              </Link>
            )}
          </div>

          {isaudio && (
            <div className="mt-lg" style={{ position: "sticky", bottom: 16, zIndex: 10 }}>
              <AudioPlayer autoPlay={isaudio} src={data.audio} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Quran;
