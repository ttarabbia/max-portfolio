import React from 'react'
import {Canvas} from "@react-three/fiber"
import Points from './Points'
import { Suspense } from 'react'
import CameraControls from './CameraControls'

const AnimationCanvas = ({speed, color}) => {


    return(
        <Canvas
            camera={{position: [100, 10, 0], fov: 75}}
            >
                <Suspense fallback={null}>
                    <Points cnt={500} speed={speed} fvar={0.003} avar={8} color={color}/>
                </Suspense>
                <CameraControls/>
        </Canvas>
    )
}

export default AnimationCanvas