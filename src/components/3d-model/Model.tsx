import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF, Html } from '@react-three/drei';
import { Suspense, useState, useEffect, useMemo, useRef, useCallback } from 'react';
import * as THREE from 'three';

function Modelo({ selectedFurniture, furnitureColor, isInSelectionMode, onObjectSelected }) {
  // Preload del modelo para evitar recargas
  const { scene } = useGLTF('/modelo2.glb', true);
  const [furnitureParts, setFurnitureParts] = useState({});
  const [meshList, setMeshList] = useState([]);
  const processedMeshes = useRef(new Set());
  
  // Clonar la escena para evitar mutaciones del modelo original
  const clonedScene = useMemo(() => {
    const cloned = scene.clone();
    
    // Optimizar todos los materiales una sola vez
    cloned.traverse((object) => {
      if (object.isMesh) {
        // Compartir geometrías cuando sea posible
        if (object.geometry.userData.optimized) {
          // Ya optimizada, usar referencia compartida
        } else {
          // Optimizar geometría
          object.geometry.computeBoundingBox();
          object.geometry.computeBoundingSphere();
          object.geometry.userData.optimized = true;
        }
        
        // Optimizar materiales
        if (object.material && !object.material.userData.optimized) {
          // Reducir precisión innecesaria
          if (object.material.map) {
            object.material.map.generateMipmaps = true;
            object.material.map.minFilter = THREE.LinearMipmapLinearFilter;
            object.material.map.magFilter = THREE.LinearFilter;
          }
          
          // Configurar frustum culling
          object.frustumCulled = true;
          
          // Marcar como optimizado
          object.material.userData.optimized = true;
        }
      }
    });
    
    return cloned;
  }, [scene]);
  
  // Memoizar el procesamiento de objetos para evitar re-cálculos
  const processedObjects = useMemo(() => {
    const muebles = {};
    const allMeshes = [];
    
    clonedScene.traverse((object) => {
      if (object.isMesh) {
        // Guardar el material original solo una vez
        if (!object.userData.originalMaterial) {
          object.userData.originalMaterial = object.material.clone();
        }
        
        const meshData = {
          name: object.name,
          object: object,
          boundingBox: new THREE.Box3().setFromObject(object),
          isSmallDetail: false
        };
        
        // Determinar si es un detalle pequeño
        const size = meshData.boundingBox.getSize(new THREE.Vector3());
        const maxDimension = Math.max(size.x, size.y, size.z);
        meshData.isSmallDetail = maxDimension < 0.3;
        
        allMeshes.push(meshData);
        
        // Catalogar muebles (versión optimizada)
        const nameLower = object.name.toLowerCase();
        const furnitureTypes = {
          sofa: ['sofa', 'couch', 'sillon'],
          mesa: ['mesa', 'table', 'escritorio'],
          silla: ['silla', 'chair', 'banco'],
          cama: ['cama', 'bed', 'colchon'],
          lampara: ['lamp', 'luz', 'light'],
          tv: ['tv', 'television', 'monitor']
        };
        
        for (const [type, keywords] of Object.entries(furnitureTypes)) {
          if (keywords.some(keyword => nameLower.includes(keyword))) {
            if (!muebles[type]) muebles[type] = [];
            muebles[type].push(object);
            break;
          }
        }
      }
    });
    
    return { muebles, allMeshes };
  }, [clonedScene]);
  
  // Actualizar estados solo cuando cambien los objetos procesados
  useEffect(() => {
    setFurnitureParts(processedObjects.muebles);
    setMeshList(processedObjects.allMeshes);
  }, [processedObjects]);
  
  // Optimizar el modo de selección con useCallback
  const updateSelectionMode = useCallback((isActive) => {
    const highlightMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#aaaaff'),
      emissive: new THREE.Color('#3333ff'),
      emissiveIntensity: 0.2,
      transparent: true,
      opacity: 0.8
    });
    
    meshList.forEach(({ object }) => {
      if (isActive) {
        object.userData.isSelectable = true;
        if (!object.userData.priorToSelectionMaterial) {
          object.userData.priorToSelectionMaterial = object.material;
        }
        object.material = highlightMaterial;
      } else {
        object.userData.isSelectable = false;
        if (object.userData.priorToSelectionMaterial) {
          object.material = object.userData.priorToSelectionMaterial;
          object.userData.priorToSelectionMaterial = null;
        }
      }
    });
  }, [meshList]);
  
  useEffect(() => {
    updateSelectionMode(isInSelectionMode);
  }, [isInSelectionMode, updateSelectionMode]);
  
  // Optimizar cambio de colores con memoización
  const updateFurnitureColor = useCallback(() => {
    if (!selectedFurniture) return;
    
    let targetObjects = [];
    
    if (selectedFurniture.startsWith('custom:')) {
      const objectName = selectedFurniture.replace('custom:', '');
      const found = meshList.find(m => m.name === objectName)?.object;
      if (found) targetObjects = [found];
    } else {
      targetObjects = furnitureParts[selectedFurniture] || [];
      if (!Array.isArray(targetObjects)) targetObjects = [targetObjects];
    }
    
    // Crear material una sola vez y reutilizarlo
    const newMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(furnitureColor),
      roughness: 0.7,
      metalness: 0.2
    });
    
    targetObjects.forEach(object => {
      if (object) object.material = newMaterial;
    });
  }, [selectedFurniture, furnitureColor, furnitureParts, meshList]);
  
  useEffect(() => {
    updateFurnitureColor();
  }, [updateFurnitureColor]);
  
  // Optimizar el manejo de clicks
  const handleClick = useCallback((event) => {
    if (!isInSelectionMode || !event.object.userData.isSelectable) return;
    
    event.stopPropagation();
    onObjectSelected(event.object.name);
    
    // Restaurar materiales de forma más eficiente
    meshList.forEach(({ object }) => {
      if (object.userData.priorToSelectionMaterial) {
        object.material = object.userData.priorToSelectionMaterial;
        object.userData.priorToSelectionMaterial = null;
      }
    });
  }, [isInSelectionMode, onObjectSelected, meshList]);
  
  return (
    <primitive 
      object={clonedScene} 
      scale={0.7} 
      position={[-4.5,1,-4.5]} 
      onClick={handleClick}
    />
  );
}

