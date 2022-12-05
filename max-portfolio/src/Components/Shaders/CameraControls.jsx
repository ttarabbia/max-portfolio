import { useFrame, useThree, extend } from '@react-three/fiber';
import React from 'react'
import { useRef } from 'react';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
extend({OrbitControls})

const CameraControls = () => {

    const{ 
        camera,
        gl: {domElement}
    } = useThree();

    const controlsRef = useRef()
    useFrame(() => controlsRef.current.update())

  return (
    <orbitControls
    ref={controlsRef}
    args={[camera, domElement]}
    autoRotate
    autoRotateSpeed={-0.2}
    />
  )
}

export default CameraControls