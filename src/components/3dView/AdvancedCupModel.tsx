// AdvancedCupModel.tsx
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function AdvancedCupModel({
  texture,
  color,
  position,
  rotation,
  scale,
  uvOffset,
}: {
  texture: THREE.Texture | null;
  color: THREE.Color;
  position: { x: number; y: number };
  rotation: { x: number; y: number; z: number };
  scale: number;
  uvOffset: { u: number; v: number };
}) {
  const cupRef = useRef<THREE.Group>(null);
  const textureMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  
  // Create optimized cup geometry with perfect UV mapping
  const { cupGeometry, textureGeometry } = useMemo(() => {
    // Parameters for cup dimensions
    const height = 2;
    const topRadius = 1;
    const bottomRadius = 0.9;
    // const rimHeight = 0.1;
    const segments = 64;
    
    // Main cup geometry
    const cupGeom = new THREE.CylinderGeometry(
      topRadius,
      bottomRadius,
      height,
      segments,
      32,
      true
    );
    
    // Adjust UVs for perfect cylindrical mapping
    const uvs = cupGeom.attributes.uv;
    const positions = cupGeom.attributes.position;
    
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = positions.getZ(i);
      
      // Calculate cylindrical coordinates
      // const radius = Math.sqrt(x * x + z * z);
      const angle = Math.atan2(z, x);
      
      // Normalize angle to 0-1 range for U coordinate
      let u = (angle + Math.PI) / (2 * Math.PI);
      
      // Normalize height to 0-1 range for V coordinate
      // Exclude rim and bottom
      const normalizedY = (y + height / 2) / height;
      let v = THREE.MathUtils.clamp(normalizedY * 0.85 + 0.15, 0.15, 1);
      
      // Apply UV offset
      u = (u + uvOffset.u) % 1;
      v = (v + uvOffset.v) % 1;
      
      uvs.setXY(i, u, v);
    }
    
    // Duplicate geometry for texture overlay
    const textureGeom = cupGeom.clone();
    
    return { cupGeometry: cupGeom, textureGeometry: textureGeom };
  }, [uvOffset.u, uvOffset.v]);

  useFrame(() => {
    if (cupRef.current) {
      cupRef.current.rotation.x = rotation.x * Math.PI / 180;
      cupRef.current.rotation.y = rotation.y * Math.PI / 180;
      cupRef.current.rotation.z = rotation.z * Math.PI / 180;
      cupRef.current.position.x = position.x;
      cupRef.current.position.y = position.y;
      cupRef.current.scale.setScalar(scale);
    }
    
    // Update texture properties
    if (textureMaterialRef.current && texture) {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.anisotropy = 16;
      texture.needsUpdate = true;
    }
  });

  return (
    <group ref={cupRef}>
      {/* Base cup material */}
      <mesh geometry={cupGeometry}>
        <meshPhysicalMaterial
          color={color}
          roughness={0.3}
          metalness={0.2}
          clearcoat={0.1}
          clearcoatRoughness={0.1}
        />
      </mesh>
      
      {/* Texture overlay */}
      {texture && (
        <mesh geometry={textureGeometry}>
          <meshBasicMaterial
            ref={textureMaterialRef}
            map={texture}
            transparent={true}
            opacity={0.95}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}