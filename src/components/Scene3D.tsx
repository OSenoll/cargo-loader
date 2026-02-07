import { Suspense, useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { useStore } from '../store/useStore';
import { Container3D } from './Container3D';
import { Item3D } from './Item3D';

function Scene() {
  const { selectedContainer, packingResult, setSelectedItemId } = useStore();
  const orbitRef = useRef<OrbitControlsImpl>(null);

  // Konteyner boyutlarina gore olcek (ekrana sigdirma)
  const maxDim = Math.max(selectedContainer.length, selectedContainer.width, selectedContainer.height);
  const scale = 5 / maxDim; // 5 birimlik sanal alana sigdir

  // Konteyner merkez ofseti
  const containerOffset = {
    x: -selectedContainer.length * scale / 2,
    y: -selectedContainer.height * scale / 2,
    z: -selectedContainer.width * scale / 2
  };

  const handleDragStart = useCallback(() => {
    if (orbitRef.current) {
      orbitRef.current.enabled = false;
    }
  }, []);

  const handleDragEnd = useCallback(() => {
    if (orbitRef.current) {
      orbitRef.current.enabled = true;
    }
  }, []);

  return (
    <>
      {/* Kamera */}
      <PerspectiveCamera makeDefault position={[8, 6, 8]} fov={50} />

      {/* Isiklandirma */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow />
      <directionalLight position={[-10, 10, -5]} intensity={0.4} />

      {/* Ortam */}
      <Environment preset="city" />

      {/* Konteyner */}
      <Container3D container={selectedContainer} scale={scale} />

      {/* Yerlesmis esyalar */}
      {packingResult?.packedItems.map((packedItem, index) => (
        <Item3D
          key={`${packedItem.item.id}-${index}`}
          packedItem={packedItem}
          scale={scale}
          containerOffset={containerOffset}
          index={index}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        />
      ))}

      {/* Kamera kontrolleri */}
      <OrbitControls
        ref={orbitRef}
        enableDamping
        dampingFactor={0.05}
        minDistance={3}
        maxDistance={20}
        onStart={() => setSelectedItemId(null)}
      />
    </>
  );
}

export function Scene3D() {
  return (
    <div className="w-full h-full bg-slate-900 rounded-lg overflow-hidden">
      <Canvas shadows>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
