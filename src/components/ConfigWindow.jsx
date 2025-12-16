// src/components/ConfigWindow.jsx
import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import { X, Save, Terminal, Activity, AlertCircle, Globe, Shield, Trash2, Plus, Network } from 'lucide-react'; // Tambah icon Network

export default function ConfigWindow({ node, onClose, onSave, runPing }) {
  const nodeRef = useRef(null);
  const isRouter = node.data.deviceType === 'router'; // Cek tipe device

  const [label, setLabel] = useState(node.data.label);
  const [ip, setIp] = useState(node.data.ip || '');
  const [netmask, setNetmask] = useState(node.data.netmask || '255.255.255.0'); // STATE BARU: Subnet Mask
  const [gateway, setGateway] = useState(node.data.gateway || '');
  const [error, setError] = useState('');

  // ... (State firewall, tab, terminal, command SAMA SEPERTI SEBELUMNYA) ...
  const [firewallRules, setFirewallRules] = useState(node.data.firewallRules || []);
  const [newRule, setNewRule] = useState({ src: '', dst: '', action: 'DROP' });
  const [activeTab, setActiveTab] = useState('settings');
  const [terminalOutput, setTerminalOutput] = useState([]);
  const [command, setCommand] = useState('');

  useEffect(() => {
    setLabel(node.data.label);
    setIp(node.data.ip || '');
    setNetmask(node.data.netmask || '255.255.255.0'); // Load netmask
    setGateway(node.data.gateway || '');
    setFirewallRules(node.data.firewallRules || []);
    setTerminalOutput([`Winbox v6.48 (Stable) on ${node.data.label}`, 'Type "ping <ip>" to test connection.']);
    setError('');
  }, [node]);

  const validateIP = (value, fieldName) => {
    const ipPattern = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    if (value !== '' && value !== 'any' && !value.match(ipPattern)) {
      setError(`Invalid ${fieldName} Format`);
      return false;
    }
    setError('');
    return true;
  };

  // ... (Fungsi addFirewallRule, deleteRule SAMA) ...
  const addFirewallRule = () => {
    if (!newRule.src || !newRule.dst) { alert("Source and Destination cannot be empty"); return; }
    setFirewallRules([...firewallRules, { ...newRule, id: Date.now() }]);
    setNewRule({ src: '', dst: '', action: 'DROP' });
  };
  const deleteRule = (id) => setFirewallRules(firewallRules.filter(r => r.id !== id));

  const handleSave = () => {
    if (error) return;
    // Simpan data termasuk Netmask
    onSave(node.id, { label, ip, netmask, gateway, firewallRules });
    onClose();
  };

  // ... (handleCommand SAMA) ...
  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const input = command.trim();
      let response = '';
      const newLogs = [...terminalOutput, `[admin@${label}] > ${input}`];

      if (input.startsWith('ping ')) {
        const targetIp = input.split(' ')[1];
        if (!targetIp) response = 'Usage: ping <ip_address>';
        else if (targetIp === ip) response = 'Pinging self... Loopback success.';
        else response = runPing(node.id, targetIp);
      } else if (input === 'clear') { setTerminalOutput([]); setCommand(''); return;
      } else if (input === '') { response = '';
      } else { response = `Bad command: ${input}`; }

      if (response) newLogs.push(response);
      setTerminalOutput(newLogs);
      setCommand('');
    }
  };

  const getTabStyle = (tabName) => ({
    flex: 1, padding: '8px', border: 'none', cursor: 'pointer',
    background: activeTab === tabName ? '#f0f0f0' : '#ddd',
    fontWeight: activeTab === tabName ? 'bold' : 'normal',
    borderBottom: activeTab === tabName ? '2px solid #004d7a' : 'none',
    color: activeTab === tabName ? '#004d7a' : '#666'
  });

  return (
    <Draggable handle=".window-header" nodeRef={nodeRef}>
      <div ref={nodeRef} style={{ position: 'absolute', top: 50, left: 50, width: '400px', background: '#f0f0f0', border: '1px solid #004d7a', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', zIndex: 1000, fontFamily: 'sans-serif' }}>
        <div className="window-header" style={{ background: '#004d7a', color: 'white', padding: '8px', cursor: 'move', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            {activeTab === 'terminal' ? <Terminal size={14}/> : activeTab === 'firewall' ? <Shield size={14}/> : <Activity size={14}/>}
            <span>{isRouter ? `RouterOS: ${label}` : `Config: ${label}`}</span>
          </div>
          <X size={16} cursor="pointer" onClick={onClose} />
        </div>

        <div style={{ display: 'flex', background: '#ddd', borderBottom: '1px solid #ccc' }}>
          <button onClick={() => setActiveTab('settings')} style={getTabStyle('settings')}>General</button>
          {isRouter && <button onClick={() => setActiveTab('firewall')} style={getTabStyle('firewall')}>Firewall</button>}
          <button onClick={() => setActiveTab('terminal')} style={getTabStyle('terminal')}>Terminal</button>
        </div>

        <div style={{ padding: '15px' }}>
          {activeTab === 'settings' && (
            <>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', fontSize: '12px' }}>Device Name:</label>
                <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} style={{ width: '95%', padding: '5px' }} />
              </div>
              
              {/* Baris IP dan Netmask Jejeran */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <div style={{ flex: 1 }}>
                   <label style={{ display: 'block', fontSize: '12px' }}>IP Address:</label>
                   <input type="text" value={ip} placeholder="192.168.1.1" onChange={(e) => { setIp(e.target.value); validateIP(e.target.value, 'IP'); }} style={{ width: '90%', padding: '5px', border: error.includes('IP') ? '1px solid red' : '1px solid #ccc' }} />
                </div>
                <div style={{ flex: 1 }}>
                   <label style={{ display: 'block', fontSize: '12px' }}>Subnet Mask:</label>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Network size={14} color="#666"/>
                      <input type="text" value={netmask} onChange={(e) => { setNetmask(e.target.value); validateIP(e.target.value, 'Netmask'); }} style={{ width: '80%', padding: '5px' }} />
                   </div>
                </div>
              </div>

              {/* LOGIKA HIDE GATEWAY: Gateway HANYA muncul kalau BUKAN Router */}
              {!isRouter && (
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', fontSize: '12px' }}>Default Gateway:</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Globe size={14} color="#666"/>
                    <input type="text" value={gateway} placeholder="192.168.1.1" onChange={(e) => { setGateway(e.target.value); validateIP(e.target.value, 'Gateway'); }} style={{ width: '88%', padding: '5px', border: error.includes('Gateway') ? '1px solid red' : '1px solid #ccc' }} />
                  </div>
                </div>
              )}

              {error && <div style={{ color: 'red', fontSize: '11px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}><AlertCircle size={12}/> {error}</div>}
              
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={handleSave} disabled={!!error} style={{ padding: '5px 15px', background: error ? '#ccc' : '#004d7a', color: 'white', border: 'none', cursor: error ? 'not-allowed' : 'pointer' }}>
                  <Save size={14} style={{ marginRight: '5px' }}/> Save Config
                </button>
              </div>
            </>
          )}

          {/* ... (TAB FIREWALL DAN TERMINAL SAMA PERSIS KODE LAMA) ... */}
          {activeTab === 'firewall' && isRouter && (
             <div>
               <div style={{ display: 'flex', gap: '5px', marginBottom: '10px', alignItems: 'center' }}>
                <input type="text" placeholder="Src IP" value={newRule.src} onChange={e => setNewRule({...newRule, src: e.target.value})} style={{ flex: 2, padding: '5px', fontSize: '11px' }} />
                <input type="text" placeholder="Dst IP" value={newRule.dst} onChange={e => setNewRule({...newRule, dst: e.target.value})} style={{ flex: 2, padding: '5px', fontSize: '11px' }} />
                <select value={newRule.action} onChange={e => setNewRule({...newRule, action: e.target.value})} style={{ flex: 1, padding: '5px', fontSize: '11px' }}>
                  <option value="DROP">DROP</option>
                  <option value="ACCEPT">ACCEPT</option>
                </select>
                <button onClick={addFirewallRule} style={{ padding: '5px', background: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}><Plus size={14}/></button>
              </div>
              <div style={{ height: '150px', overflowY: 'auto', border: '1px solid #ccc', background: 'white' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                  <thead style={{ background: '#eee', textAlign: 'left' }}><tr><th style={{ padding: '5px' }}>Act</th><th style={{ padding: '5px' }}>Src</th><th style={{ padding: '5px' }}>Dst</th><th></th></tr></thead>
                  <tbody>
                    {firewallRules.map((rule) => (
                      <tr key={rule.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '5px', color: rule.action==='DROP'?'red':'green' }}>{rule.action}</td>
                        <td style={{ padding: '5px' }}>{rule.src}</td><td style={{ padding: '5px' }}>{rule.dst}</td>
                        <td style={{ padding: '5px' }}><Trash2 size={12} color="red" cursor="pointer" onClick={() => deleteRule(rule.id)}/></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
             </div>
          )}

          {activeTab === 'terminal' && (
            <div style={{ background: '#1e1e1e', color: '#00ff00', padding: '10px', borderRadius: '4px', height: '200px', fontSize: '12px', overflowY: 'auto', fontFamily: 'monospace' }}>
              {terminalOutput.map((line, i) => <div key={i}>{line}</div>)}
              <div style={{ display: 'flex' }}>
                <span style={{ marginRight: '5px', color: '#00ccff' }}>[admin@{label}] &gt;</span>
                <input autoFocus type="text" value={command} onChange={(e) => setCommand(e.target.value)} onKeyDown={handleCommand} style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', flex: 1, fontFamily: 'monospace' }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </Draggable>
  );
}