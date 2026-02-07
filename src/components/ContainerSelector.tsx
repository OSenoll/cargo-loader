import { useStore } from '../store/useStore';
import type { ContainerType } from '../types';
import { translations } from '../lib/i18n';
import { Box } from 'lucide-react';

export function ContainerSelector() {
  const { containers, selectedContainer, setSelectedContainer, language } = useStore();
  const t = translations[language];

  return (
    <div className="bg-slate-800 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Box className="w-5 h-5 text-blue-400" />
        <h2 className="text-lg font-semibold">{t.containerSelection}</h2>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {containers.map((container: ContainerType) => (
          <button
            key={container.id}
            onClick={() => setSelectedContainer(container)}
            className={`p-3 rounded-lg border-2 transition-all text-left ${
              selectedContainer.id === container.id
                ? 'border-blue-500 bg-blue-500/20'
                : 'border-slate-600 hover:border-slate-500 bg-slate-700/50'
            }`}
          >
            <div className="font-medium">{container.name}</div>
            <div className="text-sm text-slate-400">
              {(container.length / 100).toFixed(2)}m x{' '}
              {(container.width / 100).toFixed(2)}m x{' '}
              {(container.height / 100).toFixed(2)}m
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {t.maxWeight}: {(container.maxWeight / 1000).toFixed(1)} ton
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
