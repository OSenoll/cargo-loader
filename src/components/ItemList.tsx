import { useStore } from '../store/useStore';
import { translations } from '../lib/i18n';
import { ConstraintBadge } from './ConstraintBadge';
import { Package, Trash2, X, Plus, Minus } from 'lucide-react';

export function ItemList() {
  const { items, removeItem, clearItems, selectedItemId, setSelectedItemId, language, isManualPlaceMode, addManualItem, packingResult, removePackedItem } = useStore();
  const t = translations[language];

  if (items.length === 0) {
    return (
      <div className="bg-slate-800 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Package className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-semibold">{t.itemList}</h2>
        </div>
        <div className="text-slate-500 text-center py-8">
          {t.noItemsYet}
        </div>
      </div>
    );
  }

  // Toplam esya sayisi (quantity dahil)
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalWeight = items.reduce((acc, item) => acc + item.weight * item.quantity, 0);
  const totalVolume = items.reduce(
    (acc, item) => acc + (item.length * item.width * item.height * item.quantity) / 1000000,
    0
  );

  // Count how many of each item are already placed
  const getPlacedCount = (itemId: string) => {
    if (!packingResult) return 0;
    return packingResult.packedItems.filter(pi => pi.item.id.split('-')[0] === itemId.split('-')[0]).length;
  };

  // Find index of last placed item for removal
  const getLastPlacedIndex = (itemId: string) => {
    if (!packingResult) return -1;
    const baseId = itemId.split('-')[0];
    for (let i = packingResult.packedItems.length - 1; i >= 0; i--) {
      if (packingResult.packedItems[i].item.id.split('-')[0] === baseId) {
        return i;
      }
    }
    return -1;
  };

  return (
    <div className="bg-slate-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-semibold">{t.itemList}</h2>
          <span className="text-sm text-slate-400">({totalItems} {t.items})</span>
        </div>
        <button
          onClick={clearItems}
          className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1"
        >
          <X className="w-4 h-4" />
          {t.clear}
        </button>
      </div>

      {/* Ozet */}
      <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
        <div className="bg-slate-700/50 rounded px-2 py-1">
          <span className="text-slate-400">{t.totalWeight}</span>{' '}
          <span className="text-white font-medium">{totalWeight.toFixed(1)} kg</span>
        </div>
        <div className="bg-slate-700/50 rounded px-2 py-1">
          <span className="text-slate-400">{t.totalVolume}</span>{' '}
          <span className="text-white font-medium">{totalVolume.toFixed(2)} m³</span>
        </div>
      </div>

      {/* Manuel yerlesim bilgi */}
      {isManualPlaceMode && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-2 mb-3 text-xs text-amber-300">
          {t.manualPlaceInfo}
        </div>
      )}

      {/* Liste */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
        {items.map((item) => {
          const placedCount = getPlacedCount(item.id);
          return (
            <div
              key={item.id}
              onClick={() => setSelectedItemId(selectedItemId === item.id ? null : item.id)}
              className={`bg-slate-700/50 rounded-lg p-3 cursor-pointer transition-all ${
                selectedItemId === item.id
                  ? 'ring-2 ring-blue-500'
                  : 'hover:bg-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-medium">{item.name}</span>
                  {item.quantity > 1 && (
                    <span className="text-slate-400 text-sm">x{item.quantity}</span>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeItem(item.id);
                  }}
                  className="text-slate-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="text-sm text-slate-400 mt-1">
                {item.length} x {item.width} x {item.height} cm | {item.weight} kg
              </div>

              {item.constraints.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {item.constraints.map((constraint) => (
                    <ConstraintBadge key={constraint} type={constraint} size="sm" showLabel={false} />
                  ))}
                </div>
              )}

              {/* Manuel yerlesim butonlari */}
              {isManualPlaceMode && (
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const manualItem = {
                        ...item,
                        id: `${item.id}-m${Date.now()}`,
                        quantity: 1
                      };
                      addManualItem(manualItem);
                    }}
                    className="flex items-center gap-1 px-2 py-1 bg-green-600 hover:bg-green-500 text-white text-xs rounded transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    {t.placeItem}
                  </button>
                  {placedCount > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const idx = getLastPlacedIndex(item.id);
                        if (idx >= 0) removePackedItem(idx);
                      }}
                      className="flex items-center gap-1 px-2 py-1 bg-red-600 hover:bg-red-500 text-white text-xs rounded transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                      {t.removeItem}
                    </button>
                  )}
                  {placedCount > 0 && (
                    <span className="text-xs text-slate-400">{placedCount} {t.packed.toLowerCase()}</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
