import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';

interface CupThreeViewProps {
  selectedImage: string;
  imagePosition: { x: number; y: number };
  zoomScale: number;
  rotation: number;
  cupFlip: 'left' | 'right';
  objectRotation: number;
  isApplied: boolean;
  selectedColor: string;
  selectedProduct: string;
}

function CupModel({
  selectedImage,
  imagePosition,
  zoomScale,
  rotation,
  cupFlip,
  objectRotation,
  isApplied,
  selectedColor,
  selectedProduct
}: CupThreeViewProps) {
  const cupRef = useRef<THREE.Mesh>(null);
  const textureRef = useRef<THREE.Texture | null>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  // const { scene } = useThree();

  // Load texture
  useEffect(() => {
    if (!selectedImage || !isApplied) return;

    const loader = new THREE.TextureLoader();
    loader.load(
      selectedImage,
      (loadedTexture) => {
        loadedTexture.wrapS = THREE.RepeatWrapping;
        loadedTexture.wrapT = THREE.RepeatWrapping;
        loadedTexture.anisotropy = 16;
        textureRef.current = loadedTexture;
        setTexture(loadedTexture);
      },
      undefined,
      (error) => {
        console.error('Error loading texture:', error);
      }
    );

    return () => {
      if (textureRef.current) {
        textureRef.current.dispose();
      }
    };
  }, [selectedImage, isApplied]);

  // Create cylindrical UV mapping for cup
  const createCupGeometry = () => {
    const geometry = new THREE.CylinderGeometry(1, 0.9, 2, 64, 32, true);
    
    // Apply custom UV mapping for cylindrical wrapping
    const uvs = geometry.attributes.uv;
    const positions = geometry.attributes.position;
    
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = positions.getZ(i);
      
      // Convert to cylindrical coordinates for UV mapping
      // const radius = Math.sqrt(x * x + z * z);
      const angle = Math.atan2(z, x);
      
      // Map U (0-1) around circumference
      const u = (angle + Math.PI) / (2 * Math.PI);
      
      // Map V (0-1) along height (excluding rim and bottom)
      const v = (y + 1) / 2; // y goes from -1 to 1
      
      // Adjust V to avoid rim and bottom
      const adjustedV = THREE.MathUtils.clamp(v * 0.85 + 0.15, 0.15, 1);
      
      uvs.setXY(i, u, adjustedV);
    }
    
    return geometry;
  };

  // Update material uniforms based on position and scale
  useFrame(() => {
    if (cupRef.current) {
      // Apply rotation based on cupFlip
      const flipRotation = cupFlip === 'right' ? Math.PI : 0;
      const totalRotation = flipRotation + (objectRotation * Math.PI / 180);
      
      cupRef.current.rotation.y = totalRotation;
      
      // Apply design rotation to texture
      if (texture) {
        texture.rotation = rotation * Math.PI / 180;
        texture.offset.x = -imagePosition.x * 0.001;
        texture.offset.y = imagePosition.y * 0.001;
        texture.repeat.x = texture.repeat.y = 1 / (zoomScale / 100);
      }
    }
  });

  // Convert hex color to THREE.Color
  const getColor = (hex: string) => {
    if (hex === 'none') return new THREE.Color(0xffffff);
    return new THREE.Color(hex);
  };

  if (selectedProduct !== 'cup') {
    return null;
  }

  return (
    <>
      {/* Cup Mesh */}
      <mesh ref={cupRef} geometry={createCupGeometry()}>
        <meshStandardMaterial
          color={getColor(selectedColor)}
          roughness={0.3}
          metalness={0.2}
        />
      </mesh>

      {/* Image Overlay Mesh (only if applied) */}
      {isApplied && texture && (
        <mesh geometry={createCupGeometry()}>
          <meshBasicMaterial
            map={texture}
            transparent={true}
            opacity={0.95}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </>
  );
}

function SceneSetup() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={true}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.5}
        minAzimuthAngle={-Math.PI / 2}
        maxAzimuthAngle={Math.PI / 2}
      />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <Environment preset="studio" />
    </>
  );
}

export function CupThreeView(props: CupThreeViewProps) {
  return (
    <Canvas
      style={{
        width: '100%',
        height: '100%',
        background: 'transparent',
      }}
      shadows
      dpr={[1, 2]}
    >
      <SceneSetup />
      <CupModel {...props} />
    </Canvas>
  );
}