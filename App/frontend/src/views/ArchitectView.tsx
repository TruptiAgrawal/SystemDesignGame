import React, { useCallback, useState } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  Panel,
  addEdge, 
  applyNodeChanges,
  applyEdgeChanges,
  ReactFlowProvider,
} from 'reactflow';
import type { 
  Connection, 
  NodeChange,
  EdgeChange,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useSystemStore } from '../store/useSystemStore';
import BaseNode from '../components/Canvas/BaseNode';
import TrafficEdge from '../components/Canvas/TrafficEdge';
import InspectorPanel from '../components/Inspector/InspectorPanel';
import ValidationHUD from '../components/Validation/ValidationHUD';
import LiveDashboard from '../components/Dashboard/LiveDashboard';
import ChaosLog from '../components/Chaos/ChaosLog';
import PostMortem from '../components/PostMortem/PostMortem';
import TutorialOverlay from '../components/Onboarding/TutorialOverlay';
import styles from './ArchitectView.module.css';
import type { NodeType } from '../types/system';

const nodeTypes = {
  user: BaseNode,
  loadBalancer: BaseNode,
  apiServer: BaseNode,
  sqlDB: BaseNode,
  noSqlDB: BaseNode,
  redis: BaseNode,
  cdn: BaseNode,
};

const edgeTypes = {
  default: TrafficEdge,
};

import { useSimulation } from '../hooks/useSimulation';

const ArchitectViewInner = () => {
  const { 
    nodes, edges, setNodes, setEdges, isSimulating, setSimulating, 
    showPostMortem, resetSimulation 
  } = useSystemStore();

  const [showTutorial, setShowTutorial] = useState(nodes.length === 0);

  useSimulation();

  const handleRetry = () => {
    resetSimulation();
  };

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes(applyNodeChanges(changes, nodes));
    },
    [nodes, setNodes]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges(applyEdgeChanges(changes, edges)),
    [edges, setEdges]
  );

  const onConnect = useCallback(
    (connection: Connection) => setEdges(addEdge(connection, edges)),
    [edges, setEdges]
  );

  const onDragStart = (event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();

    const type = event.dataTransfer.getData('application/reactflow') as NodeType;
    if (!type) return;

    const newNode = {
      id: `${type}-${Date.now()}`,
      type,
      position: { x: event.clientX - 240, y: event.clientY - 60 },
      data: { 
        label: type.toUpperCase(), 
        type, 
        instances: 1,
        cpu: 1,
        ram: 2,
        capacityRPS: 100,
        currentRPS: 0,
        saturation: 0,
        health: 'healthy' as const,
        cost: 10
      },
    };

    setNodes([...nodes, newNode]);
  };

  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>The Architect</h1>
        <div className={styles.status}>
          {/* Mission info will go here */}
        </div>
      </header>
      
      <aside className={styles.palette}>
        <h3>Components</h3>
        <div className={styles.paletteList}>
          {(['user', 'loadBalancer', 'apiServer', 'sqlDB', 'noSqlDB', 'redis', 'cdn'] as NodeType[]).map(type => (
            <div 
              key={type}
              className={styles.paletteItem}
              onDragStart={(e) => onDragStart(e, type)}
              draggable
            >
              {type.replace(/([A-Z])/g, ' $1').toUpperCase()}
            </div>
          ))}
        </div>
      </aside>

      <div className={styles.canvasWrapper} onDrop={onDrop} onDragOver={onDragOver}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          selectNodesOnDrag={false}
        >
          <Background color="#1a1a1a" gap={20} />
          <Controls />
          <Panel position="top-right">
            <button 
              className={`${styles.deployBtn} ${isSimulating ? styles.simulating : ''}`}
              onClick={() => setSimulating(!isSimulating)}
            >
              {isSimulating ? 'Stop Simulation' : 'Deploy Simulation'}
            </button>
          </Panel>
          <ValidationHUD />
          <LiveDashboard />
          <ChaosLog />
        </ReactFlow>
      </div>

      <div className={styles.inspector}>
        <h3>Inspector</h3>
        <InspectorPanel />
      </div>

      {showPostMortem && <PostMortem onRetry={handleRetry} />}
      {showTutorial && <TutorialOverlay onClose={() => setShowTutorial(false)} />}
    </div>
  );
};

const ArchitectView = () => (
  <ReactFlowProvider>
    <ArchitectViewInner />
  </ReactFlowProvider>
);

export default ArchitectView;
