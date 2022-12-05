import React from 'react'
// import circleImg from "../../assets/circle.png"
import "./ShaderBox.css"
import AnimationCanvas from './AnimationCanvas'
import { Suspense, useState } from 'react'



const ShaderBox = () => {

    const [speed, setSpeed] = useState(15)
    const [color, setColor] = useState(0x00AAFF)
    console.log(speed)

  return (
    <div className='shader'>
        <div className='shader--sliders'>
            <input type="range" min="1" max="100" value={speed} className="slider" onChange={(e) => setSpeed(e.target.value)}/>
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)}/>
        </div>
        <div className='anim'>
            <Suspense fallback={<div>Loading...</div>}>
                <AnimationCanvas speed={speed} color={color}/>
            </Suspense>

        </div>
    </div>
  )
}

export default ShaderBox