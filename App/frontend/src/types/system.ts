import type { Node, Edge } from 'reactflow';

export type NodeType = 'user' | 'loadBalancer' | 'apiServer' | 'sqlDB' | 'noSqlDB' | 'redis' | 'cdn';

export interface InfrastructureNodeData {
  label: string;
  type: NodeType;
  instances: number;
  cpu: number; // 1-8
  ram: number; // 2-32
  capacityRPS: number;
  currentRPS: number;
  saturation: number; // 0-1
  health: 'healthy' | 'saturated' | 'failing';
  cost: number;
}

export type InfrastructureNode = Node<InfrastructureNodeData>;

export interface LiveMetrics {
  rps: number;
  latency: number;
  errorRate: number;
  cost: number;
}

export interface MissionMetadata {
  id: string;
  title: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  trafficProfile: string;
  targets: {
    rps: number;
    latency: number;
    errorRate: number;
    budget: number;
  };
}

export interface SystemState {
  nodes: InfrastructureNode[];
  edges: Edge[];
  activeMission: MissionMetadata | null;
  isSimulating: boolean;
  liveMetrics: LiveMetrics;
  acedMissions: string[]; // IDs of completed missions
  logs: string[];
  showPostMortem: boolean;
}
