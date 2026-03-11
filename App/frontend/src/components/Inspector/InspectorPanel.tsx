import React from 'react';
import { useSystemStore } from '../../store/useSystemStore';
import styles from './InspectorPanel.module.css';

const InspectorPanel = () => {
  const { nodes, setNodes, removeNode } = useSystemStore();
  
  // Find the selected node
  const selectedNode = nodes.find((node) => node.selected);

  if (!selectedNode) {
    return (
      <div className={styles.emptyState}>
        Select a component to inspect its properties.
      </div>
    );
  }

  const handleUpdate = (updates: Partial<typeof selectedNode.data>) => {
    setNodes(
      nodes.map((node) =>
        node.id === selectedNode.id
          ? { ...node, data: { ...node.data, ...updates } }
          : node
      )
    );
  };

  return (
    <div className={styles.panel}>
      <h3 className={styles.title}>{selectedNode.data.label}</h3>
      <div className={styles.typeBadge}>{selectedNode.data.type.toUpperCase()}</div>

      <div className={styles.section}>
        <label>Instances: {selectedNode.data.instances}</label>
        <input 
          type="range" 
          min="1" 
          max="20" 
          value={selectedNode.data.instances}
          onChange={(e) => handleUpdate({ instances: parseInt(e.target.value) })}
        />
      </div>

      <div className={styles.section}>
        <label>CPU Cores: {selectedNode.data.cpu}</label>
        <div className={styles.btnGroup}>
          {[1, 2, 4, 8].map(cores => (
            <button 
              key={cores}
              className={selectedNode.data.cpu === cores ? styles.active : ''}
              onClick={() => handleUpdate({ cpu: cores })}
            >
              {cores}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <label>RAM: {selectedNode.data.ram}GB</label>
        <div className={styles.btnGroup}>
          {[2, 4, 8, 16, 32].map(gb => (
            <button 
              key={gb}
              className={selectedNode.data.ram === gb ? styles.active : ''}
              onClick={() => handleUpdate({ ram: gb })}
            >
              {gb}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.metrics}>
        <div className={styles.metricItem}>
          <span>Base Capacity:</span>
          <span>{selectedNode.data.capacityRPS * selectedNode.data.instances} RPS</span>
        </div>
        <div className={styles.metricItem}>
          <span>Monthly Cost:</span>
          <span className={styles.cost}>${selectedNode.data.cost * selectedNode.data.instances}</span>
        </div>
      </div>

      <div className={styles.divider} />

      <button 
        className={styles.removeBtn}
        onClick={() => removeNode(selectedNode.id)}
      >
        Remove Component
      </button>
    </div>
  );
};

export default InspectorPanel;
