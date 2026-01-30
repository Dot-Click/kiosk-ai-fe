import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ProfessionalCupProps {
  texture: THREE.Texture | null;
  color: string;
  position: { x: number; y: number };
  zoomScale: number;
  rotation: number;
  isApplied: boolean;
  cupFlip: 'left' | 'right';
  objectRotation: number;
}

export function ProfessionalCupModel({
  texture,
  color,
  position,
  zoomScale,
  rotation,
  isApplied,
  cupFlip,
  objectRotation
}: ProfessionalCupProps) {
  const cupGroupRef = useRef<THREE.Group>(null);
  const textureMeshRef = useRef<THREE.Mesh>(null);
  const cupMaterialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  
  // Real-world cup dimensions (in meters)
  const CUP_HEIGHT = 0.1;        // 10cm tall
  const CUP_TOP_RADIUS = 0.0425; // 8.5cm diameter at top
  const CUP_BASE_RADIUS = 0.04;  // 8cm diameter at base
  const WALL_THICKNESS = 0.003;  // 3mm thick
  // const HANDLE_HEIGHT = 0.07;    // 7cm tall handle
  const HANDLE_WIDTH = 0.045;    // 4.5cm wide handle
  const HANDLE_THICKNESS = 0.012; // 1.2cm thick handle
  const RIM_THICKNESS = 0.002;   // 2mm rim thickness

  // Create professional cup geometry with separate inner and outer surfaces
  const { cupGeometry, outerCylinderGeometry } = useMemo(() => {
    // ===== 1. MAIN CUP BODY =====
    
    // Outer cylinder (main visible surface)
    const outerGeometry = new THREE.CylinderGeometry(
      CUP_TOP_RADIUS,
      CUP_BASE_RADIUS,
      CUP_HEIGHT - RIM_THICKNESS,
      64, // high resolution for smoothness
      32,
      false // NOT open ended - this prevents inner surface
    );
    
    // Translate to position correctly (Three.js cylinders are centered)
    outerGeometry.translate(0, CUP_HEIGHT/2 - RIM_THICKNESS/2, 0);
    
    // ===== 2. INNER CYLINDER (HOLLOW) =====
    
    // Inner cylinder (for hollow effect, but NOT for texturing)
    const innerRadiusTop = CUP_TOP_RADIUS - WALL_THICKNESS;
    const innerRadiusBase = CUP_BASE_RADIUS - WALL_THICKNESS;
    const innerHeight = CUP_HEIGHT - RIM_THICKNESS - 0.002; // slightly shorter
    
    const innerGeometry = new THREE.CylinderGeometry(
      innerRadiusTop,
      innerRadiusBase,
      innerHeight,
      64,
      32,
      true // open ended - only visible from inside
    );
    
    innerGeometry.translate(0, CUP_HEIGHT/2 - RIM_THICKNESS/2 - 0.001, 0);
    
    // ===== 3. CUP BASE =====
    
    const baseGeometry = new THREE.CylinderGeometry(
      CUP_BASE_RADIUS * 0.7,
      CUP_BASE_RADIUS * 0.7,
      WALL_THICKNESS,
      32
    );
    
    baseGeometry.translate(0, WALL_THICKNESS/2, 0);
    
    // ===== 4. RIM =====
    
    const rimOuterGeometry = new THREE.CylinderGeometry(
      CUP_TOP_RADIUS + 0.002,
      CUP_TOP_RADIUS + 0.002,
      RIM_THICKNESS,
      64
    );
    
    rimOuterGeometry.translate(0, CUP_HEIGHT - RIM_THICKNESS/2, 0);
    
    const rimInnerGeometry = new THREE.CylinderGeometry(
      CUP_TOP_RADIUS - WALL_THICKNESS,
      CUP_TOP_RADIUS - WALL_THICKNESS,
      RIM_THICKNESS,
      64
    );
    
    rimInnerGeometry.translate(0, CUP_HEIGHT - RIM_THICKNESS/2, 0);
    
    // ===== 5. HANDLE =====
    
    // Create handle using bezier curves for realistic shape
    const handleCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(CUP_TOP_RADIUS + 0.005, CUP_HEIGHT * 0.4, 0),
      new THREE.Vector3(CUP_TOP_RADIUS + HANDLE_WIDTH * 0.7, CUP_HEIGHT * 0.6, 0),
      new THREE.Vector3(CUP_TOP_RADIUS + HANDLE_WIDTH * 0.9, CUP_HEIGHT * 0.3, 0),
      new THREE.Vector3(CUP_TOP_RADIUS + HANDLE_WIDTH, CUP_HEIGHT * -0.15, 0)
    );
    
    const handleShape = new THREE.Shape();
    
    // Create elliptical handle cross-section
    const ellipsePoints = 32;
    for (let i = 0; i <= ellipsePoints; i++) {
      const angle = (i / ellipsePoints) * Math.PI * 2;
      const x = Math.cos(angle) * (HANDLE_THICKNESS / 2);
      const y = Math.sin(angle) * (HANDLE_THICKNESS / 3);
      if (i === 0) {
        handleShape.moveTo(x, y);
      } else {
        handleShape.lineTo(x, y);
      }
    }
    
    const extrudeSettings = {
      steps: 64,
      depth: 1,
      bevelEnabled: false,
      extrudePath: handleCurve
    };
    
    const handleGeometry = new THREE.ExtrudeGeometry(handleShape, extrudeSettings);
    
    // ===== 6. TEXTURE GEOMETRY (ONLY OUTER SURFACE) =====
    
    // Create a separate geometry just for the outer surface where texture goes
    const textureGeometry = outerGeometry.clone();
    
    // Apply perfect cylindrical UV mapping to texture geometry
    const positions = textureGeometry.attributes.position;
    const uvs = textureGeometry.attributes.uv;
    
    // Calculate min and max Y for UV mapping
    let minY = Infinity;
    let maxY = -Infinity;
    
    for (let i = 0; i < positions.count; i++) {
      const y = positions.getY(i);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
    
    const heightRange = maxY - minY;
    
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = positions.getZ(i);
      
      // Calculate cylindrical coordinates
      // const radius = Math.sqrt(x * x + z * z);
      const angle = Math.atan2(z, x);
      
      // U coordinate: map angle around circumference (0 to 1)
      let u = (angle + Math.PI) / (2 * Math.PI);
      
      // V coordinate: map height from bottom to top
      // Only map the main printable area (exclude rim and very bottom)
      const normalizedY = (y - minY) / heightRange;
      let v = THREE.MathUtils.clamp(normalizedY, 0.02, 0.98); // Exclude 2% top and bottom
      v = (v - 0.02) / 0.96; // Remap to 0-1
      
      // Apply user positioning adjustments
      const finalU = (u + position.x * 0.5) % 1;
      const finalV = (v + position.y * 0.5) % 1;
      
      uvs.setXY(i, finalU, finalV);
    }
    
    // ===== 7. COMBINE GEOMETRIES =====
    
    // Combine all cup parts except inner geometry (we don't want to see inside)
    const cupParts = [
      outerGeometry,
      baseGeometry,
      rimOuterGeometry,
      rimInnerGeometry,
      handleGeometry
    ];
    
    const mergedGeometry = new THREE.BufferGeometry();
    let vertexOffset = 0;
    const mergedPositions: number[] = [];
    const mergedNormals: number[] = [];
    const mergedIndices: number[] = [];
    
    for (const geometry of cupParts) {
      const positions = geometry.attributes.position;
      const normals = geometry.attributes.normal;
      const indices = geometry.index;
      
      if (positions) {
        const posArray = positions.array as Float32Array;
        mergedPositions.push(...Array.from(posArray));
      }
      
      if (normals) {
        const normArray = normals.array as Float32Array;
        mergedNormals.push(...Array.from(normArray));
      }
      
      if (indices) {
        const idxArray = indices.array as Uint32Array;
        mergedIndices.push(...Array.from(idxArray).map(i => i + vertexOffset));
      }
      
      vertexOffset += positions.count;
    }
    
    mergedGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(mergedPositions), 3));
    if (mergedNormals.length > 0) {
      mergedGeometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(mergedNormals), 3));
    }
    if (mergedIndices.length > 0) {
      mergedGeometry.setIndex(new THREE.BufferAttribute(new Uint32Array(mergedIndices), 1));
    } else {
      mergedGeometry.computeVertexNormals();
    }
    
    // Clean up temporary geometries
    [innerGeometry, ...cupParts].forEach(geo => geo.dispose());
    
    return {
      cupGeometry: mergedGeometry,
      outerCylinderGeometry: textureGeometry
    };
  }, [position.x, position.y]);

  // Handle texture updates
  useEffect(() => {
    if (texture && textureMeshRef.current) {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.anisotropy = 16;
      texture.rotation = rotation * (Math.PI / 180);
      
      // Calculate scale based on zoom
      const scaleFactor = zoomScale / 100;
      texture.repeat.set(1 / scaleFactor, 1 / scaleFactor); // Invert for correct scaling
      texture.offset.set(0.5 - 0.5 / scaleFactor, 0.5 - 0.5 / scaleFactor); // Center scaling
      texture.needsUpdate = true;
    }
  }, [texture, zoomScale, rotation]);

  // Handle color updates
  useEffect(() => {
    if (cupMaterialRef.current) {
      const threeColor = new THREE.Color(color === 'none' ? '#ffffff' : color);
      cupMaterialRef.current.color = threeColor;
    }
  }, [color]);

  // Animation and rotation
  useFrame(() => {
    if (cupGroupRef.current) {
      const flipMultiplier = cupFlip === 'right' ? -1 : 1;
      cupGroupRef.current.rotation.y = objectRotation * (Math.PI / 180) * flipMultiplier;
    }
  });

  return (
    <group ref={cupGroupRef}>
      {/* Main Cup Body (all parts except texture) */}
      <mesh geometry={cupGeometry} castShadow receiveShadow>
        <meshPhysicalMaterial
          ref={cupMaterialRef}
          color="#ffffff"
          roughness={0.4}
          metalness={0.1}
          clearcoat={0.8}
          clearcoatRoughness={0.1}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Texture Overlay - ONLY on outer surface */}
      {isApplied && texture && (
        <mesh 
          ref={textureMeshRef}
          geometry={outerCylinderGeometry}
          position={[0, 0, 0.0001]} // Tiny offset to prevent z-fighting
        >
          <meshBasicMaterial
            map={texture}
            transparent={true}
            opacity={0.99}
            side={THREE.FrontSide} // Only show on front/outside
            depthWrite={false}
            depthTest={true}
          />
        </mesh>
      )}
    </group>
  );
}