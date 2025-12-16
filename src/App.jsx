import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap
} from 'reactflow';
import 'reactflow/dist/style.css';

import Sidebar from './components/Sidebar';
import DeviceNode from './nodes/DeviceNode';
import Topbar from './components/Topbar';
import SaveModal from './components/SaveModal';
import DeviceMenu from './components/DeviceMenu';
import FeatureWindow from './components/FeatureWindow';
import LoginScreen from './components/LoginScreen';

/*
  ============================================================================
  NOTE (IMPORTANT FOR GITHUB / OPEN SOURCE):
  ----------------------------------------------------------------------------
  - This application is FRONTEND-ONLY.
  - The login system implemented here is a MOCK / DEMO login.
  - There is NO backend authentication, database, or password validation.
  - Any username/password combination is accepted and used ONLY for UI purposes.
  ============================================================================
*/

const nodeTypes = { device: DeviceNode };
const initialNodes = [];

// Simple incremental ID generator (frontend only)
let id = 10;
const getId = () => `${id++}`;

// LocalStorage key (non-sensitive, browser-only)
const APP_STORAGE_PREFIX = 'netsim';
const SAVE_KEY = `${APP_STORAGE_PREFIX}-autosave`;

/*
  Utility: Check if two IP addresses are in the same subnet (Class C simulation)
*/
const isSameSubnet = (ip1, ip2) => {
  if (!ip1 || !ip2) return false;

  const parts1 = ip1.split('.');
  const parts2 = ip2.split('.');

  if (parts1.length !== 4 || parts2.length !== 4) return false;

  return (
    parts1[0] === parts2[0] &&
    parts1[1] === parts2[1] &&
    parts1[2] === parts2[2]
  );
};

