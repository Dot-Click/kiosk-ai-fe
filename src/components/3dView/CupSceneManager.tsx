// import { Suspense, useEffect, useState } from 'react';
// import { Canvas, useThree } from '@react-three/fiber';
// import { 
//   OrbitControls, 
//   PerspectiveCamera, 
//   Environment, 
//   Lightformer,
//   Grid,
//   Float
// } from '@react-three/drei';
// import * as THREE from 'three';
// import { RealisticCupModel } from './RealisticCupModel';

// interface CupSceneManagerProps {
//   selectedImage: string;
//   imagePosition: { x: number; y: number };
//   zoomScale: number;
//   rotation: number;
//   isApplied: boolean;
//   selectedColor: string;
//   cupFlip: 'left' | 'right';
//   objectRotation: number;
//   selectedProduct: string;
// }

// function SceneSetup() {
//   const { scene } = useThree();
  
//   useEffect(() => {
//     // Set scene background
//     scene.background = new THREE.Color(0x080319);
    
//     return () => {
//       scene.background = null;
//     };
//   }, [scene]);

//   return null;
// }

// function Lighting() {
//   return (
//     <>
//       {/* Main lighting */}
//       <ambientLight intensity={0.6} color="#ffffff" />
      
//       {/* Key light */}
//       <directionalLight
//         position={[5, 8, 5]}
//         intensity={1.2}
//         castShadow
//         shadow-mapSize-width={2048}
//         shadow-mapSize-height={2048}
//         shadow-camera-left={-2}
//         shadow-camera-right={2}
//         shadow-camera-top={2}
//         shadow-camera-bottom={-2}
//       />
      
//       {/* Fill light */}
//       <directionalLight
//         position={[-5, 3, -3]}
//         intensity={0.4}
//         color="#4a90e2"
//       />
      
//       {/* Rim light */}
//       <directionalLight
//         position={[0, 5, -5]}
//         intensity={0.3}
//         color="#ffffff"
//       />
      
//       {/* Environment lighting for reflections */}
//       <Environment preset="studio">
//         <Lightformer
//           form="ring"
//           intensity={2}
//           position={[0, 5, 5]}
//           scale={[10, 10, 1]}
//           color="white"
//         />
//       </Environment>
//     </>
//   );
// }

// function CupSceneContent(props: CupSceneManagerProps) {
//   const [texture, setTexture] = useState<THREE.Texture | null>(null);
//   const { gl } = useThree();

//   // Load texture
//   useEffect(() => {
//     if (!props.selectedImage || !props.isApplied) {
//       setTexture(null);
//       return;
//     }

//     const loader = new THREE.TextureLoader();
//     loader.load(
//       props.selectedImage,
//       (loadedTexture) => {
//         // Configure for high quality
//         loadedTexture.encoding = THREE.sRGBEncoding;
//         loadedTexture.anisotropy = gl.capabilities.getMaxAnisotropy();
//         loadedTexture.minFilter = THREE.LinearMipmapLinearFilter;
//         loadedTexture.magFilter = THREE.LinearFilter;
//         loadedTexture.generateMipmaps = true;
//         setTexture(loadedTexture);
//       },
//       undefined,
//       (error) => {
//         console.error('Failed to load texture:', error);
//       }
//     );

//     return () => {
//       if (texture) {
//         texture.dispose();
//       }
//     };
//   }, [props.selectedImage, props.isApplied]);

//   return (
//     <>
//       <SceneSetup />
//       <Lighting />
      
//       <Float
//         speed={1.5}
//         rotationIntensity={0.2}
//         floatIntensity={0.2}
//       >
//         <RealisticCupModel
//           texture={texture}
//           color={props.selectedColor}
//           position={props.imagePosition}
//           zoomScale={props.zoomScale}
//           rotation={props.rotation}
//           isApplied={props.isApplied}
//           selectedProduct={props.selectedProduct}
//           cupFlip={props.cupFlip}
//           objectRotation={props.objectRotation}
//         />
//       </Float>
      
//       {/* Grid for reference */}
//       <Grid
//         args={[10, 10]}
//         cellSize={0.5}
//         cellThickness={0.5}
//         cellColor="#6f6f6f"
//         sectionSize={3}
//         sectionThickness={1}
//         sectionColor="#9d4b4b"
//         fadeDistance={30}
//         fadeStrength={1}
//         followCamera={false}
//       />
//     </>
//   );
// }

// export function CupSceneManager(props: CupSceneManagerProps) {
//   return (
//     <Canvas
//       shadows
//       dpr={[1, 2]}
//       gl={{
//         antialias: true,
//         alpha: true,
//         preserveDrawingBuffer: true,
//         powerPreference: "high-performance"
//       }}
//       camera={{ position: [0, 0.1, 0.3], fov: 45 }}
//       style={{ width: '100%', height: '100%' }}
//     >
//       <Suspense fallback={null}>
//         <PerspectiveCamera makeDefault position={[0, 0.1, 0.3]} fov={45} />
//         <OrbitControls
//           enableZoom={true}
//           enablePan={false}
//           enableRotate={true}
//           zoomSpeed={0.6}
//           rotateSpeed={0.8}
//           minDistance={0.2}
//           maxDistance={1}
//           minPolarAngle={Math.PI / 6}
//           maxPolarAngle={Math.PI / 1.5}
//           target={[0, 0, 0]}
//         />
//         <CupSceneContent {...props} />
//       </Suspense>
//     </Canvas>
//   );
// }

