import { useMemo } from 'react';
import * as THREE from 'three';
import type { ContainerType } from '../types';

interface Container3DProps {
  container: ContainerType;
  scale: number;
}

export function Container3D({ container, scale }: Container3DProps) {
  // Olceklenmis boyutlar
  const width = container.length * scale;
  const height = container.height * scale;
  const depth = container.width * scale;

  // Kenar cizgileri icin geometry
  const edgesGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];

    // Alt kenarlar
    points.push(new THREE.Vector3(-width/2, -height/2, -depth/2));
    points.push(new THREE.Vector3(width/2, -height/2, -depth/2));

    points.push(new THREE.Vector3(-width/2, -height/2, depth/2));
    points.push(new THREE.Vector3(width/2, -height/2, depth/2));

    points.push(new THREE.Vector3(-width/2, -height/2, -depth/2));
    points.push(new THREE.Vector3(-width/2, -height/2, depth/2));

    points.push(new THREE.Vector3(width/2, -height/2, -depth/2));
    points.push(new THREE.Vector3(width/2, -height/2, depth/2));

    // Ust kenarlar
    points.push(new THREE.Vector3(-width/2, height/2, -depth/2));
    points.push(new THREE.Vector3(width/2, height/2, -depth/2));

    points.push(new THREE.Vector3(-width/2, height/2, depth/2));
    points.push(new THREE.Vector3(width/2, height/2, depth/2));

    points.push(new THREE.Vector3(-width/2, height/2, -depth/2));
    points.push(new THREE.Vector3(-width/2, height/2, depth/2));

    points.push(new THREE.Vector3(width/2, height/2, -depth/2));
    points.push(new THREE.Vector3(width/2, height/2, depth/2));

    // Dikey kenarlar
    points.push(new THREE.Vector3(-width/2, -height/2, -depth/2));
    points.push(new THREE.Vector3(-width/2, height/2, -depth/2));

    points.push(new THREE.Vector3(width/2, -height/2, -depth/2));
    points.push(new THREE.Vector3(width/2, height/2, -depth/2));

    points.push(new THREE.Vector3(-width/2, -height/2, depth/2));
    points.push(new THREE.Vector3(-width/2, height/2, depth/2));

    points.push(new THREE.Vector3(width/2, -height/2, depth/2));
    points.push(new THREE.Vector3(width/2, height/2, depth/2));

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return geometry;
  }, [width, height, depth]);

  return (
    <group>
      {/* Yari saydam konteyner */}
      <mesh>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial
          color="#1e3a5f"
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Kenar cizgileri */}
      <lineSegments geometry={edgesGeometry}>
        <lineBasicMaterial color="#3b82f6" />
      </lineSegments>

      {/* Zemin grid */}
      <gridHelper
        args={[Math.max(width, depth), 10, '#334155', '#1e293b']}
        position={[0, -height/2, 0]}
      />
    </group>
  );
}
