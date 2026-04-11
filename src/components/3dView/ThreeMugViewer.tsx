import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { cn } from "@/utils/cn.util";

interface ThreeMugViewerProps {
  imageUrl?: string;
  color: string;
  isApplied: boolean;
  zoomScale?: number;
  rotationAngle?: number;
  // fraction of circumference that can be printed (0-1). 0.5 means half the mug.
  coverage?: number;
  // additional rotation applied to the wrap mesh (radians)
  wrapOffset?: number;
  className?: string;
}

export interface ThreeMugViewerRef {
  capture: () => string | null;
}

const MIN_DISTANCE = 4;
const MAX_DISTANCE = 15;

const ThreeMugViewer = forwardRef<ThreeMugViewerRef, ThreeMugViewerProps>(({
  imageUrl,
  color,
  isApplied,
  zoomScale = 100,
  rotationAngle = 0,  coverage = 0.5,
  wrapOffset = 0, className = "h-[500px] sm:h-[600px]" }, ref) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const wrapMeshRef = useRef<THREE.Mesh | null>(null);
  const mugGroupRef = useRef<THREE.Group | null>(null);
  const ceramicMatRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const printMatRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const animationIdRef = useRef<number>(0);

  useImperativeHandle(ref, () => ({
    capture: () => {
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
        return rendererRef.current.domElement.toDataURL("image/png");
      }
      return null;
    }
  }));

  useEffect(() => {
    if (!mountRef.current) return;

    // Cleanup previous instance
    if (rendererRef.current && mountRef.current.contains(rendererRef.current.domElement)) {
      mountRef.current.removeChild(rendererRef.current.domElement);
    }

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x080319);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      35,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(5, 4, 7);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
      preserveDrawingBuffer: true // Required for canvas capture
    });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 3;
    controls.maxDistance = 15;
    controls.maxPolarAngle = Math.PI / 2 - 0.1;
    controls.target.set(0, 1.25, 0); // Center on mug height (0 to 2.5)
    controlsRef.current = controls;

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambient);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
    mainLight.position.set(5, 10, 7);
    mainLight.castShadow = true;
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
    fillLight.position.set(-5, 5, -5);
    scene.add(fillLight);

    // Materials
    const ceramicMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(color),
      roughness: 0.1,
      metalness: 0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    });
    ceramicMatRef.current = ceramicMat;

    const printMat = new THREE.MeshPhysicalMaterial({
      roughness: 0.2,
      clearcoat: 0.5,
      transparent: false,
      side: THREE.DoubleSide,
    });
    printMatRef.current = printMat;

    // Mug group
    const mugGroup = new THREE.Group();
    mugGroupRef.current = mugGroup;

    // 1. MUG BODY
    const points = [];
    points.push(new THREE.Vector2(0, 0));
    points.push(new THREE.Vector2(0.75, 0));
    points.push(new THREE.Vector2(1.0, 0.3));
    points.push(new THREE.Vector2(1.0, 2.5));
    points.push(new THREE.Vector2(0.95, 2.55));
    points.push(new THREE.Vector2(0.9, 2.5));
    points.push(new THREE.Vector2(0.9, 0.15));
    points.push(new THREE.Vector2(0, 0.15));

    const body = new THREE.Mesh(new THREE.LatheGeometry(points, 128), ceramicMat);
    body.castShadow = true;
    body.receiveShadow = true;
    mugGroup.add(body);

    // 2. IMAGE WRAP
    // determine how much of the circumference is printable; default to 90% for backwards compatibility
    const cov = coverage !== undefined ? coverage : 0.9;
    // gap around circumference = 2π * (1 - cov)
    const gap = 2 * Math.PI * (1 - cov);
    const wrapGeom = new THREE.CylinderGeometry(1.005, 1.005, 2.1, 128, 1, true, gap / 2, Math.PI * 2 - gap);
    const wrapMesh = new THREE.Mesh(wrapGeom, printMat);
    wrapMesh.position.y = 1.35;
    // base rotation keeps printable section facing front; we can add wrapOffset to allow horizontal shifting
    wrapMesh.rotation.y = Math.PI / 2 + (wrapOffset || 0);
    wrapMesh.visible = false;
    wrapMeshRef.current = wrapMesh;
    mugGroup.add(wrapMesh);

    // 3. HANDLE
    const handleCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.9, 2.2, 0),
      new THREE.Vector3(1.5, 2.1, 0),
      new THREE.Vector3(1.9, 1.3, 0),
      new THREE.Vector3(1.6, 0.4, 0),
      new THREE.Vector3(0.9, 0.35, 0),
    ]);

    const handleShape = new THREE.Shape();
    const width = 0.18;
    const height = 0.08;
    handleShape.ellipse(0, 0, width, height, 0, Math.PI * 2);

    const extrudeSettings = {
      steps: 100,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      extrudePath: handleCurve
    };

    const handleGeom = new THREE.ExtrudeGeometry(handleShape, extrudeSettings);
    const handle = new THREE.Mesh(handleGeom, ceramicMat);
    handle.castShadow = true;
    mugGroup.add(handle);

    const baseRotationY = -Math.PI / 2 + 0.3;
    mugGroup.rotation.y = baseRotationY + (rotationAngle * Math.PI) / 180;
    scene.add(mugGroup);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !camera) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (mountRef.current && rendererRef.current?.domElement) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      controlsRef.current?.dispose();
      rendererRef.current?.dispose();
    };
  }, []);

  // Update color
  useEffect(() => {
    if (ceramicMatRef.current) {
      ceramicMatRef.current.color.set(new THREE.Color(color));
      ceramicMatRef.current.needsUpdate = true;
    }
  }, [color]);

  // Update image
  useEffect(() => {
    if (imageUrl && wrapMeshRef.current && printMatRef.current) {
      const loader = new THREE.TextureLoader();
      loader.load(
        imageUrl,
        (texture) => {
          texture.repeat.set(-1, 1);
          texture.offset.set(1, 0);
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.ClampToEdgeWrapping;
          texture.anisotropy = rendererRef.current?.capabilities.getMaxAnisotropy() || 1;

          if (printMatRef.current) {
            printMatRef.current.map = texture;
            printMatRef.current.needsUpdate = true;
          }
          if (wrapMeshRef.current) {
            wrapMeshRef.current.visible = isApplied;
          }
        },
        undefined,
        (err) => {
          console.error("Failed to load 3D texture:", imageUrl, err);
          // Don't crash, just hide the wrap
          if (wrapMeshRef.current) {
            wrapMeshRef.current.visible = false;
          }
        }
      );
    }
  }, [imageUrl, isApplied]);

  // Apply zoom scale: 50 = closest, 200 = farthest
  useEffect(() => {
    const controls = controlsRef.current;
    const camera = cameraRef.current;
    if (!controls || !camera) return;
    const target = controls.target.clone();
    const dir = new THREE.Vector3().subVectors(camera.position, target).normalize();
    const t = (zoomScale - 50) / 150;
    const distance = MIN_DISTANCE + (MAX_DISTANCE - MIN_DISTANCE) * Math.max(0, Math.min(1, t));
    camera.position.copy(target).add(dir.multiplyScalar(distance));
  }, [zoomScale]);

  // Update wrap mesh rotation when offset prop changes
  useEffect(() => {
    if (wrapMeshRef.current) {
      wrapMeshRef.current.rotation.y = Math.PI / 2 + (wrapOffset || 0);
    }
  }, [wrapOffset]);

  // Apply rotation angle to mug group
  useEffect(() => {
    const group = mugGroupRef.current;
    if (!group) return;
    const baseRotationY = -Math.PI / 2 + 0.3;
    group.rotation.y = baseRotationY + (rotationAngle * Math.PI) / 180;
  }, [rotationAngle]);

  return (
    <div
      ref={mountRef}
      className={cn("w-full bg-transparent overflow-hidden", className)}
    />
  );
});

export default ThreeMugViewer;