import { Suspense, useEffect, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Environment, 
  Grid,
  Float,
  ContactShadows
} from '@react-three/drei';
import * as THREE from 'three';
import { ProfessionalCupModel } from './ProfessionalCupModel';

interface CupSceneManagerProps {
  selectedImage: string;
  imagePosition: { x: number; y: number };
  zoomScale: number;
  rotation: number;
  isApplied: boolean;
  selectedColor: string;
  cupFlip: 'left' | 'right';
  objectRotation: number;
}

function SceneSetup() {
  const { scene } = useThree();
  
  useEffect(() => {
    // Set scene background
    scene.background = new THREE.Color(0x080319);
    
    return () => {
      scene.background = null;
    };
  }, [scene]);

  return null;
}

function ProfessionalLighting() {
  return (
    <>
      {/* Main key light */}
      <directionalLight
        position={[3, 5, 2]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={5}
        shadow-camera-left={-1}
        shadow-camera-right={1}
        shadow-camera-top={1}
        shadow-camera-bottom={-1}
      />
      
      {/* Fill light */}
      <directionalLight
        position={[-2, 3, -1]}
        intensity={0.6}
        color="#4a90e2"
      />
      
      {/* Ambient for soft overall illumination */}
      <ambientLight intensity={0.4} color="#ffffff" />
      
      {/* Rim/back light */}
      <directionalLight
        position={[0, 2, -3]}
        intensity={0.3}
        color="#ffffff"
      />
      
      {/* Soft environment lighting */}
      <Environment preset="studio" />
    </>
  );
}

function CupSceneContent(props: CupSceneManagerProps) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const { gl } = useThree();

  // Load texture
  useEffect(() => {
    if (!props.selectedImage || !props.isApplied) {
      setTexture(null);
      return;
    }

    const loader = new THREE.TextureLoader();
    const onLoad = (loadedTexture: THREE.Texture) => {
      // Configure for high quality
      (loadedTexture as any).colorSpace = 'srgb';
      loadedTexture.anisotropy = gl.capabilities.getMaxAnisotropy();
      loadedTexture.minFilter = THREE.LinearMipmapLinearFilter;
      loadedTexture.magFilter = THREE.LinearFilter;
      loadedTexture.generateMipmaps = true;
      loadedTexture.needsUpdate = true;
      setTexture(loadedTexture);
    };

    const onProgress = () => {
      // Optional: Add loading progress indicator
    };

    const onError = (error: unknown) => {
      console.error('Failed to load texture:', error);
    };

    loader.load(props.selectedImage, onLoad, onProgress, onError);

    return () => {
      if (texture) {
        texture.dispose();
      }
    };
  }, [props.selectedImage, props.isApplied]);

  return (
    <>
      <SceneSetup />
      <ProfessionalLighting />
      
      {/* Smooth floating animation */}
      <Float
        speed={2}
        rotationIntensity={0.5}
        floatIntensity={0.5}
      >
        <ProfessionalCupModel
          texture={texture}
          color={props.selectedColor}
          position={props.imagePosition}
          zoomScale={props.zoomScale}
          rotation={props.rotation}
          isApplied={props.isApplied}
          cupFlip={props.cupFlip}
          objectRotation={props.objectRotation}
        />
      </Float>
      
      {/* Contact shadows for realism */}
      <ContactShadows
        position={[0, -0.05, 0]}
        opacity={0.4}
        scale={5}
        blur={2}
        far={0.5}
        resolution={256}
        color="#000000"
      />
      
      {/* Grid for reference */}
      <Grid
        args={[10, 10]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor="#6f6f6f"
        sectionSize={3}
        sectionThickness={1}
        sectionColor="#9d4b4b"
        fadeDistance={20}
        fadeStrength={1}
      />
    </>
  );
}

export function CupSceneManager(props: CupSceneManagerProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true,
        powerPreference: "high-performance",
        precision: "highp"
      }}
      camera={{ position: [0, 0.05, 0.25], fov: 45 }}
      style={{ 
        width: '100%', 
        height: '100%',
        borderRadius: '1rem'
      }}
    >
      <Suspense fallback={null}>
        <PerspectiveCamera makeDefault position={[0, 0.05, 0.25]} fov={45} />
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          enableRotate={true}
          zoomSpeed={0.6}
          rotateSpeed={0.8}
          minDistance={0.15}
          maxDistance={0.5}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 1.8}
          target={[0, 0.02, 0]}
        />
        <CupSceneContent {...props} />
      </Suspense>
    </Canvas>
  );
}