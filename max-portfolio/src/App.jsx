import React from 'react'
import Intro from './Components/Intro'
import images from "./assets/images.json"
import {background} from "./assets/background.json"
import {Shaders} from "./assets/Shaders.js"
import Carousel from './Components/Carousel'
import ContactMe from './Components/ContactMe'
import ShaderCarousel from "./Components/Shaders/ShaderCarousel"
import "./App.css"

const App = () => {

  return (
    <div className='app'>
        <Intro image={background}/>
        {Object.keys(images).map((catName, i) => (
            <Carousel key={i} catName={catName} images={images[catName]}/>))}
        <ShaderCarousel key={"shader"} shaders={Shaders}/>
        <ContactMe/>
    </div>
  )
}

export default App
