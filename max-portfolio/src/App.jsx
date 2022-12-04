import React from 'react'
import Intro from './Components/Intro'
import images from "./assets/images.json"
import Carousel from './Components/Carousel'
import ContactMe from './Components/ContactMe'
import ShaderBox from './Components/ShaderBox'
import "./App.css"

const App = () => {
  return (
    <div className='app'>
        <Intro image={images["background"]}/>
        {Object.keys(images).map((catName, i) => (
            <Carousel key={i} catName={catName} images={images[catName]}/>))}
        <ShaderBox/>
        <ContactMe/>
    </div>
  )
}

export default App