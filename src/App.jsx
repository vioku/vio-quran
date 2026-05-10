import { useEffect, useState } from "react";
import { Link } from "react-router";

function App() {
  const [data, setdata] = useState();
  const [quran, setquran] = useState();
  const [groupedData, setgroupedData] = useState();
  const [isloading, setisloading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [favQuran, setfavQuran] = useState([]);
  const [favDoa, setfavDoa] = useState([]);
  const [tab, settab] = useState(localStorage.getItem("tab") ? parseInt(localStorage.getItem("tab")) : 1);
  const [subtab, setsubtab] = useState(localStorage.getItem("subtab") ? localStorage.getItem("subtab") : "Al-Quran");
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      setisloading(true);
      try {
        const [quran, data] = await Promise.all([fetch(`${import.meta.env.BASE_URL}assets/quran.json`), fetch(`${import.meta.env.BASE_URL}assets/data.json`)]);
        const [quranData, dataInfo] = await Promise.all([quran.json(), data.json()]);
        setdata(dataInfo);
        setquran(quranData);

        const groupCat = {};
        dataInfo.forEach((item) => {
          if (!groupCat[item.categories]) {
            groupCat[item.categories] = [];
          }
          groupCat[item.categories].push(item);
        });
        setgroupedData(groupCat);
        setisloading(false);
      } catch (error) {
        setisloading(false);
      }
    };
    fetchData();
    const dataLocalStorage = JSON.parse(localStorage.getItem("favorites"));
    if (Array.isArray(dataLocalStorage?.quran)) setfavQuran(dataLocalStorage.quran);
    if (Array.isArray(dataLocalStorage?.doa)) setfavDoa(dataLocalStorage.doa);
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
          <div className="neo-tabs mb-lg">
            {[
              { id: 1, text: "Al-Quran" },
              { id: 2, text: "Doa & Dzikir" },
              { id: 3, text: "Favorit" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  localStorage.setItem("tab", item.id);
                  settab(item.id);
                  setSearchTerm("");
                }}
                className={`neo-tab ${tab === item.id ? "neo-tab-active" : ""}`}
              >
                {item.text}
              </button>
            ))}
          </div>

          {tab === 1 && (
            <>
              <div className="neo-card mb-lg">
                <div className="neo-search">
                  <svg className="neo-search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                  </svg>
                  <input value={searchTerm} onChange={handleSearch} type="search" placeholder="Cari nama surah..." className="neo-input" />
                </div>
              </div>
              <div className="flex flex-col gap-md">
                {quran
                  .filter((item) => item.nama.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((item) => (
                    <Link to={`surah/${item.nomor}`} key={item.nomor} className="neo-surah-card">
                      <div className="flex flex-row items-center justify-between gap-md">
                        <div className="flex flex-row items-center gap-md">
                          <div className="neo-num">{item.nomor}</div>
                          <div>
                            <div className="font-bold text-lg">{item.nama}</div>
                            <div className="text-sm text-muted">{item.arti}</div>
                          </div>
                        </div>
                        <div className="flex flex-col items-center gap-xs">
                          <div className="ibm text-lg">{item.asma}</div>
                          <div className="text-sm text-muted">{item.ayat} Ayat</div>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </>
          )}

          {tab === 2 && (
            <>
              <div className="neo-card mb-lg">
                <div className="neo-search">
                  <svg className="neo-search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                  </svg>
                  <input value={searchTerm} onChange={handleSearch} type="search" placeholder="Cari doa atau dzikir..." className="neo-input" />
                </div>
              </div>
              <div className="flex flex-col gap-md">
                {Object.keys(groupedData).map((category) => (
                  <div key={category} className="neo-category-card">
                    <div className="neo-category-header">{category.replace(/-/g, " ")}</div>
                    {groupedData[category]
                      .filter((item) => item.title.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((item) => (
                        <Link key={item.id} to={`${item.id}/${item.title}`} className="neo-category-item">
                          {item.title}
                        </Link>
                      ))}
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === 3 && (
            <>
              <div className="neo-tabs mb-lg">
                {["Al-Quran", "Doa & Dzikir"].map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      localStorage.setItem("subtab", item);
                      setsubtab(item);
                    }}
                    className={`neo-tab ${subtab === item ? "neo-tab-active" : ""}`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              {subtab === "Al-Quran" && (
                <>
                  {favQuran.length > 0 ? (
                    <div className="flex flex-col gap-md">
                      {quran
                        .filter((item) => favQuran.includes(item.nomor))
                        .map((item) => (
                          <Link to={`surah/${item.nomor}`} key={item.nomor} className="neo-surah-card">
                            <div className="flex flex-row items-center justify-between gap-md">
                              <div className="flex flex-row items-center gap-md">
                                <div className="neo-num">{item.nomor}</div>
                                <div>
                                  <div className="font-bold text-lg">{item.nama}</div>
                                  <div className="text-sm text-muted">{item.arti}</div>
                                </div>
                              </div>
                              <div className="flex flex-col items-center gap-xs">
                                <div className="ibm text-lg">{item.asma}</div>
                                <div className="text-sm text-muted">{item.ayat} Ayat</div>
                              </div>
                            </div>
                          </Link>
                        ))}
                    </div>
                  ) : (
                    <div className="neo-empty">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={64} height={64} fill="var(--black)">
                        <path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM174.6 384.1c-4.5 12.5-18.2 18.9-30.7 14.4s-18.9-18.2-14.4-30.7C146.9 319.4 198.9 288 256 288s109.1 31.4 126.6 79.9c4.5 12.5-2 26.2-14.4 30.7s-26.2-2-30.7-14.4C328.2 358.5 297.2 336 256 336s-72.2 22.5-81.4 48.1zM144.4 208a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm192-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
                      </svg>
                      <span className="neo-empty-text">Belum ada {subtab} yang di favoritkan</span>
                    </div>
                  )}
                </>
              )}

              {subtab === "Doa & Dzikir" && (
                <>
                  {favDoa.length > 0 ? (
                    <div className="flex flex-col gap-md">
                      {data
                        .filter((item) => favDoa.includes(parseInt(item.id)))
                        .map((item) => (
                          <Link to={`${item.id}/${item.title}`} key={item.id} className="neo-surah-card">
                            <div className="font-semibold text-lg">{item.title}</div>
                          </Link>
                        ))}
                    </div>
                  ) : (
                    <div className="neo-empty">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={64} height={64} fill="var(--black)">
                        <path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM174.6 384.1c-4.5 12.5-18.2 18.9-30.7 14.4s-18.9-18.2-14.4-30.7C146.9 319.4 198.9 288 256 288s109.1 31.4 126.6 79.9c4.5 12.5-2 26.2-14.4 30.7s-26.2-2-30.7-14.4C328.2 358.5 297.2 336 256 336s-72.2 22.5-81.4 48.1zM144.4 208a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm192-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
                      </svg>
                      <span className="neo-empty-text">Belum ada {subtab} yang di favoritkan</span>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;
