import { useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import type { ThreeEvent } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import type { PackedItem } from '../types';
import { useStore } from '../store/useStore';
import { CONSTRAINTS } from '../lib/containers';
import { snapPosition } from '../lib/snapping';

interface Item3DProps {
  packedItem: PackedItem;
  scale: number;
  containerOffset: { x: number; y: number; z: number };
  index: number;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

export function Item3D({ packedItem, scale, containerOffset, index, onDragStart, onDragEnd }: Item3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragPlane = useRef<THREE.Plane | null>(null);
  const dragOffset = useRef(new THREE.Vector3());

  const { selectedItemId, setSelectedItemId, isManualEditMode, updatePackedItemPosition, selectedContainer, packingResult } = useStore();
  const { camera, raycaster, gl } = useThree();

  const { item, position, dimensions } = packedItem;

  // Olceklenmis boyut ve pozisyon
  const width = dimensions.width * scale;
  const height = dimensions.height * scale;
  const depth = dimensions.depth * scale;

  // Konteyner merkezinden offset ile pozisyon
  const posX = (position.x + dimensions.width / 2) * scale + containerOffset.x;
  const posY = (position.y + dimensions.height / 2) * scale + containerOffset.y;
  const posZ = (position.z + dimensions.depth / 2) * scale + containerOffset.z;

  const isSelected = selectedItemId === item.id.split('-')[0];

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    if (isDragging) return;
    e.stopPropagation();
    const originalId = item.id.split('-')[0];
    setSelectedItemId(isSelected ? null : originalId);
  };

  const handlePointerDown = useCallback((e: ThreeEvent<PointerEvent>) => {
    if (!isManualEditMode) return;
    e.stopPropagation();

    // Create drag plane at item's Y level in scene coordinates
    const sceneY = posY;
    dragPlane.current = new THREE.Plane(new THREE.Vector3(0, 1, 0), -sceneY);

    // Calculate offset: where we clicked vs the item center
    const intersectPoint = new THREE.Vector3();
    raycaster.ray.intersectPlane(dragPlane.current, intersectPoint);
    dragOffset.current.set(
      intersectPoint.x - posX,
      0,
      intersectPoint.z - posZ
    );

    setIsDragging(true);
    onDragStart?.();

    // Capture pointer for smooth dragging
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);

    gl.domElement.style.cursor = 'grabbing';
  }, [isManualEditMode, posX, posY, posZ, raycaster, onDragStart, gl]);

  const handlePointerMove = useCallback((e: ThreeEvent<PointerEvent>) => {
    if (!isDragging || !dragPlane.current) return;
    e.stopPropagation();

    // Update raycaster from event
    const rect = gl.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );
    raycaster.setFromCamera(mouse, camera);

    const intersectPoint = new THREE.Vector3();
    if (!raycaster.ray.intersectPlane(dragPlane.current, intersectPoint)) return;

    // Scene position (center of item)
    const newSceneX = intersectPoint.x - dragOffset.current.x;
    const newSceneZ = intersectPoint.z - dragOffset.current.z;

    // Convert scene → container coordinates (top-left origin)
    const containerX = (newSceneX - containerOffset.x) / scale - dimensions.width / 2;
    const containerZ = (newSceneZ - containerOffset.z) / scale - dimensions.depth / 2;

    // Apply snapping
    const snapped = snapPosition(
      { x: containerX, y: position.y, z: containerZ },
      dimensions,
      selectedContainer,
      packingResult?.packedItems || [],
      index
    );

    updatePackedItemPosition(index, snapped);
  }, [isDragging, gl, raycaster, camera, containerOffset, scale, dimensions, position.y, selectedContainer, packingResult, index, updatePackedItemPosition]);

  const handlePointerUp = useCallback((e: ThreeEvent<PointerEvent>) => {
    if (!isDragging) return;
    e.stopPropagation();
    setIsDragging(false);
    dragPlane.current = null;
    onDragEnd?.();
    gl.domElement.style.cursor = isManualEditMode ? 'grab' : 'auto';
  }, [isDragging, onDragEnd, gl, isManualEditMode]);

  // Kisitlamalara gore renk
  const getColor = () => {
    if (item.constraints.includes('must_be_on_top')) return '#f59e0b';
    if (item.constraints.includes('fragile')) return '#ec4899';
    if (item.constraints.includes('must_be_on_bottom')) return '#ef4444';
    return item.color;
  };

  return (
    <group position={[posX, posY, posZ]}>
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerOver={() => {
          setHovered(true);
          if (isManualEditMode && !isDragging) {
            gl.domElement.style.cursor = 'grab';
          }
        }}
        onPointerOut={() => {
          setHovered(false);
          if (!isDragging) {
            gl.domElement.style.cursor = 'auto';
          }
        }}
      >
        <boxGeometry args={[width - 0.01, height - 0.01, depth - 0.01]} />
        <meshStandardMaterial
          color={getColor()}
          transparent
          opacity={isDragging ? 0.95 : isSelected ? 0.9 : hovered ? 0.8 : 0.7}
          emissive={isDragging ? '#ffffff' : isSelected ? getColor() : hovered ? getColor() : '#000000'}
          emissiveIntensity={isDragging ? 0.4 : isSelected ? 0.3 : hovered ? 0.15 : 0}
        />
      </mesh>

      {/* Kenar cizgileri */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(width, height, depth)]} />
        <lineBasicMaterial color={isDragging ? '#fbbf24' : isSelected ? '#ffffff' : '#000000'} linewidth={1} />
      </lineSegments>

      {/* Hover/Selected info */}
      {(hovered || isSelected) && !isDragging && (
        <Html
          position={[0, height / 2 + 0.2, 0]}
          center
          style={{ pointerEvents: 'none' }}
        >
          <div className="bg-slate-900/95 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-xl border border-slate-700">
            <div className="font-bold text-sm mb-1">{item.name}</div>
            <div className="text-slate-300">
              {item.length} x {item.width} x {item.height} cm
            </div>
            <div className="text-slate-300">{item.weight} kg</div>
            {item.constraints.length > 0 && (
              <div className="flex gap-1 mt-1">
                {item.constraints.map(c => (
                  <span key={c}>{CONSTRAINTS[c].icon}</span>
                ))}
              </div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}
