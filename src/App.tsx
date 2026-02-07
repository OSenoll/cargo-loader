import { useEffect } from 'react';
import { useStore } from './store/useStore';
import { packItems } from './lib/packer';
import { ContainerSelector } from './components/ContainerSelector';
import { ItemForm } from './components/ItemForm';
import { ItemList } from './components/ItemList';
import { StatsPanel } from './components/StatsPanel';
import { Scene3D } from './components/Scene3D';
import { Truck, Play, RotateCcw } from 'lucide-react';

function App() {
  const {
    items,
    selectedContainer,
    isPacking,
    setPackingResult,
    setIsPacking,
    loadFromStorage
  } = useStore();

  // Sayfa yuklendiginde localStorage'dan veri yukle
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  // Packing islemini baslat
  const handlePack = async () => {
    if (items.length === 0) return;

    setIsPacking(true);

    // Kucuk bir gecikme ile UI'in guncellenmesini bekle
    await new Promise(resolve => setTimeout(resolve, 100));

    const result = packItems(items, selectedContainer);
    setPackingResult(result);
    setIsPacking(false);
  };

  // Sonuclari temizle
  const handleReset = () => {
    setPackingResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between max-w-[1800px] mx-auto">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Cargo Loader</h1>
              <p className="text-sm text-slate-400">Konteyner Yukleme Optimizasyonu</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Sifirla
            </button>
            <button
              onClick={handlePack}
              disabled={items.length === 0 || isPacking}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              <Play className="w-4 h-4" />
              {isPacking ? 'Hesaplaniyor...' : 'Hesapla'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 max-w-[1800px] mx-auto">
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-140px)]">
          {/* Sol Panel - Kontroller */}
          <div className="col-span-3 space-y-4 overflow-y-auto pr-2">
            <ContainerSelector />
            <ItemForm />
            <ItemList />
          </div>

          {/* Orta Panel - 3D Goruntu */}
          <div className="col-span-6 bg-slate-800 rounded-lg overflow-hidden">
            <Scene3D />
          </div>

          {/* Sag Panel - Sonuclar */}
          <div className="col-span-3 space-y-4 overflow-y-auto pl-2">
            <StatsPanel />

            {/* Kullanim Kilavuzu */}
            <div className="bg-slate-800 rounded-lg p-4">
              <h3 className="font-semibold mb-3 text-slate-300">Nasil Kullanilir?</h3>
              <ol className="text-sm text-slate-400 space-y-2 list-decimal list-inside">
                <li>Konteyner tipini secin</li>
                <li>Esyalarinizi boyut ve kisitlamalariyla ekleyin</li>
                <li>"Hesapla" butonuna tiklayin</li>
                <li>3D goruntude sonucu inceleyin</li>
              </ol>

              <div className="mt-4 pt-4 border-t border-slate-700">
                <h4 className="font-medium text-slate-300 mb-2">Kisitlamalar</h4>
                <div className="text-xs text-slate-500 space-y-1">
                  <div><span className="text-amber-400">🔝</span> Ustte Olmali - Uzerine sey konulmaz</div>
                  <div><span className="text-red-400">🔻</span> Altta Olmali - Zemine yakin</div>
                  <div><span className="text-pink-400">📦</span> Kirilgan - Max 20kg yuk</div>
                  <div><span className="text-indigo-400">🚫</span> Dondurulemez - Sabit yon</div>
                  <div><span className="text-teal-400">⚓</span> Agir - Alta yerlesir</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
