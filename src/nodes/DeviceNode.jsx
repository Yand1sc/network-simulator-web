// src/nodes/DeviceNode.jsx
import React from 'react';
import { Handle, Position } from 'reactflow';
// GANTI 'Switch' MENJADI 'Network' atau 'Box'
import { Router, Network, Monitor, Wifi } from 'lucide-react'; 

const iconMap = {
  router: <Router size={24} />,
  switch: <Network size={24} />, // Gunakan ikon Network sebagai pengganti Switch
  pc: <Monitor size={24} />,
  ap: <Wifi size={24} />
};

export default function DeviceNode({ data }) {
  // ... (Sisa kode ke bawah sama persis, tidak perlu diubah)
  return (
    <div style={{
      border: '1px solid #333',
      borderRadius: '5px',
      background: 'white',
      minWidth: '100px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }}>
      <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
      
      <div style={{
        backgroundColor: '#004d7a',
        color: 'white',
        padding: '5px 10px',
        fontSize: '12px',
        fontWeight: 'bold',
        borderTopLeftRadius: '4px',
        borderTopRightRadius: '4px'
      }}>
        {data.label}
      </div>

      <div style={{
        padding: '10px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: '5px'
      }}>
        {/* Pastikan ini memanggil data.deviceType yang benar */}
        {iconMap[data.deviceType] || <Router size={24} />}
        <span style={{ fontSize: '10px', color: '#666' }}>{data.ip || 'No IP'}</span>
      </div>

      <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />
    </div>
  );
}