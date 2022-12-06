import React from 'react'
import { useState, useEffect} from 'react'
import ShaderBox from './ShaderBox'


const Carousel = ({shaders}) => {

    const [offset, setOffset] = useState(0)
    const [seconds, setSeconds] = useState(0)

    const len = shaders.length-1
    console.log(offset)


  return (
    <>
        <div className="carousel">
            <h1 className='carousel--title'>Shaders</h1>
            <p className="carousel--prev-arrow carousel--arrow" onClick={() => setOffset(offset => offset-1)}>&#10094;</p>

            <p className="carousel--next-arrow carousel--arrow" onClick={() => setOffset(offset => offset+1)}>&#10095;</p>
            <div className='carousel--images'>
                {shaders?.map((shader, idx) => <ShaderBox key={idx} fragmentShader={shader} offset={offset} idx={idx} len={len}/>)}      
            </div>
        </div>
    </>
  )
}

export default Carousel