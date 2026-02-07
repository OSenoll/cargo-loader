# Cargo Loader

3D container loading optimization app. Pack your items into containers in the most efficient way.

![React](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Three.js](https://img.shields.io/badge/Three.js-3D-green) ![Tailwind](https://img.shields.io/badge/Tailwind-CSS-purple)

## Features

- **3D Visualization** - Interactive 3D view (rotate, zoom, select items)
- **Smart Packing** - Optimal box placement using LAFF algorithm
- **Constraint Support** - Define custom rules for items
- **Real Container Sizes** - 20ft, 40ft and 40ft High Cube support
- **LocalStorage** - Your data is automatically saved

## Constraint Labels

| Label | Description |
|-------|-------------|
| Must Be On Top | Nothing can be placed on top of this item |
| Must Be On Bottom | This item should be placed near the ground |
| Fragile | Maximum 20kg load can be placed on top |
| No Rotate | Can only be placed in the specified orientation |
| Heavy - Bottom | Heavy item, should be at bottom and center |

## Installation

```bash
# Clone the repository
git clone https://github.com/OSenoll/cargo-loader.git
cd cargo-loader

# Install dependencies
npm install

# Start development server
npm run dev
```

## Usage

1. **Select Container** - Choose container type from the left panel
2. **Add Items** - Enter dimensions, weight and constraints
3. **Calculate** - Click the "Calculate" button
4. **Inspect** - View results in 3D, click on items for details

## Tech Stack

- **React 18** + TypeScript
- **Three.js** / React Three Fiber - 3D visualization
- **Zustand** - State management
- **Tailwind CSS** - Styling
- **Vite** - Build tool

## Algorithm

The app uses the **LAFF (Largest Area Fit First)** algorithm:

1. Items are sorted by priority (heavy and large items first)
2. The best available space is found for each item
3. Constraints are checked (fragility, must-be-on-top, etc.)
4. Remaining spaces are updated after each placement

## Container Specifications

| Type | Length | Width | Height | Max Weight |
|------|--------|-------|--------|------------|
| 20ft Standard | 5.89m | 2.35m | 2.39m | 28.2 tons |
| 40ft Standard | 12.03m | 2.35m | 2.39m | 28.8 tons |
| 40ft High Cube | 12.03m | 2.35m | 2.69m | 28.56 tons |

## License

MIT

---

Made with Claude Code
