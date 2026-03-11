import type { Edge } from 'reactflow';
import type { InfrastructureNode, LiveMetrics } from '../types/system';

/**
 * Calculates the total system capacity and distributes traffic
 * across the graph using a simple flow model.
 */
export const calculateSystemMetrics = (
  nodes: InfrastructureNode[],
  edges: Edge[],
  incomingRPS: number
): { updatedNodes: InfrastructureNode[]; globalMetrics: LiveMetrics } => {
  const updatedNodes = [...nodes];
  let totalLatency = 0;
  let totalErrors = 0;
  let activePaths = 0;

  // 1. Reset current load on all nodes
  updatedNodes.forEach(node => {
    node.data.currentRPS = 0;
    node.data.saturation = 0;
    node.data.health = 'healthy';
  });

  // 2. Identify Entry Points (User nodes)
  const userNodes = updatedNodes.filter(n => n.type === 'user');
  if (userNodes.length === 0) {
    return { 
      updatedNodes, 
      globalMetrics: { rps: 0, latency: 0, errorRate: 0, cost: calculateTotalCost(nodes) } 
    };
  }

  // 3. Recursive Traffic Distribution
  const distributeTraffic = (nodeId: string, rps: number, visited: Set<string>) => {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);

    const currentNode = updatedNodes.find(n => n.id === nodeId);
    if (!currentNode) return;

    currentNode.data.currentRPS += rps;
    
    // Calculate node capacity based on specs
    // Base: 100 RPS per instance * (CPU cores / 2)
    const baseCapacity = currentNode.data.capacityRPS * currentNode.data.instances * (currentNode.data.cpu / 2);
    currentNode.data.saturation = Math.min(currentNode.data.currentRPS / baseCapacity, 1.2);

    // Latency Increases Exponentially with Saturation (Queueing Theory approximation)
    // Base latency: 10ms + exponential growth after 70% saturation
    const nodeLatency = 10 + Math.pow(currentNode.data.saturation * 10, 2);
    totalLatency += nodeLatency;
    activePaths++;

    // Error Rate increases after 90% saturation
    if (currentNode.data.saturation > 0.9) {
      const errorFactor = (currentNode.data.saturation - 0.9) * 100; // e.g., 100% saturation = 10% errors
      totalErrors += errorFactor;
      currentNode.data.health = currentNode.data.saturation > 1.1 ? 'failing' : 'saturated';
    } else if (currentNode.data.saturation > 0.7) {
      currentNode.data.health = 'saturated';
    }

    // Find children
    const outgoingEdges = edges.filter(e => e.source === nodeId);
    if (outgoingEdges.length === 0) return;

    const rpsPerChild = rps / outgoingEdges.length;
    outgoingEdges.forEach(edge => {
      distributeTraffic(edge.target, rpsPerChild, new Set(visited));
    });
  };

  // Start distribution from each user node
  const rpsPerUser = incomingRPS / userNodes.length;
  userNodes.forEach(user => {
    distributeTraffic(user.id, rpsPerUser, new Set());
  });

  const avgLatency = activePaths > 0 ? totalLatency / activePaths : 0;
  const avgErrorRate = activePaths > 0 ? Math.min(totalErrors / activePaths, 100) : 0;

  return {
    updatedNodes,
    globalMetrics: {
      rps: incomingRPS,
      latency: Math.round(avgLatency),
      errorRate: parseFloat(avgErrorRate.toFixed(2)),
      cost: calculateTotalCost(updatedNodes)
    }
  };
};

const calculateTotalCost = (nodes: InfrastructureNode[]): number => {
  return nodes.reduce((total, node) => {
    // Basic cost model: baseCost * instances * (CPU/2) * (RAM/4)
    const nodeCost = node.data.cost * node.data.instances * (node.data.cpu / 2) * (node.data.ram / 4);
    return total + nodeCost;
  }, 0);
};
