import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
    const favQ = Array.isArray(dataLocalStorage?.quran) ? setfavQuran(dataLocalStorage.quran) : setfavQuran([]);
    const favD = Array.isArray(dataLocalStorage?.doa) ? setfavDoa(dataLocalStorage.doa) : setfavDoa([]);
  }, []);
  return (
    <div className='p-4 md:max-w-6xl mx-auto'>
      {isloading ? (
        <div className='flex flex-col items-center justify-center gap-y-2'>
          <div>
            <svg aria-hidden='true' className='w-9 h-9 text-gray-200 animate-spin fill-primary' viewBox='0 0 100 101' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z' fill='currentColor' />
              <path d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z' fill='currentFill' />
            </svg>
          </div>
          <div className='italic'>Loading...</div>
        </div>
      ) : (
        <>
          <div className='border overflow-hidden border-primary rounded-md mb-3 flex drop-shadow-md font-semibold divide divide-x divide-primary'>
            {[
              { id: 1, text: "Al-Quran" },
              { id: 2, text: "Doa & Dzikir" },
              { id: 3, text: "Favorit" },
            ].map((item, index) => {
              return (
                <button
                  key={index}
                  onClick={() => {
                    localStorage.setItem("tab", item.id);
                    settab(item.id);
                    setSearchTerm("");
                  }}
                  className={`${tab === item.id && "bg-primary text-white"} w-full p-1`}
                >
                  {item.text}
                </button>
              );
            })}
          </div>
          {tab === 1 && (
            <>
              <div className='bg-white drop-shadow-md rounded-md p-3 mb-3'>
                <div className='flex'>
                  <input value={searchTerm} onChange={handleSearch} type='search' placeholder='Cari nama surah' className='px-2 py-1 border-slate-200 border rounded-l-md focus:outline-none block w-full' />
                </div>
              </div>
              <div className='flex flex-col'>
                {quran
                  .filter((item) => {
                    return item.nama.toLowerCase().includes(searchTerm.toLowerCase());
                  })
                  .map((item, index) => {
                    return (
                      <Link to={`surah/${item.nomor}`} key={index} className='p-2 bg-white overflow-hidden drop-shadow-md rounded-md mb-3 '>
                        <div className='flex flex-row justify-between items-center'>
                          <div className='flex flex-row items-center gap-x-2'>
                            <div className='flex items-center justify-center bg-secondary rounded-full font-bold h-8 w-8 text-gray-600 p-5'>{item.nomor}</div>
                            <div>
                              <div className='hover:bg-gray-50 font-semibold text-lg'>{item.nama}</div>
                              <div className='hover:bg-gray-50 text-sm'>{item.arti}</div>
                            </div>
                          </div>
                          <div className='flex flex-col items-center'>
                            <div className='ibm text-md'>{item.asma}</div>
                            <div className='text-sm'>{item.ayat} Ayat</div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
              </div>
            </>
          )}
          {tab === 2 && (
            <>
              <div className='bg-white drop-shadow-md rounded-md p-3 mb-3'>
                <div className='flex'>
                  <input value={searchTerm} onChange={handleSearch} type='search' placeholder='Cari nama doa/dzikir' className='px-2 py-1 border-slate-200 border rounded-l-md focus:outline-none block w-full' />
                </div>
              </div>
              <div className='[&>div]:h-fit'>
                {Object.keys(groupedData).map((category, index) => (
                  <div key={index} className='bg-white overflow-hidden drop-shadow-md rounded-md mb-3 flex flex-col divide divide-y divide-secondary'>
                    <div className='p-2 bg-primary overflow-hidden text-white text-center font-bold capitalize'>{category.replace(/-/g, " ")}</div>
                    {groupedData[category]
                      .filter((item) => {
                        return item.title.toLowerCase().includes(searchTerm.toLowerCase());
                      })
                      .map((item, itemIndex) => (
                        <Link key={itemIndex} to={`${item.id}/${item.title}`} className='p-2 hover:bg-gray-50 hover:rounded-md'>
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
              <div className='border overflow-hidden border-primary rounded-md mb-3 flex drop-shadow-md font-semibold divide divide-x divide-primary'>
                {["Al-Quran", "Doa & Dzikir"].map((item, index) => {
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        localStorage.setItem("subtab", item);
                        setsubtab(item);
                      }}
                      className={`${subtab === item && "bg-primary text-white"} w-full`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
              {subtab === "Al-Quran" && (
                <>
                  {favQuran.length > 0 ? (
                    <div className='flex flex-col'>
                      {quran
                        .filter((item) => favQuran.includes(item.nomor))
                        .map((item, index) => {
                          return (
                            <Link to={`surah/${item.nomor}`} key={index} className='p-2 bg-white overflow-hidden drop-shadow-md rounded-md mb-3 '>
                              <div className='flex flex-row justify-between items-center'>
                                <div className='flex flex-row items-center gap-x-2'>
                                  <div className='flex items-center justify-center bg-secondary rounded-full font-bold h-8 w-8 text-gray-600 p-5'>{item.nomor}</div>
                                  <div>
                                    <div className='hover:bg-gray-50 font-semibold text-lg'>{item.nama}</div>
                                    <div className='hover:bg-gray-50 text-sm'>{item.arti}</div>
                                  </div>
                                </div>
                                <div className='flex flex-col items-center'>
                                  <div className='ibm text-md'>{item.asma}</div>
                                  <div className='text-sm'>{item.ayat} Ayat</div>
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                    </div>
                  ) : (
                    <div className='bg-warning rounded-md p-2 text-white text-sm drop-shadow-md'>Belum ada AL-Quran yang di favoritkan</div>
                  )}
                </>
              )}
              {subtab === "Doa & Dzikir" && (
                <>
                  {favDoa.length > 0 ? (
                    <div className='flex flex-col'>
                      {data
                        .filter((item) => favDoa.includes(parseInt(item.id)))
                        .map((item, index) => {
                          return (
                            <Link to={`${item.id}/${item.title}`} key={index} className='p-2 bg-white overflow-hidden drop-shadow-md rounded-md mb-3 '>
                              <div className='hover:bg-gray-50 font-semibold text-lg truncate hover:text-wrap'>{item.title}</div>
                            </Link>
                          );
                        })}
                    </div>
                  ) : (
                    <div className='bg-warning rounded-md p-2 text-white text-sm drop-shadow-md'>Belum ada Doa & Dzikir yang di favoritkan</div>
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
