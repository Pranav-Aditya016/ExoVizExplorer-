# ExoVision 3D - Planet Explorer

An immersive 3D exoplanet visualization application that allows you to explore confirmed exoplanets in stunning detail. Discover habitable worlds, analyze planetary features, and visualize AI-powered predictions in a beautiful space environment.

## Features

- 🌌 Interactive 3D planet visualizations
- 🪐 Explore confirmed exoplanet data
- 🔍 Analyze planetary characteristics
- 🎨 Beautiful space-themed UI
- 📱 Responsive design

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd exo-viz-explorer
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:8080`

## Technologies Used

- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Three.js** - 3D graphics
- **React Three Fiber** - React integration for Three.js
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components

## Project Structure

```
src/
├── components/     # React components
├── pages/         # Page components
├── data/          # Planet data and configurations
├── hooks/         # Custom React hooks
└── lib/           # Utility functions
```

## Development

The project uses Vite for fast development with hot module replacement. The development server runs on port 8080 by default.

## Deployment

Build the project for production:

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment to any static hosting service.