// Componente optimizado para renderizado condicional
function OptimizedLighting() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[10, 10, 10]} 
        intensity={0.8}
        castShadow={false} // Desactivar sombras para mejor rendimiento
      />
      <pointLight 
        position={[-4.5, 3, -4.5]} 
        intensity={0.5} 
        color="#ffffff"
        distance={20} // Limitar alcance para optimizar
      />
    </>
  );
}

// Controlador de cámara optimizado
function SmoothCameraController({ animationState, updateDebugInfo, setAnimatingCamera }) {
  const { camera, controls } = useThree();
  const animationRef = useRef();
  
  const lerp = useCallback((start, end, progress) => {
    return start + (end - start) * progress;
  }, []);
  
  const lerpVector = useCallback((start, end, progress) => {
    return [
      lerp(start[0], end[0], progress),
      lerp(start[1], end[1], progress),
      lerp(start[2], end[2], progress)
    ];
  }, [lerp]);
  
  // Optimizar la animación con requestAnimationFrame
  useFrame(() => {
    if (animationState && typeof animationState === 'object') {
      const { startCamera, endCamera, startTarget, endTarget, progress } = animationState;
      
      if (progress >= 1) {
        camera.position.set(...endCamera);
        if (controls) {
          controls.target.set(...endTarget);
          controls.update();
        }
        
        updateDebugInfo(
          endCamera.map(v => v.toFixed(2)),
          endTarget.map(v => v.toFixed(2))
        );
        
        setAnimatingCamera(false);
        return;
      }
      
      const newCameraPos = lerpVector(startCamera, endCamera, progress);
      const newTargetPos = lerpVector(startTarget, endTarget, progress);
      
      camera.position.set(...newCameraPos);
      if (controls) {
        controls.target.set(...newTargetPos);
        controls.update();
      }
      
      updateDebugInfo(
        newCameraPos.map(v => v.toFixed(2)),
        newTargetPos.map(v => v.toFixed(2))
      );
      
      setAnimatingCamera({
        ...animationState,
        progress: progress + 0.03
      });
    } else if (!animationState && controls) {
      // Solo actualizar debug info cuando sea necesario
      if (animationRef.current % 30 === 0) { // Cada 30 frames
        updateDebugInfo(
          [camera.position.x.toFixed(2), camera.position.y.toFixed(2), camera.position.z.toFixed(2)],
          [controls.target.x.toFixed(2), controls.target.y.toFixed(2), controls.target.z.toFixed(2)]
        );
      }
      animationRef.current = (animationRef.current || 0) + 1;
    }
  });
  
  return (
    <OrbitControls 
      makeDefault
      enableRotate={true}
      enabled={!animationState}
      enableDamping={true}
      dampingFactor={0.05}
      minDistance={2}
      maxDistance={50}
      maxPolarAngle={Math.PI / 2}
    />
  );
}

