import {   useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Decal, useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";

interface ShirtModelProps {
  color: string;
  imageUrl?: string;
  isApplied: boolean;
  decalPosition?: [number, number, number];
  decalScale?: number;
  decalRotation?: number;
}

function ShirtDecal({
  imageUrl,
  position,
  scale,
  rotation,
}: {
  imageUrl: string;
  position: [number, number, number];
  scale: number;
  rotation: number;
}) {
  const texture = useTexture(imageUrl);
  useEffect(() => {
    texture.anisotropy = 16;
    texture.colorSpace = THREE.SRGBColorSpace;
  }, [texture]);
  return (
    <Decal
      position={position}
      rotation={[0, 0, (rotation * Math.PI) / 180]}
      scale={scale}
      map={texture}
      depthTest={false}
      depthWrite={false}
      polygonOffset
      polygonOffsetFactor={-4}
    />
  );
}

export default function ShirtModel({
  color,
  imageUrl,
  isApplied,
  decalPosition = [0, 0.04, 0.15],
  decalScale = 0.18,
  decalRotation = 0,
}: ShirtModelProps) {
  const { nodes, materials } = useGLTF("/shirt_baked.glb");
  
  // Create completely matte material (no shine, proper cotton fabric)
  const mat = new THREE.MeshLambertMaterial({
    color: new THREE.Color(color),
    side: THREE.DoubleSide, // Render both sides to avoid black inner faces
    emissive: new THREE.Color(0x000000),
    emissiveIntensity: 0,
  });

  useEffect(() => {
    mat.color.set(new THREE.Color(color));
  }, [color, mat]);

  useFrame((_, delta) => {
    mat.color.lerp(new THREE.Color(color), Math.min(delta * 4, 1));
  });

  const meshNode = nodes.T_Shirt_male as THREE.Mesh;
  if (!meshNode?.geometry) return null;

  return (
    <group>
      <mesh
        castShadow={false}
        receiveShadow={false}
        geometry={meshNode.geometry}
        material={mat}
        dispose={null}
      >
        {isApplied && imageUrl ? (
          <ShirtDecal
            imageUrl={imageUrl}
            position={decalPosition}
            scale={decalScale}
            rotation={decalRotation}
          />
        ) : null}
      </mesh>
    </group>
  );
}

useGLTF.preload("/shirt_baked.glb");
