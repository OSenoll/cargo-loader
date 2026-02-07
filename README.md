# Cargo Loader

3D konteyner yukleme optimizasyon uygulamasi. Esyalarinizi en verimli sekilde konteynere yerlestirin.

![Cargo Loader](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Three.js](https://img.shields.io/badge/Three.js-3D-green) ![Tailwind](https://img.shields.io/badge/Tailwind-CSS-purple)

## Ozellikler

- **3D Gorsellestirme** - Interaktif 3D gorunum (dondurme, yakinlastirma, esya secme)
- **Akilli Yerlestirme** - LAFF algoritmasiyla optimal kutu yerlestirme
- **Kisitlama Destegi** - Esyalara ozel kurallar tanimlama
- **Gercek Konteyner Olculeri** - 20ft, 40ft ve 40ft High Cube destegi
- **LocalStorage** - Verileriniz otomatik kaydedilir

## Kisitlama Etiketleri

| Etiket | Aciklama |
|--------|----------|
| Ustte Olmali | Bu esyanin ustune hicbir sey konulamaz |
| Altta Olmali | Bu esya zemine yakin olmali |
| Kirilgan | Ustune maksimum 20kg yuk konulabilir |
| Dondurulemez | Sadece belirtilen yonde yerlestirilebilir |
| Agir - Alta | Agir esya, altta ve merkezde olmali |

## Kurulum

```bash
# Repoyu klonla
git clone https://github.com/OSenoll/cargo-loader.git
cd cargo-loader

# Bagimliliklari yukle
npm install

# Gelistirme sunucusunu baslat
npm run dev
```

## Kullanim

1. **Konteyner Sec** - Sol panelden konteyner tipini secin
2. **Esya Ekle** - Boyut, agirlik ve kisitlamalari girin
3. **Hesapla** - "Hesapla" butonuna tiklayin
4. **Incele** - 3D goruntude sonucu inceleyin, esyalara tiklayarak detaylari gorun

## Teknolojiler

- **React 18** + TypeScript
- **Three.js** / React Three Fiber - 3D gorsellestirme
- **Zustand** - State yonetimi
- **Tailwind CSS** - Styling
- **Vite** - Build tool

## Algoritma

Uygulama **LAFF (Largest Area Fit First)** algoritmasini kullanir:

1. Esyalar oncelik sirasina gore siralanir (agir ve buyuk olanlar once)
2. Her esya icin en uygun bos alan bulunur
3. Kisitlamalar kontrol edilir (kirilganlik, ustte olma zorunlulugu vb.)
4. Esya yerlestirildikten sonra kalan bos alanlar guncellenir

## Konteyner Olculeri

| Tip | Uzunluk | Genislik | Yukseklik | Max Agirlik |
|-----|---------|----------|-----------|-------------|
| 20ft Standard | 5.89m | 2.35m | 2.39m | 28.2 ton |
| 40ft Standard | 12.03m | 2.35m | 2.39m | 28.8 ton |
| 40ft High Cube | 12.03m | 2.35m | 2.69m | 28.56 ton |

## Lisans

MIT

---

Made with Claude Code
