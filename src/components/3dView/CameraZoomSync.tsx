import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

const MIN_DISTANCE = 1.2;
const MAX_DISTANCE = 4;

interface CameraZoomSyncProps {
  zoomScale: number;
}

export default function CameraZoomSync({ zoomScale }: CameraZoomSyncProps) {
  const { camera } = useThree();
  const targetRef = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    const dir = new THREE.Vector3()
      .subVectors(camera.position, targetRef.current)
      .normalize();
    const t = (zoomScale - 50) / 150;
    const distance =
      MIN_DISTANCE +
      (MAX_DISTANCE - MIN_DISTANCE) * Math.max(0, Math.min(1, t));
    camera.position.copy(targetRef.current).add(dir.multiplyScalar(distance));
  }, [zoomScale, camera]);

  return null;
}
