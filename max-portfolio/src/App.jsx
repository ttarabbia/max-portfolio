import React from 'react'
import Intro from './Components/Intro'
import images from "./assets/images.json"
import {background} from "./assets/background.json"
import {Shaders} from "./assets/Shaders.js"
import Carousel from './Components/Carousel'
import ContactMe from './Components/ContactMe'
import ShaderCarousel from "./Components/Shaders/ShaderCarousel"
import "./App.css"
import ShaderBox from './Components/Shaders/ShaderBox'
import fragmentShader from "./assets/fragmentShader2.js"

const App = () => {

  return (
    <div className='app'>
        <Intro image={background}/>
        {Object.keys(images).map((catName, i) => (
          <Carousel key={i} catName={catName} images={images[catName]}/>))}
        <ShaderCarousel key={"shader"} shaders={Shaders}/>
        {/* <ShaderBox fragmentShader={fragmentShader} offset="0" len="1" meshRef={useRef()}/> */}
        <ContactMe/>
    </div>
  )
}

export default App
