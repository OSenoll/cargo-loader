import type { ContainerType, PackedItem } from '../types';

export interface SnapResult {
  x: number;
  y: number;
  z: number;
  snappedX: boolean;
  snappedY: boolean;
  snappedZ: boolean;
}

const SNAP_THRESHOLD = 15; // cm

export function snapPosition(
  position: { x: number; y: number; z: number },
  dimensions: { width: number; height: number; depth: number },
  container: ContainerType,
  otherItems: PackedItem[],
  selfIndex: number
): SnapResult {
  let { x, y, z } = position;
  let snappedX = false;
  let snappedY = false;
  let snappedZ = false;

  // Item edges
  const itemLeft = x;
  const itemRight = x + dimensions.width;
  const itemBottom = y;
  const itemFront = z;
  const itemBack = z + dimensions.depth;

  // --- Snap to container walls ---

  // X axis: left wall (x=0), right wall (x=container.length)
  if (Math.abs(itemLeft) < SNAP_THRESHOLD) {
    x = 0;
    snappedX = true;
  } else if (Math.abs(itemRight - container.length) < SNAP_THRESHOLD) {
    x = container.length - dimensions.width;
    snappedX = true;
  }

  // Z axis: front wall (z=0), back wall (z=container.width)
  if (Math.abs(itemFront) < SNAP_THRESHOLD) {
    z = 0;
    snappedZ = true;
  } else if (Math.abs(itemBack - container.width) < SNAP_THRESHOLD) {
    z = container.width - dimensions.depth;
    snappedZ = true;
  }

  // Y axis: floor (y=0)
  if (Math.abs(itemBottom) < SNAP_THRESHOLD) {
    y = 0;
    snappedY = true;
  }

  // --- Snap to other items ---
  for (let i = 0; i < otherItems.length; i++) {
    if (i === selfIndex) continue;

    const other = otherItems[i];
    const oLeft = other.position.x;
    const oRight = other.position.x + other.dimensions.width;
    const oBottom = other.position.y;
    const oTop = other.position.y + other.dimensions.height;
    const oFront = other.position.z;
    const oBack = other.position.z + other.dimensions.depth;

    // Recalculate current edges after potential wall snap
    const curLeft = x;
    const curRight = x + dimensions.width;
    const curBottom = y;
    const curTop = y + dimensions.height;
    const curFront = z;
    const curBack = z + dimensions.depth;

    // X axis snapping
    if (!snappedX) {
      // Left edge to right edge (place next to right side)
      if (Math.abs(curLeft - oRight) < SNAP_THRESHOLD) {
        x = oRight;
        snappedX = true;
      }
      // Right edge to left edge (place next to left side)
      else if (Math.abs(curRight - oLeft) < SNAP_THRESHOLD) {
        x = oLeft - dimensions.width;
        snappedX = true;
      }
      // Left-left alignment
      else if (Math.abs(curLeft - oLeft) < SNAP_THRESHOLD) {
        x = oLeft;
        snappedX = true;
      }
      // Right-right alignment
      else if (Math.abs(curRight - oRight) < SNAP_THRESHOLD) {
        x = oRight - dimensions.width;
        snappedX = true;
      }
    }

    // Z axis snapping
    if (!snappedZ) {
      if (Math.abs(curFront - oBack) < SNAP_THRESHOLD) {
        z = oBack;
        snappedZ = true;
      } else if (Math.abs(curBack - oFront) < SNAP_THRESHOLD) {
        z = oFront - dimensions.depth;
        snappedZ = true;
      } else if (Math.abs(curFront - oFront) < SNAP_THRESHOLD) {
        z = oFront;
        snappedZ = true;
      } else if (Math.abs(curBack - oBack) < SNAP_THRESHOLD) {
        z = oBack - dimensions.depth;
        snappedZ = true;
      }
    }

    // Y axis snapping (stack on top)
    if (!snappedY) {
      if (Math.abs(curBottom - oTop) < SNAP_THRESHOLD) {
        y = oTop;
        snappedY = true;
      } else if (Math.abs(curTop - oBottom) < SNAP_THRESHOLD) {
        y = oBottom - dimensions.height;
        snappedY = true;
      }
    }
  }

  // --- Clamp within container bounds ---
  x = Math.max(0, Math.min(x, container.length - dimensions.width));
  y = Math.max(0, Math.min(y, container.height - dimensions.height));
  z = Math.max(0, Math.min(z, container.width - dimensions.depth));

  return { x, y, z, snappedX, snappedY, snappedZ };
}
