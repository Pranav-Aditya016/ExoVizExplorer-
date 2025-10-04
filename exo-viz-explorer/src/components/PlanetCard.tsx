import { X } from "lucide-react";
import { PlanetData } from "@/data/planetData";

interface PlanetCardProps {
  planet: PlanetData;
  onClose: () => void;
}

const PlanetCard = ({ planet, onClose }: PlanetCardProps) => {
  console.log('PlanetCard rendering for:', planet.name);
  
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '100%',
        maxWidth: '400px',
        height: '100vh',
        backgroundColor: 'rgba(15, 23, 42, 0.98)',
        backdropFilter: 'blur(10px)',
        borderLeft: '1px solid #334155',
        zIndex: 9999,
        overflowY: 'auto',
        padding: '24px'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '4px' }}>
              {planet.name}
            </h2>
            <p style={{ fontSize: '14px', color: '#9CA3AF' }}>{planet.type}</p>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '8px',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              color: 'white'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1E293B'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <X size={20} />
          </button>
        </div>

        {/* Probability */}
        <div style={{ padding: '16px', backgroundColor: '#1E293B', borderRadius: '8px', border: '1px solid #334155' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '14px', color: '#9CA3AF' }}>Confirmation Probability</span>
            <span style={{ fontSize: '14px', fontWeight: '600', color: 'white' }}>
              {Math.round(planet.probability * 100)}%
            </span>
          </div>
          <div style={{ height: '8px', backgroundColor: '#334155', borderRadius: '4px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                backgroundColor: '#3B82F6',
                borderRadius: '4px',
                width: `${planet.probability * 100}%`,
                transition: 'width 1s ease-out'
              }}
            />
          </div>
        </div>

        {/* Physical Properties */}
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'white', marginBottom: '16px' }}>
            Physical Properties
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ padding: '12px', backgroundColor: '#1E293B', borderRadius: '8px', border: '1px solid #334155' }}>
              <p style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '4px' }}>Radius</p>
              <p style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>
                {planet.radius.toFixed(2)}
                <span style={{ fontSize: '12px', color: '#9CA3AF', marginLeft: '4px' }}>R⊕</span>
              </p>
            </div>

            <div style={{ padding: '12px', backgroundColor: '#1E293B', borderRadius: '8px', border: '1px solid #334155' }}>
              <p style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '4px' }}>Distance</p>
              <p style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>
                {planet.distanceFromStar.toFixed(3)}
                <span style={{ fontSize: '12px', color: '#9CA3AF', marginLeft: '4px' }}>AU</span>
              </p>
            </div>

            <div style={{ padding: '12px', backgroundColor: '#1E293B', borderRadius: '8px', border: '1px solid #334155', gridColumn: 'span 2' }}>
              <p style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '4px' }}>Temperature</p>
              <p style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>
                {planet.temperature}
                <span style={{ fontSize: '12px', color: '#9CA3AF', marginLeft: '4px' }}>K</span>
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'white', marginBottom: '16px' }}>
            Features
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid',
              backgroundColor: planet.hasWater ? 'rgba(59, 130, 246, 0.1)' : '#1E293B',
              borderColor: planet.hasWater ? '#3B82F6' : '#334155',
              color: planet.hasWater ? '#60A5FA' : '#6B7280',
              opacity: planet.hasWater ? 1 : 0.5
            }}>
              <span>💧</span>
              <span style={{ fontSize: '12px', fontWeight: '500' }}>Water</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid',
              backgroundColor: planet.hasAtmosphere ? 'rgba(34, 197, 94, 0.1)' : '#1E293B',
              borderColor: planet.hasAtmosphere ? '#22C55E' : '#334155',
              color: planet.hasAtmosphere ? '#4ADE80' : '#6B7280',
              opacity: planet.hasAtmosphere ? 1 : 0.5
            }}>
              <span>🌬️</span>
              <span style={{ fontSize: '12px', fontWeight: '500' }}>Atmosphere</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid',
              backgroundColor: planet.isHabitable ? 'rgba(34, 197, 94, 0.1)' : '#1E293B',
              borderColor: planet.isHabitable ? '#22C55E' : '#334155',
              color: planet.isHabitable ? '#4ADE80' : '#6B7280',
              opacity: planet.isHabitable ? 1 : 0.5
            }}>
              <span>🌱</span>
              <span style={{ fontSize: '12px', fontWeight: '500' }}>Habitable</span>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div style={{ padding: '16px', backgroundColor: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '8px' }}>
          <p style={{ fontSize: '12px', color: '#9CA3AF' }}>
            {planet.isHabitable
              ? "This exoplanet shows promising signs for potential habitability based on its distance from the host star and estimated conditions."
              : "Current data suggests this exoplanet may not be suitable for life as we know it, though further observation is needed."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlanetCard;
