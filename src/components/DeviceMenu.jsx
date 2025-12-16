// src/components/DeviceMenu.jsx
import React from 'react';
import { 
  Server, Activity, Terminal, Shield, 
  Network, Settings, Cpu 
} from 'lucide-react';

export default function DeviceMenu({ selectedNode, onMenuClick }) {
  
  if (!selectedNode) {
    return (
      <div style={sidebarStyle}>
        <div style={headerStyle}>
          <Network size={24} />
          <span>NetSim Project</span>
        </div>
        <div style={{ padding: '20px', fontSize: '13px', color: '#666', lineHeight: '1.5' }}>
          Select a device on the canvas to configure its settings.
        </div>
      </div>
    );
  }

  const isRouter = selectedNode.data.deviceType === 'router';
  const label = selectedNode.data.label;

  return (
    <div style={sidebarStyle}>
      {/* Header Info Device */}
      <div style={headerStyle}>
        <Server size={24} color={isRouter ? '#004d7a' : '#333'} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{label}</span>
          <span style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase' }}>
            {selectedNode.data.deviceType}
          </span>
        </div>
      </div>

      {/* Menu List */}
      <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
        
        <MenuButton 
          icon={<Settings size={16} />} 
          label="Interfaces / IP" 
          onClick={() => onMenuClick('ip')} 
        />

        {isRouter && (
          <MenuButton 
            icon={<Shield size={16} />} 
            label="Firewall" 
            onClick={() => onMenuClick('firewall')} 
          />
        )}

        <MenuButton 
          icon={<Terminal size={16} />} 
          label="New Terminal" 
          onClick={() => onMenuClick('terminal')} 
        />

      </div>

      {/* Footer Info */}
      <div style={{ marginTop: 'auto', padding: '15px', borderTop: '1px solid #ddd' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#555', fontSize: '12px' }}>
          <Cpu size={14} />
          <span>System OK</span>
        </div>
      </div>
    </div>
  );
}

// Komponen Kecil untuk Tombol Menu
const MenuButton = ({ icon, label, onClick }) => (
  <button 
    onClick={onClick}
    style={{
      display: 'flex', alignItems: 'center', gap: '10px',
      padding: '12px 20px', background: 'transparent',
      border: 'none', width: '100%', textAlign: 'left',
      cursor: 'pointer', color: '#333', fontSize: '13px',
      borderLeft: '3px solid transparent',
      transition: 'all 0.2s'
    }}
    onMouseOver={(e) => { e.currentTarget.style.background = '#e9ecef'; e.currentTarget.style.borderLeft = '3px solid #004d7a'; }}
    onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderLeft = '3px solid transparent'; }}
  >
    {icon} <span>{label}</span>
  </button>
);

const sidebarStyle = {
  width: '250px',
  height: '100%',
  background: '#f8f9fa',
  borderRight: '1px solid #ddd',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '2px 0 5px rgba(0,0,0,0.05)',
  zIndex: 5
};

const headerStyle = {
  padding: '20px',
  borderBottom: '1px solid #ddd',
  display: 'flex',
  alignItems: 'center',
  gap: '15px',
  background: 'white'
};