
import { useState } from 'react';
import './App.css';
import defaultImage from './colorizedefault.jpg';

function App() {

  const [loading, setLoading] = useState(false);
  const [loadingSecond, setLoadingSecond] = useState(false);
  const [greyscaleimg, setGreyScaleImg]  = useState('');
  const [gimgFile, setgimgFile] = useState(null);
  const [coloredImg, setColoredImg] = useState('');
  const [originalImage, setOriginalImage] = useState('')
  const [originalImageFile, setOriginalImageFile] = useState(null);
  const [difference, setDifference] = useState('__')

  const handleImage = (event) => {
    const file = event.target.files[0];
    console.log(file)
    if (file && file.type.startsWith('image')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        console.log(event.target.result)
        setGreyScaleImg(event.target.result);
      }
      reader.readAsDataURL(file);
      console.log(reader)
      setgimgFile(file);
    }
    else {
      alert("It seems the file type attached is not an image, please attach an image.")
    }
  }
  const handleColoredImage = (event) => {
    const file = event.target.files[0];
     if (file && file.type.startsWith('image')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        console.log(event.target.result)
        setOriginalImage(event.target.result);
      }
      reader.readAsDataURL(file);
      console.log(reader)
      setOriginalImageFile(file);
    }
    else {
      alert("It seems the file type attached is not an image, please attach an image.")
    }
  }
  const dataURLtoBlob = (dataURL) => {
    // Decode the dataURL    
    const parts = dataURL.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;

    // Convert binary to array
    const uInt8Array = new Uint8Array(rawLength);
    for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    // Return Blob from the typed array
    return new Blob([uInt8Array], {type: contentType});
  }
  const uploadImage = async () => {
    if (!greyscaleimg) {
      alert('Please select an image first')
    }
    const formData = new FormData();
    formData.append('file', gimgFile);
    try {
      setLoading(true);
      const response = await fetch("http://127.0.0.1:8000/upload", {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      // setColoredImg(`data:image/jpeg;base64,${result.image}`)
      let img = new Image();
      img.src = 'data:image/jpeg;base64,' + result.image;
      setColoredImg(img.src)
      console.log(result)
      setLoading(false)
    } catch (error) {
      setLoading(false);
      console.error('Error uploading image:', error);
      alert('Error uploading image');
    }
  }
  const compareImages = async () => {
    if (!coloredImg || !originalImage) {
      alert("Please upload required images first.")
    }
    const blob = dataURLtoBlob(coloredImg);
    const formData = new FormData();
    // formData.append('original', originalImageFile);
    formData.append('original', originalImageFile);
    formData.append('colorized', blob, 'colorized.jpeg');
    try {
      setLoadingSecond(true);
      const response = await fetch("http://127.0.0.1:8000/compare", {
        method: "POST",
        body: formData
      });
      const result = await response.json();
      console.log(result.difference)
      setDifference(result.difference)
      setLoadingSecond(false)
    } catch (error) {
      setLoadingSecond(false);
      console.error('Error uploading images:', error);
      alert('Error uploading images');
    }

  }
  return (
    <div className="App">
      <div className='header'>
        <h1>Image Colorizer</h1>
      </div>
      <div className='attachFile'>
        <label for="formFileLg" className="form-label">Select a grescale image to colorize.</label>
        <input className="form-control form-control-lg image-input" id="formFileLg" type="file" onChange={handleImage}></input>
      </div>
      <div className='imageboxes'>
        <div className='greyscale'>
        <div className="card" style={{width: "18rem"}}>
          <img src={greyscaleimg || defaultImage} className="card-img-top" alt="..."></img>
          <div class="card-body">
            <h5>Greyscale Image</h5>
          </div>
        </div>
        </div>
        <div className='colorized'>
        <div className="card" style={{width: "18rem"}}>
          <img src={coloredImg || defaultImage} className="card-img-top" alt="..."></img>
          <div className="card-body">
            <h5>Colorized Image</h5>
          </div>
        </div>
        </div>
      </div>
      <div className='submit'>
        {
          loading ? (
            <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
          </div>
          ): (
            <button type="button" class="btn btn-success btn-lg" onClick={uploadImage}>Colorize</button>
          )
        }
    
      </div>
      <div className='comparison'>
        <div className='attachFile'>
        <label for="formFileLg" className="form-label">Attach original image to compare difference.</label>
        <input className="form-control form-control-lg image-input" id="formFileLg" type="file" onChange={handleColoredImage}></input>
        </div>
        <div className='submit padleft-submit' >
        {
          loadingSecond ? (
            <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
          </div>
          ): (
            <button type="button" class="btn btn-success btn-lg" onClick={compareImages}>Compare</button>
          )
        }
    
      </div>
      </div>
      <div className="original">
        <div className="card" style={{width: "18rem"}}>
          <img src={originalImage || defaultImage} className="card-img-top" alt="..."></img>
          <div className="card-body">
            <h5>Original Image</h5>
          </div>
        </div>
        <div class="alert alert-success d-flex align-items-center alert-size" role="alert">
       <div>
        Original and generated differ by {`${difference}`}
      </div>
      </div>
        
</div>


  
    </div>
  );
}

export default App;
