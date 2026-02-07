export type Language = 'en' | 'tr';

export const translations = {
  en: {
    // Header
    appName: 'Cargo Loader',
    appSubtitle: 'Container Loading Optimization',
    reset: 'Reset',
    calculate: 'Calculate',
    calculating: 'Calculating...',

    // Container Selector
    containerSelection: 'Container Selection',
    maxWeight: 'Max',

    // Item Form
    addItem: 'Add Item',
    itemName: 'Item Name',
    itemNamePlaceholder: 'Example: Box A',
    length: 'Length (cm)',
    width: 'Width (cm)',
    height: 'Height (cm)',
    weight: 'Weight (kg)',
    quantity: 'Quantity',
    constraints: 'Constraints',

    // Item List
    itemList: 'Item List',
    noItemsYet: 'No items added yet',
    items: 'items',
    clear: 'Clear',
    totalWeight: 'Total Weight:',
    totalVolume: 'Total Volume:',

    // Stats Panel
    results: 'Results',
    volumeUsage: 'Volume Usage',
    weightUsage: 'Weight Usage',
    packed: 'Packed',
    unpacked: 'Unpacked',
    unpackedItems: 'Unpacked Items:',

    // Usage Guide
    howToUse: 'How to Use?',
    step1: 'Select container type',
    step2: 'Add items with dimensions and constraints',
    step3: 'Click "Calculate" button',
    step4: 'Inspect the result in 3D view',
    constraintsTitle: 'Constraints',
    constraintMustBeOnTop: 'Must Be On Top - Nothing on top',
    constraintMustBeOnBottom: 'Must Be On Bottom - Near ground',
    constraintFragile: 'Fragile - Max 20kg load',
    constraintNoRotate: 'No Rotate - Fixed orientation',
    constraintHeavyBottom: 'Heavy - Placed at bottom',

    // Constraint Labels
    mustBeOnTop: 'Must Be On Top',
    mustBeOnBottom: 'Must Be On Bottom',
    fragile: 'Fragile',
    noRotate: 'No Rotate',
    heavyBottom: 'Heavy - Bottom',

    // Constraint Descriptions
    mustBeOnTopDesc: 'Nothing can be placed on top of this item',
    mustBeOnBottomDesc: 'This item should be placed near the ground',
    fragileDesc: 'Maximum 20kg load can be placed on top',
    noRotateDesc: 'Can only be placed in the specified orientation',
    heavyBottomDesc: 'Heavy item, should be at bottom and center',

    // Manual Mode
    manualEdit: 'Manual Edit',
    manualPlace: 'Manual Place',
    placeItem: 'Place',
    removeItem: 'Remove',
    dragToMove: 'Drag items to reposition',
    manualPlaceInfo: 'Click "Place" to add items to the container',
    manualEditInfo: 'Drag items to adjust positions',
    manualModeStats: 'Manual mode — stats update in real-time',
  },
  tr: {
    // Header
    appName: 'Cargo Loader',
    appSubtitle: 'Konteyner Yükleme Optimizasyonu',
    reset: 'Sıfırla',
    calculate: 'Hesapla',
    calculating: 'Hesaplanıyor...',

    // Container Selector
    containerSelection: 'Konteyner Seçimi',
    maxWeight: 'Max',

    // Item Form
    addItem: 'Eşya Ekle',
    itemName: 'Eşya Adı',
    itemNamePlaceholder: 'Örnek: Koli A',
    length: 'Uzunluk (cm)',
    width: 'Genişlik (cm)',
    height: 'Yükseklik (cm)',
    weight: 'Ağırlık (kg)',
    quantity: 'Adet',
    constraints: 'Kısıtlamalar',

    // Item List
    itemList: 'Eşya Listesi',
    noItemsYet: 'Henüz eşya eklenmedi',
    items: 'adet',
    clear: 'Temizle',
    totalWeight: 'Toplam Ağırlık:',
    totalVolume: 'Toplam Hacim:',

    // Stats Panel
    results: 'Sonuçlar',
    volumeUsage: 'Hacim Kullanımı',
    weightUsage: 'Ağırlık Kullanımı',
    packed: 'Yerleşti',
    unpacked: 'Sığmadı',
    unpackedItems: 'Sığmayan Eşyalar:',

    // Usage Guide
    howToUse: 'Nasıl Kullanılır?',
    step1: 'Konteyner tipini seçin',
    step2: 'Eşyalarınızı boyut ve kısıtlamalarıyla ekleyin',
    step3: '"Hesapla" butonuna tıklayın',
    step4: '3D görüntüde sonucu inceleyin',
    constraintsTitle: 'Kısıtlamalar',
    constraintMustBeOnTop: 'Üstte Olmalı - Üzerine şey konulmaz',
    constraintMustBeOnBottom: 'Altta Olmalı - Zemine yakın',
    constraintFragile: 'Kırılgan - Max 20kg yük',
    constraintNoRotate: 'Döndürülemez - Sabit yön',
    constraintHeavyBottom: 'Ağır - Alta yerleşir',

    // Constraint Labels
    mustBeOnTop: 'Üstte Olmalı',
    mustBeOnBottom: 'Altta Olmalı',
    fragile: 'Kırılgan',
    noRotate: 'Döndürülemez',
    heavyBottom: 'Ağır - Alta',

    // Constraint Descriptions
    mustBeOnTopDesc: 'Bu eşyanın üstüne hiçbir şey konulamaz',
    mustBeOnBottomDesc: 'Bu eşya zemine yakın olmalı',
    fragileDesc: 'Üstüne maksimum 20kg yük konulabilir',
    noRotateDesc: 'Sadece belirtilen yönde yerleştirilebilir',
    heavyBottomDesc: 'Ağır eşya, altta ve merkezde olmalı',

    // Manual Mode
    manualEdit: 'Manuel Düzenleme',
    manualPlace: 'Manuel Yerleştir',
    placeItem: 'Yerleştir',
    removeItem: 'Kaldır',
    dragToMove: 'Eşyaları sürükleyerek taşıyın',
    manualPlaceInfo: 'Eşyaları konteynere eklemek için "Yerleştir"e tıklayın',
    manualEditInfo: 'Eşyaları sürükleyerek pozisyonlarını ayarlayın',
    manualModeStats: 'Manuel mod — istatistikler anlık güncellenir',
  }
} as const;

export type TranslationKey = keyof typeof translations.en;

export function getTranslation(lang: Language, key: TranslationKey): string {
  return translations[lang][key];
}
