import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
function Quran() {
  let { id } = useParams();
  const [isloading, setisloading] = useState(true);
  const [fav, setfav] = useState();
  const [data, setData] = useState(null);
  const [isaudio, setisaudio] = useState(false);
  const [pagination, setpagination] = useState();
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
    const dataArray = Array.isArray(dataLocalStorage?.quran) ? setfav(dataLocalStorage.quran) : setfav([]);
  }, [id]);

  const addFav = (id, name) => {
    try {
      let favorites = JSON.parse(localStorage.getItem("favorites") || "{}");
      let quranFavorites = favorites["quran"] || [];

      const index = quranFavorites.indexOf(id);
      if (index !== -1) {
        quranFavorites.splice(index, 1);
        toast.success(`${name} dihapus dari favorit`);
      } else {
        quranFavorites.push(id);
        toast.success(`${name} ditambahkan ke favorit`);
      }

      favorites["quran"] = quranFavorites;
      localStorage.setItem("favorites", JSON.stringify(favorites));
      setfav(quranFavorites);
    } catch (error) {
      toast.error(`${name} gagal update favorit`);
    }
  };

  return (
    <div className='p-4'>
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
          <h2 className='text-center text-xl font-semibold'>{data.nama}</h2>
          <h2 className='text-center text-sm mb-3'>{data.arti}</h2>
          <div className='bg-primary p-2 rounded-md mb-3 flex justify-between items-center'>
            <button onClick={() => setisaudio(!isaudio)} className='flex text-white gap-x-2 items-center'>
              {isaudio ? (
                <>
                  <svg xmlns='http://www.w3.org/2000/svg' className='fill-white w-5 h-5' fill='currentColor' viewBox='0 0 16 16'>
                    <path d='M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.25 5C5.56 5 5 5.56 5 6.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C7.5 5.56 6.94 5 6.25 5m3.5 0c-.69 0-1.25.56-1.25 1.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C11 5.56 10.44 5 9.75 5' />
                  </svg>
                  <span>Hentikan Audio</span>
                </>
              ) : (
                <>
                  <svg xmlns='http://www.w3.org/2000/svg' className='fill-white w-5 h-5' fill='currentColor' viewBox='0 0 16 16'>
                    <path d='M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814z' />
                  </svg>
                  <span>Putar Audio</span>
                </>
              )}
            </button>
            <button onClick={() => addFav(data.nomor, data.nama)}>
              {fav.includes(data.nomor) ? (
                <svg xmlns='http://www.w3.org/2000/svg' className='fill-red-500 w-5 h-5' fill='currentColor' viewBox='0 0 16 16'>
                  <path fillRule='evenodd' d='M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314' />
                </svg>
              ) : (
                <svg xmlns='http://www.w3.org/2000/svg' className='fill-white w-5 h-5' fill='currentColor' viewBox='0 0 16 16'>
                  <path d='m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15' />
                </svg>
              )}
            </button>
          </div>
          <div className='bg-secondary p-2 rounded-md'>
            <p className='' dangerouslySetInnerHTML={{ __html: data.keterangan }} />
          </div>
          <div className='flex flex-col divide divide-y-2 divide-primary gap-y-2'>
            {data.data.map((item, index) => {
              return (
                <div key={index} className='py-3'>
                  <div className='flex justify-between items-center'>
                    <div className='flex items-center justify-center bg-secondary rounded-full font-bold h-6 w-6 text-gray-600 p-4 border border-primary'>{item.nomor}</div>
                    <p className='text-right text-3xl mb-4 ibm leading-relaxed'>{item.ar}</p>
                  </div>
                  <div className='mb-2 text-lg' dangerouslySetInnerHTML={{ __html: item.tr }} />
                  <p className='italic'>{item.id}</p>
                </div>
              );
            })}
          </div>
          <div className='flex justify-between'>
            {pagination.prev ? (
              <Link to={`/surah/${pagination.prev.id}`} className='bg-primary p-1 px-2 rounded-md text-white font-medium flex items-center justify-center gap-x-1'>
                <svg className=' stroke-white' xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='currentColor' viewBox='0 0 16 16'>
                  <path fillRule='evenodd' d='M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0' />
                </svg>
                <span>{pagination.prev.nama}</span>
              </Link>
            ) : (
              <div></div> // Atau bisa diganti dengan komponen atau elemen lainnya
            )}
            {pagination.next && (
              <Link to={`/surah/${pagination.next.id}`} className='bg-primary p-1 px-2 rounded-md text-white font-medium flex items-center justify-center gap-x-1'>
                <span>{pagination.next.nama}</span>
                <svg className=' stroke-white' xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='currentColor' viewBox='0 0 16 16'>
                  <path fillRule='evenodd' d='M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708' />
                </svg>
              </Link>
            )}
          </div>
          {isaudio && (
            <div className='sticky bottom-4 z-10 mt-5 w-full '>
              <AudioPlayer autoPlay={isaudio} src={data.audio} />
            </div>
          )}
          <Toaster toastOptions={{ duration: 2000 }} />
        </>
      )}
    </div>
  );
}

export default Quran;
