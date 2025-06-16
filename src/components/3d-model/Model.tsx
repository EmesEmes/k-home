
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF, Html } from '@react-three/drei';
import { Suspense, useState, useEffect } from 'react';
import * as THREE from 'three';

function Modelo({ selectedFurniture, furnitureColor, isInSelectionMode, onObjectSelected }) {
  const { scene } = useGLTF('/modelo.glb');
  const [furnitureParts, setFurnitureParts] = useState({});
  const [meshList, setMeshList] = useState([]);
  
  // Detectar y catalogar todos los objetos del modelo
  useEffect(() => {
    const muebles = {};
    const allMeshes = [];
    
    // Recorrer todos los objetos y catalogarlos
    scene.traverse((object) => {
      if (object.isMesh) {
        // Guardar el material original
        object.userData.originalMaterial = object.material.clone();
        
        // Agregar a la lista de meshes
        allMeshes.push({
          name: object.name,
          object: object
        });
        
        // Intentar catalogar por nombres comunes (ajustar según tu modelo)
        const nameLower = object.name.toLowerCase();
        if (nameLower.includes('sofa') || nameLower.includes('couch')) {
          muebles.sofa = object;
        } else if (nameLower.includes('mesa') || nameLower.includes('table')) {
          muebles.mesa = object;
        } else if (nameLower.includes('silla') || nameLower.includes('chair')) {
          muebles.silla = object;
        } else if (nameLower.includes('cama') || nameLower.includes('bed')) {
          muebles.cama = object;
        }
        
        // Métodos alternativos de identificación por estructura de nombre
        // Por ejemplo, nombres con formato "Object_123"
        if (nameLower.match(/object_\d+/)) {
          const id = nameLower.split('_')[1];
          // Aquí puedes mapear IDs específicos si los conoces
          if (id === '123') muebles.sofa = object;
          if (id === '124') muebles.mesa = object;
          // etc.
        }
        
        // Imprimir en consola para depuración (nombres ordenados alfabéticamente)
        // console.log("Objeto encontrado:", object.name);
      }
    });
    
    // Ordenar la lista de meshes por nombre para facilitar la búsqueda
    allMeshes.sort((a, b) => a.name.localeCompare(b.name));
    setMeshList(allMeshes);
    
    setFurnitureParts(muebles);
    
  }, [scene]);
  
  // Modo de selección directa
  useEffect(() => {
    if (isInSelectionMode) {
      // Hacer todos los objetos seleccionables
      meshList.forEach(({ object }) => {
        object.userData.isSelectable = true;
        
        // Cambiar material para indicar que es seleccionable
        const highlightMaterial = new THREE.MeshStandardMaterial({
          color: new THREE.Color('#aaaaff'),
          emissive: new THREE.Color('#3333ff'),
          emissiveIntensity: 0.2,
          transparent: true,
          opacity: 0.8
        });
        
        // Almacenar el material actual (podría ser el original o uno personalizado)
        if (!object.userData.priorToSelectionMaterial) {
          object.userData.priorToSelectionMaterial = object.material;
        }
        
        object.material = highlightMaterial;
      });
    } else {
      // Restaurar materiales cuando no está en modo selección
      meshList.forEach(({ object }) => {
        object.userData.isSelectable = false;
        
        // Si tiene un material de pre-selección, restaurarlo
        if (object.userData.priorToSelectionMaterial) {
          object.material = object.userData.priorToSelectionMaterial;
          object.userData.priorToSelectionMaterial = null;
        }
      });
    }
  }, [isInSelectionMode, meshList]);
  
  // Cambiar el color del mueble seleccionado
  useEffect(() => {
    if (selectedFurniture && (furnitureParts[selectedFurniture] || selectedFurniture.startsWith('custom:'))) {
      let part;
      
      // Si es una selección personalizada (viene del modo selección directa)
      if (selectedFurniture.startsWith('custom:')) {
        const objectName = selectedFurniture.replace('custom:', '');
        part = meshList.find(m => m.name === objectName)?.object;
      } else {
        // Selección normal por categoría
        part = furnitureParts[selectedFurniture];
      }
      
      if (part) {
        // Crear un nuevo material con el color seleccionado
        const newMaterial = new THREE.MeshStandardMaterial({
          color: new THREE.Color(furnitureColor),
          roughness: 0.7,
          metalness: 0.2
        });
        
        // Aplicar el nuevo material
        part.material = newMaterial;
      }
    }
  }, [selectedFurniture, furnitureColor, furnitureParts, meshList]);
  
  // Manejar clicks en objetos (para modo selección)
  const handleClick = (event) => {
    if (!isInSelectionMode) return;
    
    // Prevenir que el click se propague al canvas
    event.stopPropagation();
    
    // Si hizo click en un objeto seleccionable
    if (event.object.userData.isSelectable) {
      console.log("Objeto seleccionado:", event.object.name);
      
      // Notificar la selección
      onObjectSelected(event.object.name);
      
      // Restaurar materiales
      meshList.forEach(({ object }) => {
        if (object.userData.priorToSelectionMaterial) {
          object.material = object.userData.priorToSelectionMaterial;
          object.userData.priorToSelectionMaterial = null;
        }
      });
    }
  };
  
  return (
    <primitive 
      object={scene} 
      scale={0.7} 
      position={[-4.5,1,-4.5]} 
      onClick={handleClick}
    />
  );
}

