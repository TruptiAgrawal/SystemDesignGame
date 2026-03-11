import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Edge } from 'reactflow';
import type { 
  SystemState, 
  InfrastructureNode, 
  MissionMetadata, 
  LiveMetrics 
} from '../types/system';

interface SystemActions {
  setNodes: (nodes: InfrastructureNode[]) => void;
  setEdges: (edges: Edge[]) => void;
  setActiveMission: (mission: MissionMetadata | null) => void;
  setSimulating: (isSimulating: boolean) => void;
  updateLiveMetrics: (metrics: Partial<LiveMetrics>) => void;
  aceMission: (missionId: string) => void;
  resetSimulation: () => void;
  addLog: (message: string) => void;
  clearLogs: () => void;
  setShowPostMortem: (show: boolean) => void;
  removeNode: (nodeId: string) => void;
}

const initialLiveMetrics: LiveMetrics = {
  rps: 0,
  latency: 0,
  errorRate: 0,
  cost: 0,
};

export const useSystemStore = create<SystemState & SystemActions>()(
  persist(
    (set) => ({
      // State
      nodes: [],
      edges: [],
      activeMission: null,
      isSimulating: false,
      liveMetrics: initialLiveMetrics,
      acedMissions: [],
      logs: [],
      showPostMortem: false,

      // Actions
      setNodes: (nodes) => set({ nodes }),
      setEdges: (edges) => set({ edges }),
      setActiveMission: (activeMission) => set({ activeMission }),
      setSimulating: (isSimulating) => set({ isSimulating }),
      updateLiveMetrics: (metrics) => set((state) => ({ 
        liveMetrics: { ...state.liveMetrics, ...metrics } 
      })),
      aceMission: (missionId) => set((state) => ({
        acedMissions: state.acedMissions.includes(missionId) 
          ? state.acedMissions 
          : [...state.acedMissions, missionId]
      })),
      resetSimulation: () => set({ 
        isSimulating: false, 
        liveMetrics: initialLiveMetrics,
        logs: [],
        showPostMortem: false
      }),
      addLog: (message) => set((state) => ({
        logs: [message, ...state.logs].slice(0, 50) // Keep last 50 logs
      })),
      clearLogs: () => set({ logs: [] }),
      setShowPostMortem: (show) => set({ showPostMortem: show }),
      removeNode: (nodeId) => set((state) => ({
        nodes: state.nodes.filter(n => n.id !== nodeId),
        edges: state.edges.filter(e => e.source !== nodeId && e.target !== nodeId)
      })),
    }),
    {
      name: 'system-design-game-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist acedMissions and activeMission state, 
      // but maybe not the live simulation metrics or current layout for now? 
      // Actually, persisting layout (nodes/edges) is good for the "Architect" phase.
      partialize: (state) => ({ 
        acedMissions: state.acedMissions,
        activeMission: state.activeMission,
        nodes: state.nodes,
        edges: state.edges
      }),
    }
  )
);
