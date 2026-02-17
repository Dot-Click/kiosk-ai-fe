import { Suspense, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Center, OrbitControls } from "@react-three/drei";
import ShirtModel from "./ShirtModel";
import CameraZoomSync from "./CameraZoomSync";

interface TShirtMockupCanvasProps {
  imageUrl?: string;
  color: string;
  isApplied: boolean;
  zoomScale?: number;
  rotationAngle?: number;
  decalPosition?: [number, number, number];
  decalScale?: number;
  decalRotation?: number;
  captureRef?: React.MutableRefObject<any>;
}

const CaptureHandler = ({ captureRef }: { captureRef: React.MutableRefObject<any> }) => {
  const { gl, scene, camera } = useThree();

  useEffect(() => {
    if (captureRef) {
      captureRef.current = () => {
        gl.render(scene, camera);
        return gl.domElement.toDataURL("image/png");
      };
    }
  }, [gl, scene, camera, captureRef]);

  return null;
};

export default function TShirtMockupCanvas({
  imageUrl,
  color,
  isApplied,
  zoomScale = 100,
  rotationAngle = 0,
  decalPosition = [0, 0.04, 0.15],
  decalScale = 0.18,
  decalRotation = 0,
  captureRef
}: TShirtMockupCanvasProps) {
  return (
    <div className="w-full h-[500px] sm:h-[550px] md:h-[600px] lg:h-[650px] xl:h-[700px] 2xl:h-[750px] rounded-2xl xl:rounded-3xl 2xl:rounded-[32px] overflow-hidden bg-transparent">
      <Canvas
        shadows={false}
        camera={{ position: [0, 0, 2.5], fov: 25 }}
        gl={{ preserveDrawingBuffer: true, alpha: true }}
        className="w-full h-full"
      >
        {captureRef && <CaptureHandler captureRef={captureRef} />}
        <color attach="background" args={["#080319"]} />
        <ambientLight intensity={0.9} />
        <directionalLight position={[2, 3, 2]} intensity={0.6} />
        <directionalLight position={[-2, 2, -1]} intensity={0.35} />
        <directionalLight position={[0, -1, 0]} intensity={0.2} />
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={1.2}
          maxDistance={4}
          maxPolarAngle={Math.PI / 2 - 0.05}
        />
        <CameraZoomSync zoomScale={zoomScale} />
        <Center>
          <Suspense fallback={null}>
            <group rotation={[0, (rotationAngle * Math.PI) / 180, 0]}>
              <ShirtModel
                color={color}
                imageUrl={imageUrl}
                isApplied={isApplied}
                decalPosition={decalPosition}
                decalScale={decalScale}
                decalRotation={decalRotation}
              />
            </group>
          </Suspense>
        </Center>
      </Canvas>
    </div>
  );
}
