import React, { memo } from 'react';
import type { NodeProps } from 'reactflow';
import { Handle, Position } from 'reactflow';
import type { InfrastructureNodeData } from '../../types/system';
import styles from './BaseNode.module.css';

const BaseNode = ({ data, selected }: NodeProps<InfrastructureNodeData>) => {
  const { type, label, instances, health, saturation } = data;

  return (
    <div className={`${styles.node} ${selected ? styles.selected : ''} ${styles[health]}`}>
      <Handle type="target" position={Position.Top} className={styles.handle} />
      
      <div className={styles.iconWrapper}>
        <div className={`${styles.icon} ${styles[type]}`} />
      </div>
      
      <div className={styles.content}>
        <div className={styles.label}>{label}</div>
        <div className={styles.stats}>
          <span className={styles.instances}>{instances}x Units</span>
        </div>
        
        {/* Load Bar for War Room Phase */}
        <div className={styles.loadBar}>
          <div 
            className={styles.loadFill} 
            style={{ width: `${saturation * 100}%` }} 
          />
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className={styles.handle} />
    </div>
  );
};

export default memo(BaseNode);
