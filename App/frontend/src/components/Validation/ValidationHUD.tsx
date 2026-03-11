import React, { useMemo } from 'react';
import { useSystemStore } from '../../store/useSystemStore';
import styles from './ValidationHUD.module.css';
import type { InfrastructureNode } from '../../types/system';

const ValidationHUD = () => {
  const { nodes, edges } = useSystemStore();

  const issues = useMemo(() => {
    const list: string[] = [];

    nodes.forEach((node) => {
      const connections = edges.filter(
        (e) => e.source === node.id || e.target === node.id
      );

      // Rule 1: Orphaned Nodes
      if (connections.length === 0) {
        list.push(`⚠️ ${node.data.label} is orphaned (no connections).`);
      }

      // Rule 2: Database Connectivity
      if (node.type?.includes('DB')) {
        const connectedToAPI = edges.some((e) => {
          const otherId = e.source === node.id ? e.target : e.source;
          const otherNode = nodes.find(n => n.id === otherId);
          return otherNode?.type === 'apiServer';
        });
        if (!connectedToAPI && connections.length > 0) {
          list.push(`❌ ${node.data.label} must be connected to an API Server.`);
        }
      }

      // Rule 3: Load Balancer Targets
      if (node.type === 'loadBalancer') {
        const hasValidTarget = edges.some((e) => {
          if (e.source === node.id) {
            const targetNode = nodes.find(n => n.id === e.target);
            return targetNode?.type === 'apiServer' || targetNode?.type === 'cdn';
          }
          return false;
        });
        if (!hasValidTarget && connections.length > 0) {
          list.push(`⚠️ ${node.data.label} has no valid backend targets.`);
        }
      }
    });

    // Rule 4: System Entry Point
    const hasLB = nodes.some(n => n.type === 'loadBalancer');
    if (!hasLB && nodes.length > 0) {
      list.push(`ℹ️ Consider adding a Load Balancer as an entry point.`);
    }

    return list;
  }, [nodes, edges]);

  if (issues.length === 0) return null;

  return (
    <div className={styles.hud}>
      <div className={styles.header}>System Validation</div>
      <div className={styles.issueList}>
        {issues.map((issue, idx) => (
          <div key={idx} className={styles.issueItem}>
            {issue}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ValidationHUD;
