import type { MissionMetadata } from '../types/system';

export const MISSIONS: MissionMetadata[] = [
  {
    id: 'mission-1',
    title: 'The Viral Link',
    difficulty: 1,
    trafficProfile: 'High Read / Low Write',
    targets: {
      rps: 1000,
      latency: 50,
      errorRate: 1,
      budget: 150,
    }
  },
  {
    id: 'mission-2',
    title: 'The Flash Sale',
    difficulty: 3,
    trafficProfile: 'Sudden Spikes / High Write',
    targets: {
      rps: 5000,
      latency: 200,
      errorRate: 2,
      budget: 500,
    }
  },
  {
    id: 'mission-3',
    title: 'Global Social App',
    difficulty: 5,
    trafficProfile: 'Extreme Traffic / Global Scale',
    targets: {
      rps: 15000,
      latency: 100,
      errorRate: 0.5,
      budget: 2000,
    }
  }
];
