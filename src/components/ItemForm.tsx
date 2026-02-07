import { useState } from 'react';
import { useStore } from '../store/useStore';
import type { ConstraintType } from '../types';
import { ConstraintSelector } from './ConstraintBadge';
import { Plus } from 'lucide-react';

interface FormData {
  name: string;
  length: string;
  width: string;
  height: string;
  weight: string;
  quantity: string;
  constraints: ConstraintType[];
}

const initialFormData: FormData = {
  name: '',
  length: '',
  width: '',
  height: '',
  weight: '',
  quantity: '1',
  constraints: []
};

export function ItemForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const addItem = useStore((state) => state.addItem);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.length || !formData.width || !formData.height) {
      return;
    }

    addItem({
      name: formData.name,
      length: parseFloat(formData.length),
      width: parseFloat(formData.width),
      height: parseFloat(formData.height),
      weight: parseFloat(formData.weight) || 0,
      quantity: parseInt(formData.quantity) || 1,
      constraints: formData.constraints
    });

    setFormData(initialFormData);
  };

  const handleChange = (field: keyof FormData, value: string | ConstraintType[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <Plus className="w-5 h-5 text-green-400" />
        <h2 className="text-lg font-semibold">Esya Ekle</h2>
      </div>

      <div className="space-y-3">
        {/* Esya Adi */}
        <div>
          <label className="block text-sm text-slate-400 mb-1">Esya Adi</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Ornek: Koli A"
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Boyutlar */}
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Uzunluk (cm)</label>
            <input
              type="number"
              value={formData.length}
              onChange={(e) => handleChange('length', e.target.value)}
              placeholder="100"
              min="1"
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Genislik (cm)</label>
            <input
              type="number"
              value={formData.width}
              onChange={(e) => handleChange('width', e.target.value)}
              placeholder="50"
              min="1"
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Yukseklik (cm)</label>
            <input
              type="number"
              value={formData.height}
              onChange={(e) => handleChange('height', e.target.value)}
              placeholder="60"
              min="1"
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Agirlik ve Adet */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Agirlik (kg)</label>
            <input
              type="number"
              value={formData.weight}
              onChange={(e) => handleChange('weight', e.target.value)}
              placeholder="10"
              min="0"
              step="0.1"
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Adet</label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => handleChange('quantity', e.target.value)}
              placeholder="1"
              min="1"
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Kisitlamalar */}
        <div>
          <label className="block text-sm text-slate-400 mb-2">Kisitlamalar</label>
          <ConstraintSelector
            selected={formData.constraints}
            onChange={(constraints) => handleChange('constraints', constraints)}
          />
        </div>

        {/* Ekle Butonu */}
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Esya Ekle
        </button>
      </div>
    </form>
  );
}
