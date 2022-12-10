import React, {useState, useCallback} from 'react'
import './App.css';
import axios from 'axios'


const API_KEY = "AIzaSyBzw3zJ57vaCtxzMCSHZ0ibJkPEggCh-dA";
const API_URL = "https://www.googleapis.com/youtube/v3/search";

function App() {

  const [searchTerm, setSearchTerm] = useState("")
  const [videos, setVideos] = useState([])
  const [selectedVideos, setSelectedVideo] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [playVideo, setPlayVideo] = useState("")

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    axios.get(API_URL, {
      params: {
        q: searchTerm,
        part: "snippet",
        type: "video",
        maxResults: 10,
        key: API_KEY
      }
    })
    .then((response) => {
      setVideos(response.data.items)
      setShowModal(true)
    })
    .catch((err) => {
      console.log(err)
    })
  };

  const handleSelect = (video) => {
    setSelectedVideo([...selectedVideos,video])
    setShowModal(false)
    setSearchTerm("")
  };

  const handlePlayVideo = (video) => {
    setPlayVideo(video.id.videoId)
    console.log(video.id.videoId)
    const itemIndex = selectedVideos.findIndex(obj => obj.id.videoId === video.id.videoId)
    setSelectedVideo((currentList) => {
      const newList = JSON.parse(JSON.stringify(currentList));
      newList.splice(itemIndex,1)
      return newList
    })
  }
  // Create a memoized version of the handleSelect, handlePlayVideo function
  // that only changes when the video argument changes
  const memoizedHandleSelect = useCallback(handleSelect, [selectedVideos]);
  const memoizedHandlePlayVideo = useCallback(handlePlayVideo, [playVideo]);
  console.log(selectedVideos) 
  return (
    <div className="App grid grid-cols-5">
      <div className="">
        <form onSubmit={handleSubmit}>
          <input
            type="search"
            value={searchTerm}
            placeholder="search for video"
            onChange={handleSearch}
          />
          <button type="submit">Search</button>
        </form>
          <ul>
          {videos.map((video) => {
            return (
              <li key={video.id.videoId}>
                <div className="flex">
                  <img
                    src={video.snippet.thumbnails.medium.url}
                    alt={video.snippet.title}
                    className="w-1/2"
                    onClick={() => memoizedHandleSelect(video)}
                  />
                  <p className="w-1/2">{video.snippet.title}</p>
                </div>
              </li>
            );
          })}
        </ul>

        <div>
          <h3>Selected Videos</h3>
          {selectedVideos.length > 0 ?
          (
            <ul>
              {selectedVideos.map((video)=>{
                return(
                  <li key={video.id.videoId} onClick={() => memoizedHandlePlayVideo(video)}>
                    <img src={video.snippet.thumbnails.default.url} alt={video.snippet.title} />
                    <p>{video.snippet.title}</p>
                </li>
                )
              })}
            </ul>
          ):
          "emty"
          }
        </div>
      </div>

      <div className="col-span-4">
      <iframe
        id="ytplayer"
        type="text/html"
        width="1360"
        height="768"
        src={`https://www.youtube.com/embed/${playVideo}`}
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
      </div>


    </div>
  );
}

export default App;







<div class="grid h-screen grid-cols-4 font-sans text-xs font-medium">
  <div class="bg-neutral-200">
    <div class="block text-center">
      <form class="inline-flex rounded-md bg-gray-50 text-[0.8125rem] font-medium leading-5 shadow-sm">
        <input class="bg-transparent p-1.5 focus:outline-none" placeholder="Search..." />
        <div class="border-l border-slate-400/20 py-2 px-2.5">
          <svg width="20" height="20" class="" viewBox="0 0 20 20"><path d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z" stroke="gray" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>
        </div>
      </form>
    </div>

    <div class="h-screen">
      <div class="mx-auto w-10/12 rounded-md border-gray-200 bg-white mt-2 pb-1 shadow-md">
        <img class="rounded-t-md" src="https://flowbite.com/docs/images/blog/image-1.jpg" alt="place" />
        <p class="m-1">Video Title</p>
        <p class="m-1 font-light">Video Title</p>
      </div>

      <div class="mx-auto w-10/12 rounded-md border-gray-200 bg-white mt-2 pb-1 shadow-md">
        <img class="rounded-t-md" src="https://flowbite.com/docs/images/blog/image-1.jpg" alt="place" />
        <p class="m-1">Video Title</p>
        <p class="m-1 font-light">Video Title</p>
      </div>

      <div class="mx-auto w-10/12 rounded-md border-gray-200 bg-white mt-2 pb-1 shadow-md">
        <img class="rounded-t-md" src="https://flowbite.com/docs/images/blog/image-1.jpg" alt="place" />
        <p class="m-1">Video Title</p>
        <p class="m-1 font-light">Video Title</p>
      </div>

      <div class="mx-auto w-10/12 rounded-md border-gray-200 bg-white mt-2 pb-1 shadow-md">
        <img class="rounded-t-md" src="https://flowbite.com/docs/images/blog/image-1.jpg" alt="place" />
        <p class="m-1">Video Title</p>
        <p class="m-1 font-light">Video Title</p>
      </div>

      
    </div>
    

    
  </div>
  <div class="col-span-3 bg-neutral-100">
    <iframe class="w-full aspect-video rounded-lg shadow-lg mb-10" src="https://www.youtube.com/embed/v=Q1gnQcwr4pE"></iframe>
    <div class="z-10 h-16 w-8 rounded-tl-full rounded-bl-full bg-red-400"></div>
    <div class="ml-10 w-16 h-16 rounded-full flex items-center justify-center bg-pink-500 shadow-lg ring-2 ring-white z-40 dark:ring-slate-900">05</div>
  </div>
</div>