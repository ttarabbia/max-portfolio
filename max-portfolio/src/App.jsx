import React, {useState} from 'react'
import Intro from './Components/Intro'
import Carousel from './Components/Carousel'
import ContactMe from './Components/ContactMe'
import ShaderCarousel from "./Components/Shaders/ShaderCarousel"
import Modal from './Components/Modal'
import ShaderBox from './Components/Shaders/ShaderBox'
import images from "./assets/images.json"
import {background} from "./assets/background.json"
import {Shaders} from "./assets/Shaders.js"
import "./App.css"




const App = () => {


  const [modal, setModal] = useState("https://media.journoportfolio.com/users/164251/images/ec8f8941-45b7-42eb-a178-2227907360ab.jpg");


  return (
    <div className='app'>
        {/* <Intro image={background}/>*/}
        {Object.keys(images).map((catName, i) => (
          <Carousel key={i} catName={catName} images={images[catName]} setModal={setModal}/>))}
        {/* <ShaderCarousel key={"shader"} shaders={Shaders} modalState={modalState}/> */}
        {modal ? <Modal img={modal} setModal={setModal}/> : null}
        <ContactMe/>
    </div>
  )
}

export default App