// Componente separado para el depurador fuera del canvas
function DebuggerOverlay({ position, target }) {
  return (
    <div style={{
      position: 'absolute',
      left: '20px',
      bottom: '20px',
      background: '#00000088',
      color: '#fff',
      padding: '10px',
      borderRadius: '8px',
      fontFamily: 'monospace',
      zIndex: 1000
    }}>
      <div><b>Camera Position:</b> [{position.join(', ')}]</div>
      <div><b>Target:</b> [{target.join(', ')}]</div>
    </div>
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
  
  const positions = {
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
  };

  const goToPosition = (position) => {
    setAnimatingCamera({
      startCamera: [...debugInfo.position.map(p => parseFloat(p))],
      endCamera: positions[position].camera,
      startTarget: [...debugInfo.target.map(t => parseFloat(t))],
      endTarget: positions[position].target,
      progress: 0
    });
  };

  // Función para actualizar la información de depuración
  const updateDebugInfo = (pos, tgt) => {
    setDebugInfo({
      position: pos,
      target: tgt
    });
  };

  // Manejar la selección de muebles
  const handleSelectFurniture = (furniture) => {
    setSelectedFurniture(furniture);
    setSelectedObjectName(furniture);
  };
  
  // Manejar la selección directa de objetos
  const handleObjectSelected = (objectName) => {
    setSelectedFurniture(`custom:${objectName}`);
    setSelectedObjectName(objectName);
    setIsInSelectionMode(false);
  };
  
  // Togglear el modo de selección
  const toggleSelectionMode = () => {
    setIsInSelectionMode(!isInSelectionMode);
  };

  return (
    <>
      
      
      {/* <FurnitureCustomizer 
        onSelectFurniture={handleSelectFurniture}
        onSelectColor={setFurnitureColor}
        onToggleSelectionMode={toggleSelectionMode}
        isInSelectionMode={isInSelectionMode}
        selectedObject={selectedObjectName}
      /> */}
      
      <Canvas camera={{ position: cameraPosition, fov: 65 }} className='w-screen h-screen'>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-4.5, 3, -4.5]} intensity={0.5} color="#ffffff" />
        <Suspense fallback={null}>
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
        <button onClick={() => goToPosition('Kitchen')} style={buttonStyle}>Kitcken</button>
        <button onClick={() => goToPosition('StayRoom')} style={buttonStyle}>Stay Room</button>
        <button onClick={() => goToPosition('BedRoom')} style={buttonStyle}>Bed Room</button>
      </div>
      {/* <DebuggerOverlay position={debugInfo.position} target={debugInfo.target} /> */}
    </>
  );
}

// Nuevo controlador de cámara con animación suave
function SmoothCameraController({ animationState, updateDebugInfo, setAnimatingCamera }) {
  const { camera, controls } = useThree();
  
  // Función para interpolar entre dos valores
  const lerp = (start, end, progress) => {
    return start + (end - start) * progress;
  };
  
  // Función para interpolar entre dos vectores 3D
  const lerpVector = (start, end, progress) => {
    return [
      lerp(start[0], end[0], progress),
      lerp(start[1], end[1], progress),
      lerp(start[2], end[2], progress)
    ];
  };
  
  // Actualizar la posición de la cámara en cada frame
  useFrame(() => {
    if (animationState && typeof animationState === 'object') {
      // Si hay una animación en progreso
      const { startCamera, endCamera, startTarget, endTarget, progress } = animationState;
      
      // Si la animación ya terminó
      if (progress >= 1) {
        // Establecer exactamente la posición final
        camera.position.set(...endCamera);
        if (controls) {
          controls.target.set(...endTarget);
          controls.update();
        }
        
        // Actualizar la información de depuración con los valores exactos
        updateDebugInfo(
          endCamera.map(v => v.toFixed(2)),
          endTarget.map(v => v.toFixed(2))
        );
        
        setAnimatingCamera(false);
        return;
      }
      
      // Calcular las nuevas posiciones interpoladas
      const newCameraPos = lerpVector(startCamera, endCamera, progress);
      const newTargetPos = lerpVector(startTarget, endTarget, progress);
      
      // Actualizar la cámara y el target
      camera.position.set(...newCameraPos);
      if (controls) {
        controls.target.set(...newTargetPos);
        controls.update();
      }
      
      // Actualizar la información de depuración
      updateDebugInfo(
        newCameraPos.map(v => v.toFixed(2)),
        newTargetPos.map(v => v.toFixed(2))
      );
      
      // Incrementar el progreso de la animación
      setAnimatingCamera({
        ...animationState,
        progress: progress + 0.03 // Velocidad de la animación (más pequeño = más lento)
      });
    }
    
    // Para la actualización regular cuando no hay animación
    if (!animationState && controls) {
      updateDebugInfo(
        [camera.position.x.toFixed(2), camera.position.y.toFixed(2), camera.position.z.toFixed(2)],
        [controls.target.x.toFixed(2), controls.target.y.toFixed(2), controls.target.z.toFixed(2)]
      );
    }
  });
  
  return <OrbitControls 
    makeDefault
    enableRotate={true}
    enabled={!animationState} // Deshabilitar controles durante la animación
  />;
}

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
