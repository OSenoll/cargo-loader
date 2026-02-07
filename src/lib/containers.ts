import type { ContainerType, Constraint, ConstraintType, Language } from '../types';
import { translations } from './i18n';

// Standart konteyner tipleri (ic olculer - cm cinsinden)
export const CONTAINERS: ContainerType[] = [
  {
    id: '20ft',
    name: '20ft Standard',
    length: 589,      // 5.89m
    width: 235,       // 2.35m
    height: 239,      // 2.39m
    maxWeight: 28200, // 28.2 ton
    color: '#3b82f6'
  },
  {
    id: '40ft',
    name: '40ft Standard',
    length: 1203,     // 12.03m
    width: 235,       // 2.35m
    height: 239,      // 2.39m
    maxWeight: 28800, // 28.8 ton
    color: '#8b5cf6'
  },
  {
    id: '40ft-hc',
    name: '40ft High Cube',
    length: 1203,     // 12.03m
    width: 235,       // 2.35m
    height: 269,      // 2.69m
    maxWeight: 28560, // 28.56 ton
    color: '#06b6d4'
  }
];

// Constraint base data (without translations)
const CONSTRAINT_BASE: Record<ConstraintType, { icon: string; color: string }> = {
  must_be_on_top: { icon: '🔝', color: '#f59e0b' },
  must_be_on_bottom: { icon: '🔻', color: '#ef4444' },
  fragile: { icon: '📦', color: '#ec4899' },
  no_rotate: { icon: '🚫', color: '#6366f1' },
  heavy_bottom: { icon: '⚓', color: '#14b8a6' }
};

// Get constraints with translations
export function getConstraints(lang: Language): Record<ConstraintType, Constraint> {
  const t = translations[lang];
  return {
    must_be_on_top: {
      type: 'must_be_on_top',
      label: t.mustBeOnTop,
      icon: CONSTRAINT_BASE.must_be_on_top.icon,
      color: CONSTRAINT_BASE.must_be_on_top.color,
      description: t.mustBeOnTopDesc
    },
    must_be_on_bottom: {
      type: 'must_be_on_bottom',
      label: t.mustBeOnBottom,
      icon: CONSTRAINT_BASE.must_be_on_bottom.icon,
      color: CONSTRAINT_BASE.must_be_on_bottom.color,
      description: t.mustBeOnBottomDesc
    },
    fragile: {
      type: 'fragile',
      label: t.fragile,
      icon: CONSTRAINT_BASE.fragile.icon,
      color: CONSTRAINT_BASE.fragile.color,
      description: t.fragileDesc
    },
    no_rotate: {
      type: 'no_rotate',
      label: t.noRotate,
      icon: CONSTRAINT_BASE.no_rotate.icon,
      color: CONSTRAINT_BASE.no_rotate.color,
      description: t.noRotateDesc
    },
    heavy_bottom: {
      type: 'heavy_bottom',
      label: t.heavyBottom,
      icon: CONSTRAINT_BASE.heavy_bottom.icon,
      color: CONSTRAINT_BASE.heavy_bottom.color,
      description: t.heavyBottomDesc
    }
  };
}

// Default CONSTRAINTS for backwards compatibility (English)
export const CONSTRAINTS: Record<ConstraintType, Constraint> = getConstraints('en');

// Rastgele renk uretici
const ITEM_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
  '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
  '#ec4899', '#f43f5e'
];

export function getRandomColor(): string {
  return ITEM_COLORS[Math.floor(Math.random() * ITEM_COLORS.length)];
}

// Hacim hesaplama (cm3 -> m3)
export function calculateVolume(length: number, width: number, height: number): number {
  return (length * width * height) / 1000000; // cm3 to m3
}
