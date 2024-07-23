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
            <svg aria-hidden='true' className='w-9 h-9 text-gray-200 dark:text-dark2 animate-spin fill-primary' viewBox='0 0 100 101' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z' fill='currentColor' />
              <path d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z' fill='currentFill' />
            </svg>
          </div>
          <div className='italic dark:text-gray-400'>Loading...</div>
        </div>
      ) : (
        <>
          <div className='border overflow-hidden border-primary rounded-md mb-3 flex drop-shadow-md font-semibold divide divide-x divide-primary dark:text-gray-400'>
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
                  className={`${tab === item.id && "bg-primary text-white dark:text-dark"} w-full p-1`}
                >
                  {item.text}
                </button>
              );
            })}
          </div>
          {tab === 1 && (
            <>
              <div className='bg-white dark:bg-dark2 drop-shadow-md rounded-md p-3 mb-3'>
                <div className='flex'>
                  <input value={searchTerm} onChange={handleSearch} type='search' placeholder='Cari nama surah' className='dark:bg-dark dark:border-gray-500 dark:text-gray-400 px-2 py-1 border-slate-200 border rounded-md focus:outline-none block w-full' />
                </div>
              </div>
              <div className='flex flex-col'>
                {quran
                  .filter((item) => {
                    return item.nama.toLowerCase().includes(searchTerm.toLowerCase());
                  })
                  .map((item, index) => {
                    return (
                      <Link to={`surah/${item.nomor}`} key={index} className='p-2 dark:text-gray-400 bg-white dark:bg-dark2 overflow-hidden drop-shadow-md rounded-md mb-3 '>
                        <div className='flex flex-row justify-between items-center'>
                          <div className='flex flex-row items-center gap-x-2'>
                            <div className='flex items-center justify-center bg-secondary rounded-full font-bold h-8 w-8 text-gray-600 dark:text-dark dark:bg-primary p-5'>{item.nomor}</div>
                            <div>
                              <div className='font-semibold text-lg'>{item.nama}</div>
                              <div className='text-sm'>{item.arti}</div>
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
              <div className='bg-white dark:bg-dark2 drop-shadow-md rounded-md p-3 mb-3'>
                <div className='flex'>
                  <input value={searchTerm} onChange={handleSearch} type='search' placeholder='Cari nama surah' className='dark:bg-dark dark:border-gray-500 dark:text-gray-400 px-2 py-1 border-slate-200 border rounded-md focus:outline-none block w-full' />
                </div>
              </div>
              <div className='[&>div]:h-fit'>
                {Object.keys(groupedData).map((category, index) => (
                  <div key={index} className='bg-white overflow-hidden drop-shadow-md rounded-md mb-3 flex flex-col divide divide-y divide-secondary dark:bg-dark2'>
                    <div className='p-2 bg-primary overflow-hidden text-white dark:text-dark text-center font-bold capitalize'>{category.replace(/-/g, " ")}</div>
                    {groupedData[category]
                      .filter((item) => {
                        return item.title.toLowerCase().includes(searchTerm.toLowerCase());
                      })
                      .map((item, itemIndex) => (
                        <Link key={itemIndex} to={`${item.id}/${item.title}`} className='p-2 dark:text-gray-400'>
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
              <div className='border overflow-hidden border-primary rounded-md mb-3 flex drop-shadow-md font-semibold divide divide-x divide-primary dark:text-gray-400'>
                {["Al-Quran", "Doa & Dzikir"].map((item, index) => {
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        localStorage.setItem("subtab", item);
                        setsubtab(item);
                      }}
                      className={`${subtab === item && "bg-primary text-white dark:text-dark"} w-full`}
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
                            <Link to={`surah/${item.nomor}`} key={index} className='p-2 dark:text-gray-400 bg-white dark:bg-dark2 overflow-hidden drop-shadow-md rounded-md mb-3 '>
                              <div className='flex flex-row justify-between items-center'>
                                <div className='flex flex-row items-center gap-x-2'>
                                  <div className='flex items-center justify-center bg-secondary rounded-full font-bold h-8 w-8 text-gray-600 dark:text-dark dark:bg-primary p-5'>{item.nomor}</div>
                                  <div>
                                    <div className='font-semibold text-lg'>{item.nama}</div>
                                    <div className='text-sm'>{item.arti}</div>
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
                    <div className='flex flex-col gap-y-2 justify-center items-center'>
                      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512' width={50} height={50} className='dark:fill-yellow-500 fill-primary'>
                        <path d='M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM174.6 384.1c-4.5 12.5-18.2 18.9-30.7 14.4s-18.9-18.2-14.4-30.7C146.9 319.4 198.9 288 256 288s109.1 31.4 126.6 79.9c4.5 12.5-2 26.2-14.4 30.7s-26.2-2-30.7-14.4C328.2 358.5 297.2 336 256 336s-72.2 22.5-81.4 48.1zM144.4 208a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm192-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z' />
                      </svg>
                      <span className='dark:text-gray-400'>Belum ada {subtab} yang di favoritkan</span>
                    </div>
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
                            <Link to={`${item.id}/${item.title}`} key={index} className='p-2 bg-white dark:bg-dark2 dark:text-gray-400 overflow-hidden drop-shadow-md rounded-md mb-3 '>
                              <div className='font-semibold text-lg truncate hover:text-wrap'>{item.title}</div>
                            </Link>
                          );
                        })}
                    </div>
                  ) : (
                    <div className='flex flex-col gap-y-2 justify-center items-center'>
                      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512' width={50} height={50} className='dark:fill-yellow-500 fill-primary'>
                        <path d='M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM174.6 384.1c-4.5 12.5-18.2 18.9-30.7 14.4s-18.9-18.2-14.4-30.7C146.9 319.4 198.9 288 256 288s109.1 31.4 126.6 79.9c4.5 12.5-2 26.2-14.4 30.7s-26.2-2-30.7-14.4C328.2 358.5 297.2 336 256 336s-72.2 22.5-81.4 48.1zM144.4 208a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm192-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z' />
                      </svg>
                      <span className='dark:text-gray-400'>Belum ada {subtab} yang di favoritkan</span>
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
