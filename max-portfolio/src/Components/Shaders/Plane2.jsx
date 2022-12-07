import React from 'react'
import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'

const Plane2 = ({scale, color}) => {

    const mesh = useRef();
    const {viewport} = useThree();

    const clr = useMemo(() => color, [color])


  return (
    <>
        <mesh ref={mesh}>
            <planeGeometry args={[viewport.width, viewport.height]}/>
            <lineBasicMaterial color={clr} linewidth={1}/>

        </mesh>
    
    </>
  )
}

export default Plane2