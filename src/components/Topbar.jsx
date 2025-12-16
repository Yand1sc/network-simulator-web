// src/components/Topbar.jsx
import React from 'react';
import { Download, Upload, Server, Trash2, FilePlus, LogOut, User } from 'lucide-react'; // Tambah icon LogOut & User

export default function Topbar({ onSave, onRestore, onClear, onDeleteSelected, username, onLogout }) {
  
  const handleUploadClick = () => { document.getElementById('file-upload').click(); };

  return (
    <div style={{ 
      height: '50px', background: '#004d7a', color: 'white',
      display: 'flex', alignItems: 'center', padding: '0 20px',
      justifyContent: 'space-between', borderBottom: '2px solid #003355'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold' }}>
        <Server size={20} />
        <span>NetSim Web v1.0</span>
      </div>

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        
        {/* INFO USER YANG LOGIN */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginRight: '10px', fontSize: '13px', background: 'rgba(255,255,255,0.1)', padding: '5px 10px', borderRadius: '20px' }}>
          <User size={14} />
          <span>{username || 'Guest'}</span>
        </div>

        <div style={{ width: '1px', height: '20px', background: '#ffffff55', margin: '0 5px' }}></div>

        <button onClick={onClear} style={{ ...btnStyle, background: '#d9534f', borderColor: '#c9302c' }} title="Reset Canvas">
          <FilePlus size={16} /> New
        </button>

        <button onClick={onDeleteSelected} style={btnStyle} title="Delete Selected">
          <Trash2 size={16} /> Del
        </button>

        <button onClick={onSave} style={btnStyle}>
          <Download size={16} /> Save
        </button>

        <button onClick={handleUploadClick} style={btnStyle}>
          <Upload size={16} /> Load
        </button>

        <button onClick={onLogout} style={{ ...btnStyle, background: '#333' }} title="Logout">
          <LogOut size={16} />
        </button>
        
        <input id="file-upload" type="file" accept=".json" onChange={onRestore} style={{ display: 'none' }} />
      </div>
    </div>
  );
}

const btnStyle = {
  background: '#006699', border: '1px solid #003355', color: 'white',
  padding: '5px 15px', cursor: 'pointer', borderRadius: '4px',
  display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px'
};