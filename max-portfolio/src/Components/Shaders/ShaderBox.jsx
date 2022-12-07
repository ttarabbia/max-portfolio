import React, { Suspense, useState, useRef } from 'react'
import {Canvas} from "@react-three/fiber"
import {Leva} from "leva"
import "./ShaderBox.css"
import Plane from './Plane'
import vertexShader from "../../assets/vertexShader.js"
// import fragmentShader from "../../assets/fragmentShader.js"
// import fragmentShader2 from "../../assets/fragmentShader2.js"

//For reference https://stackoverflow.com/questions/24820004/how-to-implement-a-shadertoy-shader-in-three-js

const ShaderBox = ({fragmentShader, offset, len}) => {

    const vshader = useRef(vertexShader)
    const fshader = useRef(fragmentShader)

    function mod(n, m) {
        return ((n % m) + m) % m;
      }




  return (
    <div className="carousel-comp" style={{
        transform: `translate(${mod(offset, len) *  -105}%)`,
        transition: "0.5s",
        }}>
        <Leva titleBar={{drag: false, filter: false}} collapsed/>
        <div className='shader'>
            {/* <div className='shader--sliders'>
                <input type="range" min="0.1" max="20." value={scale} className="Scale" onChange={(e) => setScale(e.target.value)}/>
                <label htmlFor="Scale">Scale</label>
                <input type="range" min="0.1" max="20." value={speed} className="Speed" onChange={(e) => setSpeed(e.target.value)}/>
                <label htmlFor="Speed">Speed</label>
            </div> */}
            <div className='canvas'>
                    <Suspense fallback={null}>
                    {/* <AnimationCanvas speed={speed} color={color}/> */}
                        <Canvas gl={{alpha: false, logarithmicDepthBuffer: true}}>
                            <Plane vshader={vshader} fshader={fshader}/>
                        </Canvas>
                    </Suspense>

            </div>
        </div>
    </div>
  )
}

export default ShaderBox