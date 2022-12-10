import React, { Suspense,  useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Leva, useCreateStore } from 'leva'
import Plane from './Plane'

const ShaderModal = ({shader, setModal}) => {
  

    const animate = useRef(true)

    useEffect(() => {
      const handleEsc = (event) => {
         if (event.keyCode === 27) {
          setModal(null)
        }
      };
      window.addEventListener('keydown', handleEsc);
  
      return () => {
        window.removeEventListener('keydown', handleEsc);
      };
    }, []);
    

    console.log(shader)
  return (
    <>
       <div className='modal'>
        <div className='modal--container'>
                <button className='modal--exit' onClick={() => setModal(null)}> X </button>
                <Leva titleBar={{drag: false, filter: false}} store={shader[3]}/>
                <Suspense fallback={<div>Loading....</div>}>
                    <Canvas gl={{alpha: false, logarithmicDepthBuffer: true}}>
                        <Plane vshader={shader[0]} fshader={shader[1]} controls={shader[2]} store={shader[3]} animate={animate}/> 
                    </Canvas>
                </Suspense>
        </div>
    </div>
    </>
  )
}

export default ShaderModal