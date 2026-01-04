"use client";
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
// import modelPath from "../public/models/compas.gltf";

function CompassIndicator(props: any) {
  const gltf = useGLTF("/models/arrow/arrow_custom.gltf");
  return <primitive {...props} object={gltf.scene} />;
}

export default function Scene({
  absolute,
  alpha,
  beta,
  gamma,
  permissionGranted,
}: {
  absolute: boolean;
  alpha: number;
  beta: number;
  gamma: number;
  permissionGranted: boolean;
}) {
  console.log(alpha);
  return (
    <Canvas
      className="h-full w-screen"
      camera={{ position: [0, 2, 5], fov: 75 }}
    >
      {/* <color attach="background" args={["#282c34"]} /> */}
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <Environment preset="city" />
      <group rotation={[0, alpha, 0]}>
        <CompassIndicator />
      </group>
      {/* <OrbitControls /> */}
    </Canvas>
  );
}
