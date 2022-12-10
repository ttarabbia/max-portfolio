import React, { useMemo, useRef, useCallback} from 'react';
import { useControls } from 'leva';
import { useFrame, useThree } from "@react-three/fiber";
import {Stats} from "@react-three/drei"
import { Vector2 } from 'three';
// import {Color} from "three"

const Plane = ({fshader, vshader, controls, store, animate}) => {

    
    const mesh = useRef();
    const {viewport} = useThree();

    mesh.fshader = fshader.current;
    mesh.vshader = vshader.current;

    let {iSpeed, iScale, other1, other2, iColor } = useControls(controls, {store: store});

    const {height, width, factor} = viewport




    
    const uniforms = useMemo(() => ({
        iTime: {value: 1.0},
        iScale: {value: iScale},
        iSpeed: {value: iSpeed},
        iColor: {value: iColor},
        iResolution : {value: new Vector2(width, height)},
        iMouse : {value: new Vector2(0,0)}
    }), []);


    useFrame(({clock, mouse}) => {
        if (animate.current){
            mesh.current.material.uniforms.iTime.value = clock.getElapsedTime();
            mesh.current.material.uniforms.iScale.value = iScale;
            mesh.current.material.uniforms.iSpeed.value = iSpeed;
            mesh.current.material.uniforms.iColor.value = iColor;
    
            mesh.current.material.uniforms.iMouse.value = new Vector2(mouse?.x*width*factor * 2, mouse?.y*height*factor * 2);
            mesh.current.material.uniforms.iResolution.value  = new Vector2(width*factor, height*factor);
        }

        // console.log(mesh.current.material.uniforms.iMouse)
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
        <Stats />
    </>
  )
};

export default Plane