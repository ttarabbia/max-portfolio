import React, { useMemo, useRef } from 'react';
import { useFrame, useThree } from "@react-three/fiber";
// import {Color} from "three"

const Plane = ({fshader, vshader, scale, speed}) => {

    const mesh = useRef();
    const {viewport} = useThree();

    mesh.fshader = fshader.current;
    mesh.vshader = vshader.current;

    const uniforms = useMemo(() =>({
        iTime: { value: 0.0,},
        iScale: {value: scale},
        iSpeed: {value: speed}
    }), []);

    useFrame((state) => {
        const {clock} = state;
        mesh.current.material.uniforms.iTime.value = clock.getElapsedTime();
        mesh.current.material.uniforms.iScale.value = scale;
        mesh.current.material.uniforms.iSpeed.value = speed;
    });

    console.log(viewport)
    console.log(useThree())
    console.log(viewport.width)

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