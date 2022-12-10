import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import axios from "axios";

const API_KEY = "AIzaSyBzw3zJ57vaCtxzMCSHZ0ibJkPEggCh-dA";
const API_URL = "https://www.googleapis.com/youtube/v3/search";
export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [videos, setVideos] = useState([]);
  const [selectedVideos, setSelectedVideo] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [playVideo, setPlayVideo] = useState("");

  // Assign value for searchTerm
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  //Submit from and call the API
  const handleSubmit = (event) => {
    console.log("hi");
    event.preventDefault();

    axios
      .get(API_URL, {
        params: {
          q: searchTerm,
          part: "snippet",
          type: "video",
          maxResults: 10,
          key: API_KEY,
        },
      })
      .then((response) => {
        console.log(response.data.items)
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
  //Select video from queque and play it
  const handlePlayVideo = (video) => {
    setPlayVideo(video.id.videoId);
    console.log(video.id.videoId);
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
  const memoizedHandlePlayVideo = useCallback(handlePlayVideo, [playVideo]);

  // const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  // const itemPerPage = 5;
  // const initialPage = 0;

  // const [currentPage, setCurrentPage] = useState(initialPage);
  // const [currentData, setCurrentData] = useState(data.slice(0, 5));

  // const getItem = () => {
  //   let startIndex = currentPage * itemPerPage;
  //   let endIndex = startIndex + itemPerPage;

  //   return data.slice(startIndex, endIndex);
  // };
  // const handlePageChange = (page) => {
  //   setCurrentPage(page);
  //   console.log(currentData);
  // };

  // useEffect(() => {
  //   setCurrentData(getItem());
  // }, [currentPage]);

  return (
    <div class="grid h-screen grid-cols-4 font-sans text-xs font-medium">
      <div class="bg-neutral-200">
        {/* Search Section */}
        <div class="block text-center">
          <form onSubmit={handleSubmit} class="inline-flex rounded-md bg-gray-50 text-[0.8125rem] font-medium leading-5 shadow-sm">
            <input
              class="bg-transparent p-1.5 focus:outline-none"
              type="search"
              value={searchTerm}
              placeholder="search for video"
              onChange={handleSearch}
            />
            <button type="submit" class="border-l border-slate-400/20 py-2 px-2.5">
              <svg width="20" height="20" class="" viewBox="0 0 20 20">
                <path
                  d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z"
                  stroke="gray"
                  fill="none"
                  fill-rule="evenodd"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </svg>
            </button>
          </form>
        </div>
        {/* Search result modal */}
        {showModal 
          ?
            <div class="h-screen">
              <button onClick={() => setShowModal(false)}>x</button>
              {videos.length > 0 
                ?
                
                  videos.map((video) => {
                    return(
                      <div key={video.id.videoId} class="mx-auto w-10/12 rounded-md border-gray-200 bg-white mt-2 pb-1 shadow-md">
                        <img
                          class="rounded-t-md"
                          src={video.snippet.thumbnails.medium.url}
                          alt={video.snippet.title}
                          onClick={() => memoizedHandleSelect(video)}
                        />
                        <p class="m-1">{video.snippet.title}</p>
                        <p class="m-1 font-light">{video.snippet.channelTitle}</p>
                      </div>
                    )
                  })
                :
                  "There is no result for your search"
              }       
            </div>
          :
            null 
        }
        {/* Selected video list */}

        <div class="h-screen">
              {selectedVideos.length > 0 
                ?
                
                selectedVideos.map((video) => {
                    return(
                      <div key={video.id.videoId} class="mx-auto w-10/12 rounded-md border-gray-200 bg-white mt-2 pb-1 shadow-md">
                        <img
                          class="rounded-t-md"
                          src={video.snippet.thumbnails.medium.url}
                          alt={video.snippet.title}
                          onClick={() => memoizedHandlePlayVideo(video)}
                        />
                        <p class="m-1">{video.snippet.title}</p>
                        <p class="m-1 font-light">{video.snippet.channelTitle}</p>
                      </div>
                    )
                  })
                :
                  "There is no nothing"
              }       
            </div>

        
      </div>
      <div class="col-span-3 bg-neutral-100">
        <iframe
          class="w-full aspect-video rounded-lg shadow-lg mb-10"
          id="ytplayer"
          type="text/html"
          src={`https://www.youtube.com/embed/${playVideo}`}
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
        {/* <div class="z-10 h-16 w-8 rounded-tl-full rounded-bl-full bg-red-400"></div> */}
      </div>
    </div>
  );
}
