import React, { useMemo, useRef } from 'react';
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect } from 'react';
import { useControls } from 'leva';
// import {Color} from "three"

const Plane = ({fshader, vshader}) => {

    
    const mesh = useRef();
    const {viewport} = useThree();

    mesh.fshader = fshader.current;
    mesh.vshader = vshader.current;

    let {speed, scale, other1, other2, color } = useControls({
        speed: {value: 1.0, min: 0.1, max: 50.},
        scale: {value: 0.5, min: 0.05, max: 20.},
        Other: {value: "10", min: 1, max: 32, step: 1},
        Other2: {value: "32", min: 0, max: 512, step: 16},
        color: {value: "#ff005b"}
      })

    
    const uniforms = useMemo(() => ({
        iTime: {value: 1.0},
        iScale: {value: scale},
        iSpeed: {value: speed},
        iColor: {value: color},
    }), []);

    // useEffect(() =>{
    //     mesh.current.material.uniforms.iScale = scale;
    //     mesh.current.material.uniforms.iSpeed = speed;
    // },[scale, speed])


    useFrame(({clock}) => {
        mesh.current.material.uniforms.iTime.value = clock.getElapsedTime();
        mesh.current.material.uniforms.iScale.value = scale;
        mesh.current.material.uniforms.iSpeed.value = speed;
        mesh.current.material.uniforms.iColor.value = color;
        console.log(mesh.current.material.uniforms)
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