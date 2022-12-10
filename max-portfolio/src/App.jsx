import React, {useState} from 'react'

import Intro from './Components/Intro'
import Carousel from './Components/Carousel'
import ContactMe from './Components/ContactMe'
import ShaderCarousel from "./Components/Shaders/ShaderCarousel"
import Modal from './Components/Modal'
import ShaderModal from './Components/Shaders/ShaderModal'

import images from "./assets/images.json"
import {background} from "./assets/background.json"
import {Shaders} from "./assets/Shaders.js"
import "./App.css"




const App = () => {


  const [modal, setModal] = useState(null);
  const [shaderModal, setShaderModal] = useState(null)
  //https://docs.pmnd.rs/react-three-fiber/advanced/scaling-performance
  const [dpr, setDpr] = useState()

  return (
    <div className='app'>
        <Intro image={background}/>
        {Object.keys(images).map((catName, i) => (
          <Carousel key={i} catName={catName} images={images[catName]} setModal={setModal}/>))}
        {/* <PerformanceMonitor /> */}
        <ShaderCarousel key={"shader"} shaders={Shaders} setModal={setShaderModal}/>
        {modal ? <Modal img={modal} setModal={setModal}/> : null}
        {shaderModal ? <ShaderModal shader={shaderModal} setModal={setShaderModal} /> : null}
        <ContactMe/>
    </div>
  )
}

export default App
