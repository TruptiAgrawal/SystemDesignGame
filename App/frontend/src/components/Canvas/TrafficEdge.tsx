import { memo } from 'react';
import type { EdgeProps } from 'reactflow';
import { BaseEdge, getBezierPath } from 'reactflow';
import { useSystemStore } from '../../store/useSystemStore';
import styles from './TrafficEdge.module.css';

const TrafficEdge = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const { isSimulating, liveMetrics } = useSystemStore();

  // Pulse speed based on RPS
  const pulseDuration = Math.max(0.5, 3 - (liveMetrics.rps / 1000));

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={{ ...style, stroke: '#333' }} />
      {isSimulating && (
        <path
          d={edgePath}
          fill="none"
          stroke="#00ff41"
          strokeWidth={2}
          className={styles.pulse}
          style={{ animationDuration: `${pulseDuration}s` }}
        />
      )}
    </>
  );
};

export default memo(TrafficEdge);
