import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { EnhancedPlanet } from './EnhancedPlanet';
import { planets } from '../data/planetData';

// Star component for the central star
const CentralStar: React.FC<{ position: [number, number, number], color: string }> = ({ position, color }) => {
  const starRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (starRef.current) {
      // Enhanced pulsing effect for the star
      const time = clock.getElapsedTime();
      const scale = 1 + Math.sin(time * 0.5) * 0.05; // Increased pulsing amplitude
      starRef.current.scale.set(scale, scale, scale);
    }
  });
  
  return (
    <mesh ref={starRef} position={position}>
      <sphereGeometry args={[2.5, 64, 64]} /> {/* Increased star size */}
      <meshStandardMaterial 
        color={color} 
        emissive={color} 
        emissiveIntensity={1.5} // Increased emissive intensity
        toneMapped={false} 
      />
      {/* Add point light to illuminate the planets */}
      <pointLight 
        color={color} 
        intensity={2.5} // Increased light intensity
        distance={150} // Increased light distance
        decay={1.5} // Reduced decay for wider illumination
        castShadow 
      />
    </mesh>
  );
};

// Orbit path visualization with click interaction
const OrbitPath: React.FC<{ 
  radius: number, 
  color?: string,
  planet?: typeof planets[0],
  onSelect?: (planet: typeof planets[0]) => void
}> = ({ 
  radius, 
  color = '#555555',
  planet,
  onSelect 
}) => {
  // Handle click on orbit path
  const handleClick = () => {
    if (planet && onSelect) {
      onSelect(planet);
    }
  };

  return (
    <mesh 
      rotation={[Math.PI / 2, 0, 0]}
      onClick={handleClick}
      // Change cursor to pointer when hovering over orbit path
      onPointerOver={(e) => {
        document.body.style.cursor = 'pointer';
        e.stopPropagation();
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
    >
      <ringGeometry args={[radius - 0.02, radius + 0.02, 128]} /> {/* Wider orbit path */}
      <meshBasicMaterial color={color} transparent opacity={0.5} side={THREE.DoubleSide} /> {/* Increased opacity */}
    </mesh>
  );
};

// Planet with orbit animation
const OrbitingPlanet: React.FC<{ 
  planet: typeof planets[0], 
  orbitRadius: number, 
  orbitSpeed: number,
  initialAngle?: number,
  onHover: (hovering: boolean, planet: typeof planets[0]) => void
}> = ({ 
  planet, 
  orbitRadius, 
  orbitSpeed, 
  initialAngle = 0,
  onHover 
}) => {
  const [angle, setAngle] = useState(initialAngle);
  const planetRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    const newAngle = angle + orbitSpeed * 0.01;
    setAngle(newAngle);
    
    if (planetRef.current) {
      // Calculate position on the orbital path
      const x = Math.cos(newAngle) * orbitRadius;
      const z = Math.sin(newAngle) * orbitRadius;
      planetRef.current.position.x = x;
      planetRef.current.position.z = z;
    }
  });
  
  return (
    <group ref={planetRef} position={[orbitRadius, 0, 0]}>
      <EnhancedPlanet 
        planet={planet} 
        position={[0, 0, 0]} 
        scale={planet.radius / 10} // Scale based on planet radius
        onHover={onHover}
      />
    </group>
  );
};

// Info panel that displays when hovering over a planet
const PlanetInfoPanel: React.FC<{ planet: typeof planets[0] | null }> = ({ planet }) => {
  if (!planet) return null;
  
  return (
    <div className="absolute bottom-4 left-4 bg-black/70 text-white p-4 rounded-lg max-w-md">
      <h2 className="text-xl font-bold mb-2">{planet.name}</h2>
      <p className="mb-2">{planet.description}</p>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="font-semibold">Type:</span> {planet.type}
        </div>
        <div>
          <span className="font-semibold">Radius:</span> {planet.radius} Earth radii
        </div>
        <div>
          <span className="font-semibold">Distance:</span> {planet.distanceFromStar} AU
        </div>
        <div>
          <span className="font-semibold">Temperature:</span> {planet.temperature}K
        </div>
        <div>
          <span className="font-semibold">Water:</span> {planet.hasWater ? 'Yes' : 'No'}
        </div>
        <div>
          <span className="font-semibold">Atmosphere:</span> {planet.hasAtmosphere ? 'Yes' : 'No'}
        </div>
        <div>
          <span className="font-semibold">Habitable:</span> {planet.isHabitable ? 'Potentially' : 'No'}
        </div>
      </div>
      {planet.surfaceFeatures && (
        <div className="mt-2">
          <span className="font-semibold">Surface Features:</span> {planet.surfaceFeatures}
        </div>
      )}
    </div>
  );
};

// Main ExoplanetSystem component
export const ExoplanetSystem: React.FC = () => {
  const [hoveredPlanet, setHoveredPlanet] = useState<typeof planets[0] | null>(null);
  
  // Handle planet hover
  const handlePlanetHover = (hovering: boolean, planet: typeof planets[0]) => {
    setHoveredPlanet(hovering ? planet : null);
  };
  
  // Calculate orbit radii and speeds
  const planetConfigs = planets.map((planet, index) => {
    return {
      planet,
      orbitRadius: 5 + index * 4, // Increased spacing between planets for better visibility
      orbitSpeed: 0.8 / (index + 1), // Slightly faster rotation for better visibility
      initialAngle: Math.random() * Math.PI * 2 // Random starting position
    };
  });
  
  return (
    <div className="w-full h-full relative">
      <Canvas 
        shadows 
        camera={{ position: [0, 20, 20], fov: 50 }}
        dpr={[1, 2]} // Responsive pixel ratio
        gl={{ alpha: false }} // Disable alpha for pure black background
        style={{ background: '#000000' }} // Set background to pure black
      >
        {/* Increased ambient light for better base illumination */}
        <ambientLight intensity={0.25} />
        
        {/* Stars removed as requested */}
        
        {/* Central star - brighter for better illumination */}
        <CentralStar position={[0, 0, 0]} color="#FFD700" />
        
        {/* Orbit paths */}
        {planetConfigs.map((config, index) => (
          <OrbitPath key={`orbit-${index}`} radius={config.orbitRadius} />
        ))}
        
        {/* Planets */}
        {planetConfigs.map((config, index) => (
          <OrbitingPlanet 
            key={`planet-${index}`}
            planet={config.planet}
            orbitRadius={config.orbitRadius}
            orbitSpeed={config.orbitSpeed}
            initialAngle={config.initialAngle}
            onHover={handlePlanetHover}
          />
        ))}
        
        {/* Camera controls */}
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={50}
          target={[0, 0, 0]}
        />
      </Canvas>
      
      {/* Planet info panel */}
      <PlanetInfoPanel planet={hoveredPlanet} />
      
      {/* Title */}
      <div className="absolute top-4 left-4 text-white">
        <h1 className="text-2xl font-bold">Exoplanet Explorer</h1>
        <p>Hover over planets to learn more</p>
      </div>
    </div>
  );
};