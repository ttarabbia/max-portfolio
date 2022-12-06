import React, { useMemo, useRef } from 'react';
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect } from 'react';
// import {Color} from "three"

const Plane = ({fshader, vshader, scale, speed}) => {

    const mesh = useRef();
    const {viewport} = useThree();

    mesh.fshader = fshader.current;
    mesh.vshader = vshader.current;

    const uniforms = useMemo(() =>({
        iTime: {value: 1.0},
        iScale: {value: scale},
        iSpeed: {value: speed}
    }), []);

    useEffect(() =>{
        mesh.current.material.uniforms.iScale = scale;
        mesh.current.material.uniforms.iSpeed = speed;
    },[scale, speed])


    useFrame(({clock}) => {
        // console.log(clock)
        // mesh.current.uniforms = 
        //     {...mesh.current.uniforms,
        //         iTime: {value: clock.getElapsedTime()},
        //         iScale: {value: scale},
        //         iSpeed: {value: speed}}
        mesh.current.material.uniforms.iTime = clock.getElapsedTime();
        mesh.current.rotation.y = Math.sin(clock.getElapsedTime())
        mesh.current.material.uniforms.iScale = scale;
        mesh.current.material.uniforms.iSpeed = speed;
        // console.log(mesh.current.material.uniforms.iTime.value)
    });

  return (
    <>
        <mesh ref={mesh}>
            <planeGeometry args={[viewport.width, viewport.height]}/>
            <shaderMaterial
                fragmentShader={fshader.current}
                vertexShader={vshader.current}
                uniforms={uniforms}/>
        </mesh>
    </>
  )
};

export default Plane