/*
  ============================================================================
  MAIN FLOW COMPONENT
  Handles:
  - React Flow canvas
  - Nodes & edges
  - Autosave
  - Device configuration
  ============================================================================
*/
const DnDFlow = ({ currentUser, onLogout }) => {
  const reactFlowWrapper = useRef(null);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const [selectedNode, setSelectedNode] = useState(null);
  const [openWindows, setOpenWindows] = useState([]);
  const [showSaveModal, setShowSaveModal] = useState(false);

  /*
    ------------------------
    LOAD AUTO-SAVED CANVAS
    ------------------------
  */
  useEffect(() => {
    const savedFlow = localStorage.getItem(SAVE_KEY);
    if (!savedFlow) return;

    try {
      const flow = JSON.parse(savedFlow);
      if (!flow) return;

      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);

      setTimeout(() => {
        if (reactFlowInstance && flow.viewport) {
          reactFlowInstance.setViewport(flow.viewport);
        }
      }, 100);

      // Recalculate node ID
      let maxId = 0;
      (flow.nodes || []).forEach((n) => {
        const nId = parseInt(n.id);
        if (!isNaN(nId) && nId > maxId) maxId = nId;
      });
      id = maxId + 1;
    } catch {
      // Ignore corrupted localStorage
    }
  }, [reactFlowInstance, setNodes, setEdges]);

  /*
    ------------------------
    AUTO-SAVE ON CHANGE
    ------------------------
  */
  useEffect(() => {
    if (!reactFlowInstance || nodes.length === 0) return;
    const flow = reactFlowInstance.toObject();
    localStorage.setItem(SAVE_KEY, JSON.stringify(flow));
  }, [nodes, edges, reactFlowInstance]);

  /*
    ------------------------
    WINDOW MANAGEMENT
    ------------------------
  */
  const onNodeClick = (_, node) => {
    setSelectedNode(node);
    setOpenWindows([]);
  };

  const handleMenuClick = (featureType) => {
    if (!openWindows.find((w) => w.type === featureType)) {
      setOpenWindows([...openWindows, { type: featureType, id: Date.now() }]);
    }
  };

  const closeFeatureWindow = (typeToClose) => {
    setOpenWindows(openWindows.filter((w) => w.type !== typeToClose));
  };

  /*
    ------------------------
    CANVAS ACTIONS
    ------------------------
  */
  const onSaveClick = useCallback(() => {
    setShowSaveModal(true);
  }, []);

  const executeSave = useCallback(
    (fileName) => {
      if (!reactFlowInstance) return;

      const flow = reactFlowInstance.toObject();
      const jsonString = JSON.stringify(flow, null, 2);

      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}.json`;
      link.click();

      URL.revokeObjectURL(url);
      setShowSaveModal(false);
    },
    [reactFlowInstance]
  );

  const onClear = useCallback(() => {
    if (!window.confirm('Clear canvas?')) return;

    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
    setOpenWindows([]);
    localStorage.removeItem(SAVE_KEY);
  }, [setNodes, setEdges]);

  const onDeleteSelected = useCallback(() => {
    if (!reactFlowInstance) return;

    const nodesToDelete = reactFlowInstance.getNodes().filter((n) => n.selected);
    const edgesToDelete = reactFlowInstance.getEdges().filter((e) => e.selected);

    reactFlowInstance.deleteElements({
      nodes: nodesToDelete,
      edges: edgesToDelete
    });

    setSelectedNode(null);
    setOpenWindows([]);
  }, [reactFlowInstance]);

  const onRestore = useCallback(
    (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.readAsText(file);

      reader.onload = (e) => {
        try {
          const flow = JSON.parse(e.target.result);
          if (!flow) return;

          setNodes(flow.nodes || []);
          setEdges(flow.edges || []);

          if (reactFlowInstance) {
            reactFlowInstance.setViewport(flow.viewport || { x: 0, y: 0, zoom: 1 });
          }

          let maxId = 0;
          (flow.nodes || []).forEach((n) => {
            const nId = parseInt(n.id);
            if (!isNaN(nId) && nId > maxId) maxId = nId;
          });
          id = maxId + 1;
        } catch {
          alert('Invalid JSON file');
        }
      };

      event.target.value = null;
    },
    [setNodes, setEdges, reactFlowInstance]
  );

  /*
    ------------------------
    NETWORK SIMULATION (PING)
    ------------------------
  */
  const runPing = (sourceNodeId, targetIp) => {
    const sourceNode = nodes.find((n) => n.id === sourceNodeId);
    if (!sourceNode) return 'Error: Source missing.';

    const { ip: sourceIp, gateway, deviceType } = sourceNode.data;
    const isRouter = deviceType === 'router';

    if (!sourceIp) return 'Error: IP not configured.';

    const checkFirewall = (routerNode, src, dst) => {
      const rules = routerNode.data.firewallRules || [];
      const matchedRule = rules.find((rule) => {
        const srcMatch = rule.src === 'any' || rule.src === src;
        const dstMatch = rule.dst === 'any' || rule.dst === dst;
        return srcMatch && dstMatch;
      });
      return matchedRule && matchedRule.action === 'DROP';
    };

    if (sourceIp === targetIp) {
      return `Reply from ${targetIp}: bytes=32 time<1ms TTL=64`;
    }

    if (isSameSubnet(sourceIp, targetIp)) {
      const targetNode = nodes.find((n) => n.data.ip === targetIp);
      if (!targetNode) return `Ping request could not find host ${targetIp}.`;

      const connected = edges.some(
        (e) =>
          (e.source === sourceNodeId && e.target === targetNode.id) ||
          (e.source === targetNode.id && e.target === sourceNodeId)
      );

      return connected
        ? `Reply from ${targetIp}: bytes=32 time<1ms TTL=64`
        : 'Request timed out. (No connection)';
    }

    if (isRouter) {
      return `Reply from ${targetIp}: bytes=32 time=5ms TTL=64`;
    }

    if (!gateway) return 'Destination host unreachable. (No Gateway)';
    if (!isSameSubnet(sourceIp, gateway))
      return `Config Error: Gateway (${gateway}) unreachable from ${sourceIp}.`;

    const gatewayNode = nodes.find((n) => n.data.ip === gateway);
    if (!gatewayNode) return 'Gateway timeout.';

    const connectedToGateway = edges.some(
      (e) =>
        (e.source === sourceNodeId && e.target === gatewayNode.id) ||
        (e.source === gatewayNode.id && e.target === sourceNodeId)
    );

    if (!connectedToGateway) return 'Gateway disconnected.';
    if (checkFirewall(gatewayNode, sourceIp, targetIp))
      return 'Request timed out. (Packet filtered)';

    return `Reply from ${targetIp}: bytes=32 time=10ms TTL=54 (Routed via ${gateway})`;
  };

  /*
    ------------------------
    REACT FLOW EVENTS
    ------------------------
  */
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      const label = event.dataTransfer.getData('application/label');
      if (!type) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY
      });

      const newNode = {
        id: getId(),
        type: 'device',
        position,
        data: {
          label,
          deviceType: type,
          ip: ''
        }
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const saveConfiguration = (nodeId, newData) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...newData } }
          : node
      )
    );
  };

  /*
    ------------------------
    RENDER
    ------------------------
  */
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100vw', height: '100vh' }}>
      <Topbar
        onSave={onSaveClick}
        onRestore={onRestore}
        onClear={onClear}
        onDeleteSelected={onDeleteSelected}
        username={currentUser}
        onLogout={onLogout}
      />

      <div style={{ display: 'flex', flexGrow: 1, position: 'relative' }}>
        <DeviceMenu selectedNode={selectedNode} onMenuClick={handleMenuClick} />

        <div
          ref={reactFlowWrapper}
          className="reactflow-wrapper"
          style={{ flexGrow: 1, background: '#f5f5f5' }}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            connectionLineType="step"
            defaultEdgeOptions={{
              type: 'step',
              animated: false,
              style: { strokeWidth: 2, stroke: '#555' }
            }}
          >
            <Controls />
            <MiniMap style={{ bottom: 100 }} />
            <Background variant="dots" gap={12} size={1} />
          </ReactFlow>

          <Sidebar />

          {selectedNode &&
            openWindows.map((win) => (
              <FeatureWindow
                key={win.id}
                node={selectedNode}
                type={win.type}
                onClose={() => closeFeatureWindow(win.type)}
                onSave={saveConfiguration}
                runPing={runPing}
              />
            ))}

          {showSaveModal && (
            <SaveModal
              onClose={() => setShowSaveModal(false)}
              onConfirm={executeSave}
            />
          )}
        </div>
      </div>
    </div>
  );
};

/*
  ============================================================================
  APP ROOT
  Handles MOCK LOGIN state
  ============================================================================
*/
export default function App() {
  const [user, setUser] = useState(null);

  // MOCK login: accept any username (frontend-only)
  const handleLogin = (username) => {
    setUser(username?.trim() || 'Guest');
  };

  const handleLogout = () => {
    if (
      window.confirm(
        'Logout? Unsaved changes will remain stored in this browser.'
      )
    ) {
      setUser(null);
    }
  };

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <ReactFlowProvider>
      <DnDFlow currentUser={user} onLogout={handleLogout} />
    </ReactFlowProvider>
  );
}