// Loading component optimizado
function LoadingFallback() {
  return (
    <Html center>
      <div style={{
        color: 'black',
        fontSize: '18px',
        textAlign: 'center',
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '10px'
      }}>
        <div>Cargando modelo 3D...</div>
        <div style={{ 
          width: '200px', 
          height: '4px', 
          backgroundColor: '#333', 
          marginTop: '10px',
          borderRadius: '2px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#006BE3',
            animation: 'loading 2s infinite ease-in-out'
          }} />
        </div>
      </div>
    </Html>
  );
}

export default function Model() {
  const [cameraPosition] = useState([0, 10, -1]);
  const [debugInfo, setDebugInfo] = useState({
    position: [0, 0, 0],
    target: [0, 0, 0]
  });
  const [animatingCamera, setAnimatingCamera] = useState(false);
  const [selectedFurniture, setSelectedFurniture] = useState('');
  const [selectedObjectName, setSelectedObjectName] = useState('');
  const [furnitureColor, setFurnitureColor] = useState('#ffffff');
  const [isInSelectionMode, setIsInSelectionMode] = useState(false);
  
  // Memoizar las posiciones para evitar re-creación
  const positions = useMemo(() => ({
    Kitchen: {
      camera: [0.84, 1.87, 2.51],
      target: [13, 1.7, -9]
    },
    StayRoom: {
      camera: [0.69, 2.35, 2.33],
      target: [-4.5, 1, -4.5]
    },
    BedRoom: {
      camera: [-0.62, 3.01, -3.02],
      target: [-10, -5, 5]
    }
  }), []);

  // Optimizar función de navegación
  const goToPosition = useCallback((position) => {
    setAnimatingCamera({
      startCamera: [...debugInfo.position.map(p => parseFloat(p))],
      endCamera: positions[position].camera,
      startTarget: [...debugInfo.target.map(t => parseFloat(t))],
      endTarget: positions[position].target,
      progress: 0
    });
  }, [debugInfo.position, debugInfo.target, positions]);

  const updateDebugInfo = useCallback((pos, tgt) => {
    setDebugInfo({ position: pos, target: tgt });
  }, []);

  const handleSelectFurniture = useCallback((furniture) => {
    setSelectedFurniture(furniture);
    setSelectedObjectName(furniture);
  }, []);
  
  const handleObjectSelected = useCallback((objectName) => {
    setSelectedFurniture(`custom:${objectName}`);
    setSelectedObjectName(objectName);
    setIsInSelectionMode(false);
  }, []);
  
  const toggleSelectionMode = useCallback(() => {
    setIsInSelectionMode(prev => !prev);
  }, []);

  // Memoizar los botones para evitar re-renders
  const navigationButtons = useMemo(() => (
    <div className="buttons-container grid items-center justify-center" style={{ 
      zIndex: 100,
      display: 'flex',
      gap: '10px'
    }}>
      <button onClick={() => {
        setAnimatingCamera({
          startCamera: [...debugInfo.position.map(p => parseFloat(p))],
          endCamera: [0, 10, -1],
          startTarget: [...debugInfo.target.map(t => parseFloat(t))],
          endTarget: [0, 0, 0],
          progress: 0
        });
      }} style={buttonStyle}>Aerial View</button>
      <button onClick={() => goToPosition('Kitchen')} style={buttonStyle}>Kitchen</button>
      <button onClick={() => goToPosition('StayRoom')} style={buttonStyle}>Stay Room</button>
      <button onClick={() => goToPosition('BedRoom')} style={buttonStyle}>Bed Room</button>
    </div>
  ), [debugInfo, goToPosition]);

  return (
    <>
      <Canvas 
        camera={{ position: cameraPosition, fov: 65 }} 
        className='w-screen h-screen bg-red-500' 
        gl={{
          antialias: window.devicePixelRatio < 2,
          alpha: true ,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        dpr={Math.min(window.devicePixelRatio, 2)}
      >
        <OptimizedLighting />
        <Suspense fallback={<LoadingFallback />}>
          <Modelo 
            selectedFurniture={selectedFurniture}
            furnitureColor={furnitureColor}
            isInSelectionMode={isInSelectionMode}
            onObjectSelected={handleObjectSelected}
          />
          <Environment preset="apartment" />
          <SmoothCameraController 
            animationState={animatingCamera}
            updateDebugInfo={updateDebugInfo}
            setAnimatingCamera={setAnimatingCamera}
          />
        </Suspense>
      </Canvas>
      {navigationButtons}
    </>
  );
}

// Precargar el modelo para evitar delays
useGLTF.preload('/modelo2.glb');

const buttonStyle = {
  padding: '8px 16px',
  backgroundColor: '#006BE3',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: 'bold',
  marginTop: '20px'
};