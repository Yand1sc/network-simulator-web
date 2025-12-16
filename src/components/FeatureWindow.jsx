// src/components/FeatureWindow.jsx
import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import { X, Save, AlertCircle, Trash2, Plus, Terminal } from 'lucide-react';

export default function FeatureWindow({ node, type, onClose, onSave, runPing }) {
  const nodeRef = useRef(null);
  
  // State Umum
  const [label, setLabel] = useState(node.data.label);
  const [ip, setIp] = useState(node.data.ip || '');
  const [netmask, setNetmask] = useState(node.data.netmask || '255.255.255.0');
  const [gateway, setGateway] = useState(node.data.gateway || '');
  const [firewallRules, setFirewallRules] = useState(node.data.firewallRules || []);
  const [error, setError] = useState('');

  // State Terminal
  const [terminalOutput, setTerminalOutput] = useState([`Connecting to ${node.data.label}...`, 'Login successful.']);
  const [command, setCommand] = useState('');

  // State Firewall Form
  const [newRule, setNewRule] = useState({ src: '', dst: '', action: 'DROP' });

  // Reset error saat pindah field
  useEffect(() => {
    setError('');
  }, [type]);

  const getTitle = () => {
    if (type === 'ip') return `Interfaces - ${label}`;
    if (type === 'firewall') return `Firewall - ${label}`;
    if (type === 'terminal') return `Terminal - ${label}`;
    return 'Window';
  };

  // --- PERBAIKAN VALIDASI IP (0-255) ---
  const validateIP = (value, fieldName) => {
    // 1. Cek Kosong atau 'any' (valid untuk firewall)
    if (value === '' || value === 'any') {
      setError('');
      return true;
    }

    // 2. Cek Format Dasar (Angka.Angka.Angka.Angka)
    const ipPattern = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const match = value.match(ipPattern);

    if (!match) {
      setError(`Invalid ${fieldName} format (e.g. 192.168.1.1)`);
      return false;
    }

    // 3. Cek Rentang Angka (0 - 255)
    // Kita ambil 4 bagian angka tersebut dan cek satu per satu
    const parts = value.split('.').map(Number);
    for (let part of parts) {
      if (part > 255) {
        setError(`Invalid ${fieldName}: Value ${part} exceeds 255`);
        return false;
      }
    }

    setError('');
    return true;
  };

  const handleSaveIP = () => {
    // Validasi ulang sebelum save untuk memastikan user tidak save saat error
    if (!validateIP(ip, 'IP Address')) return;
    if (!validateIP(netmask, 'Subnet Mask')) return;
    if (node.data.deviceType !== 'router' && !validateIP(gateway, 'Gateway')) return;

    onSave(node.id, { label, ip, netmask, gateway });
    onClose();
  };

  const handleSaveFirewall = () => {
    onSave(node.id, { firewallRules });
  };

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const input = command.trim();
      let response = '';
      const newLogs = [...terminalOutput, `[admin@${label}] > ${input}`];

      if (input.startsWith('ping ')) {
        const targetIp = input.split(' ')[1];
        if (!targetIp) response = 'Usage: ping <ip_address>';
        else if (targetIp === ip) response = 'Loopback success.';
        else response = runPing(node.id, targetIp);
      } else if (input === 'clear') { setTerminalOutput([]); setCommand(''); return; } 
      else if (input === '') { response = ''; } 
      else { response = `Bad command: ${input}`; }

      if (response) newLogs.push(response);
      setTerminalOutput(newLogs);
      setCommand('');
    }
  };

  const addFirewallRule = () => {
    if (!newRule.src || !newRule.dst) { alert("Src/Dst cannot be empty"); return; }
    // Validasi input firewall juga
    if (!validateIP(newRule.src, 'Source IP') || !validateIP(newRule.dst, 'Dest IP')) {
        return; // Stop jika format salah
    }

    const updatedRules = [...firewallRules, { ...newRule, id: Date.now() }];
    setFirewallRules(updatedRules);
    setNewRule({ src: '', dst: '', action: 'DROP' });
  };
  
  const deleteRule = (id) => {
    setFirewallRules(firewallRules.filter(r => r.id !== id));
  };

  return (
    <Draggable handle=".window-header" nodeRef={nodeRef}>
      <div 
        ref={nodeRef} 
        style={{
          position: 'absolute', top: 100, left: 300, width: type === 'terminal' ? '500px' : '350px',
          background: 'white', border: '1px solid #004d7a',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)', zIndex: 2000, fontFamily: 'sans-serif',
          borderRadius: '4px'
        }}
      >
        <div className="window-header" style={{
          background: '#004d7a', color: 'white', padding: '8px 12px', cursor: 'move',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold', fontSize: '13px'
        }}>
          <span>{getTitle()}</span>
          <X size={16} cursor="pointer" onClick={onClose} />
        </div>

        <div style={{ padding: '15px', background: '#f5f5f5' }}>
          
          {/* --- VIEW IP CONFIG --- */}
          {type === 'ip' && (
            <>
              <div style={formGroup}>
                <label style={labelStyle}>Device Name</label>
                <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} style={inputStyle} />
              </div>
              <div style={formGroup}>
                <label style={labelStyle}>IP Address</label>
                <input 
                  type="text" value={ip} 
                  onChange={(e) => {
                    setIp(e.target.value); 
                    validateIP(e.target.value, 'IP Address');
                  }} 
                  style={{...inputStyle, borderColor: error.includes('IP') ? 'red' : '#ccc'}} 
                  placeholder="192.168.1.1"
                />
              </div>
              <div style={formGroup}>
                <label style={labelStyle}>Subnet Mask</label>
                <input 
                  type="text" value={netmask} 
                  onChange={(e) => {
                    setNetmask(e.target.value); 
                    validateIP(e.target.value, 'Subnet Mask');
                  }} 
                  style={{...inputStyle, borderColor: error.includes('Subnet') ? 'red' : '#ccc'}} 
                />
              </div>
              {node.data.deviceType !== 'router' && (
                <div style={formGroup}>
                  <label style={labelStyle}>Gateway</label>
                  <input 
                    type="text" value={gateway} 
                    onChange={(e) => {
                      setGateway(e.target.value); 
                      validateIP(e.target.value, 'Gateway');
                    }} 
                    style={{...inputStyle, borderColor: error.includes('Gateway') ? 'red' : '#ccc'}} 
                    placeholder="192.168.1.254"
                  />
                </div>
              )}
              
              {/* Tampilkan Error Merah jika ada */}
              {error && (
                <div style={{color:'red', fontSize:'11px', marginBottom:'10px', display:'flex', alignItems:'center', gap:'5px'}}>
                   <AlertCircle size={12}/> {error}
                </div>
              )}

              <div style={{textAlign:'right'}}>
                <button onClick={handleSaveIP} disabled={!!error} style={{...btnSave, opacity: error ? 0.5 : 1, cursor: error ? 'not-allowed' : 'pointer'}}>
                  Apply Configuration
                </button>
              </div>
            </>
          )}

          {/* --- VIEW FIREWALL --- */}
          {type === 'firewall' && (
            <>
              <div style={{display:'flex', gap:'5px', marginBottom:'10px'}}>
                <input placeholder="Src IP" value={newRule.src} onChange={e=>setNewRule({...newRule, src:e.target.value})} style={{flex:1, padding:'4px', fontSize:'11px'}}/>
                <input placeholder="Dst IP" value={newRule.dst} onChange={e=>setNewRule({...newRule, dst:e.target.value})} style={{flex:1, padding:'4px', fontSize:'11px'}}/>
                <select value={newRule.action} onChange={e=>setNewRule({...newRule, action:e.target.value})} style={{fontSize:'11px'}}>
                  <option>DROP</option><option>ACCEPT</option>
                </select>
                <button onClick={addFirewallRule} style={{background:'#28a745', color:'white', border:'none', cursor:'pointer'}}><Plus size={14}/></button>
              </div>
              
              {/* Pesan error khusus di tab firewall */}
              {error && (
                <div style={{color:'red', fontSize:'10px', marginBottom:'5px'}}>{error}</div>
              )}

              <div style={{height:'150px', overflowY:'auto', background:'white', border:'1px solid #ccc', marginBottom:'10px'}}>
                <table style={{width:'100%', fontSize:'11px', borderCollapse:'collapse'}}>
                  <thead style={{background:'#eee'}}><tr><th style={{textAlign:'left', padding:'4px'}}>Act</th><th>Src</th><th>Dst</th><th></th></tr></thead>
                  <tbody>
                    {firewallRules.map(r => (
                      <tr key={r.id} style={{borderBottom:'1px solid #eee'}}>
                        <td style={{padding:'4px', color:r.action==='DROP'?'red':'green'}}>{r.action}</td>
                        <td>{r.src}</td><td>{r.dst}</td>
                        <td><Trash2 size={12} color="red" cursor="pointer" onClick={()=>deleteRule(r.id)}/></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button onClick={handleSaveFirewall} style={{...btnSave, width:'100%'}}>Save Rules</button>
            </>
          )}

          {/* --- VIEW TERMINAL --- */}
          {type === 'terminal' && (
            <div style={{background:'#1e1e1e', color:'#00ff00', padding:'10px', height:'250px', fontSize:'12px', fontFamily:'monospace', overflowY:'auto'}}>
              {terminalOutput.map((l,i) => <div key={i}>{l}</div>)}
              <div style={{display:'flex'}}>
                <span style={{marginRight:'5px', color:'#00ccff'}}>[admin@{label}] &gt;</span>
                <input autoFocus type="text" value={command} onChange={e=>setCommand(e.target.value)} onKeyDown={handleCommand} style={{background:'transparent', border:'none', color:'white', outline:'none', flex:1, fontFamily:'monospace'}} />
              </div>
            </div>
          )}

        </div>
      </div>
    </Draggable>
  );
}

const formGroup = { marginBottom: '10px' };
const labelStyle = { display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#555', marginBottom: '3px' };
const inputStyle = { width: '95%', padding: '6px', border: '1px solid #ccc', borderRadius: '3px', fontSize: '12px' };
const btnSave = { padding: '6px 15px', background: '#004d7a', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '12px' };