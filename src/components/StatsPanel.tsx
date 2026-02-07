import { useStore } from '../store/useStore';
import { translations } from '../lib/i18n';
import { BarChart3, Package, AlertTriangle } from 'lucide-react';

export function StatsPanel() {
  const { packingResult, selectedContainer, language, isManualEditMode, isManualPlaceMode } = useStore();
  const t = translations[language];

  if (!packingResult) {
    return null;
  }

  const volumePercent = packingResult.volumeUtilization;
  const weightPercent = packingResult.weightUtilization;

  return (
    <div className="bg-slate-800 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-cyan-400" />
        <h2 className="text-lg font-semibold">{t.results}</h2>
      </div>

      {/* Hacim Kullanimi */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-slate-400">{t.volumeUsage}</span>
          <span className="font-medium">{volumePercent.toFixed(1)}%</span>
        </div>
        <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(volumePercent, 100)}%`,
              backgroundColor: volumePercent > 90 ? '#22c55e' : volumePercent > 70 ? '#eab308' : '#3b82f6'
            }}
          />
        </div>
        <div className="text-xs text-slate-500 mt-1">
          {packingResult.usedVolume.toFixed(2)} / {packingResult.totalVolume.toFixed(2)} m³
        </div>
      </div>

      {/* Agirlik Kullanimi */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-slate-400">{t.weightUsage}</span>
          <span className="font-medium">{weightPercent.toFixed(1)}%</span>
        </div>
        <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(weightPercent, 100)}%`,
              backgroundColor: weightPercent > 90 ? '#ef4444' : weightPercent > 70 ? '#eab308' : '#3b82f6'
            }}
          />
        </div>
        <div className="text-xs text-slate-500 mt-1">
          {packingResult.totalWeight.toFixed(1)} / {selectedContainer.maxWeight.toFixed(0)} kg
        </div>
      </div>

      {/* Istatistikler */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-slate-700/50 rounded-lg p-3 flex items-center gap-2">
          <Package className="w-5 h-5 text-green-400" />
          <div>
            <div className="text-xl font-bold">{packingResult.packedItems.length}</div>
            <div className="text-xs text-slate-400">{t.packed}</div>
          </div>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-3 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          <div>
            <div className="text-xl font-bold">{packingResult.unpackedItems.length}</div>
            <div className="text-xs text-slate-400">{t.unpacked}</div>
          </div>
        </div>
      </div>

      {/* Manuel mod bilgi notu */}
      {(isManualEditMode || isManualPlaceMode) && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-2 mt-3 text-xs text-amber-300">
          {t.manualModeStats}
        </div>
      )}

      {/* Sigmayan Esyalar */}
      {packingResult.unpackedItems.length > 0 && (
        <div className="mt-4">
          <div className="text-sm text-slate-400 mb-2">{t.unpackedItems}</div>
          <div className="space-y-1">
            {packingResult.unpackedItems.map((item) => (
              <div
                key={item.id}
                className="text-sm bg-red-500/20 text-red-300 rounded px-2 py-1"
              >
                {item.name} ({item.length}x{item.width}x{item.height} cm)
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
