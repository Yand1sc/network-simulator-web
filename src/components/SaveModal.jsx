// src/components/SaveModal.jsx
import React, { useState } from 'react';
import { Save, X } from 'lucide-react';

export default function SaveModal({ onClose, onConfirm }) {
  const [fileName, setFileName] = useState('network-topology');

  const handleSave = () => {
    if (fileName.trim()) {
      onConfirm(fileName);
    }
  };

  return (
    // Overlay Hitam Transparan
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 2000 // Paling atas
    }}>
      
      {/* Kotak Modal */}
      <div style={{
        background: 'white', padding: '20px', borderRadius: '8px',
        width: '350px', boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
        fontFamily: 'sans-serif'
      }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 style={{ margin: 0, color: '#004d7a' }}>Save Topology</h3>
          <X size={20} cursor="pointer" onClick={onClose} />
        </div>

        {/* Input Nama File */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#333' }}>File Name:</label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input 
              type="text" 
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              autoFocus
              style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px 0 0 4px', outline: 'none' }}
            />
            <div style={{ padding: '8px 12px', background: '#eee', border: '1px solid #ccc', borderLeft: 'none', borderRadius: '0 4px 4px 0', color: '#666', fontSize: '14px' }}>
              .json
            </div>
          </div>
        </div>

        {/* Tombol Action */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button onClick={onClose} style={{ padding: '8px 15px', background: 'transparent', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}>
            Cancel
          </button>
          <button onClick={handleSave} style={{ padding: '8px 20px', background: '#004d7a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Save size={16} /> Save
          </button>
        </div>

      </div>
    </div>
  );
}