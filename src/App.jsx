import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import { useState } from 'react'
import './App.css'
const ffmpeg = createFFmpeg({ log: true })

function App() {
  const [videoSrc, setVideoSrc] = useState("");
  const [videoFile, setVideoFile] = useState();
  const [imageSrc, setImageSrc] = useState("");

  const handleChangeVideo = (e) => {
    const file = e.target.files[0];
    console.log(file)
    setVideoFile(file);
  }

  const createVideo = async () => {
    console.log('entre')
    await ffmpeg.load()
    ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(videoFile));
    console.log('pase1')
    await ffmpeg.run("-i", "test.mp4", "-t", "20", "-map", "0", "-map", "-0:a", "-c", "copy", "prueba1.mp4")
    await ffmpeg.run("-i", "test.mp4", '-ss', '15', "-t", "1", '-f', 'image2', "image.png")

    const data = ffmpeg.FS('readFile', 'prueba1.mp4');
    const data2 = ffmpeg.FS('readFile', 'image.png');

    const url = URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" }))
    const url2 = URL.createObjectURL(new Blob([data2.buffer], { type: "image/png" }))
    setVideoSrc(url);
    setImageSrc(url2);
  }

  return (
    <div className="App">
      <br></br>
      <video
        controls
        width="250"
        src={videoFile ? URL.createObjectURL(videoFile) : null}>
      </video>
      <br></br>
      <input type="file" id="video" accept="video/*" onChange={handleChangeVideo}></input>
      <br></br>
      <button onClick={createVideo}>Create a video from the things above!</button>
      <br></br>
      <video src={videoSrc} width="250" controls></video>
      <img src={imageSrc}
        width="250"
        alt="capture" />
    </div>
  )
}

export default App;