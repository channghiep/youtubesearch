import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import axios from "axios";

// const API_KEY = process.env.REACT_APP_API_KEY;
// const API_URL = process.env.REACT_APP_API_URL;3
const API_KEY = "AIzaSyBzw3zJ57vaCtxzMCSHZ0ibJkPEggCh-dA";
const API_URL = "https://www.googleapis.com/youtube/v3/search";
export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [videos, setVideos] = useState([]);
  const [selectedVideos, setSelectedVideo] = useState(JSON.parse(localStorage.getItem("savedData")) || []);
  const [showModal, setShowModal] = useState(false);
  const [playVideo, setPlayVideo] = useState();
  const [showSearch, setShowSearch] = useState(true)
  // Assign value for searchTerm
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  //Submit from and call the API
  const handleSubmit = (event) => {
    event.preventDefault();

    axios
      .get(API_URL, {
        params: {
          q: searchTerm,
          part: "snippet",
          type: "video",
          maxResults: 15,
          key: API_KEY,
        },
      })
      .then((response) => {
        setVideos(response.data.items);
        setShowModal(true)

      })
      .catch((err) => {
        console.log(err);
      });
  };

  //Pick video from search result and add to queque
  const handleSelect = (video) => {
    setSelectedVideo([...selectedVideos, video]);
    setShowModal(false);
    setSearchTerm("");
  };

  //Sync local storage with newly added video
  useEffect(() => {
    localStorage.setItem("savedData", JSON.stringify(selectedVideos))
  },[selectedVideos])
  //Select video from queque and play it
  const handlePlayVideo = (video) => {
    setPlayVideo(video.id.videoId);
    const itemIndex = selectedVideos.findIndex(
      (obj) => obj.id.videoId === video.id.videoId
    );
    setSelectedVideo((currentList) => {
      const newList = JSON.parse(JSON.stringify(currentList));
      newList.splice(itemIndex, 1);
      return newList;
    });
    
  };
  // Create a memoized version of the handleSelect, handlePlayVideo function
  // that only changes when the video argument changes
  const memoizedHandleSelect = useCallback(handleSelect, [selectedVideos]);
  // const memoizedHandlePlayVideo = useCallback(handlePlayVideo, [playVideo]);

  // Handle Pagination
  const itemPerPage = 3;
  const initialPage = 0;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [currentData, setCurrentData] = useState(videos.slice(0, 5));

  const getItem = () => {
    let startIndex = currentPage * itemPerPage;
    let endIndex = startIndex + itemPerPage;

    return videos.slice(startIndex, endIndex);
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    setCurrentData(getItem());
  }, [videos, currentPage]);
  //////////////////////////////////////////

  // Handle Pagination selected video
  const sitemPerPage = 3;
  const sinitialPage = 0;

  const [scurrentPage, setsCurrentPage] = useState(sinitialPage);
  const [scurrentData, setsCurrentData] = useState(selectedVideos.slice(0, 5));
  const [ceilData, setCeilData] = useState(0)

  const getsItem = () => {
    let startIndex = scurrentPage * sitemPerPage;
    let endIndex = startIndex + sitemPerPage;

    return selectedVideos.slice(startIndex, endIndex);
  };
  const handlesPageChange = (page) => {
    if(selectedVideos.length > 3){
      setsCurrentPage(page);
    }
  };

  useEffect(() => {
    setsCurrentData(getsItem());
    setCeilData(Math.ceil(selectedVideos.length/3)-1)
  }, [selectedVideos, scurrentPage]);
  //////////////////////////////////////////
  return (
    <div className="grid grid-cols-5 font-sans text-xs font-medium h-screen">
      {/* <div className="bg-neutral-200 relative"> */}
      <div className={`bg-neutral-200 transition duration-150 ease-out ${showSearch ? "relative" : "absolute -left-full"}`}>
        {/* Search Section */}
        <div className="block text-center">
          <form onSubmit={handleSubmit} className="inline-flex justify-between mt-5 rounded-md bg-gray-50 text-[0.8125rem] font-medium leading-5 shadow-sm w-5/6">
            <input
              className="grow bg-transparent p-1.5 focus:outline-none "
              type="search"
              value={searchTerm}
              placeholder="search for video"
              onChange={handleSearch}
            />
            <button type="submit" className="border-l border-slate-400/20 py-2 px-2.5">
              <svg width="20" height="20" className="" viewBox="0 0 20 20">
                <path
                  d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z"
                  stroke="gray"
                  fill="none"
                  fillRule="evenodd"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </button>
          </form>
        </div>
        {/* Search result modal */}
        {showModal 
          ?
            <div className="w-9/12 mx-auto mt-5 rounded-md p-2 bg-white shadow-xl shadow-black/5 bg-slate-50 ring-2">
              <button className="text-lg ml-2" onClick={() => setShowModal(false)}>x</button>
              {videos.length > 0 
                ?
                <div className="">
                  {currentData.map((video) => {
                      return(
                        <div key={video.id.videoId} className="mx-auto w-3/4 rounded-md border-gray-200 bg-white mt-2 pb-1 shadow-md">
                          <img
                            className="rounded-t-md"
                            src={video.snippet.thumbnails.medium.url}
                            alt={video.snippet.title}
                            onClick={() => memoizedHandleSelect(video)}
                          />
                          <p className="m-1">{video.snippet.title}</p>
                          <p className="m-1 font-light">{video.snippet.channelTitle}</p>
                        </div>
                      )
                    })
                  }
                  {/* Pagination */}
                  <div className="grid place-items-center mt-3 " aria-label="Pagination">
                    <div>
                      {currentPage > 0
                        ?
                        // <div className="pointer-events-auto rounded-md bg-indigo-600 py-2 px-3 text-[0.8125rem] font-semibold leading-5 text-white hover:bg-indigo-500"onClick={() => handlePageChange(currentPage-1)}>Prev</div>
                        <div className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50" onClick={() => handlePageChange(currentPage-1)}>
                          <svg className="h-5 w-5" x-description="Heroicon name: mini/chevron-left" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd"></path>
                          </svg>
                        </div>
                        :
                        <div className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50">
                          <svg className="h-5 w-5" x-description="Heroicon name: mini/chevron-left" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd"></path>
                          </svg>
                        </div>
                      }
                    
                      {currentPage < 4
                        ?
                        <div className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50" onClick={() => handlePageChange(currentPage+1)}>
                          <svg className="h-5 w-5" x-description="Heroicon name: mini/chevron-right" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd"></path>
                          </svg>
                        </div>
                        :
                        <div className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50">
                          <svg className="h-5 w-5" x-description="Heroicon name: mini/chevron-right" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd"></path>
                          </svg>
                        </div>
                      }
                    </div>                
                  </div>
                  {/* //////////////////// */}
                </div>
                  
                :
                  "There is no result for your search"
              }       
            </div>
          :
            null 
        }
        {/* Selected video list */}
          {showModal
            ?
            null
            :
            <div className="">
              {selectedVideos.length > 0 
                ? 
                scurrentData.map((video) => {
                    return(
                      <div key={video.id.videoId} className="mx-auto w-3/4 rounded-md border-gray-200 bg-white mt-2 pb-1 shadow-md">
                        <img
                          className="rounded-t-md"
                          src={video.snippet.thumbnails.medium.url}
                          alt={video.snippet.title}
                          onClick={() => handlePlayVideo(video)}
                        />
                        <p className="m-1">{video.snippet.title}</p>
                        <p className="m-1 font-light">{video.snippet.channelTitle}</p>
                      </div>
                    )
                  })
                :
                  null
              }
              {/* Pagination Selected */}
              <div className="grid place-items-center mt-3 " aria-label="Pagination">
                <div>
                  {scurrentPage > 0
                    ?
                    <div className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50" onClick={() => handlesPageChange(scurrentPage-1)}>
                      <svg className="h-5 w-5" x-description="Heroicon name: mini/chevron-left" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    :
                    <div className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50">
                      <svg className="h-5 w-5" x-description="Heroicon name: mini/chevron-left" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                  }
                
                  {scurrentPage < ceilData
                    ?
                    <div className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50" onClick={() => handlesPageChange(scurrentPage+1)}>
                      <svg className="h-5 w-5" x-description="Heroicon name: mini/chevron-right" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    :
                    <div className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50">
                      <svg className="h-5 w-5" x-description="Heroicon name: mini/chevron-right" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                  }
                </div>                
              </div>
              {/* //////////////////// */}       
            </div>
          }
            
            
            <div className="absolute top-1/2 right-0 ml-10 w-8 h-16 rounded-tl-full rounded-bl-full flex items-center justify-center bg-gray-200 shadow-lg ring-1 ring-white z-40" onClick={() => setShowSearch(false)}>
              <svg className="h-5 w-5" x-description="Heroicon name: mini/chevron-left" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd"></path>
              </svg> 
            </div>

      </div>
      <div className={`transition ease-in-out ${showSearch ? "col-span-4 bg-neutral-100 flex justify-center items-center " : "col-span-5"}`}>
        {showSearch 
          ? 
            null
          :
          <div className="absolute top-1/2 -left-10 ml-10 w-8 h-16 rounded-tr-full rounded-br-full flex items-center justify-center bg-gray-200 shadow-lg ring-1 ring-white z-40" onClick={() => setShowSearch(true)}>
            <svg className="h-5 w-5" x-description="Heroicon name: mini/chevron-right" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd"></path>
            </svg>
          </div>
        }
        <iframe
          className="w-full aspect-auto h-screen rounded-lg shadow-lg"
          id="ytplayer"
          type="text/html"
          src={`https://www.youtube.com/embed/${playVideo}`}
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}
