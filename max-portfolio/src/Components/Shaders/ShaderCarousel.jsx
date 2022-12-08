
import React, { useState, useEffect} from 'react'
import ShaderBox from './ShaderBox'


const Carousel = ({shaders}) => {

    const [offset, setOffset] = useState(0)

    const len = shaders.length
    for (let i = 0; i < shaders.length; i++){
      console.log(shaders[i]["controls"])
    }


  return (
    <>
        <div className="carousel">
            <h1 className='carousel--title'>Shaders</h1>
            <p className="carousel--prev-arrow carousel--arrow" onClick={() => setOffset(offset => offset-1)}>&#10094;</p>

            <p className="carousel--next-arrow carousel--arrow" onClick={() => setOffset(offset => offset+1)}>&#10095;</p>
            <div className='carousel--images'>
                {shaders?.map((shader, idx) => <ShaderBox key={idx} fragmentShader={shader["shader"]} offset={offset} len={len-1} controls={shader["controls"]}/>)}      
            </div>
        </div>
    </>
  )
}

export default Carousel