import { useEffect, useRef } from 'react';
import { useSystemStore } from '../store/useSystemStore';

export const useSimulation = () => {
  const { 
    isSimulating, 
    setSimulating,
    nodes, 
    edges, 
    setNodes, 
    updateLiveMetrics,
    activeMission,
    addLog,
    clearLogs,
    setShowPostMortem,
    liveMetrics
  } = useSystemStore();
  
  const workerRef = useRef<Worker | null>(null);
  const rpsRef = useRef(10); // Start with 10 RPS
  const lastSaturationRef = useRef<Record<string, number>>({});

  // Initialize Worker
  useEffect(() => {
    workerRef.current = new Worker(
      new URL('../workers/simulation.worker.ts', import.meta.url),
      { type: 'module' }
    );

    workerRef.current.onmessage = (event) => {
      const { updatedNodes, globalMetrics } = event.data;
      setNodes(updatedNodes);
      updateLiveMetrics(globalMetrics);
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, [setNodes, updateLiveMetrics]);

  // Simulation Loop
  useEffect(() => {
    let interval: number;

    if (isSimulating) {
      clearLogs();
      addLog("🚀 Simulation started. Initializing traffic...");

      interval = window.setInterval(() => {
        // 1. Check for failure (Too many errors)
        if (activeMission && liveMetrics.errorRate > activeMission.targets.errorRate + 15) {
          setSimulating(false);
          setShowPostMortem(true);
          return;
        }

        // 2. Check for success (Target RPS reached)
        if (activeMission && rpsRef.current > activeMission.targets.rps * 1.2) {
          setSimulating(false);
          setShowPostMortem(true);
          return;
        }

        // Ramp up RPS over time
        rpsRef.current = Math.min(rpsRef.current * 1.05, 10000); // 5% growth

        // Random spike logic
        if (Math.random() > 0.9) {
          const spike = Math.round(rpsRef.current * 0.5);
          rpsRef.current += spike;
          addLog(`⚠️ Traffic spike: +${spike} RPS detected from US-East`);
        }

        // Check for saturation logs
        nodes.forEach(node => {
          const prevSat = lastSaturationRef.current[node.id] || 0;
          const currSat = node.data.saturation;

          if (currSat > 0.9 && prevSat <= 0.9) {
            addLog(`❌ CRITICAL: ${node.data.label} is heavily saturated!`);
          } else if (currSat > 0.7 && prevSat <= 0.7) {
            addLog(`⚠️ WARNING: ${node.data.label} load exceeding 70%`);
          }
          lastSaturationRef.current[node.id] = currSat;
        });

        workerRef.current?.postMessage({
          nodes,
          edges,
          incomingRPS: Math.round(rpsRef.current)
        });
      }, 1000); // Run every second
    } else {
      rpsRef.current = 10; // Reset RPS when stopped
      lastSaturationRef.current = {};
    }

    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [isSimulating, nodes, edges, addLog, clearLogs]);
};
