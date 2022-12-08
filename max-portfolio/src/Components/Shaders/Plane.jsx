import React, { useMemo, useRef } from 'react';
import { useFrame, useThree } from "@react-three/fiber";
// import {Color} from "three"

const Plane = ({fshader, vshader, controls}) => {

    
    const mesh = useRef();
    const {viewport} = useThree();

    mesh.fshader = fshader.current;
    mesh.vshader = vshader.current;

    let {speed, scale, other1, other2, color } = controls;

    
    const uniforms = useMemo(() => ({
        iTime: {value: 1.0},
        iScale: {value: scale},
        iSpeed: {value: speed},
        iColor: {value: color},
    }), []);


    useFrame(({clock}) => {
        mesh.current.material.uniforms.iTime.value = clock.getElapsedTime();
        mesh.current.material.uniforms.iScale.value = scale;
        mesh.current.material.uniforms.iSpeed.value = speed;
        mesh.current.material.uniforms.iColor.value = color;
        // console.log(mesh.current.material.uniforms)
    });

  return (
    <>
        <mesh ref={mesh}>
            <planeGeometry args={[viewport.width, viewport.height]}/>
            <shaderMaterial
                attach="material"
                fragmentShader={fshader.current}
                vertexShader={vshader.current}
                uniforms={uniforms}/>
        </mesh>
    </>
  )
};

export default Plane