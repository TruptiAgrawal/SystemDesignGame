import { calculateSystemMetrics } from './simulationEngine';

// Self-contained simulation worker
self.onmessage = (event) => {
  const { nodes, edges, incomingRPS } = event.data;
  
  const result = calculateSystemMetrics(nodes, edges, incomingRPS);
  
  self.postMessage(result);
};
