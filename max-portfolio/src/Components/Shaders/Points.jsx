import React from 'react'
import * as THREE from 'three'
import circleImg from "../../assets/circle.png"
import { useMemo } from 'react'
import {useFrame, useLoader} from "@react-three/fiber"
import { useCallback, useRef } from 'react'

const Points = ({cnt, speed, fvar, avar, color}) => {
    const imgTex = useLoader(THREE.TextureLoader, circleImg);
    const bufferRef = useRef()

    let t = 0;
    let f = fvar;
    let a = avar;


    const graph = useCallback((x, z) => {
        return Math.sin(f * (x ** 2 + z ** 2 + t)) * a;
    }, [t, f, a])


    const sep = 3;
    const count = cnt;

    let positions = useMemo(() => {

        let positions = []

        for(let xi = 0; xi < count; xi++){
            for(let zi = 0; zi < count; zi++){
                let x = sep * (xi - count /2);
                let z = sep * (zi - count /2);
                let y = graph(x, z);
                positions.push(x, y, z);
            }
        }

        return new Float32Array(positions)
    }, [count, sep, graph])


    useFrame(() => {
        bufferRef.current.speed = speed;
        t += bufferRef.current.speed;
        const positions = bufferRef.current.array;

        let i = 0;
        for(let xi = 0; xi < count; xi++){
            for(let zi = 0; zi < count; zi++){
                let x = sep * (xi - count /2);
                let z = sep * (zi - count /2);
                positions[i + 1] = graph(x, z);
                i += 3;
            }
        }
        bufferRef.current.needsUpdate = true;
    })


    return(
        <points>
            <bufferGeometry attach="geometry">
                <bufferAttribute
                ref={bufferRef}
                attach='attributes-position'
                array={positions}
                count={positions.length/3}
                itemSize={3}
                onUpdate={(self) => console.log("props updated")}
                />
            </bufferGeometry>

            <pointsMaterial
                attach="material"
                map={imgTex}
                color={color}
                size={0.5}
                sizeAttenuation
                transparent={false}
                alphaTest={0.5}
                opacity={1.0}
                />
        </points>
    )
}

export default Points