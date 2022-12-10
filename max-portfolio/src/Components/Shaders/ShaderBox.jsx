import React, { Suspense, useEffect, useRef } from 'react'
import {Canvas} from "@react-three/fiber"
import {Leva, useCreateStore, useControls} from "leva"
import "./ShaderBox.css"
import Plane from './Plane'
import vertexShader from "../../assets/vertexShader.js"


//For reference https://stackoverflow.com/questions/24820004/how-to-implement-a-shadertoy-shader-in-three-js

const ShaderBox = ({fragmentShader, offset, len, controls, setModal}) => {

    const vshader = useRef(vertexShader)
    const fshader = useRef(fragmentShader)

    function mod(n, m) {
        return ((n % m) + m) % m;
      }

      const animate = useRef(false)

      const setAnimate = () => {
        animate.current = !animate.current;
        console.log(animate.current)
    }
      


    const localStore = useCreateStore()
    // const cntrl = useControls(controls, {store: localStore})

    const handleClick = (e) => {
        setModal([vshader, fshader, controls, localStore]);
    }
  


  return (
    <div className="carousel-comp" style={{
        transform: `translate(${mod(offset, len) *  -105}%)`,
        transition: "0.5s",
        }}>
        {/* <Leva titleBar={{drag: false, filter: false}} collapsed store={localStore}/> */}
        <div className='shader'>
            <div onClick={(e) => handleClick(e)} className='canvas' onMouseEnter={setAnimate} onMouseLeave={setAnimate}>
                    <Suspense fallback={<div>Loading....</div>}>
                        <Canvas gl={{alpha: false, logarithmicDepthBuffer: true}}>
                            <Plane vshader={vshader} fshader={fshader} controls={controls} store={localStore} animate={animate}/>
                        </Canvas>
                    </Suspense>
            </div>
        </div>
    </div>
  )
}

export default ShaderBox