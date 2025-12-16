// src/components/Sidebar.jsx
import React from 'react';
import { Router, Network, Monitor, Wifi, GripVertical } from 'lucide-react';

export default function Sidebar() {
  const onDragStart = (event, nodeType, label) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('application/label', label);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div style={{ 
      // --- STYLE BARU: HORIZONTAL DOCK ---
      position: 'absolute',
      bottom: '30px',             // Jarak dari bawah
      left: '50%',                // Posisi tengah
      transform: 'translateX(-50%)', // Kompensasi agar benar-benar di tengah
      
      display: 'flex',            // Berjejer ke samping
      flexDirection: 'row',
      gap: '15px',                // Jarak antar icon
      
      padding: '10px 20px',
      backgroundColor: 'rgba(255, 255, 255, 0.9)', // Putih agak transparan dikit
      backdropFilter: 'blur(5px)', // Efek blur keren
      borderRadius: '12px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      border: '1px solid #e5e7eb',
      zIndex: 10,                 // Agar muncul di atas kanvas
    }}>
      
      {/* Label Kecil (Opsional) */}
      <div style={{ 
        display: 'flex', alignItems: 'center', borderRight: '1px solid #ccc', paddingRight: '10px', marginRight: '5px', color: '#666', fontSize: '12px', fontWeight: 'bold' 
      }}>
        <GripVertical size={16} /> Devices
      </div>

      {/* Item: Router */}
      <div 
        onDragStart={(event) => onDragStart(event, 'router', 'Router Mikrotik')} 
        draggable 
        style={itemStyle}
        title="Router"
      >
        <div style={iconBoxStyle}><Router size={24} color="#004d7a"/></div>
        <span style={textStyle}>Router</span>
      </div>

      {/* Item: Switch */}
      <div 
        onDragStart={(event) => onDragStart(event, 'switch', 'Switch Hub')} 
        draggable 
        style={itemStyle}
        title="Switch"
      >
         <div style={iconBoxStyle}><Network size={24} color="#28a745"/></div>
         <span style={textStyle}>Switch</span>
      </div>

      {/* Item: PC */}
      <div 
        onDragStart={(event) => onDragStart(event, 'pc', 'PC Client')} 
        draggable 
        style={itemStyle}
        title="PC Client"
      >
         <div style={iconBoxStyle}><Monitor size={24} color="#333"/></div>
         <span style={textStyle}>PC</span>
      </div>

    </div>
  );
}

// Style untuk tiap item device
const itemStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  cursor: 'grab',
  gap: '5px',
  transition: 'transform 0.2s',
};

const iconBoxStyle = {
  width: '40px',
  height: '40px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: '#f8f9fa',
  borderRadius: '8px',
  border: '1px solid #eee'
};

const textStyle = {
  fontSize: '11px',
  color: '#555',
  fontWeight: '500'
};