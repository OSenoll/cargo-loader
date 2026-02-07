import { useRef, useState } from 'react';
import * as THREE from 'three';
import type { ThreeEvent } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import type { PackedItem } from '../types';
import { useStore } from '../store/useStore';
import { CONSTRAINTS } from '../lib/containers';

interface Item3DProps {
  packedItem: PackedItem;
  scale: number;
  containerOffset: { x: number; y: number; z: number };
}

export function Item3D({ packedItem, scale, containerOffset }: Item3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { selectedItemId, setSelectedItemId } = useStore();

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
    e.stopPropagation();
    const originalId = item.id.split('-')[0];
    setSelectedItemId(isSelected ? null : originalId);
  };

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
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[width - 0.01, height - 0.01, depth - 0.01]} />
        <meshStandardMaterial
          color={getColor()}
          transparent
          opacity={isSelected ? 0.9 : hovered ? 0.8 : 0.7}
          emissive={isSelected ? getColor() : hovered ? getColor() : '#000000'}
          emissiveIntensity={isSelected ? 0.3 : hovered ? 0.15 : 0}
        />
      </mesh>

      {/* Kenar cizgileri */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(width, height, depth)]} />
        <lineBasicMaterial color={isSelected ? '#ffffff' : '#000000'} linewidth={1} />
      </lineSegments>

      {/* Hover/Selected info */}
      {(hovered || isSelected) && (
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
